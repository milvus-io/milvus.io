/** @type {import('next').NextConfig} */

const withLess = require('next-with-less');
const path = require('path');

const nextConfig = {
  // reactStrictMode: true,
  // swcMinify: true,
  images: {
    loader: 'akamai',
    path: '',
  },
};

module.exports = withLess({
  ...nextConfig,
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
});
