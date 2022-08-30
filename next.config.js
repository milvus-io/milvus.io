/** @type {import('next').NextConfig} */

const withLess = require('next-with-less');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withLess({
  ...nextConfig,
  i18n: {
    /**
     * Provide the locales you want to support in your application
     */
    locales: ['en', 'cn'],
    /**
     * This is the default locale you want to be used when visiting
     * a non-locale prefixed path.
     */
    defaultLocale: 'en',
  },

  lessLoaderOptions: {
    /* ... */
  },
});
