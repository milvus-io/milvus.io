const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const root = path.resolve(__dirname, '..');
const origin = 'https://milvus.io';

function load(relPath, deps = {}) {
  const file = path.join(root, relPath);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const scope = {
    exports: {},
    require: name => (name in deps ? deps[name] : require(name)),
    process,
    URL,
    URLSearchParams,
  };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}

const fullConsts = {
  ABSOLUTE_BASE_URL: origin,
  GITHUB_MILVUS_LINK: 'https://github.com/milvus-io/milvus',
  MILVUS_TWITTER_LINK: 'https://twitter.com/milvusio',
  MILVUS_LINKEDIN_URL: 'https://www.linkedin.com/company/the-milvus-project/',
  MILVUS_YOUTUBE_CHANNEL_LINK: 'https://www.youtube.com/channel/UCMCo_F7pKjMHBlfyxwOPw-g',
  DISCORD_INVITE_URL: 'https://milvus.io/discord',
  CLOUD_SIGNUP_LINK: 'https://cloud.zilliz.com/signup',
};

const schemaConstants = load('src/schema/constants.ts', { '@/consts': fullConsts });
const generators = load('src/schema/generators.ts', { './constants': schemaConstants });
const buildSchemaMod = load('src/schema/buildSchema.ts', { './generators': generators });
const schemaIndex = { ...schemaConstants, ...buildSchemaMod, ...generators };
const JsonLd = load('src/components/JsonLd/index.tsx', {
  'next/head': ({ children }) => React.createElement(React.Fragment, null, children),
}).default;
const localization = load('src/types/localization.ts');

const parseJsonLd = html =>
  [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(
    ([, raw]) => JSON.parse(raw)
  );

test('Organization, WebSite, WebPage, and SoftwareApplication carry precise entity anchors and attributes', () => {
  const org = schemaIndex.buildSchema('organization');
  assert.equal(org['@id'], 'https://milvus.io/#organization');
  assert.equal(org.founder.name, 'Zilliz');
  assert.equal(org.founder.url, 'https://zilliz.com/');
  assert.equal(org.memberOf.name, 'LF AI & Data Foundation');
  assert.equal(org.memberOf.url, 'https://lfaidata.foundation/');
  for (const anchor of [
    'https://github.com/milvus-io/milvus',
    'https://en.wikipedia.org/wiki/Milvus_(vector_database)',
    'https://lfaidata.foundation/projects/milvus/',
    'https://milvus.io/discord',
  ]) {
    assert.ok(org.sameAs.includes(anchor), `sameAs missing ${anchor}`);
  }
  assert.equal(org.sameAs.includes('https://zilliz.com/'), false, 'Zilliz belongs on founder, not Organization.sameAs');
  assert.equal(org.sameAs.includes('https://pypi.org/project/pymilvus/'), false, 'PyPI belongs on PyMilvus SDK, not Organization.sameAs');
  assert.equal(org.sameAs.includes('https://hub.docker.com/r/milvusdb/milvus'), false, 'Docker Hub belongs on SoftwareApplication.sameAs');

  const website = schemaIndex.buildSchema('website', { inLanguage: 'en' });
  assert.equal(website['@id'], 'https://milvus.io/#website');
  assert.equal(website.url, 'https://milvus.io');
  assert.equal(website.inLanguage, 'en');
  assert.equal(website.publisher['@id'], 'https://milvus.io/#organization');
  assert.ok(website.description);

  const zhPage = schemaIndex.buildSchema('webPage', {
    absoluteUrl: 'https://milvus.io/zh',
    inLanguage: 'zh',
    about: { '@id': 'https://milvus.io/#software' },
  });
  assert.equal(zhPage['@type'], 'WebPage');
  assert.equal(zhPage.url, 'https://milvus.io/zh');
  assert.equal(zhPage.inLanguage, 'zh');
  assert.equal(zhPage.isPartOf['@id'], 'https://milvus.io/#website');

  const app = schemaIndex.buildSchema('softwareApp', {
    offerUrl: fullConsts.CLOUD_SIGNUP_LINK,
    codeRepository: fullConsts.GITHUB_MILVUS_LINK,
    inLanguage: 'en',
  });
  assert.equal(app['@id'], 'https://milvus.io/#software');
  assert.equal(app.license, 'https://www.apache.org/licenses/LICENSE-2.0');
  assert.equal(app.isAccessibleForFree, true);
  assert.ok(app.softwareVersion);
  assert.ok(Array.isArray(app.featureList) && app.featureList.length >= 4);
  assert.ok(app.sameAs.includes('https://hub.docker.com/r/milvusdb/milvus'));
  assert.equal(app.publisher['@id'], 'https://milvus.io/#organization');
});

test('JsonLd escapes < as \\u003c so CMS and glossary text cannot break out of script tags', () => {
  const payload = 'Safe text </script><script>alert("xss")</script> & more';
  const html = renderToStaticMarkup(
    React.createElement(JsonLd, {
      schema: schemaIndex.buildSchema('collectionPage', {
        absoluteUrl: 'https://milvus.io/use-cases',
        name: 'Use Cases',
        items: [{ name: 'Case', description: payload }],
      }),
    })
  );
  const scriptTags = html.match(/<script\b/gi) || [];
  assert.equal(scriptTags.length, 1, 'must render exactly one <script> tag');
  const closingTags = html.match(/<\/script>/gi) || [];
  assert.equal(closingTags.length, 1, 'must render exactly one </script> tag');
  assert.ok(html.includes('\\u003c/script>'), 'literal < must be escaped as \\u003c');
  const [parsed] = parseJsonLd(html);
  assert.equal(parsed.mainEntity.itemListElement[0].description, payload);
});

test('glossary.md extracts DefinedTermSet and DefinedTerm on canonical docs only (with script-breakout safety)', () => {
  const glossaryHtml = `
    <h1 id="Terminology">Terminology</h1>
    <h2 id="AutoID" class="common-anchor-header">AutoID<button class="anchor-icon"><svg></svg></button></h2>
    <p>AutoID determines whether to auto-generate primary keys and handles &lt;/script&gt;&lt;script&gt; safely.</p>
    <h2 id="Collection" class="common-anchor-header">Collection<button class="anchor-icon"><svg></svg></button></h2>
    <p>A collection is equivalent to a table in a relational database &amp; stores entities.</p>
  `;
  const seoUtils = load('src/components/localization/utils.ts', {
    '@/types/localization': localization,
    '@/consts': fullConsts,
  });
  const noOp = () => null;
  const { DocDetailPage } = load('src/components/localization/DocDetail.tsx', {
    '@/types/localization': localization,
    '@/components/localization/utils': seoUtils,
    '@/consts': fullConsts,
    '@/schema': schemaIndex,
    '@/components/JsonLd': JsonLd,
    '@/parts/docs/docContent': noOp,
    '@/components/aside': noOp,
    '@/parts/docs/leftNavTree': noOp,
    '@/components/layout/docLayout': noOp,
    '@/styles/docDetail.module.css': {},
    'react-i18next': { useTranslation: () => ({ t: key => key }) },
    '@/hooks/enhanceCodeBlock': { useCopyCode: noOp, useFilter: noOp, useMultipleCodeFilter: noOp },
    '@/hooks/doc-anchor': { useActivateAnchorWhenScroll: noOp, useGenAnchor: noOp },
    '@/hooks/use-breadcrumb-lables': { useBreadcrumbLabels: noOp },
    '@/hooks/use-anchor-event-listener': { useAnchorEventListener: noOp },
    '@/hooks/use-heading-anchor-fallback': { useHeadingAnchorFallback: noOp },
  });

  const canonicalUrl = 'https://milvus.io/docs/glossary.md';
  const html = renderToStaticMarkup(React.createElement(DocDetailPage, {
    id: 'glossary.md',
    lang: 'en',
    version: 'v3.0.x',
    latestVersion: 'v3.0.x',
    canonicalUrl,
    lastModified: '2026-10-01T00:00:00.000Z',
    homeData: { frontMatter: { title: 'Glossary' }, tree: glossaryHtml },
  }));
  assert.equal((html.match(/<script\b/gi) || []).length, 3, 'TechArticle + BreadcrumbList + DefinedTermSet');
  assert.equal((html.match(/<\/script>/gi) || []).length, 3);
  const schemas = parseJsonLd(html);
  const article = schemas.find(s => s['@type'] === 'TechArticle');
  assert.equal(article.about['@id'], 'https://milvus.io/#software-v3.0.x');
  assert.deepEqual(article.author, {
    '@type': 'Organization',
    '@id': 'https://milvus.io/#organization',
    name: 'Milvus',
    url: 'https://milvus.io',
  });
  const termSet = schemas.find(s => s['@type'] === 'DefinedTermSet');
  assert.ok(termSet, 'glossary.md must emit DefinedTermSet');
  assert.equal(termSet['@id'], `${canonicalUrl}#definedtermset`);
  assert.equal(termSet.publisher['@id'], 'https://milvus.io/#organization');
  assert.equal(termSet.hasDefinedTerm.length, 2);
  assert.equal(termSet.hasDefinedTerm[0].name, 'AutoID');
  assert.equal(termSet.hasDefinedTerm[0].url, `${canonicalUrl}#AutoID`);
  assert.match(termSet.hasDefinedTerm[0].description, /<\/script><script>/);
  assert.match(termSet.hasDefinedTerm[1].description, /relational database & stores entities/);

  // Non-canonical archived glossary must not emit DefinedTermSet
  const archivedHtml = renderToStaticMarkup(React.createElement(DocDetailPage, {
    id: 'glossary.md',
    lang: 'en',
    version: 'v2.6.x',
    latestVersion: 'v3.0.x',
    canonicalUrl,
    homeData: { frontMatter: { title: 'Glossary' }, tree: glossaryHtml },
  }));
  assert.equal(parseJsonLd(archivedHtml).some(s => s['@type'] === 'DefinedTermSet'), false);
});

test('LandingHead links @id entities and emits TechArticle, reviewedOn on WebPage, self-contained author, mentions, and citations', () => {
  const { LandingHead } = load('src/components/seo-landings/LandingPage.tsx', {
    'next/head': ({ children }) => React.createElement(React.Fragment, null, children),
    'next/link': ({ children }) => children,
    '@/utils/growth-measurement': {},
    '@/components/layout/commonLayout': ({ children }) => children,
    '@/hooks/use-store': {},
    '@/types/localization': localization,
    '@/i18n/client': {},
    './landing.module.css': {},
    '@/utils/cloud-attribution': {},
  });
  const html = renderToStaticMarkup(React.createElement(LandingHead, {
    title: 'Milvus vs pgvector',
    description: 'Compare Milvus and pgvector.',
    path: '/compare/milvus-vs-pgvector',
    twinPath: '/zh/compare/milvus-vs-pgvector',
    zh: false,
    image: '/og/milvus-vs-pgvector.png',
    faqs: [['Is Milvus faster?', 'Yes at large scale.']],
    reviewedOn: '2026-10-21',
    sources: ['/docs/overview.md', 'https://zilliz.com/vdbbench-leaderboard', '/docs/overview.md'],
    slug: 'milvus-vs-pgvector',
  }));
  const [{ '@graph': graph }] = parseJsonLd(html);
  const webPage = graph.find(n => n['@type'] === 'WebPage');
  const article = graph.find(n => n['@type'] === 'TechArticle');
  const faq = graph.find(n => n['@type'] === 'FAQPage');
  assert.equal(webPage.publisher['@id'], 'https://milvus.io/#organization');
  assert.equal(webPage.isPartOf['@id'], 'https://milvus.io/#website');
  assert.equal(webPage.dateModified, '2026-10-21');
  assert.equal(webPage.lastReviewed, '2026-10-21');
  assert.equal(webPage.publisher['@type'], undefined, 'must reference @id instead of anonymous Organization');
  assert.ok(article, 'detail landing page must emit TechArticle');
  assert.equal(article.dateModified, '2026-10-21');
  assert.equal(article.lastReviewed, undefined, 'lastReviewed belongs on WebPage, not TechArticle');
  assert.deepEqual(article.author, {
    '@type': 'Organization',
    '@id': 'https://milvus.io/#organization',
    name: 'Milvus',
    url: 'https://milvus.io',
  });
  assert.equal(article.publisher['@id'], 'https://milvus.io/#organization');
  assert.ok(article.about.some(e => e['@id'] === 'https://milvus.io/#software'));
  assert.ok(article.mentions.some(e => e.name === 'pgvector'));
  assert.deepEqual(article.citation, [
    'https://milvus.io/docs/overview.md',
    'https://zilliz.com/vdbbench-leaderboard',
  ]);
  assert.equal(faq.mainEntity.length, 1);
});

test('LearnMilvusSeo references homepage Organization and WebSite via @id', () => {
  const { default: LearnMilvusSeo } = load('src/components/learn-milvus/components/LearnMilvusSeo.tsx', {
    'next/head': ({ children }) => React.createElement(React.Fragment, null, children),
    '@/consts': fullConsts,
    '@/schema': schemaIndex,
    '@/hooks/use-global-locale': { useGlobalLocale: () => ({ locale: 'en', getLocalePath: p => p }) },
    'react-i18next': { useTranslation: () => ({ t: k => k }) },
    '@/utils/learn-milvus-seo': require('../src/utils/learn-milvus-seo'),
  });
  const html = renderToStaticMarkup(React.createElement(LearnMilvusSeo, {
    path: '/learn-milvus/hnsw',
    title: 'HNSW',
    description: 'HNSW visual guide',
    breadcrumbName: 'HNSW',
  }));
  const lr = parseJsonLd(html).find(s => Array.isArray(s['@type']) && s['@type'].includes('LearningResource'));
  assert.deepEqual(lr.publisher, { '@id': 'https://milvus.io/#organization' });
  assert.deepEqual(lr.isPartOf, { '@id': 'https://milvus.io/#website' });
});

test('localized homepage, DocHome, BlogHome, Intro, UseCases, Sizing, and API Reference emit JSON-LD', () => {
  const noOp = () => null;
  const passThrough = ({ children }) => React.createElement(React.Fragment, null, children);
  const headMock = ({ children }) => React.createElement(React.Fragment, null, children);

  // 1. Non-English homepage
  const { default: LangHome } = load('src/pages/[lang]/index.tsx', {
    '@/parts/home/headerSection': noOp,
    '@/parts/home/codeExampleSection': noOp,
    '@/parts/home/tryFreeSection': { AIToolsSection: noOp },
    '@/parts/home/lovedSection': noOp,
    '@/parts/home/vdbSection': noOp,
    '@/parts/home/deploySection': noOp,
    '@/parts/home/developSection': Object.assign(noOp, { MeetupsSection: noOp }),
    '@/components/layout/commonLayout': passThrough,
    '@/parts/home/productionSection/ProductionSection': { ProductionSection: noOp },
    '@/utils/blogs': {},
    '@/styles/home.module.css': {},
    '@/styles/responsive.module.css': {},
    '@/utils/localization': {},
    '@/types/localization': localization,
    '@/parts/home/meta/HomeMeta': { HomeMeta: noOp },
    '@/hooks/use-global-locale': { useGlobalLocale: () => ({ locale: 'zh' }) },
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
    '@/consts': fullConsts,
  });
  const zhHomeSchemas = parseJsonLd(renderToStaticMarkup(React.createElement(LangHome, { lang: 'zh', headlines: [] })));
  assert.deepEqual(zhHomeSchemas.map(s => s['@type']), ['Organization', 'WebSite', 'WebPage', 'SoftwareApplication']);
  assert.equal(zhHomeSchemas[1].url, 'https://milvus.io', '#website must keep canonical domain root URL');
  assert.equal(zhHomeSchemas[2].url, 'https://milvus.io/zh');
  assert.equal(zhHomeSchemas[2].inLanguage, 'zh');
  assert.deepEqual(zhHomeSchemas[2].isPartOf, { '@id': 'https://milvus.io/#website' });

  // 2. DocHome
  const seoUtils = load('src/components/localization/utils.ts', {
    '@/types/localization': localization,
    '@/consts': fullConsts,
  });
  const { DocHomepage } = load('src/components/localization/DocHome.tsx', {
    '@/consts': fullConsts,
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
    '@/types/localization': localization,
    '@/components/layout/docLayout': noOp,
    '@/parts/docs/docHome': noOp,
    '@/parts/docs/leftNavTree': noOp,
    '@/styles/docs.module.css': {},
    '@/components/localization/utils': seoUtils,
    'react-i18next': { useTranslation: () => ({ t: k => k }) },
  });
  const docHomeSchemas = parseJsonLd(renderToStaticMarkup(React.createElement(DocHomepage, {
    lang: 'en', version: 'v3.0.x', latestVersion: 'v3.0.x',
  })));
  assert.deepEqual(docHomeSchemas.map(s => s['@type']), ['CollectionPage', 'BreadcrumbList']);
  assert.equal(docHomeSchemas[0].about['@id'], 'https://milvus.io/#software-v3.0.x');
  assert.equal(docHomeSchemas[0].about.softwareVersion, 'v3.0.x');

  // 2b. BlogHome (page 1, page 2, and empty search)
  const blogConsts = load('src/consts/blog.ts');
  let activeRouterQuery = {};
  const { BlogHome } = load('src/components/localization/BlogHome.tsx', {
    '../../components/layout/commonLayout': passThrough,
    '../../styles/blog.module.css': {},
    '../../styles/responsive.module.css': {},
    'next/head': headMock,
    'next/link': passThrough,
    'next/router': { useRouter: () => ({ pathname: '/blog', query: activeRouterQuery }) },
    '@/consts': fullConsts,
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
    '../../components/icons': {
      AirplaneArrowIcon: noOp, ClockIcon: noOp, RocketIcon: noOp, SearchIcon: noOp, TrendingIcon: noOp,
    },
    '@/components/ui/pagination': {
      Pagination: passThrough, PaginationContent: passThrough, PaginationEllipsis: noOp,
      PaginationItem: passThrough, PaginationLink: passThrough, PaginationNext: noOp, PaginationPrevious: noOp,
    },
    '@/components/subscribe': noOp,
    'react-i18next': { Trans: passThrough, useTranslation: () => ({ t: k => k }) },
    '@/components/inkeep/inkeepChat': { InkeepCustomTriggerWrapper: passThrough },
    '@/parts/blogs/zillizAdv': noOp,
    '@/consts/blog': blogConsts,
    '@/types/localization': localization,
    '@/utils/format': { generatePaginationNavigators: () => [1, 2] },
  });
  const sampleBlogs = Array.from({ length: 12 }, (_, idx) => ({
    id: `post-${idx + 1}.md`,
    title: `Post ${idx + 1}`,
    desc: `Summary ${idx + 1}`,
    date: `2026-10-${String(idx + 1).padStart(2, '0')}T00:00:00.000Z`,
    tags: ['engineering'],
    cover: '/cover.png',
    author: 'Author',
  }));
  activeRouterQuery = {};
  const blogPage1 = parseJsonLd(renderToStaticMarkup(React.createElement(BlogHome, {
    locale: 'en', blogList: sampleBlogs,
  })));
  assert.deepEqual(blogPage1.map(s => s['@type']), ['CollectionPage', 'BreadcrumbList']);
  assert.equal(blogPage1[0].mainEntity.numberOfItems, blogConsts.PAGE_SIZE);
  assert.equal(blogPage1[0].mainEntity.itemListElement[0].name, 'Post 1');

  activeRouterQuery = { [blogConsts.PAGINATION_QUERY_KEY]: 2 };
  const blogPage2 = parseJsonLd(renderToStaticMarkup(React.createElement(BlogHome, {
    locale: 'en', blogList: sampleBlogs,
  })));
  assert.equal(blogPage2[0].mainEntity.numberOfItems, 3);
  assert.equal(blogPage2[0].mainEntity.itemListElement[0].name, 'Post 10');

  activeRouterQuery = { [blogConsts.SEARCH_QUERY_KEY]: 'no-matching-post' };
  const blogEmptySearch = parseJsonLd(renderToStaticMarkup(React.createElement(BlogHome, {
    locale: 'en', blogList: sampleBlogs,
  })));
  assert.equal(blogEmptySearch[0].mainEntity, undefined, 'empty search must omit ItemList');

  // 3. IntroMilvus
  const { IntroMilvus } = load('src/parts/intro/IntroMIlvus.tsx', {
    '@/styles/intro.module.css': {},
    '@/styles/responsive.module.css': {},
    '@/components/layout/commonLayout': passThrough,
    'react-i18next': { useTranslation: () => ({ t: k => (k.endsWith('.keys') || k.endsWith('.features') ? [] : k) }) },
    'next/head': headMock,
    'next/link': passThrough,
    '@/consts/externalLinks': {},
    '@/consts': fullConsts,
    '@/types/localization': localization,
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
  });
  const introSchemas = parseJsonLd(renderToStaticMarkup(React.createElement(IntroMilvus, { locale: 'en' })));
  assert.deepEqual(introSchemas.map(s => s['@type']), ['TechArticle', 'BreadcrumbList']);
  assert.equal(introSchemas[0].url, 'https://milvus.io/intro');

  // 4. UseCase (linked card, linkless card, and script-breakout CMS text)
  const { UseCase } = load('src/parts/intro/UseCase.tsx', {
    '@/components/localizedLinks': { LocalizedAnchor: passThrough },
    '@/components/layout/commonLayout': passThrough,
    'react-i18next': { useTranslation: () => ({ t: k => k }) },
    '@/styles/useCase.module.css': {},
    '@/styles/responsive.module.css': {},
    '@/parts/useCase/useCaseCard': noOp,
    'react-masonry-css': passThrough,
    '@/components/icons': { RightArrow: noOp },
    '@/consts/externalLinks': {},
    'next/head': headMock,
    '@/types/localization': localization,
    '@/consts': fullConsts,
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
  });
  const useCaseHtml = renderToStaticMarkup(React.createElement(UseCase, {
    locale: 'en',
    useCaseList: [
      { name: 'Nvidia', link: 'https://milvus.io/blog/nvidia.md', description: 'AI search </script><script>x()</script>' },
      { name: 'Internal Case', link: '', description: 'No public link' },
    ],
  }));
  assert.equal((useCaseHtml.match(/<script\b/gi) || []).length, 2, 'CollectionPage + BreadcrumbList only');
  const useCaseSchemas = parseJsonLd(useCaseHtml);
  assert.deepEqual(useCaseSchemas.map(s => s['@type']), ['CollectionPage', 'BreadcrumbList']);
  assert.equal(useCaseSchemas[0].mainEntity.numberOfItems, 2);
  assert.equal(useCaseSchemas[0].mainEntity.itemListElement[0].url, 'https://milvus.io/blog/nvidia.md');
  assert.equal(useCaseSchemas[0].mainEntity.itemListElement[0].description, 'AI search </script><script>x()</script>');
  assert.equal(useCaseSchemas[0].mainEntity.itemListElement[1].url, undefined, 'linkless use case must not fabricate pageUrl');

  // 5. SizingTool (v2.6 & v3.0)
  const { default: SizingTool } = load('src/pages/tools/sizing.tsx', {
    '@/utils/localization': { getLocalePath: ({ path: p }) => p },
    '@/components/localizedLinks': { LocalizedLink: passThrough },
    'react-i18next': { Trans: passThrough, useTranslation: () => ({ t: k => k }) },
    '@/components/layout/commonLayout': passThrough,
    '@/styles/sizingTool.module.css': {},
    '@/styles/responsive.module.css': {},
    'next/head': headMock,
    '@/consts': fullConsts,
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
    '@/parts/sizing/formSection': noOp,
    '@/parts/sizing/resultSection': noOp,
    '@/types/sizing': { DependencyComponentEnum: {}, ModeEnum: {} },
    '@/components/icons': { InfoFilled: noOp },
    '@/parts/blogs/zillizAdv': noOp,
    '@/types/localization': localization,
    '@/http/milvus': {},
    '@/components/ui/select': {
      Select: passThrough, SelectContent: passThrough, SelectGroup: passThrough,
      SelectItem: passThrough, SelectTrigger: passThrough, SelectValue: passThrough,
    },
    'next/router': { useRouter: () => ({ pathname: '/tools/sizing-v300', query: {}, isReady: false }) },
    '@/consts/sizing': { SIZING_TOOL_VERSION_OPTIONS: [{ href: '/tools/sizing-v300', value: 'Milvus 3.0.x', label: '3.0.x' }] },
    '@/parts/sizing/configV300': { sizingV300Config: { version: 'v300' } },
    '@/parts/sizing/config': { sizingV26Config: { version: 'v26' }, baseValues: {} },
    '@/utils/sizingToolV300': {},
    '@/components/sizing': { SizingTabs: noOp, sizingTabId: () => 't', sizingTabPanelId: () => 'p' },
    '@/parts/sizingGpu': { GpuSizingTool: noOp },
  });
  const sizingSchemas = parseJsonLd(renderToStaticMarkup(React.createElement(SizingTool, {
    locale: 'en', latestTag: 'v3.0.6', profile: 'v300',
  })));
  assert.deepEqual(sizingSchemas.map(s => s['@type']), ['SoftwareApplication', 'BreadcrumbList']);
  assert.equal(sizingSchemas[0].url, 'https://milvus.io/tools/sizing-v300');
  assert.equal(sizingSchemas[0].softwareVersion, 'Milvus 3.0.x');

  // 6. SDK API Reference (canonical, self-canonical archived, and non-canonical archived)
  const docTypes = load('src/types/docs.ts');
  const { default: ApiPage } = load('src/pages/api-reference/[language]/[version]/[...slug].tsx', {
    '@/parts/docs/leftNavTree': noOp,
    'react-i18next': { useTranslation: () => ({ t: k => k }) },
    '@/components/aside': noOp,
    '@/utils/markdown': {},
    '@/styles/docDetail.module.css': {},
    '@/components/layout/docLayout': noOp,
    '@/parts/docs/docContent': noOp,
    '@/utils/apiReference': {},
    '@/types/docs': docTypes,
    '@/hooks/enhanceCodeBlock': { useCopyCode: noOp },
    '@/consts/externalLinks': {},
    '@/utils': {},
    '@/consts': fullConsts,
    '@/components/localization/utils': seoUtils,
    '@/utils/doc-sitemap-segments': {},
    '@/server/content-freshness': {},
    '@/hooks/use-breadcrumb-lables': { useBreadcrumbLabels: () => [] },
    '@/hooks/use-anchor-event-listener': { useAnchorEventListener: noOp },
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
  });
  const apiCanonicalSchemas = parseJsonLd(renderToStaticMarkup(React.createElement(ApiPage, {
    doc: '<p>search</p>',
    currentId: 'search',
    menus: [],
    version: 'v2.6.x',
    latestVersion: 'v2.6.x',
    versions: ['v2.6.x'],
    category: docTypes.ApiReferenceRouteEnum.Python,
    languageCategory: docTypes.ApiReferenceRouteEnum.Python,
    relativePath: '/v2.6.x/MilvusClient/Vector/search.md',
    codeList: [],
    curCategoryContentData: [{ version: 'v2.6.x', mds: ['MilvusClient-Vector-search.md'] }],
    headingContent: 'search()',
    lastModified: '2026-10-15T00:00:00.000Z',
    meta: { title: 'search.md', path: 'MilvusClient/Vector' },
  })));
  assert.deepEqual(apiCanonicalSchemas.map(s => s['@type']), ['TechArticle', 'BreadcrumbList']);
  assert.equal(apiCanonicalSchemas[0].programmingLanguage, undefined, 'programmingLanguage belongs on SoftwareSourceCode, not TechArticle');
  assert.equal(apiCanonicalSchemas[0].dateModified, '2026-10-15T00:00:00.000Z');
  assert.ok(Array.isArray(apiCanonicalSchemas[0].about));
  assert.equal(apiCanonicalSchemas[0].about[0]['@id'], 'https://milvus.io/#software-v2.6.x');
  assert.equal(apiCanonicalSchemas[0].about[0].softwareVersion, 'v2.6.x');
  assert.equal(apiCanonicalSchemas[0].about[1]['@type'], 'SoftwareSourceCode');
  assert.equal(apiCanonicalSchemas[0].about[1].programmingLanguage, 'Python');
  assert.deepEqual(apiCanonicalSchemas[0].about[1].sameAs, ['https://pypi.org/project/pymilvus/']);

  const apiArchivedSchemas = parseJsonLd(renderToStaticMarkup(React.createElement(ApiPage, {
    doc: '<p>search</p>',
    currentId: 'search',
    menus: [],
    version: 'v2.5.x',
    latestVersion: 'v2.6.x',
    versions: ['v2.6.x', 'v2.5.x'],
    category: docTypes.ApiReferenceRouteEnum.Python,
    languageCategory: docTypes.ApiReferenceRouteEnum.Python,
    relativePath: '/v2.5.x/MilvusClient/Vector/search.md',
    codeList: [],
    curCategoryContentData: [{ version: 'v2.6.x', mds: ['MilvusClient-Vector-search.md'] }],
    headingContent: 'search()',
    meta: { title: 'search.md', path: 'MilvusClient/Vector' },
  })));
  assert.deepEqual(apiArchivedSchemas.map(s => s['@type']), ['BreadcrumbList']);

  const apiArchivedSelfCanonical = parseJsonLd(renderToStaticMarkup(React.createElement(ApiPage, {
    doc: '<p>legacy</p>',
    currentId: 'legacy',
    menus: [],
    version: 'v2.4.x',
    latestVersion: 'v2.6.x',
    versions: ['v2.6.x', 'v2.4.x'],
    category: docTypes.ApiReferenceRouteEnum.Python,
    languageCategory: docTypes.ApiReferenceRouteEnum.Python,
    relativePath: '/v2.4.x/ORM/legacy.md',
    codeList: [],
    curCategoryContentData: [{ version: 'v2.6.x', mds: ['MilvusClient-Vector-search.md'] }],
    headingContent: 'legacy()',
    meta: { title: 'legacy.md', path: 'ORM' },
  })));
  assert.equal(apiArchivedSelfCanonical[0].about[0]['@id'], 'https://milvus.io/#software-v2.4.x');
  assert.notEqual(apiArchivedSelfCanonical[0].about[0]['@id'], 'https://milvus.io/#software');

  // 7. RESTful API Reference
  const { default: RestfulApiPage } = load('src/pages/api-reference/restful/[version]/[...slug].tsx', {
    'next-mdx-remote': { MDXRemote: noOp },
    'next-mdx-remote/serialize': {},
    '@/components/layout/docLayout': noOp,
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
    '@/components/mdx': { components: {} },
    '@/consts': fullConsts,
    '@/parts/docs/leftNavTree': noOp,
    '@/types/docs': docTypes,
    '@/utils': {},
    '@/utils/mdx': {},
    '@/utils/restful': {},
    '@/utils/doc-sitemap-segments': {},
    '@/server/content-freshness': {},
    '@/styles/docDetail.module.css': {},
    '@/styles/restful.module.css': {},
    '@/components/breadcrumb': noOp,
    '@/hooks/use-breadcrumb-lables': { useBreadcrumbLabels: () => [] },
    '@/components/localization/utils': seoUtils,
  });
  const restSchemas = parseJsonLd(renderToStaticMarkup(React.createElement(RestfulApiPage, {
    mdxSource: null,
    headingContent: 'Search',
    version: 'v2.6.x',
    latestVersion: 'v2.6.x',
    versions: ['v2.6.x'],
    category: docTypes.ApiReferenceRouteEnum.Restful,
    languageCategory: docTypes.ApiReferenceLanguageEnum.Restful,
    relativePath: '/v2.6.x/v2/Vector/Search.mdx',
    meta: { title: 'Search.md', path: 'v2/Vector' },
    menus: [],
    currentId: 'Search',
    curCategoryContentData: [{ version: 'v2.6.x', mds: ['v2-Vector-Search.mdx'] }],
    lastModified: '2026-10-20T00:00:00.000Z',
  })));
  assert.deepEqual(restSchemas.map(s => s['@type']), ['TechArticle', 'BreadcrumbList']);
  assert.equal(restSchemas[0].url, 'https://milvus.io/api-reference/restful/v2.6.x/v2/Vector/Search.md');
  assert.equal(restSchemas[0].programmingLanguage, undefined);
  assert.ok(restSchemas[0].keywords.includes('RESTful API'));
  assert.equal(restSchemas[0].about['@id'], 'https://milvus.io/#software-v2.6.x');
  assert.equal(restSchemas[0].dateModified, '2026-10-20T00:00:00.000Z');
});

test('DocLayout, DocContent, BlogDetail, Sizing, Bootcamp, Community, and Demo keep <header>/<aside>/<footer> outside <main> and use semantic <article>/<time>', () => {
  const noOp = () => null;
  const passThrough = ({ children }) => React.createElement(React.Fragment, null, children);

  // 1. DocLayout renders Header, LeftNav, and Footer outside <main>, and wraps center in <main>
  const { default: DocLayout } = load('src/components/layout/docLayout/index.tsx', {
    './index.module.css': {
      docLayoutContainer: 'docLayoutContainer',
      mainContainer: 'mainContainer',
      flexibleContainer: 'flexibleContainer',
      contentContainer: 'contentContainer',
      docHome: 'docHome',
      docMain: 'docMain',
      docFooterContainer: 'docFooterContainer',
      docFooter: 'docFooter',
      docFooterContent: 'docFooterContent',
      docFooterNav: 'docFooterNav',
    },
    'next/head': noOp,
    '../../flexibleSection': ({ children }) => React.createElement('aside', { 'data-testid': 'left' }, children),
    '../../header': () => React.createElement('header', null, 'HEADER'),
    '../../footer': () => React.createElement('footer', null, 'FOOTER'),
    'highlight.js/styles/atom-one-dark.css': {},
    '@/types/localization': localization,
    '@/styles/responsive.module.css': {},
  });
  const docLayoutHtml = renderToStaticMarkup(React.createElement(DocLayout, {
    version: 'v3.0.x',
    latestVersion: 'v3.0.x',
    seo: { title: 'T', desc: 'D', url: 'https://milvus.io/docs/overview.md' },
    left: React.createElement('nav', null, 'NAV'),
    center: React.createElement('section', null, 'CENTER'),
  }));
  assert.match(docLayoutHtml, /<header>HEADER<\/header>/);
  assert.match(docLayoutHtml, /<main class="docMain"><section>CENTER<\/section><\/main>/);
  assert.doesNotMatch(docLayoutHtml, /<main[\s\S]*<header>[\s\S]*<\/main>/);
  assert.doesNotMatch(docLayoutHtml, /<main[\s\S]*<footer>[\s\S]*<\/main>/);
  assert.doesNotMatch(docLayoutHtml, /<main[\s\S]*<aside[\s\S]*<\/main>/);

  // 2. DocContent renders prose inside <article>
  const { default: DocContent } = load('src/parts/docs/docContent/index.tsx', {
    './index.module.css': { docPostWrapper: 'docPostWrapper', topBar: 'topBar' },
    'react-i18next': { useTranslation: () => ({ t: k => k }) },
    '@/components/breadcrumb': noOp,
    '@/components/LLMActions': Object.assign(noOp, { PageAction: {} }),
    '@/components/icons': { CopyIcon: noOp },
    '@/components/icons/RightTopArrow': { RightTopArrowIcon: noOp },
    '@/components/icons/AI': { OpenAIIcon: noOp, ClaudeAIIcon: noOp },
    '@/consts/links': { MILVUS_RAW_DOCS_BASE_URL: 'https://raw.githubusercontent.com/milvus-io/milvus-docs/refs/heads' },
  });
  const docContentHtml = renderToStaticMarkup(React.createElement(DocContent, {
    version: 'v3.0.x',
    latestVersion: 'v3.0.x',
    htmlContent: '<h1>Overview</h1><p>Hello</p>',
    mdId: 'overview.md',
    type: 'doc',
    activeLabels: ['Overview'],
  }));
  assert.match(docContentHtml, /<article class="doc-style doc-post-content"><h1>Overview<\/h1><p>Hello<\/p><\/article>/);

  // 3. BlogDetail places <Layout> outside <main>, wraps body in <article>, and uses <time dateTime=...>
  const { BlogDetail } = load('src/components/localization/BlogDetail.tsx', {
    'next/head': noOp,
    'react-i18next': { useTranslation: () => ({ t: k => k }) },
    '@/components/layout/commonLayout': ({ children }) =>
      React.createElement('div', null, React.createElement('header', null, 'H'), children, React.createElement('footer', null, 'F')),
    '@/components/tags': noOp,
    '@/components/card/BlogCard': noOp,
    '@/components/share': noOp,
    '@/styles/blogDetail.module.css': {
      upLayout: 'upLayout',
      blogHeader: 'blogHeader',
      pageHeaderContainer: 'pageHeaderContainer',
      title: 'title',
      subTitle: 'subTitle',
      tags: 'tags',
      subTitleSeparator: 'subTitleSeparator',
      date: 'date',
      author: 'author',
      blogContent: 'blogContent',
      articleContainer: 'articleContainer',
      anchorsContainer: 'anchorsContainer',
      anchorContainer: 'anchorContainer',
      mobileShareSection: 'mobileShareSection',
      share: 'share',
      bottomLayout: 'bottomLayout',
      blogCards: 'blogCards',
    },
    '@/hooks/use-anchor-event-listener': { useAnchorEventListener: noOp },
    '@/parts/blogs/blogAnchors': noOp,
    '@/styles/responsive.module.css': {},
    '@/consts': { ...fullConsts, MILVUS_RAW_BLOGS_BASE_URL: 'https://raw.example' },
    '@/components/JsonLd': JsonLd,
    '@/schema': schemaIndex,
    '@/hooks/enhanceCodeBlock': { useCopyCode: noOp },
    'highlight.js/styles/atom-one-dark.css': {},
    'next/navigation': { useRouter: () => ({ push: noOp }) },
    '@/types/localization': localization,
    '@/utils/localization': { getBlogPath: () => '/blog' },
    '../breadcrumb': noOp,
    '@/components/LLMActions': Object.assign(noOp, { PageAction: {} }),
    '@/components/icons': { CopyIcon: noOp },
    '@/components/icons/AI': { OpenAIIcon: noOp, ClaudeAIIcon: noOp },
  });
  const isoDate = '2026-10-15T00:00:00.000Z';
  const blogHtml = renderToStaticMarkup(React.createElement(BlogDetail, {
    blogId: 'post.md',
    locale: 'en',
    newHtml: '<p>Body</p>',
    author: 'Milvus Team',
    date: isoDate,
    tags: ['engineering'],
    title: 'Test Post',
    id: 'post.md',
    desc: 'Desc',
    cover: 'https://example.com/c.png',
    anchorList: [],
    codeList: [],
    moreBlogs: [],
  }));
  assert.doesNotMatch(blogHtml, /<main[\s\S]*<header>[\s\S]*<\/main>/);
  assert.doesNotMatch(blogHtml, /<main[\s\S]*<footer>[\s\S]*<\/main>/);
  assert.match(blogHtml, /<time class="date" dateTime="2026-10-15T00:00:00\.000Z">October 15, 2026<\/time>/);
  assert.match(blogHtml, /<article class="doc-style scroll-padding blog-style articleContainer"><p>Body<\/p><\/article>/);

  // 4. Static check: no page wraps <Layout> inside <main>
  for (const rel of [
    'src/pages/tools/sizing.tsx',
    'src/pages/tools/sizing-v250.tsx',
    'src/pages/tools/sizing-enterprise.tsx',
    'src/pages/tools/sizing-v250-enterprise.tsx',
    'src/parts/tutorials/Bootcamp.tsx',
    'src/parts/community/Community.tsx',
    'src/parts/tutorials/Demo.tsx',
    'src/pages/milvus-demos/reverse-image-search.jsx',
    'src/components/localization/BlogDetail.tsx',
  ]) {
    const src = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.doesNotMatch(src, /<main\b[^>]*>\s*<Layout\b/, `${rel} must not wrap <Layout> inside <main>`);
    assert.match(src, /<main\b/, `${rel} must contain a <main> landmark`);
  }
});
