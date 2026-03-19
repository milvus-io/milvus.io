const path = require('path');

module.exports = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: [path.resolve(__dirname, 'src/styles/media.css')],
    },
    'postcss-custom-media': {},
    'postcss-nested': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
