// Header and footer labels must come from the locale bundles, never from
// hard-coded English strings in the components.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const i18nDir = path.join(root, 'src/i18n');
const locales = fs
  .readdirSync(i18nDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .filter(locale => locale !== 'en');

const header = locale =>
  JSON.parse(fs.readFileSync(path.join(i18nDir, locale, 'header.json'), 'utf8'));

const english = header('en');

test('every locale translates the navigation labels', () => {
  for (const locale of locales) {
    const { nav } = header(locale);
    assert.ok(nav, `${locale}: missing nav namespace`);
    for (const key of ['solutions', 'compare', 'learnMilvus']) {
      assert.equal(typeof nav[key], 'string', `${locale}: nav.${key}`);
      assert.ok(nav[key].trim(), `${locale}: nav.${key} is empty`);
    }
    assert.notEqual(nav.learnMilvus, english.nav.learnMilvus, `${locale}: nav.learnMilvus`);
    assert.notEqual(nav.compare, english.nav.compare, `${locale}: nav.compare`);
  }
});

test('header and footer no longer hard-code the navigation labels', () => {
  const sources = [
    'src/components/header/navigation.ts',
    'src/components/footer/index.tsx',
  ].map(file => ({ file, code: fs.readFileSync(path.join(root, file), 'utf8') }));

  for (const { file, code } of sources) {
    for (const literal of ['Learn Milvus', 'Compare databases', '解决方案', '产品对比']) {
      assert.ok(!code.includes(`'${literal}'`), `${file} hard-codes ${literal}`);
    }
  }
});

test('footer keeps using the shared namespace for its headings', () => {
  const source = fs.readFileSync(path.join(root, 'src/components/footer/index.tsx'), 'utf8');
  assert.match(source, /t\('header:nav\.solutions'\)/);
  assert.match(source, /t\('header:nav\.compare'\)/);
  assert.match(source, /t\('header:nav\.learnMilvus'\)/);
});
