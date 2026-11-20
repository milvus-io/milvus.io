/** @type {import('next').NextConfig} */

const path = require('path');
const fs = require('fs');
const axios = require('axios');

const markdownRoutes = [
  ...['solutions', 'compare'].flatMap(group => ['', '/zh'].flatMap(prefix => [
    `${prefix}/${group}`, `${prefix}/${group}/:slug`,
  ])),
  '/docs',
  '/docs/:path*',
  '/blog/:id',
  '/:lang/blog/:id',
];

const nextConfig = {
  images: {
    loader: 'akamai',
    path: '',
  },
};

module.exports = async () => {
  try {
    const host = process.env.NEXT_PUBLIC_MSERVICE_URL;
    if (!fs.existsSync('./global-stats.json')) {
      const fetchMilvusStats = async () => {
        const result = await axios.get(`${host}/milvus-stats`);
        return {
          pipInstall: result.data.body?.pipInstall || 0,
          milvusStars: result.data.body?.milvusStars || 0,
        };
      };

      const result = await fetchMilvusStats();
      fs.writeFileSync('./global-stats.json', JSON.stringify(result), 'utf8');
    }
  } catch (error) {
    console.error('Failed to fetch milvus stats:', error);
  }

  return {
    ...nextConfig,
    webpack(config) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
      return {
        ...config,
      };
    },
    async rewrites() {
      return {
        beforeFiles: markdownRoutes.map(source => ({
          source,
          has: [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }],
          destination: `/api/markdown${source}`,
        })),
        afterFiles: [],
        fallback: [],
      };
    },
    async headers() {
      return [
        ...markdownRoutes.map(source => ({ source, headers: [{ key: 'Vary', value: 'Accept' }] })),
        {
          source: '/fonts/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
    experimental: {
      scrollRestoration: true,
    },
  };
};
