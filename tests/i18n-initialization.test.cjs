const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const i18next = require('i18next');
const { initReactI18next } = require('react-i18next');
const root = path.resolve(__dirname, '..');

function compile(file, dependencies, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      esModuleInterop: true, resolveJsonModule: true },
  }).outputText;
  const scope = { exports: {}, require: dependencies, ...globals };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}

const bundles = new Map();
function bundle(locale) {
  if (!bundles.has(locale)) {
    const dir = path.join(root, 'src/i18n', locale);
    bundles.set(locale, compile(path.join(dir, 'index.ts'), name =>
      JSON.parse(fs.readFileSync(path.resolve(dir, name), 'utf8'))));
  }
  return bundles.get(locale);
}

function server() {
  const instance = i18next.createInstance();
  const module = compile(path.join(root, 'src/i18n/server.ts'), name => {
    if (name === 'i18next') return instance;
    if (name === 'react-i18next') return { initReactI18next };
    return bundle(name.slice(2));
  });
  return { instance, ...module };
}

function client(locale, initialResources, fallbackResources) {
  const instance = i18next.createInstance();
  const module = compile(path.join(root, 'src/i18n/client.ts'), name => {
    if (name === 'i18next') return instance;
    if (name === 'react-i18next') return { initReactI18next };
    return bundle(name.slice(2));
  }, {
    document: { documentElement: { lang: locale }, cookie: '' },
    window: { __I18N_RESOURCES__: { [locale]: initialResources },
      __I18N_FALLBACK_RESOURCES__: fallbackResources },
  });
  return { instance, ...module };
}

function firstLeaf(value, parts = []) {
  for (const [key, child] of Object.entries(value || {})) {
    if (typeof child === 'string') return [...parts, key];
    if (child && typeof child === 'object') {
      const found = firstLeaf(child, [...parts, key]);
      if (found) return found;
    }
  }
}

test('server initialization is synchronous with the supported i18next initAsync option', () => {
  const s = server();
  assert.equal(s.instance.options.initAsync, false);
  assert.equal(s.instance.isInitialized, true);
  for (const locale of s.languages) {
    assert.equal(s.instance.t('learnMilvus:common.back', { lng: locale }),
      s.resources[locale].learnMilvus.common.back, locale);
  }
});

test('the first client render matches server translations and English fallbacks in every language', () => {
  const s = server();
  for (const locale of s.languages.filter(locale => locale !== 'cn')) {
    const fallback = s.getFallbackResources(locale);
    const c = client(locale, JSON.parse(JSON.stringify(s.resources[locale])), fallback);
    assert.equal(c.instance.options.initAsync, false, locale);
    assert.equal(c.instance.isInitialized, true, locale);
    for (const key of ['learnMilvus:common.back', 'learnMilvus:common.runSearch', 'header:docs']) {
      assert.equal(c.instance.t(key), s.instance.t(key, { lng: locale }), `${locale}:${key}`);
    }
    const missing = firstLeaf(fallback);
    if (missing) {
      const [ns, ...parts] = missing;
      const key = `${ns}:${parts.join('.')}`;
      assert.equal(c.instance.t(key), s.instance.t(key, { lng: 'en' }), `${locale}:${key}`);
    }
  }
});

test('switching from partial English fallbacks loads the full English bundle and another locale', async () => {
  const s = server();
  const c = client('zh', JSON.parse(JSON.stringify(s.resources.zh)), s.getFallbackResources('zh'));
  await c.loadI18nResources('en');
  await c.instance.changeLanguage('en');
  assert.equal(c.instance.t('learnMilvus:common.back'), s.resources.en.learnMilvus.common.back);
  assert.equal(c.instance.t('header:docs'), s.resources.en.header.docs);
  await c.loadI18nResources('ja');
  await c.instance.changeLanguage('ja');
  assert.equal(c.instance.t('learnMilvus:common.back'), s.resources.ja.learnMilvus.common.back);
  assert.equal(c.instance.t('header:docs'), s.resources.ja.header.docs);
});
