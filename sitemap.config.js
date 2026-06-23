const fs = require('fs');
const { join } = require('path');
const csv = require('csv-parser');

let simpleFaqCache = [];

// Doc detail pages are rendered on demand and recorded here during the build by
// src/utils/doc-sitemap-segments.ts. Read them back so on-demand docs still
// appear in the sitemap (the prerendered English latest pages are discovered
// automatically from the prerender manifest and are not written as segments).
const DOC_SITEMAP_SEGMENT_DIR = join(process.cwd(), '.doc-sitemap');

const readDocSitemapPaths = () => {
  try {
    if (!fs.existsSync(DOC_SITEMAP_SEGMENT_DIR)) {
      return [];
    }
    const files = fs
      .readdirSync(DOC_SITEMAP_SEGMENT_DIR)
      .filter(file => file.endsWith('.json'));
    const urls = new Set();
    files.forEach(file => {
      try {
        const list = JSON.parse(
          fs.readFileSync(join(DOC_SITEMAP_SEGMENT_DIR, file), 'utf-8')
        );
        list.forEach(url => urls.add(url));
      } catch (error) {
        console.error(`Failed to read sitemap segment ${file}:`, error);
      }
    });
    return [...urls];
  } catch (error) {
    console.error('readDocSitemapPaths error:', error);
    return [];
  }
};

const generateFaqPaths = () => {
  const filePath = join(process.cwd(), 'public/assets', 'milvus-faq.csv');

  if (simpleFaqCache.length > 0) {
    return simpleFaqCache;
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          separator: ',',
        })
      )
      .on('data', row => {
        if (row.Order !== undefined) {
          simpleFaqCache.push({
            title: row.Questions,
            url: row.URL,
          });
        }
      })
      .on('end', () => {
        resolve(simpleFaqCache);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

// Keep the sitemap focused on high-value canonical URLs: English plus the
// non-English languages that carry real GSC traffic (zh/ko/zh-hant/ja), at
// their latest doc version only. We stop advertising the rest of the localized
// and old-version long tail — Google discovers those from the sitemap but
// defers crawling/indexing them ("Discovered/Crawled - currently not indexed"),
// which just dilutes crawl budget. api-reference, ai-quick-reference and landing
// pages (incl. localized landing pages) are intentionally left untouched.
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
  // Filters auto-discovered URLs (prerendered English latest docs and all blog
  // posts come through here). Returns null to drop a URL; otherwise mirrors
  // next-sitemap's default transform so kept URLs are unchanged.
  transform: async (config, path) => {
    if (isExcludedFromSitemap(path)) return null;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async config => {
    const simpleList = await generateFaqPaths();
    const faqPaths = simpleList.map(v => ({
      loc: `/ai-quick-reference/${v.url}`,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    // Localized and old-version docs reach the sitemap through these segments
    // (English latest is auto-discovered above), so the same filter is applied
    // here. api-reference URLs also live in these segments and are kept.
    const docPaths = readDocSitemapPaths()
      .filter(loc => !isExcludedFromSitemap(loc))
      .map(loc => ({
        loc,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }));

    return [...faqPaths, ...docPaths];
  },
  outDir: './public',
};
