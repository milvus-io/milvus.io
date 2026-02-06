const fs = require('fs');
const { join } = require('path');
const csv = require('csv-parser');

let simpleFaqCache = [];

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
        allow: '*',
        // disallow: '*[id]*',
        host: 'https://milvus.io',
        sitemap: 'https://milvus.io/sitemap.xml',
      },
    ],
  },
  additionalPaths: async config => {
    const simpleList = await generateFaqPaths();
    return simpleList.map(v => ({
      loc: `/ai-quick-reference/${v.url}`,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));
  },
  outDir: './public',
};
