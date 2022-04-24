/*
 * utils to support generate html page from markdown or json dynamically
 */
const env = process.env.IS_PREVIEW;
const locales = require('../src/consts/locales');

const getDefaultLang = () =>
  Object.keys(locales).find(lang => locales[lang].default);

const findVersion = str => {
  // version: v.1.0.0 | v0.x
  const regx = /versions\/master\/([v\dx\.]*)/;
  const match = str.match(regx);
  return match
    ? match[1]
      ? match[1]
      : env === 'preview' && str.includes('preview')
      ? 'preview'
      : match[1]
    : '';
};

const findLang = path => {
  const DOC_LANG_FOLDERS = ['/en/', '/zh-CN/'];

  return DOC_LANG_FOLDERS.reduce((pre, cur) => {
    if (path.includes(cur)) {
      pre = cur === '/en/' ? 'en' : 'cn';
    }
    return pre;
  }, '');
};

// we generate path by menu structure
const generatePath = (id, lang, version, isBlog, needLocal = true) => {
  const defaultLang = getDefaultLang();
  if (isBlog) {
    if (!needLocal) return `/blog/${id}`;
    return lang === defaultLang ? `/blog/${id}` : `/${lang}/blog/${id}`;
  }

  let localizedPath = '';
  if (version && version !== 'master') {
    localizedPath =
      lang === defaultLang ? `/docs/${version}/` : `/${lang}/docs/${version}/`;
  } else {
    // for master branch version -> false
    localizedPath = lang === defaultLang ? `/docs/` : `/${lang}/docs/`;
  }

  return needLocal ? `${localizedPath}${id}` : `/${id}`;
};

module.exports = {
  generatePath,
  findLang,
  getDefaultLang,
  findVersion,
};
