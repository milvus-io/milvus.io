const fs = require('fs');
const { join } = require('path');
const { getLandingSitemapPaths } = require('./src/server/seo-landing-catalog');
const { getLearnMilvusSitemapPaths } = require('./src/utils/learn-milvus-seo');
const { getContentLastModified, readContentFrontMatter } = require(
  './src/server/content-freshness'
);
const landingSitemapPaths = getLandingSitemapPaths();
const landingSitemapByPath = new Map(landingSitemapPaths.map(page => [page.loc, page]));
const learnMilvusSitemapPaths = getLearnMilvusSitemapPaths();
const learnMilvusSitemapByPath = new Map(learnMilvusSitemapPaths.map(page => [page.loc, page]));

// The build records dates for prerendered Docs and API references, and URLs
// for their on-demand pages that are absent from Next's prerender manifest.
const DOC_SITEMAP_SEGMENT_DIR = join(process.cwd(), '.doc-sitemap');

const readDocSitemapEntries = () => {
  try {
    if (!fs.existsSync(DOC_SITEMAP_SEGMENT_DIR)) {
      return [];
    }
    const files = fs
      .readdirSync(DOC_SITEMAP_SEGMENT_DIR)
      .filter(file => file.endsWith('.json'));
    const entries = [];
    files.forEach(file => {
      try {
        const list = JSON.parse(
          fs.readFileSync(join(DOC_SITEMAP_SEGMENT_DIR, file), 'utf-8')
        );
        list.forEach(page => entries.push(
          typeof page === 'string' ? { loc: page, onDemand: true } : page
        ));
      } catch (error) {
        console.error(`Failed to read sitemap segment ${file}:`, error);
      }
    });
    return entries;
  } catch (error) {
    console.error('readDocSitemapEntries error:', error);
    return [];
  }
};

const docSitemapEntries = readDocSitemapEntries();
const lastmodByPath = new Map();
for (const { loc, lastmod } of docSitemapEntries) {
  if (!lastmodByPath.has(loc)) lastmodByPath.set(loc, lastmod);
}

// Keep the sitemap focused on high-value canonical URLs: English plus the
// non-English languages that carry real GSC traffic (zh/ko/zh-hant/ja), at
// their latest doc version only. We stop advertising the rest of the localized
// and old-version long tail — Google discovers those from the sitemap but
// defers crawling/indexing them ("Discovered/Crawled - currently not indexed"),
// which just dilutes crawl budget. API reference and landing pages (including
// localized landing pages) are intentionally left untouched.
//
// INDEXABLE_NON_EN_LANGS must stay in sync with INDEXABLE_LANGUAGES in
// src/types/localization.ts (this file is CommonJS and cannot import it).
const INDEXABLE_NON_EN_LANGS = ['zh-hant', 'zh', 'ja', 'ko'];
const CUT_LANGS = [
  'fr',
  'de',
  'es',
  'it',
  'pt',
  'ru',
  'id',
  'ar',
  'cn',
];
// Non-indexable languages: their blog and docs URLs never enter the sitemap.
const LOCALIZED_BLOG_RE = new RegExp(`^/(${CUT_LANGS.join('|')})/blog(/|$)`);
const LOCALIZED_DOCS_RE = new RegExp(`^/docs/(${CUT_LANGS.join('|')})(/|$)`);
// Old (non-latest) doc versions are excluded for every kept language, English
// (/docs/v2.6.x/...) and indexable non-English (/docs/zh/v2.6.x/...) alike.
// Only the latest version, which uses an unversioned URL, stays in the sitemap.
const VERSIONED_DOCS_RE = new RegExp(
  `^/docs/(?:(?:${INDEXABLE_NON_EN_LANGS.join('|')})/)?v\\d+\\.\\d+\\.x(/|$)`
);
// The retired collections, including historical locale-prefixed URLs,
// must stay out of generated sitemaps.
const RETIRED_REFERENCE_RE = /^\/(?:(?:en|zh-hant|zh|ja|jp|fr|ko|ru|de|es|pt|it|ar|id|cn)\/)?(?:ai-quick-reference|api\/ai-quick-reference|learn-ai-and-vectordb|api\/learn-ai-and-vectordb)(?:\/|$)/i;
const CONTENT_PATH_RE = /^(?:\/docs|\/api-reference|(?:\/[a-z-]+)?\/blog)(?:\/|$)/;
const BLOG_DETAIL_RE = /^(?:\/([a-z-]+))?\/blog\/([^/]+\.md)$/;

const decodePath = pathname => pathname.split('/').map(segment => {
  try {
    const decoded = decodeURIComponent(segment);
    return /[/\\]/.test(decoded) ? segment : decoded;
  } catch (error) {
    return segment;
  }
}).join('/');

const getBlogLastmod = pathname => {
  const match = BLOG_DETAIL_RE.exec(pathname);
  if (!match) return;

  const [, lang, id] = match;
  if (lang && lang !== 'en') {
    const localized = `src/blogs/localization/blog/${lang}/${id}`;
    const frontMatter = readContentFrontMatter(localized);
    if (typeof frontMatter?.title === 'string' && frontMatter.title.trim()) {
      return getContentLastModified(localized, frontMatter);
    }
  }
  // Localized blog routes render the English article when no translation exists.
  const english = `src/blogs/blog/en/${id}`;
  const frontMatter = readContentFrontMatter(english);
  if (frontMatter) return getContentLastModified(english, frontMatter);
};

const toPathname = loc => {
  try {
    return loc.startsWith('http') ? new URL(loc).pathname : loc;
  } catch (error) {
    return loc;
  }
};

// True when a URL should be dropped from the sitemap: non-English blog posts,
// and any localized or non-latest-version docs.
const isExcludedFromSitemap = loc => {
  const pathname = toPathname(loc);
  return (
    RETIRED_REFERENCE_RE.test(pathname) ||
    LOCALIZED_BLOG_RE.test(pathname) ||
    LOCALIZED_DOCS_RE.test(pathname) ||
    VERSIONED_DOCS_RE.test(pathname)
  );
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://milvus.io',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    transformRobotsTxt: async (_config, robotsTxt) =>
      `${robotsTxt.trimEnd()}\n\n# AI documentation index: https://milvus.io/llms.txt\n`,
    policies: [
      {
        userAgent: '*',
        allow: '/',
        // disallow: '*[id]*',
        host: 'https://milvus.io',
        sitemap: 'https://milvus.io/sitemap.xml',
      },
    ],
  },
  // The manifest supplies prerendered URLs. Resolve their content dates before
  // serializing, including routes that Next has percent-encoded.
  transform: async (config, path) => {
    if (isExcludedFromSitemap(path)) return null;
    const landing = landingSitemapByPath.get(path);
    if (landing) return landing;
    const learning = learnMilvusSitemapByPath.get(path);
    if (learning) return learning;
    const pathname = decodePath(path);
    let lastmod;
    if (CONTENT_PATH_RE.test(pathname)) {
      lastmod = lastmodByPath.get(pathname) ?? getBlogLastmod(pathname);
    } else if (config.autoLastmod) {
      lastmod = new Date().toISOString();
    }
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config = {}) => {
    // Archived API pages are recorded only when they are self-canonical.
    const urls = new Set(docSitemapEntries.filter(page => page.onDemand).map(page => page.loc));
    const docPaths = [...urls]
      .filter(loc => !isExcludedFromSitemap(loc))
      .map(loc => ({
        loc,
        changefreq: BLOG_DETAIL_RE.test(loc)
          ? (config.changefreq ?? 'daily')
          : 'weekly',
        priority: config.priority ?? 0.7,
        lastmod: lastmodByPath.get(loc),
      }));

    return [...docPaths, ...landingSitemapPaths, ...learnMilvusSitemapPaths];
  },
  outDir: './public',
};
