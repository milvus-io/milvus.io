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
  additionalPaths: async config => {
    const simpleList = await generateFaqPaths();
    const faqPaths = simpleList.map(v => ({
      loc: `/ai-quick-reference/${v.url}`,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    const docPaths = readDocSitemapPaths().map(loc => ({
      loc,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    return [...faqPaths, ...docPaths];
  },
  outDir: './public',
};
