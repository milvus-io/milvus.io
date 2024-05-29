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
        disallow: '*[id]*',
        host: 'https://milvus.io',
        sitemap: 'https://milvus.io/sitemap.xml',
      },
    ],
  },
  outDir: './out',
};
