// The <html> element must carry the writing direction of the current locale so
// Arabic pages render RTL from the first byte, before any client script runs.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const root = path.resolve(__dirname, '..');

function compile(file, dependencies, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
    },
  }).outputText;
  const scope = { exports: {}, require: dependencies, ...globals };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}

const element =
  tag =>
  ({ children, ...props }) =>
    React.createElement(tag, props, children);

// next/document renders the real document skeleton; the stand-ins only keep the
// attributes _document is responsible for.
const nextDocument = {
  Html: element('html'),
  Head: element('head'),
  Main: () => React.createElement('main'),
  NextScript: () => React.createElement('script'),
};

const localization = compile(path.join(root, 'src/types/localization.ts'), require);
const i18nServer = {
  resources: { en: { header: {} }, ar: { header: {} } },
  getFallbackResources: () => null,
};

const renderDocument = lang => {
  const module = compile(
    path.join(root, 'src/pages/_document.tsx'),
    name => {
      if (name === 'next/document') return nextDocument;
      if (name === '@/i18n/server') return i18nServer;
      if (name === '@/types/localization') return localization;
      return require(name);
    },
    // The classic JSX transform expects React in scope even though the source
    // relies on the automatic runtime.
    { React }
  );
  const html = renderToStaticMarkup(
    React.createElement(module.default, {
      __NEXT_DATA__: { props: { pageProps: { lang } } },
    })
  );
  return { html, openTag: html.slice(0, html.indexOf('>') + 1) };
};

test('Arabic pages are rendered right-to-left', () => {
  const { openTag } = renderDocument('ar');
  assert.match(openTag, /lang="ar"/);
  assert.match(openTag, /dir="rtl"/);
});

test('left-to-right locales keep the default direction', () => {
  for (const lang of ['en', 'zh-hant', 'ja', 'ko', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'id']) {
    const { openTag } = renderDocument(lang);
    assert.match(openTag, /dir="ltr"/, lang);
  }
});

test('direction is derived from the locale list, not a page list', () => {
  assert.deepEqual([...localization.RTL_LANGUAGES], ['ar']);
  assert.equal(localization.getTextDirection('ar'), 'rtl');
  assert.equal(localization.getTextDirection('ar-EG'), 'ltr');
  assert.equal(localization.getTextDirection('en'), 'ltr');
  assert.equal(localization.getTextDirection(undefined), 'ltr');
});
