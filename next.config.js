/** @type {import('next').NextConfig} */

const withLess = require('next-with-less');

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

  lessLoaderOptions: {
    /* ... */
  },
});
