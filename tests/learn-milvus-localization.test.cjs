const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function compile(file, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const scope = { exports: {}, require: name => dependencies[name] };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}

const { LanguageEnum } = compile('src/types/localization.ts');
const locales = Object.values(LanguageEnum);
const localization = compile('src/utils/localization.ts', {
  '@/types/localization': { LanguageEnum },
});

function flatten(object, prefix = '') {
  return Object.fromEntries(Object.entries(object).flatMap(([key, value]) =>
    typeof value === 'object'
      ? Object.entries(flatten(value, `${prefix}${key}.`))
      : [[prefix + key, value]]));
}

function readTranslations(locale) {
  return flatten(JSON.parse(fs.readFileSync(
    `src/i18n/${locale === 'zh' ? 'cn' : locale}/learnMilvus.json`, 'utf8'
  )));
}

test('every public Learn Milvus page builds all supported locale routes', () => {
  for (const page of ['index', 'metric', 'ivf', 'hnsw', 'diskann']) {
    const module = compile(`src/pages/[lang]/learn-milvus/${page}.tsx`, {
      '@/utils/localization': localization,
      [`@/pages/learn-milvus/${page}`]: { default: () => null },
    });
    const { paths, fallback } = module.getStaticPaths();
    assert.equal(fallback, false);
    assert.deepEqual(Array.from(paths, path => path.params.lang).sort(),
      locales.filter(locale => locale !== 'en').sort());
    for (const { params } of paths) {
      assert.equal(module.getStaticProps({ params }).props.locale, params.lang);
    }
  }
});

test('all learning translations preserve placeholders, rich text and code identifiers', () => {
  const english = readTranslations('en');
  const placeholders = value => [...value.matchAll(/\{\{[^}]+\}\}/g)].map(m => m[0]).sort();
  const code = value => [...value.matchAll(/<code>(.*?)<\/code>/g)].map(m => m[1]).sort();
  const tagNames = value => [...new Set([...value.matchAll(/<\/?([A-Za-z]+)>/g)].map(m => m[1]))].sort();
  for (const locale of locales.filter(locale => locale !== 'en')) {
    const translated = readTranslations(locale);
    assert.deepEqual(Object.keys(translated).sort(), Object.keys(english).sort(), locale);
    for (const [key, original] of Object.entries(english)) {
      const value = translated[key];
      const label = `${locale}:${key}`;
      assert.ok(typeof value === 'string' && value.trim(), label);
      assert.deepEqual(placeholders(value), placeholders(original), label);
      assert.deepEqual(code(value), code(original), label);
      assert.deepEqual(tagNames(value), tagNames(original), label);
      const stack = [];
      for (const match of value.matchAll(/<(\/?)([A-Za-z]+)>/g)) {
        if (match[1]) assert.equal(stack.pop(), match[2], label);
        else stack.push(match[2]);
      }
      assert.deepEqual(stack, [], label);
    }
    for (const key of ['common.back', 'common.runSearch', 'common.pressRun', 'home.subtitle']) {
      assert.notEqual(translated[key], english[key], `${locale}:${key} must be translated`);
    }
    for (const term of ['FLAT', 'IVF']) {
      assert.ok(translated['home.cards.ivf.title'].includes(term), `${locale}: preserve ${term}`);
    }
  }
});
