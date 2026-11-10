const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { NextRequest } = require('next/server');
const { unstable_doesMiddlewareMatch } = require('next/experimental/testing/server');

const root = path.resolve(__dirname, '..');
const exported = {};
const code = ts.transpileModule(fs.readFileSync(path.join(root, 'src/middleware.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
new Function('exports', 'require', code)(exported, require);
const { middleware, config } = exported;
const locales = ['en', 'zh-hant', 'zh', 'ja', 'jp', 'fr', 'ko', 'ru', 'de', 'es', 'pt', 'it', 'ar', 'id', 'cn'];
const matches = url => unstable_doesMiddlewareMatch({ config, url, nextConfig: {} });

test('old hub, articles, filters, API and public assets are permanently retired', () => {
  for (const url of [
    '/ai-quick-reference', '/ai-quick-reference/', '/ai-quick-reference?topic=retrieval&page=2',
    '/ai-quick-reference?keyword=hybrid', '/ai-quick-reference/agentic-search',
    '/ai-quick-reference/a-legacy-article.md', '/api/ai-quick-reference',
    '/api/ai-quick-reference?page=999', '/api/ai-quick-reference/nested',
    '/images/ai-reference/agentic-search.svg', '/assets/milvus-faq.csv',
    '/learn-ai-and-vectordb', '/learn-ai-and-vectordb/',
    '/learn-ai-and-vectordb?page=2', '/learn-ai-and-vectordb/test-workflow',
    '/api/learn-ai-and-vectordb', '/api/learn-ai-and-vectordb?page=2', '/assets/learn-ai.csv',
  ]) assert.equal(matches(url), true, url);
});

test('all supported historical locales retire pages, API and illustrations', () => {
  for (const locale of locales) {
    for (const suffix of [
      '/ai-quick-reference', '/ai-quick-reference/agentic-search?page=2',
      '/api/ai-quick-reference?keyword=search', '/images/ai-reference/agentic-search.svg',
      '/learn-ai-and-vectordb', '/learn-ai-and-vectordb/test-workflow?page=2',
      '/api/learn-ai-and-vectordb?keyword=search',
    ]) assert.equal(matches('/' + locale + suffix), true, locale + suffix);
  }
});

test('cached Next data navigation cannot revive removed pages', () => {
  for (const suffix of [
    '/ai-quick-reference.json', '/ai-quick-reference/agentic-search.json',
    ...locales.map(locale => '/' + locale + '/ai-quick-reference/agentic-search.json'),
    '/learn-ai-and-vectordb.json', '/learn-ai-and-vectordb/test-workflow.json',
    ...locales.map(locale => '/' + locale + '/learn-ai-and-vectordb/test-workflow.json'),
  ]) assert.equal(matches('/_next/data/old-build-id' + suffix), true, suffix);
});

test('retirement boundaries preserve docs, learn, API reference and similarly named routes', () => {
  for (const url of [
    '/', '/docs', '/docs/quickstart.md', '/docs/ai-quick-reference',
    '/learn', '/learn-milvus', '/learn-milvus/hnsw', '/zh/learn-milvus/diskann',
    '/learn-ai-and-vectordb-other', '/api/learn-ai-and-vectordb-other', '/assets/learn-ai.csv.backup',
    '/docs/learn-ai-and-vectordb', '/blog/learn-ai-and-vectordb', '/learn/ai-quick-reference', '/learn/what-is-ai-reference',
    '/api-reference', '/api-reference/pymilvus/v2.6.x/About.md',
    '/solutions', '/compare', '/blog/ai-quick-reference',
    '/ai-quick-reference-other', '/api/ai-quick-reference-other',
    '/images/ai-reference-other/figure.svg', '/assets/milvus-faq.csv.backup',
    '/_next/data/old-build-id/docs/quickstart.md.json',
    '/_next/data/old-build-id/learn/ai-quick-reference.json',
  ]) assert.equal(matches(url), false, url);
});

test('GET and HEAD return 410 with a noindex signal, including locale cookies', async () => {
  for (const method of ['GET', 'HEAD']) {
    for (const url of ['/ai-quick-reference', '/fr/ai-quick-reference/agentic-search', '/api/ai-quick-reference', '/zh/api/ai-quick-reference',
      '/learn-ai-and-vectordb/test-workflow', '/fr/learn-ai-and-vectordb', '/assets/learn-ai.csv',
      '/api/learn-ai-and-vectordb', '/zh/api/learn-ai-and-vectordb']) {
      const response = middleware(new NextRequest('https://milvus.example' + url, {
        method, headers: { cookie: 'lang=fr', 'accept-language': 'fr' },
      }));
      assert.equal(response.status, 410, method + ' ' + url);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex');
      assert.match(response.headers.get('cache-control'), /max-age=300/);
      assert.equal(response.headers.get('location'), null);
      if (url.includes('/api/')) {
        assert.match(response.headers.get('content-type'), /^application\/json/);
        if (method === 'GET') assert.match((await response.json()).message, /permanently removed/);
      } else {
        assert.match(response.headers.get('content-type'), /^text\/html/);
        if (method === 'GET') assert.match(await response.text(), /410 Gone/);
      }
    }
  }
});

test('Nginx retirement locations use the same precise namespace boundaries', () => {
  const nginx = fs.readFileSync(path.join(root, 'conf/conf.d/client.conf'), 'utf8');
  const locations = [...nginx.matchAll(/location\s+~\*\s+(\S+)\s*\{([^}]+)\}/g)]
    .filter(match => /return\s+410\s*;/.test(match[2]));
  assert.ok(locations.length >= 2, 'retirement locations must include cached Next data');
  const routes = locations.map(match => new RegExp(match[1], 'i'));
  const nginxMatches = url => routes.some(route => route.test(url));
  for (const url of [
    '/ai-quick-reference', '/zh/ai-quick-reference/a.md', '/api/ai-quick-reference',
    '/fr/api/ai-quick-reference', '/images/ai-reference/a.svg', '/zh/images/ai-reference/a.svg',
    '/_next/data/old-build/ai-quick-reference.json',
    '/_next/data/old-build/ai-quick-reference/agentic-search.json',
    '/_next/data/old-build/fr/ai-quick-reference/agentic-search.json',
    '/learn-ai-and-vectordb', '/zh/learn-ai-and-vectordb/test-workflow',
    '/api/learn-ai-and-vectordb', '/fr/api/learn-ai-and-vectordb',
    '/_next/data/old-build/learn-ai-and-vectordb.json',
    '/_next/data/old-build/fr/learn-ai-and-vectordb/test-workflow.json',
  ]) {
    assert.equal(nginxMatches(url), true, url);
  }
  for (const url of [
    '/docs/ai-quick-reference', '/learn/ai-quick-reference', '/blog/ai-quick-reference',
    '/ai-quick-reference-other', '/api-reference', '/learn-milvus', '/zh/learn-milvus/hnsw',
    '/learn-ai-and-vectordb-other', '/api/learn-ai-and-vectordb-other',
    '/docs/learn-ai-and-vectordb', '/blog/learn-ai-and-vectordb',
    '/_next/data/old-build/learn-milvus/hnsw.json',
    '/_next/data/old-build/learn-ai-and-vectordb-other.json',
    '/_next/data/old-build/docs/quickstart.md.json',
    '/_next/data/old-build/learn/ai-quick-reference.json',
    '/_next/data/old-build/ai-quick-reference-other.json',
  ]) {
    assert.equal(nginxMatches(url), false, url);
  }
  for (const match of locations) assert.ok(nginx.indexOf(match[0]) < nginx.indexOf('location / {'));
  assert.match(nginx, /location\s*=\s*\/assets\/milvus-faq\.csv\s*\{/);
  assert.match(nginx, /location\s*=\s*\/assets\/learn-ai\.csv\s*\{/);
});

test('the removed collection and its public assets are absent from the source tree', () => {
  const containsFiles = entry => {
    if (!fs.existsSync(entry)) return false;
    if (fs.statSync(entry).isFile()) return true;
    return fs.readdirSync(entry).some(child => containsFiles(path.join(entry, child)));
  };
  for (const entry of [
    'content/ai-quick-reference', 'public/images/ai-reference', 'public/assets/milvus-faq.csv',
    'src/pages/ai-quick-reference', 'src/pages/api/ai-quick-reference.ts',
    'src/server/ai-reference-catalog.js', 'public/assets/learn-ai.csv',
    'src/pages/learn-ai-and-vectordb', 'src/http/learnAi.ts', 'src/types/learnAi.ts',
  ]) assert.equal(containsFiles(path.join(root, entry)), false, entry);
});


test('retired learning URLs cannot re-enter the sitemap while Learn Milvus remains discoverable', async () => {
  const sitemap = require('../sitemap.config.js');
  for (const locale of ['', ...locales.map(locale => '/' + locale)]) {
    for (const suffix of ['/learn-ai-and-vectordb', '/learn-ai-and-vectordb/test-workflow', '/api/learn-ai-and-vectordb']) {
      assert.equal(await sitemap.transform(sitemap, locale + suffix), null, locale + suffix);
    }
  }
  for (const url of ['/learn-milvus', '/learn-milvus/hnsw', '/zh/learn-milvus/diskann', '/docs/overview.md', '/blog']) {
    assert.equal((await sitemap.transform(sitemap, url)).loc, url, url);
  }
  const additions = await sitemap.additionalPaths(sitemap);
  assert.ok(additions.some(page => page.loc === '/learn-milvus/hnsw'));
  assert.equal(additions.some(page => /learn-ai-and-vectordb/.test(page.loc)), false);
});

test('published and generated discovery indexes no longer advertise Learn AI', () => {
  for (const entry of ['public/llms.txt', 'scripts/generate-llms-txt.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(root, entry), 'utf8'), /learn-ai-and-vectordb|learn-ai\.csv/);
  }
});
