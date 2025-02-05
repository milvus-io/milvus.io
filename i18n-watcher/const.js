const path = require('path');

const EN_DIR = path.join(__dirname, '../src/i18n/en');
const CACHE_DIR = path.join(__dirname, '/cache');
const CHANGES_DIR = path.join(__dirname, '/changes');
const LOCALE_DIR = path.join(__dirname, '../src/i18n');

module.exports = {
  EN_DIR,
  CACHE_DIR,
  CHANGES_DIR,
  LOCALE_DIR,
};
