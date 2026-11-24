const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');
const ts = require('typescript');
const { isSerializableProps } = require('next/dist/lib/is-serializable-props');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(file, dependencies = {}, globals = {}) {
  const filename = join(__dirname, '../src', file);
  const localRequire = createRequire(filename);
  const scope = {
    exports: {},
    require: name => Object.hasOwn(dependencies, name) ? dependencies[name] : localRequire(name),
    process,
    ...globals,
  };
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  vm.runInNewContext(outputText, scope, { filename });
  return scope.exports;
}

test('sitemap dates come from the rendered content and survive builds without Git', async t => {
  const workspace = fs.mkdtempSync(join(tmpdir(), 'content-freshness-'));
  const originalCwd = process.cwd();
  t.after(() => {
    process.chdir(originalCwd);
    fs.rmSync(workspace, { recursive: true, force: true });
  });
  process.chdir(workspace);

  function write(file, body) {
    fs.mkdirSync(dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  }

  const identity = ['-c', 'user.name=Test', '-c', 'user.email=test@example.com'];
  const git = (repo, args, date) => execFileSync('git', [...identity, ...args], {
    cwd: join(workspace, 'src', repo),
    env: date ? { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : process.env,
    stdio: 'ignore',
  });
  function commit(repo, date) {
    git(repo, ['add', '.']);
    git(repo, ['commit', '-m', 'Update content'], date);
  }

  const published = '2021-04-07T00:00:00.000Z';
  const first = '2022-06-01T08:00:00.000Z';
  const revised = '2023-09-12T08:00:00.000Z';
  const integrated = '2024-01-05T08:00:00.000Z';
  const editedByAuthor = '2024-12-16T00:00:00.000Z';
  const post = '---\ntitle: Example\ndate: 2021-4-7\n---\n';
  write('src/blogs/blog/en/updated.md', `${post}Original content`);
  write('src/blogs/blog/en/untouched.md', `${post}Original content`);
  write('src/blogs/blog/en/notes+summary.md', post);
  write('src/blogs/blog/en/scheduled.md', '---\ntitle: Scheduled\ndate: 2024-12-16\n---\n');
  write('src/blogs/blog/en/editorial.md', '---\nid: editorial.md\ntitle: Edited\ndate: 2024-12-16\ndateModified: 2024-12-18\n---\n');
  write('src/blogs/localization/blog/ja/updated.md', '\n');
  write('src/blogs/localization/blog/zh/updated.md', '---\ntitle: 中文\ndateModified: 2024-12-16\n---\n');
  git('blogs', ['init']);
  commit('blogs', first);
  write('src/blogs/blog/en/updated.md', `${post}Revised content`);
  commit('blogs', revised);
  write('src/blogs/blog/en/published.md', post);

  const docSource = 'src/docs/localization/v3.0.x/site/en/guide/overview.md';
  const homeSource = 'src/docs/localization/v3.0.x/site/en/home/home.md';
  const sdkSource = 'src/docs/API_Reference/pymilvus/v3.0.x/Index.md';
  const restSource = 'src/docs/API_Reference_MDX/milvus-restful/v3.0.x/Vector (v1)/Get.mdx';
  write(docSource, '# Overview');
  write(homeSource, '# Docs');
  write(sdkSource, '# Index');
  write(restSource, '# Get');
  git('docs', ['init', '-b', 'main']);
  commit('docs', first);
  git('docs', ['switch', '-c', 'docs-update']);
  write(restSource, '# Get reference');
  commit('docs', revised);
  git('docs', ['switch', 'main']);
  git('docs', ['merge', '--no-ff', '-m', 'Merge docs update', 'docs-update'], integrated);

  const generator = join(__dirname, '../scripts/generate-content-freshness.js');
  execFileSync(process.execPath, [generator, '--require-history']);
  const indexPath = 'content/git-last-modified.json';
  const index = fs.readFileSync(indexPath, 'utf8');
  const dates = JSON.parse(index);
  assert.equal(dates[docSource], first);
  assert.equal(dates[sdkSource], first);
  assert.equal(dates[restSource], integrated);

  const localization = load('types/localization.ts');
  const { createDocDetailProps } = load('components/localization/CreateDocDetailProps.ts', {
    '@/utils/docs': {
      BASE_DOC_DIR: 'src/docs',
      generateDocVersionInfo: () => ({ latestVersion: 'v3.0.x' }),
      generateAllContentDataOfSingleVersion: () => [
        { frontMatter: { id: 'overview.md' }, editPath: '/v3.0.x/site/en/guide/overview.md' },
        { frontMatter: { id: 'overview.md', dateModified: editedByAuthor }, editPath: '/v3.0.x/site/en/reference/overview.md' },
      ],
    },
    '@/utils/apiReference': {},
    '@/types/localization': localization,
    '@/components/localization/DocDetail': {},
    '@/components/localization/utils': {},
    '@/utils/client-doc-data': {},
    '@/utils/doc-sitemap-segments': load('utils/doc-sitemap-segments.ts', {}, {
      process: { cwd: process.cwd, env: { NODE_ENV: 'production' } },
    }),
    '@/server/content-freshness': require('../src/server/content-freshness'),
  }, { process: { env: { NODE_ENV: 'production' } } });
  const { paths } = createDocDetailProps('en').getPageStaticPaths();
  assert.equal(paths.length, 1);
  assert.equal(paths[0].params.id, 'overview.md');
  const entries = JSON.parse(fs.readFileSync('.doc-sitemap/docs__en__latest.json', 'utf8'));
  assert.deepEqual(entries.find(page => page.loc === '/docs'), { loc: '/docs', lastmod: first });
  assert.deepEqual(entries.filter(page => page.loc === '/docs/overview.md'), [
    { loc: '/docs/overview.md', lastmod: first, onDemand: false },
  ]);

  write('.doc-sitemap/example.json', JSON.stringify([
    { loc: '/docs/overview.md', lastmod: revised },
    { loc: '/docs/zh/overview.md', lastmod: revised, onDemand: true },
    { loc: '/docs/zh/overview.md', lastmod: first, onDemand: true },
    { loc: '/docs/fr/overview.md', lastmod: revised, onDemand: true },
    { loc: '/api-reference/restful/v3.0.x/Vector (v1)/Get.md', lastmod: first },
  ]));
  for (const lang of ['en', 'zh']) {
    fs.mkdirSync(`content/seo-landings/${lang}`, { recursive: true });
  }

  for (const repo of ['docs', 'blogs']) fs.renameSync(`src/${repo}/.git`, `${repo}-git-metadata`);
  execFileSync(process.execPath, [generator]);
  assert.equal(fs.readFileSync(indexPath, 'utf8'), index);
  const strict = spawnSync(process.execPath, [generator, '--require-history'], { encoding: 'utf8' });
  assert.equal(strict.status, 1);
  assert.match(strict.stderr, /No usable Git modification dates in src\/docs, src\/blogs/);

  const config = require('../sitemap.config');
  const transform = loc => config.transform({ autoLastmod: true }, loc);
  for (const [url, date] of [
    ['/docs/overview.md', first],
    ['/blog/untouched.md', first],
    ['/blog/updated.md', revised],
    ['/blog/notes%2Bsummary.md', first],
    ['/blog/scheduled.md', editedByAuthor],
    ['/zh/blog/updated.md', editedByAuthor],
    ['/ja/blog/updated.md', revised],
    ['/blog/published.md', published],
    ['/api-reference/restful/v3.0.x/Vector%20(v1)/Get.md', first],
    ['/docs/no-source-date.md', undefined],
    ['/blog', undefined],
  ]) {
    assert.equal((await transform(url)).lastmod, date, url);
  }

  const localized = (await config.additionalPaths()).filter(page => page.loc.startsWith('/docs/'));
  assert.deepEqual(localized.map(({ loc, lastmod }) => [loc, lastmod]), [
    ['/docs/zh/overview.md', revised],
  ]);

  const { default: blog } = load('utils/blog.utils.ts', { '@/types/localization': localization });
  const { generateAllBlogContentList } = load('utils/blogs.ts', {
    './docs': { validationFileFilter: file => file.endsWith('.md') },
    './index': { getCacheData: () => undefined, setCacheData: () => {} },
  });
  const editorialDate = '2024-12-18T00:00:00.000Z';
  for (const post of [
    blog.getAllData().find(post => post.id === 'editorial.md'),
    blog.getListData().find(post => post.id === 'editorial.md'),
    generateAllBlogContentList().find(post => post.frontMatter.id === 'editorial.md').frontMatter,
  ]) {
    assert.equal(post.dateModified, editorialDate);
    assert.ok(isSerializableProps('/blog/[id]', 'getStaticProps', { post }));
  }

  fs.renameSync('blogs-git-metadata', 'src/blogs/.git');
  fs.renameSync('src/blogs', 'src/blogs-full');
  const cloneUrl = pathToFileURL(join(workspace, 'src/blogs-full')).href;
  execFileSync('git', ['clone', '--depth=2', cloneUrl, 'src/blogs'], { stdio: 'ignore' });
  execFileSync(process.execPath, [generator]);
  const shallow = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  assert.equal(shallow['src/blogs/blog/en/updated.md'], revised);
  assert.equal(shallow['src/blogs/blog/en/untouched.md'], undefined);
  fs.rmSync('src/blogs', { recursive: true });
  execFileSync('git', ['clone', '--depth=1', cloneUrl, 'src/blogs'], { stdio: 'ignore' });
  execFileSync(process.execPath, [generator]);
  assert.deepEqual(
    JSON.parse(fs.readFileSync(indexPath, 'utf8')),
    Object.fromEntries(Object.entries(dates).filter(([file]) => file.startsWith('src/docs/')))
  );
});

test('only self-canonical Docs publish TechArticle metadata', () => {
  const constants = { ABSOLUTE_BASE_URL: 'https://milvus.io' };
  const localization = load('types/localization.ts');
  const seoUtils = load('components/localization/utils.ts', {
    '@/types/localization': localization,
    '@/consts': constants,
  });
  const generators = load('schema/generators.ts', {
    './constants': load('schema/constants.ts', { '@/consts': constants }),
  });
  const schema = load('schema/buildSchema.ts', { './generators': generators });
  const noOp = () => null;
  const { DocDetailPage } = load('components/localization/DocDetail.tsx', {
    '@/types/localization': localization,
    '@/components/localization/utils': seoUtils,
    '@/consts': constants,
    '@/schema': schema,
    '@/components/JsonLd': load('components/JsonLd/index.tsx', { 'next/head': ({ children }) => children }),
    '@/parts/docs/docContent': noOp,
    '@/components/aside': noOp,
    '@/parts/docs/leftNavTree': noOp,
    '@/components/layout/docLayout': noOp,
    '@/styles/docDetail.module.css': {},
    'react-i18next': { useTranslation: () => ({ t: key => key }) },
    '@/hooks/enhanceCodeBlock': {
      useCopyCode: noOp, useFilter: noOp, useMultipleCodeFilter: noOp,
    },
    '@/hooks/doc-anchor': { useActivateAnchorWhenScroll: noOp, useGenAnchor: noOp },
    '@/hooks/use-breadcrumb-lables': { useBreadcrumbLabels: noOp },
    '@/hooks/use-anchor-event-listener': { useAnchorEventListener: noOp },
    '@/hooks/use-heading-anchor-fallback': { useHeadingAnchorFallback: noOp },
  });
  const canonicalUrl = 'https://milvus.io/docs/overview.md';
  const lastModified = '2026-05-12T08:08:34.000Z';
  const renderSchemas = (lang, version, canonical = canonicalUrl) => {
    const html = renderToStaticMarkup(React.createElement(DocDetailPage, {
      id: 'overview.md', lang, version, canonicalUrl: canonical, lastModified, latestVersion: 'v3.0.x',
      homeData: { frontMatter: { title: 'Overview' } },
    }));
    return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map(([, json]) => JSON.parse(json));
  };

  const canonical = renderSchemas('en', 'v3.0.x');
  const article = canonical.find(item => item['@type'] === 'TechArticle');
  assert.equal(article.url, canonicalUrl);
  assert.equal(article['@id'], `${canonicalUrl}#article`);
  assert.equal(article.mainEntityOfPage['@id'], canonicalUrl);
  assert.equal(article.dateModified, lastModified);
  assert.equal(article.inLanguage, 'en');
  assert.equal(article.about.softwareVersion, 'v3.0.x');
  for (const [lang, version] of [['fr', 'v3.0.x'], ['en', 'v2.6.x']]) {
    assert.deepEqual(renderSchemas(lang, version).map(item => item['@type']), ['BreadcrumbList']);
  }
  const archivedUrl = 'https://milvus.io/docs/v2.6.x/overview.md';
  const archived = renderSchemas('en', 'v2.6.x', archivedUrl).find(item => item['@type'] === 'TechArticle');
  assert.equal(archived.url, archivedUrl);
  assert.equal(archived.about.softwareVersion, 'v2.6.x');
});

test('SDK and REST record the source dates of latest and self-canonical archived pages', async () => {
  const constants = { ABSOLUTE_BASE_URL: 'https://milvus.io' };
  const docTypes = load('types/docs.ts');
  const seoUtils = load('components/localization/utils.ts', {
    '@/types/localization': load('types/localization.ts'),
    '@/consts': constants,
  });
  const dependencies = {
    '@/consts': constants,
    '@/types/docs': docTypes,
    '@/utils': load('utils/index.ts', { '@/types/docs': docTypes }),
    '@/components/localization/utils': seoUtils,
    ...Object.fromEntries([
      '@/parts/docs/leftNavTree', '@/components/aside', '@/utils/markdown',
      '@/styles/docDetail.module.css', '@/components/layout/docLayout',
      '@/parts/docs/docContent', '@/hooks/enhanceCodeBlock', '@/consts/externalLinks',
      '@/hooks/use-breadcrumb-lables', '@/hooks/use-anchor-event-listener',
      'next-mdx-remote', 'next-mdx-remote/serialize', '@/components/mdx',
      '@/utils/mdx', '@/styles/restful.module.css', '@/components/breadcrumb',
      '@/components/JsonLd', '@/schema',
    ].map(name => [name, {}])),
  };
  const latestVersion = 'v3.0.x';
  const archivedVersion = 'v2.6.x';
  for (const [category, file, loader, type, extension] of [
    ['pymilvus', '[language]/[version]/[...slug].tsx', 'apiReference', 'Api', '.md'],
    ['restful', 'restful/[version]/[...slug].tsx', 'restful', 'Restful', '.mdx'],
  ]) {
    const latestDate = '2026-01-20T00:00:00.000Z';
    const archivedDate = '2025-12-20T00:00:00.000Z';
    const parent = 'Vector (v1)';
    const entry = (version, name) => {
      const relativePath = `/${version}/${parent}/${name}${extension}`;
      return {
        sourcePath: `/content/${category}${relativePath}`,
        frontMatter: { category, version, relativePath, id: `${name}.md`, parentIds: [parent] },
      };
    };
    const latest = entry(latestVersion, 'Get');
    const archived = entry(archivedVersion, 'Legacy');
    const sources = new Map([[latest.sourcePath, latestDate], [archived.sourcePath, archivedDate]]);
    let segment;
    const versionsMethod = type === 'Api' ? 'generateApiReferenceVersionsInfo' : 'generateRestfulVersionsInfo';
    const route = load(`pages/api-reference/${file}`, {
      ...dependencies,
      [`@/utils/${loader}`]: {
        [versionsMethod]: () => [{
          category, latestVersion, versions: [latestVersion, archivedVersion],
          language: type === 'Api' ? docTypes.ApiReferenceLanguageEnum.Python : docTypes.ApiReferenceLanguageEnum.Restful,
        }],
        [`generate${type}MenuAndContentDataOfSingleVersion`]: ({ version }) => ({
          contentList: version === latestVersion ? [latest] : [entry(archivedVersion, 'Get'), archived],
        }),
      },
      '@/utils/doc-sitemap-segments': { writeSitemapSegment: (_key, pages) => { segment = JSON.stringify(pages); } },
      '@/server/content-freshness': { getContentLastModified: sourcePath => sources.get(sourcePath) },
    });
    const { paths, fallback } = await route.getStaticPaths();
    assert.equal(fallback, 'blocking');
    assert.equal(paths.length, 1);
    assert.equal(paths[0].params.version, latestVersion);
    assert.deepEqual(JSON.parse(segment), [
      { loc: `/api-reference/${category}/${latestVersion}/${parent}/Get.md`, lastmod: latestDate, onDemand: false },
      { loc: `/api-reference/${category}/${archivedVersion}/${parent}/Legacy.md`, lastmod: archivedDate, onDemand: true },
    ]);
  }
});
