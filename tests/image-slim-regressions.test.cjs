const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const matter = require('gray-matter');

const root = path.resolve(__dirname, '..');
const origin = 'https://milvus.io';

function loadTs(relPath, deps = {}) {
  const file = path.join(root, relPath);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = { exports: {} };
  const fn = vm.runInThisContext(
    `(function(exports, require, module, process, URL, URLSearchParams) {\n${code}\n})`,
    { filename: file }
  );
  fn(
    mod.exports,
    name => (name in deps ? deps[name] : require(name)),
    mod,
    process,
    URL,
    URLSearchParams
  );
  return mod.exports;
}

const localizationTypes = loadTs('src/types/localization.ts');
const docTypes = loadTs('src/types/docs.ts');
const clientDocData = loadTs('src/utils/client-doc-data.ts');
const utilsIndex = loadTs('src/utils/index.ts', { '@/types/docs': docTypes });
const seoUtils = loadTs('src/components/localization/utils.ts', {
  '@/types/localization': localizationTypes,
  '@/consts': { ABSOLUTE_BASE_URL: origin },
});

test('localized blog blocking route serves translations, English fallback, 404s, and keeps memory bounded', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'milvus-blog-test-'));
  const origCwd = process.cwd();
  const origNodeEnv = process.env.NODE_ENV;

  try {
    const enDir = path.join(tmpDir, 'src/blogs/blog/en');
    const zhDir = path.join(tmpDir, 'src/blogs/localization/blog/zh');
    const frDir = path.join(tmpDir, 'src/blogs/localization/blog/fr');
    const jaDir = path.join(tmpDir, 'src/blogs/localization/blog/ja');
    for (const dir of [enDir, zhDir, frDir, jaDir]) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const unicodeSlug = 'how-milvus-serves-3×-rabitq.md';
    fs.writeFileSync(
      path.join(enDir, unicodeSlug),
      '---\nid: rabitq\ntitle: English RaBitQ\ndate: 2026-05-01\ntag: vector,search\ndesc: EN desc\n---\n# English RaBitQ\nBody EN\n'
    );
    fs.writeFileSync(
      path.join(enDir, 'fallback-only.md'),
      '---\nid: fallback\ntitle: Fallback Only\ndate: 2026-05-02\ntag: vector\ndesc: Fallback desc\n---\n# Fallback Only\nEnglish body\n'
    );
    fs.writeFileSync(
      path.join(zhDir, unicodeSlug),
      '---\nid: rabitq\ntitle: 中文 RaBitQ\ndate: 2026-05-01\ntag: vector\ndesc: ZH desc\n---\n# 中文 RaBitQ\nBody ZH\n'
    );
    // 1-byte untranslated stub in zh should fall back to English
    fs.writeFileSync(path.join(zhDir, 'fallback-only.md'), '\n');
    // Non-indexable locale translation
    fs.writeFileSync(
      path.join(frDir, unicodeSlug),
      '---\nid: rabitq\ntitle: Français RaBitQ\ndate: 2026-05-01\ntag: vector\ndesc: FR desc\n---\n# Français RaBitQ\nBody FR\n'
    );

    process.chdir(tmpDir);
    process.env.NODE_ENV = 'production';
    matter.clearCache();

    const blogUtilsMod = loadTs('src/utils/blog.utils.ts', {
      '@/types/localization': localizationTypes,
    }).default;

    const createBlogDetailMod = loadTs(
      'src/components/localization/CreateBlogDetailProps.ts',
      {
        '@/utils/blog.utils': blogUtilsMod,
        '@/types/localization': localizationTypes,
        '@/utils/markdown': {
          markdownToHtml: content => ({
            tree: `<article>${content.trim()}</article>`,
            codeList: [],
            anchorList: [],
          }),
        },
        '@/consts': { ABSOLUTE_BASE_URL: origin },
      }
    );

    const localizationUtils = loadTs('src/utils/localization.ts', {
      '@/types/localization': localizationTypes,
    });

    const segments = {};
    const route = loadTs('src/pages/[lang]/blog/[id].tsx', {
      '@/types/localization': localizationTypes,
      '@/components/localization/BlogDetail': { BlogDetail: () => null },
      '@/components/localization/CreateBlogDetailProps': createBlogDetailMod,
      '@/utils/localization': localizationUtils,
      '@/utils/doc-sitemap-segments': {
        writeSitemapSegment: (key, pages) => {
          segments[key] = pages;
        },
      },
      '@/server/content-freshness': {
        readContentFrontMatter: p => {
          const abs = path.join(tmpDir, p);
          return fs.existsSync(abs) ? matter(fs.readFileSync(abs, 'utf8'), {}).data : undefined;
        },
        getContentLastModified: (p, fm) =>
          p.includes('/zh/') ? '2026-05-10T00:00:00.000Z' : new Date(fm.date).toISOString(),
      },
    });

    // 1. Production getStaticPaths returns blocking + emits localized sitemap segment
    const prodPaths = route.getStaticPaths();
    assert.equal(prodPaths.fallback, 'blocking');
    assert.deepEqual(prodPaths.paths, []);
    const zhUnicodeEntry = segments.blog__localized.find(
      e => e.loc === `/zh/blog/${unicodeSlug}`
    );
    assert.deepEqual(zhUnicodeEntry, {
      loc: `/zh/blog/${unicodeSlug}`,
      lastmod: '2026-05-10T00:00:00.000Z',
      onDemand: true,
    });
    assert.equal(
      segments.blog__localized.some(e => e.loc.startsWith('/fr/blog/')),
      false,
      'non-indexable locales must not enter localized blog sitemap segment'
    );

    // 2. Development getStaticPaths skips scanning English blog files
    process.env.NODE_ENV = 'development';
    let scannedInDev = false;
    const devRoute = loadTs('src/pages/[lang]/blog/[id].tsx', {
      '@/types/localization': localizationTypes,
      '@/components/localization/BlogDetail': { BlogDetail: () => null },
      '@/components/localization/CreateBlogDetailProps': {
        createBlogDetailProps: () => ({
          getBlogDetailStaticPaths: () => {
            scannedInDev = true;
            return { paths: [], fallback: false };
          },
        }),
      },
      '@/utils/localization': localizationUtils,
      '@/utils/doc-sitemap-segments': { writeSitemapSegment: () => {} },
      '@/server/content-freshness': {},
    });
    const devPaths = devRoute.getStaticPaths();
    assert.equal(devPaths.fallback, 'blocking');
    assert.equal(scannedInDev, false);
    process.env.NODE_ENV = 'production';

    // 3. Translated indexable post (zh) -> translated title + self-canonical
    const zhRes = await route.getStaticProps({
      params: { lang: 'zh', id: unicodeSlug },
    });
    assert.equal(zhRes.props.title, '中文 RaBitQ');
    assert.equal(zhRes.props.canonicalUrl, `${origin}/zh/blog/${unicodeSlug}`);
    assert.ok(zhRes.props.newHtml.includes('Body ZH'));

    // 4. Untranslated stub in zh -> English fallback content + zh self-canonical
    const zhFallback = await route.getStaticProps({
      params: { lang: 'zh', id: 'fallback-only.md' },
    });
    assert.equal(zhFallback.props.title, 'Fallback Only');
    assert.equal(zhFallback.props.canonicalUrl, `${origin}/zh/blog/fallback-only.md`);
    assert.ok(zhFallback.props.newHtml.includes('English body'));

    // 5. Non-indexable locale (fr) -> translated content + English canonical
    const frRes = await route.getStaticProps({
      params: { lang: 'fr', id: unicodeSlug },
    });
    assert.equal(frRes.props.title, 'Français RaBitQ');
    assert.equal(frRes.props.canonicalUrl, `${origin}/blog/${unicodeSlug}`);

    // 6. Invalid locale -> 404 without throwing ENOENT
    const badLocale = await route.getStaticProps({
      params: { lang: 'xx', id: unicodeSlug },
    });
    assert.deepEqual(badLocale, { notFound: true });

    // 7. Unknown ID in a valid locale -> 404 immediately without reading locale dir
    // (Notice `de` directory does not even exist in tmpDir; if it touched `de` it would throw ENOENT)
    const missingId = await route.getStaticProps({
      params: { lang: 'de', id: 'nonexistent.md' },
    });
    assert.deepEqual(missingId, { notFound: true });

    // 8. gray-matter global cache remains empty (no article bodies leaked)
    assert.equal(Object.keys(matter.cache).length, 0);
  } finally {
    process.env.NODE_ENV = origNodeEnv;
    process.chdir(origCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('sitemap additionalPaths preserves daily changefreq for on-demand localized blogs and weekly for docs', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'milvus-sitemap-test-'));
  const origCwd = process.cwd();
  try {
    fs.mkdirSync(path.join(tmpDir, '.doc-sitemap'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'content/seo-landings/en'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'content/seo-landings/zh'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.doc-sitemap/blog__localized.json'),
      JSON.stringify([
        {
          loc: '/zh/blog/sample.md',
          lastmod: '2026-05-10T00:00:00.000Z',
          onDemand: true,
        },
      ])
    );
    fs.writeFileSync(
      path.join(tmpDir, '.doc-sitemap/docs__zh__latest.json'),
      JSON.stringify([
        {
          loc: '/docs/zh/overview.md',
          lastmod: '2026-05-11T00:00:00.000Z',
          onDemand: true,
        },
      ])
    );

    process.chdir(tmpDir);
    const sitemapPath = path.join(root, 'sitemap.config.js');
    delete require.cache[require.resolve(sitemapPath)];
    const config = require(sitemapPath);
    const entries = await config.additionalPaths({
      changefreq: 'daily',
      priority: 0.7,
    });
    const blogEntry = entries.find(e => e.loc === '/zh/blog/sample.md');
    const docEntry = entries.find(e => e.loc === '/docs/zh/overview.md');
    assert.deepEqual(blogEntry, {
      loc: '/zh/blog/sample.md',
      changefreq: 'daily',
      priority: 0.7,
      lastmod: '2026-05-10T00:00:00.000Z',
    });
    assert.deepEqual(docEntry, {
      loc: '/docs/zh/overview.md',
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: '2026-05-11T00:00:00.000Z',
    });
  } finally {
    process.chdir(origCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('SDK and REST getStaticProps strip menus/curCategoryContentData while preserving canonical URLs and version links', async () => {
  const sharedMenu = [
    {
      id: 'pymilvus',
      label: 'PyMilvus',
      href: '',
      parentIds: [],
      parentId: '',
      isMenu: true,
      level: NaN,
      externalLink: '',
      children: [
        {
          id: 'MilvusClient-Vector-search.md',
          label: 'search',
          href: 'MilvusClient/Vector/search.md',
          parentIds: ['pymilvus'],
          parentId: 'pymilvus',
          isMenu: false,
          level: NaN,
          externalLink: '',
          children: [],
        },
      ],
    },
  ];

  const makeEntry = (version, parentIds, id, ext = '.md') => ({
    sourcePath: `/content/${version}/${[...parentIds, id].join('/')}`,
    frontMatter: {
      id: id.replace(/\.mdx$/, '.md'),
      parentIds,
      relativePath: `/${version}/${[...parentIds, id].join('/')}`,
      version,
      category: docTypes.ApiReferenceRouteEnum.Python,
    },
  });

  const sdkVersions = [
    {
      version: 'v3.0.x',
      menuData: sharedMenu,
      contentList: [
        makeEntry('v3.0.x', ['MilvusClient', 'Vector'], 'search.md'),
        makeEntry('v3.0.x', ['MilvusClient', 'Vector'], 'query.md'),
        makeEntry('v3.0.x', ['MilvusClient', 'Vector'], 'insert.md'),
      ],
    },
    {
      version: 'v2.6.x',
      menuData: sharedMenu,
      contentList: [
        makeEntry('v2.6.x', ['MilvusClient', 'Vector'], 'search.md'),
        makeEntry('v2.6.x', ['ORM'], 'legacy.md'),
      ],
    },
  ];

  const sdkRoute = loadTs('src/pages/api-reference/[language]/[version]/[...slug].tsx', {
    '@/parts/docs/leftNavTree': () => null,
    'react-i18next': { useTranslation: () => ({ t: k => k }) },
    '@/components/aside': () => null,
    '@/utils/markdown': { markdownToHtml: c => ({ tree: c, codeList: [] }) },
    '@/styles/docDetail.module.css': {},
    '@/components/layout/docLayout': () => null,
    '@/parts/docs/docContent': () => null,
    '@/utils/apiReference': {
      generateApiReferenceVersionsInfo: () => [
        {
          language: docTypes.ApiReferenceLanguageEnum.Python,
          versions: ['v3.0.x', 'v2.6.x'],
          latestVersion: 'v3.0.x',
          category: docTypes.ApiReferenceRouteEnum.Python,
        },
      ],
      generateApiMenuAndContentDataOfSingleVersion: ({ version }) =>
        sdkVersions.find(v => v.version === version),
      generateApiMenuAndContentDataOfAllVersions: () => sdkVersions,
      generateSingleApiDocContent: () => '# Heading\nbody',
    },
    '@/types/docs': docTypes,
    '@/hooks/enhanceCodeBlock': { useCopyCode: () => {} },
    '@/consts/externalLinks': {},
    '@/utils': utilsIndex,
    '@/consts': { ABSOLUTE_BASE_URL: origin },
    '@/components/localization/utils': seoUtils,
    '@/utils/client-doc-data': clientDocData,
    '@/utils/doc-sitemap-segments': { writeSitemapSegment: () => {} },
    '@/server/content-freshness': { getContentLastModified: () => '2026-05-01T00:00:00.000Z' },
    '@/hooks/use-breadcrumb-lables': { useBreadcrumbLabels: () => [] },
    '@/hooks/use-anchor-event-listener': { useAnchorEventListener: () => {} },
    '@/components/JsonLd': () => null,
    '@/schema': {},
  });

  // Shared archived page: stripped curCategoryContentData still canonicalizes to latest
  const sharedRes = await sdkRoute.getStaticProps({
    params: {
      language: 'pymilvus',
      version: 'v2.6.x',
      slug: ['MilvusClient', 'Vector', 'search.md'],
    },
  });
  assert.deepEqual(sharedRes.props.curCategoryContentData, [
    { version: 'v3.0.x', mds: ['MilvusClient-Vector-search.md'] },
    { version: 'v2.6.x', mds: ['MilvusClient-Vector-search.md'] },
  ]);
  assert.equal('isMenu' in sharedRes.props.menus[0], false);
  assert.equal('level' in sharedRes.props.menus[0], false);
  const sharedCanonical = seoUtils.getApiCanonicalUrl({
    languageCategory: sharedRes.props.languageCategory,
    version: sharedRes.props.version,
    latestVersion: sharedRes.props.latestVersion,
    relativePath: sharedRes.props.relativePath,
    latestVersionMds: sharedRes.props.curCategoryContentData.find(v => v.version === 'v3.0.x')?.mds,
  });
  assert.equal(sharedCanonical, `${origin}/api-reference/pymilvus/v3.0.x/MilvusClient/Vector/search.md`);
  const versionLinks = utilsIndex.generateVersionSelectOptions({
    versions: sharedRes.props.versions,
    currentMdId: sharedRes.props.currentId,
    mdListData: sharedRes.props.curCategoryContentData,
    latestVersion: sharedRes.props.latestVersion,
    type: 'api',
    category: sharedRes.props.category,
  });
  assert.equal(versionLinks.length, 2);

  // Archived-only page: self-canonicalizes to v2.6.x
  const archivedRes = await sdkRoute.getStaticProps({
    params: { language: 'pymilvus', version: 'v2.6.x', slug: ['ORM', 'legacy.md'] },
  });
  assert.deepEqual(archivedRes.props.curCategoryContentData, [
    { version: 'v3.0.x', mds: [] },
    { version: 'v2.6.x', mds: ['ORM-legacy.md'] },
  ]);
  const archivedCanonical = seoUtils.getApiCanonicalUrl({
    languageCategory: archivedRes.props.languageCategory,
    version: archivedRes.props.version,
    latestVersion: archivedRes.props.latestVersion,
    relativePath: archivedRes.props.relativePath,
    latestVersionMds: archivedRes.props.curCategoryContentData.find(v => v.version === 'v3.0.x')?.mds,
  });
  assert.equal(archivedCanonical, `${origin}/api-reference/pymilvus/v2.6.x/ORM/legacy.md`);

  // RESTful MDX (.mdx source requested as .md)
  const restVersions = [
    {
      version: 'v3.0.x',
      menuData: sharedMenu,
      contentList: [
        makeEntry('v3.0.x', ['v2', 'Vector'], 'Search.mdx', '.mdx'),
        makeEntry('v3.0.x', ['v2', 'Vector'], 'Query.mdx', '.mdx'),
      ],
    },
    {
      version: 'v2.6.x',
      menuData: sharedMenu,
      contentList: [
        makeEntry('v2.6.x', ['v2', 'Vector'], 'Search.mdx', '.mdx'),
        makeEntry('v2.6.x', ['v1', 'Vector'], 'LegacySearch.mdx', '.mdx'),
      ],
    },
  ];
  const restRoute = loadTs('src/pages/api-reference/restful/[version]/[...slug].tsx', {
    'next-mdx-remote': { MDXRemote: () => null },
    'next-mdx-remote/serialize': { serialize: async () => ({ compiledSource: '' }) },
    '@/components/layout/docLayout': () => null,
    '@/components/JsonLd': () => null,
    '@/schema': {},
    '@/components/mdx': { components: {} },
    '@/consts': { ABSOLUTE_BASE_URL: origin },
    '@/parts/docs/leftNavTree': () => null,
    '@/types/docs': docTypes,
    '@/utils': utilsIndex,
    '@/utils/mdx': {
      getVariablesFromMDX: async () => ({ exports: {} }),
      getRehypeHeadingTagPlugin: () => () => {},
      rehypeCodeBlockHighlightPlugin: () => {},
    },
    '@/utils/restful': {
      SPLIT_FLAG: '::',
      generateRestfulVersionsInfo: () => [
        {
          language: docTypes.ApiReferenceLanguageEnum.Restful,
          versions: ['v3.0.x', 'v2.6.x'],
          latestVersion: 'v3.0.x',
          category: docTypes.ApiReferenceRouteEnum.Restful,
        },
      ],
      generateRestfulMenuAndContentDataOfSingleVersion: ({ version }) =>
        restVersions.find(v => v.version === version),
      generateRestfulMenuAndContentDataOfAllVersions: () => restVersions,
      generateSingleRestfulDocContent: () => '# Search\nbody',
    },
    '@/utils/client-doc-data': clientDocData,
    '@/utils/doc-sitemap-segments': { writeSitemapSegment: () => {} },
    '@/server/content-freshness': { getContentLastModified: () => '2026-05-01T00:00:00.000Z' },
    '@/styles/docDetail.module.css': {},
    '@/styles/restful.module.css': {},
    '@/components/breadcrumb': () => null,
    '@/hooks/use-breadcrumb-lables': { useBreadcrumbLabels: () => [] },
    '@/components/localization/utils': seoUtils,
  });

  const restShared = await restRoute.getStaticProps({
    params: { version: 'v2.6.x', slug: ['v2', 'Vector', 'Search.md'] },
  });
  assert.deepEqual(restShared.props.curCategoryContentData, [
    { version: 'v3.0.x', mds: ['v2-Vector-Search.mdx'] },
    { version: 'v2.6.x', mds: ['v2-Vector-Search.mdx'] },
  ]);
  const toRestfulRouteMd = p => p.replace(/\.mdx$/, '.md');
  const restSharedCanonical = seoUtils.getApiCanonicalUrl({
    languageCategory: restShared.props.category,
    version: restShared.props.version,
    latestVersion: restShared.props.latestVersion,
    relativePath: toRestfulRouteMd(restShared.props.relativePath),
    latestVersionMds: restShared.props.curCategoryContentData
      .find(v => v.version === 'v3.0.x')
      ?.mds.map(toRestfulRouteMd),
  });
  assert.equal(restSharedCanonical, `${origin}/api-reference/restful/v3.0.x/v2/Vector/Search.md`);

  const restArchived = await restRoute.getStaticProps({
    params: { version: 'v2.6.x', slug: ['v1', 'Vector', 'LegacySearch.md'] },
  });
  assert.deepEqual(restArchived.props.curCategoryContentData, [
    { version: 'v3.0.x', mds: [] },
    { version: 'v2.6.x', mds: ['v1-Vector-LegacySearch.mdx'] },
  ]);
  const restArchivedCanonical = seoUtils.getApiCanonicalUrl({
    languageCategory: restArchived.props.category,
    version: restArchived.props.version,
    latestVersion: restArchived.props.latestVersion,
    relativePath: toRestfulRouteMd(restArchived.props.relativePath),
    latestVersionMds: restArchived.props.curCategoryContentData
      .find(v => v.version === 'v3.0.x')
      ?.mds.map(toRestfulRouteMd),
  });
  assert.equal(restArchivedCanonical, `${origin}/api-reference/restful/v2.6.x/v1/Vector/LegacySearch.md`);
});

test('dedupe-public-assets hardlinks duplicate files, preserves unique files, and is idempotent', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'milvus-dedupe-test-'));
  try {
    const a = path.join(tmpDir, 'v2.5.x/a.png');
    const b = path.join(tmpDir, 'v2.6.x/a.png');
    const c = path.join(tmpDir, 'v2.6.x/unique.png');
    fs.mkdirSync(path.dirname(a), { recursive: true });
    fs.mkdirSync(path.dirname(b), { recursive: true });
    const payload = Buffer.from('identical-image-bytes-12345');
    fs.writeFileSync(a, payload);
    fs.writeFileSync(b, payload);
    fs.writeFileSync(c, Buffer.from('different-image-bytes'));

    const script = path.join(root, 'scripts/dedupe-public-assets.js');
    execFileSync(process.execPath, [script, tmpDir], { encoding: 'utf8' });

    const sa = fs.statSync(a);
    const sb = fs.statSync(b);
    const sc = fs.statSync(c);
    assert.equal(sa.ino, sb.ino);
    assert.equal(sa.nlink, 2);
    assert.notEqual(sa.ino, sc.ino);
    assert.deepEqual(fs.readFileSync(b), payload);

    // Running a second time is a safe no-op
    const out2 = execFileSync(process.execPath, [script, tmpDir], { encoding: 'utf8' });
    assert.match(out2, /hardlinked 0 duplicate files/);
    assert.deepEqual(fs.readFileSync(a), payload);
    assert.deepEqual(fs.readFileSync(b), payload);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
