/** @type {import('next').NextConfig} */

const withLess = require('next-with-less');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const nextConfig = {
  images: {
    loader: 'akamai',
    path: '',
  },
};

module.exports = async () => {
  try {
    const host =
      process.env.MSERVICE_URL || process.env.NEXT_PUBLIC_MSERVICE_URL;
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

  return withLess({
    lessLoaderOptions: {
      /* ... */
    },
    ...nextConfig,
    webpack(config) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
      return {
        ...config,
      };
    },
    experimental: {
      scrollRestoration: true,
    },
  });
};
