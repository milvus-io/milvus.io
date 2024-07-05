/** @type {import('next').NextConfig} */

const withLess = require('next-with-less');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const nextConfig = {
  // reactStrictMode: true,
  // swcMinify: true,
  output: 'export',
  images: {
    loader: 'akamai',
    path: '',
  },
};

module.exports = async () => {
  const fetchMilvusStats = async () => {
    const result = await axios.get(
      `${
        process.env.MSERVICE_URL || process.env.NEXT_PUBLIC_MSERVICE_URL
      }/milvus-stats`
    );

    return {
      pipInstall: result.data.body?.pipInstall || 0,
      milvusStars: result.data.body?.milvusStars || 0,
    };
  };

  const result = await fetchMilvusStats();
  fs.writeFileSync('./global-stats.json', JSON.stringify(result), 'utf8');

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
  });
};
