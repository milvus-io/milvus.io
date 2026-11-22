const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const i18next = require('i18next');
const { initReactI18next } = require('react-i18next');
const catalog = require('../src/server/seo-landing-catalog');
const generator = require('../scripts/generate-llms-txt');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function load(file, dependencies = require, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(file), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      esModuleInterop: true, jsx: ts.JsxEmit.React,
    },
  }).outputText, { exports, require: dependencies, process, URL, ...globals }, { filename: file });
  return exports;
}

test('the committed indexes reproduce from the snapshot and layer the full docs tree', () => {
  const text = read('public/llms.txt');
  const fullText = read('public/llms-full.txt');
  assert.deepEqual(generator.renderFromSnapshot(fullText), { text, fullText });
  assert.ok(Buffer.byteLength(text) >= 15000 && Buffer.byteLength(text) <= 30000);
  assert.ok(fullText.length > text.length * 3);
  assert.match(text, /https:\/\/milvus\.io\/llms-full\.txt/);
  for (const index of [text, fullText]) {
    assert.match(index, /## Solutions[\s\S]*## Comparisons/);
    for (const page of catalog.readPages('en')) {
      assert.ok(index.includes(`(https://milvus.io${page.path}): ${page.description}`), page.path);
    }
    assert.match(index, /## API Reference/);
    assert.match(index, /\/docs\/quickstart\.md/);
    assert.match(index, /\/zh\/solutions\/<slug>/);
    assert.match(index, /\/zh\/compare\/<slug>/);
  }
  assert.match(fullText, /## Administration Guide/);
  assert.doesNotMatch(text, /## Administration Guide/);
  for (const source of [text, fullText, read('scripts/llms-evaluation.md')]) {
    assert.match(source, /\/blog\/<slug>\.md.*\/<lang>\/blog\/<slug>\.md/);
  }
});

test('head discovery is deduplicated and both robots sources advertise the index', async () => {
  for (const file of ['src/pages/_app.tsx', 'src/components/learn-milvus/components/LearnMilvusSeo.tsx']) {
    assert.match(read(file), /<link rel="describedby" [^\n]*llms\.txt[^\n]*key="llms-txt"/);
  }
  const hint = /#.*https:\/\/milvus\.io\/llms\.txt/;
  assert.match(read('public/robots.txt'), hint);
  assert.match(await require('../sitemap.config').robotsTxtOptions.transformRobotsTxt({}, 'User-agent: *\n'), hint);
});

test('inline i18n has the namespaces used by each page and loads full resources for navigation', async () => {
  const serverInstance = i18next.createInstance();
  const clientInstance = i18next.createInstance();
  const bundle = lang => load(`src/i18n/${lang}/index.ts`, name =>
    JSON.parse(read(`src/i18n/${lang}/${name.slice(2)}`)));
  const dependencies = instance => name => {
    if (name === 'i18next') return instance;
    if (name === 'react-i18next') return { initReactI18next };
    return bundle(name.slice(2));
  };
  const server = load('src/i18n/server.ts', dependencies(serverInstance));
  const { getRouteNamespaces, sliceNamespaces } = load('src/pages/_document.tsx', () => ({}));
  for (const [page, expected] of Object.entries({
    '/': ['home'], '/[lang]': ['home'], '/docs/zh/[id]': ['docs', 'llm'],
    '/[lang]/blog/[id]': ['blog', 'llm', 'home'], '/learn-milvus/metric': ['learnMilvus'],
    '/[lang]/tools/sizing-v300': ['sizingTool', 'blog'], '/intro': ['intro'],
    '/[lang]/use-cases': ['useCase'], '/milvus-demos/reverse-image-search': ['demo', 'home'],
    '/community': ['community'], '/contact': ['contact'], '/404': ['notFound'], '/error': ['notFound'],
    '/[lang]/solutions/[slug]': ['home'], '/compare': ['home'],
    '/api-reference/[language]/[version]/[...slug]': ['home', 'docs'], '/bootcamp': ['home'],
  })) {
    const names = getRouteNamespaces(page);
    for (const ns of ['common', 'header', ...expected]) assert.ok(names.includes(ns), `${page}: ${ns}`);
  }
  assert.equal(getRouteNamespaces('/unknown'), undefined);
  const names = getRouteNamespaces('/[lang]/solutions/[slug]');
  const lang = 'ar';
  const inline = sliceNamespaces(server.resources[lang], names);
  const fallback = server.getFallbackResources(lang, names);
  assert.ok(JSON.stringify([inline, fallback]).length <
    JSON.stringify([server.resources[lang], server.getFallbackResources(lang)]).length / 2);
  const client = load('src/i18n/client.ts', dependencies(clientInstance), {
    document: { documentElement: { lang }, cookie: '' },
    window: { __I18N_PARTIAL__: true, __I18N_RESOURCES__: { [lang]: inline },
      __I18N_FALLBACK_RESOURCES__: fallback },
  });
  for (const key of ['home:subscribeSection.subscribe.title', 'header:docs', 'common:status.subscribe']) {
    assert.equal(clientInstance.t(key), serverInstance.t(key, { lng: lang }));
  }
  assert.equal(clientInstance.hasResourceBundle(lang, 'learnMilvus'), false);
  assert.equal(client.hasFullI18nResources(lang), false);
  await client.loadI18nResources(lang);
  assert.equal(client.hasFullI18nResources(lang), true);
  assert.equal(clientInstance.hasResourceBundle(lang, 'learnMilvus'), true);
  assert.equal(clientInstance.t('learnMilvus:common.back'), serverInstance.t('learnMilvus:common.back', { lng: lang }));
  assert.equal(clientInstance.hasResourceBundle('en', 'learnMilvus'), true);
  assert.match(read('src/pages/_document.tsx'), /window\.__I18N_PARTIAL__/);
  assert.match(read('src/pages/_app.tsx'), /loadI18nResources\(locale\)[\s\S]*translationsReady && <Component/);
});

test('Next negotiates Markdown only on the listed paths and varies both representations', async () => {
  const scope = { require: name => name === 'fs' ? { existsSync: () => true } : require(name),
    module: {}, process, __dirname: root };
  vm.runInNewContext(read('next.config.js'), scope);
  const config = await scope.module.exports();
  const rewrites = await config.rewrites();
  const headers = await config.headers();
  const expected = ['solutions', 'compare'].flatMap(group => ['', '/zh'].flatMap(prefix =>
    [`${prefix}/${group}`, `${prefix}/${group}/:slug`]));
  expected.push('/docs', '/docs/:path*', '/blog/:id', '/:lang/blog/:id');
  assert.equal(rewrites.beforeFiles.length, expected.length);
  for (const source of expected) {
    const rule = rewrites.beforeFiles.find(r => r.source === source);
    assert.equal(rule.destination, '/api/markdown' + source);
    assert.equal(rule.has[0].key, 'accept');
    assert.equal(rule.has[0].type, 'header');
    const accept = new RegExp(rule.has[0].value);
    assert.ok(accept.test('text/html, text/markdown'));
    assert.ok(!accept.test('text/html'));
    assert.ok(headers.find(r => r.source === source).headers.some(h => h.key === 'Vary' && h.value === 'Accept'));
  }
});

const markdownFile = 'src/server/markdown-negotiation.ts';
const markdown = load(markdownFile, name => {
  if (name === '../types/localization') return load('src/types/localization.ts');
  if (name === './seo-landing-catalog') return catalog;
  return require(name);
});

test('landing Markdown includes public copy, citations, tables, examples and related pages', () => {
  let combined = '';
  for (const lang of catalog.LANGUAGES) {
    for (const group of ['solutions', 'compare']) {
      const index = lang === 'en' ? [group] : [lang, group];
      assert.match(markdown.resolveMarkdown(index).body, /^# /);
    }
    for (const page of catalog.readPages(lang)) {
      const result = markdown.resolveMarkdown(page.path.slice(1).split('/'));
      assert.ok(result.body.startsWith('# ' + page.h1));
      assert.ok(result.body.includes(page.description));
      assert.equal(result.canonical, 'https://milvus.io' + page.path);
      for (const field of ['notes', 'research', 'sem_seed_for_zilliz', 'keywords']) {
        assert.deepEqual(markdown.serializeLanding({ ...page, [field]: 'PRIVATE-FIELD-MARKER' }),
          markdown.serializeLanding(page));
      }
      combined += result.body;
    }
  }
  for (const pattern of [/\| --- \|/, /```python/, /## FAQ/, /## Related pages/, /## Sources/, /Configuration \| Result/]) {
    assert.match(combined, pattern);
  }
});

test('raw docs and blogs respect source layouts, release metadata and traversal boundaries', t => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-markdown-'));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  const put = (file, content) => {
    const target = path.join(fixture, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
    return target;
  };
  put('src/docs/version.json', '{"version":"v3.0.x","released":"no"}');
  put('src/docs/v3.0.x/site/en/preview.md', '# Unreleased');
  put('src/docs/v2.6.x/site/en/getting-started/quickstart.md', '# Quickstart');
  put('src/docs/v2.6.x/site/en/home/home.md', '# Docs home');
  put('src/docs/localization/v2.6.x/site/zh/guide/quickstart.md', '# 快速开始');
  const blog = '---\ntitle: Test blog\n---\n# Raw blog\n';
  put('src/blogs/blog/en/example.md', blog);
  put('src/blogs/localization/blog/zh/example.md', blog);
  const secret = put('private.md', 'private');
  fs.symlinkSync(secret, path.join(fixture, 'src/blogs/blog/en/private.md'));
  const resolve = (...parts) => markdown.resolveMarkdown(parts, fixture);
  assert.equal(resolve('docs').body, '# Docs home');
  assert.equal(resolve('docs', 'quickstart.md').body, '# Quickstart');
  assert.equal(resolve('docs', 'zh', 'v2.6.x', 'quickstart.md').canonical, 'https://milvus.io/docs/zh/quickstart.md');
  assert.equal(resolve('blog', 'example.md').body, blog);
  assert.equal(resolve('zh', 'blog', 'example.md').body, blog);
  for (const parts of [['docs', 'missing.md'], ['docs', 'v3.0.x', 'preview.md'],
    ['blog', 'private.md'], ['docs', '..', 'private.md'], ['blog', '../private.md'],
    ['blog', '%2e%2e%2fprivate.md'], ['blog', '..\\private.md'], ['docs', 'quickstart']]) {
    assert.equal(resolve(...parts), undefined, parts.join('/'));
  }
});

test('Markdown API sends the media type, canonical link and vary header', () => {
  const api = load('src/pages/api/markdown/[...path].ts', () => markdown).default;
  const headers = {};
  const res = { setHeader: (k, v) => { headers[k] = v; },
    status(code) { this.code = code; return this; }, send(body) { this.body = body; }, end() {} };
  api({ method: 'GET', query: { path: ['solutions'] } }, res);
  assert.equal(res.code, 200);
  assert.equal(headers.Vary, 'Accept');
  assert.equal(headers['Content-Type'], 'text/markdown; charset=utf-8');
  assert.equal(headers.Link, '<https://milvus.io/solutions>; rel="canonical"');
  assert.match(res.body, /^# Milvus solutions/);
  api({ method: 'HEAD', query: { path: ['docs', 'missing.md'] } }, res);
  assert.equal(res.code, 404);
});

test('Nginx classifies AI agents as crawlers', () => {
  const map = read('conf/conf.d/client.conf').match(/map \$http_user_agent \$is_crawler \{[^}]+}/)[0];
  for (const bot of 'GrokBot xAI-Grok Grok-DeepSearch ExaBot YouBot TavilyBot FirecrawlAgent Jina DeepSeekBot KagiBot GoogleAgent-Mariner Gemini-Deep-Research Google-NotebookLM PhindBot'.split(' ')) {
    assert.ok(map.includes(`"~*${bot}" 1;`), bot);
  }
});
