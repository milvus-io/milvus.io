const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const {
  LEARN_MILVUS_LOCALES: locales,
  LEARN_MILVUS_TOPICS: topics,
  getLearnMilvusPath,
  getLearnMilvusAlternates,
  getLearnMilvusSitemapPaths,
} = require('../src/utils/learn-milvus-seo');
const root = path.resolve(__dirname, '..');
const origin = 'https://milvus.io';

function compile(file, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const scope = { exports: {}, require: name => dependencies[name] ?? require(name) };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}

test('the public SEO catalog covers real routes in every supported language', () => {
  const { LanguageEnum } = compile('src/types/localization.ts');
  assert.deepEqual([...locales].sort(), Object.values(LanguageEnum).sort());
  assert.deepEqual(topics, ['home', 'metric', 'ivf', 'hnsw', 'diskann']);
  for (const topic of topics) {
    const file = `${topic === 'home' ? 'index' : topic}.tsx`;
    for (const dir of ['src/pages/learn-milvus', 'src/pages/[lang]/learn-milvus']) {
      assert.ok(fs.existsSync(path.join(root, dir, file)), `${dir}/${file}`);
    }
  }
  assert.equal(getLearnMilvusPath('cn'), null);
  assert.equal(getLearnMilvusPath('en', 'tradeoff'), null);
  assert.deepEqual(getLearnMilvusAlternates('/learn-milvus/tradeoff'), []);
});

test('rendered page metadata exposes one reciprocal cluster and English fallback per topic', () => {
  for (const topic of topics) {
    const englishPath = getLearnMilvusPath('en', topic);
    const expected = new Map(locales.map(locale => [locale, origin + getLearnMilvusPath(locale, topic)]));
    expected.set('x-default', origin + englishPath);
    for (const locale of locales) {
      const { default: Seo } = compile('src/components/learn-milvus/components/LearnMilvusSeo.tsx', {
        'next/head': ({ children }) => React.createElement(React.Fragment, null, children),
        '@/consts': { ABSOLUTE_BASE_URL: origin },
        '@/schema': { buildSchema: () => ({}) },
        '@/hooks/use-global-locale': { useGlobalLocale: () => ({ locale,
          getLocalePath: value => locale === 'en' ? value : `/${locale}${value}` }) },
        'react-i18next': { useTranslation: () => ({ t: key => key }) },
        '@/utils/learn-milvus-seo': require('../src/utils/learn-milvus-seo'),
      });
      const html = renderToStaticMarkup(React.createElement(Seo, {
        path: englishPath, title: 'Title', description: 'Description',
      }));
      const links = [...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/g)];
      assert.equal(links.length, locales.length + 1, `${locale}:${topic}`);
      const actual = new Map(links.map(([tag]) => [tag.match(/hrefLang="([^"]+)"/i)[1], tag.match(/href="([^"]+)"/)[1]]));
      assert.deepEqual(actual, expected);
      assert.match(html, /rel="describedby" href="https:\/\/milvus.io\/llms.txt"/);
      assert.ok(html.includes(`"inLanguage":"${locale}"`));
    }
    // The learning pages own the full cluster instead of also emitting the
    // common layout's partial/self-only hreflang declaration.
    const source = fs.readFileSync(path.join(root, `src/pages/learn-milvus/${topic === 'home' ? 'index' : topic}.tsx`), 'utf8');
    assert.match(source, /<Layout\s+disableSelfHreflang>/);
  }
});

test('actual sitemap serialization includes all 65 pages with matching, unmodified alternate URLs', async () => {
  const { SitemapBuilder } = await import('next-sitemap');
  const { UrlSetBuilder } = await import(pathToFileURL(path.resolve(
    path.dirname(require.resolve('next-sitemap')), '../esm/builders/url-set-builder.js'
  )).href);
  const config = require('../sitemap.config');
  const learning = getLearnMilvusSitemapPaths();
  const additions = await config.additionalPaths(config);
  for (const page of learning) {
    assert.equal(additions.filter(item => item.loc === page.loc).length, 1);
    assert.deepEqual(await config.transform(config, page.loc), page);
  }
  // Exercise next-sitemap's normalization and XML serializer. Absolute
  // alternates must not have the current page's path appended a second time.
  const manifest = { build: { pages: Object.fromEntries(learning.map(page => [page.loc, []])) } };
  const fields = await new UrlSetBuilder(config, manifest).createUrlSet();
  const selected = fields.filter(field => /\/(?:learn-milvus)(?:\/|$)/.test(new URL(field.loc).pathname));
  assert.equal(selected.length, 65);
  assert.equal(new Set(selected.map(field => field.loc)).size, 65);
  for (const field of selected) {
    const original = learning.find(page => origin + page.loc === field.loc);
    assert.deepEqual(field.alternateRefs, original.alternateRefs.map(({ href, hreflang }) => ({ href, hreflang })));
  }
  const xml = new SitemapBuilder().buildSitemapXml(selected);
  assert.equal((xml.match(/<url>/g) || []).length, 65);
  assert.equal((xml.match(/<xhtml:link /g) || []).length, 65 * 14);
  assert.doesNotMatch(xml, /tradeoff|learn-milvus\/learn-milvus/);
});

test('llms.txt lists all exact learning URLs once and explains translated URL grammar', () => {
  const text = fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8');
  const urls = [...text.matchAll(/^\- \[[^\n]+?\]\((https:\/\/milvus\.io\/[^)]+)\)/gm)]
    .map(match => match[1]).filter(url => /\/(?:learn-milvus)(?:\/|$)/.test(new URL(url).pathname));
  const expected = getLearnMilvusSitemapPaths().map(page => origin + page.loc);
  assert.equal(urls.length, 65);
  assert.deepEqual(urls.sort(), expected.sort());
  assert.match(text, /`\/<lang>\/learn-milvus\/<topic>`/);
  assert.match(text, /server-rendered explanations/);
  assert.doesNotMatch(urls.join('\n'), /\.md|tradeoff/);
  const { renderLearningTranslations, renderUrlRules } = require('../scripts/generate-llms-txt');
  assert.ok(text.includes(renderLearningTranslations().trim()), 'committed translations match the generator');
  const grammar = renderUrlRules(['v3.0.x'], 'v3.0.x').match(/- Learn Milvus uses [\s\S]*?(?=\n\n\*\*Unknown)/)[0];
  assert.ok(text.includes(grammar), 'committed URL grammar matches the generator');
});
