const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const topics = require('../content/ai-quick-reference/topics.json');

function compile(file, deps = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports, URLSearchParams,
    require: name => deps[name] ?? (() => null) }, { filename: file });
  return exports;
}
const queryHelpers = compile('src/utils/ai-reference-query.ts');
const items = Array.from({ length: 30 }, (_, i) => ({ title: `Concept ${i}`, url: `concept-${i}`, topic: topics[0].id }));
const deps = {
  '@/http/faq': { generateSimpleFaqList: async () => items },
  '@/consts/faq': { AI_REFERENCE_PAGE_SIZE: 24 },
  '@/utils/ai-reference-query': queryHelpers,
  '../../../content/ai-quick-reference/topics.json': topics,
};
const page = compile('src/pages/ai-quick-reference/index.tsx', deps);
const api = compile('src/pages/api/ai-quick-reference.ts', deps).default;
function response() {
  return { headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}

test('pagination and topic URLs have distinct normalized canonicals', () => {
  const path = queryHelpers.referenceListPath;
  assert.equal(path(), '/ai-quick-reference');
  assert.equal(path(2), '/ai-quick-reference?page=2');
  assert.equal(path(1, 'retrieval'), '/ai-quick-reference?topic=retrieval');
  assert.equal(path(2, 'retrieval', ' hybrid search '), '/ai-quick-reference?topic=retrieval&keyword=hybrid+search&page=2');
});

test('SSR rejects out-of-range and ambiguous page/filter URLs instead of serving a clamped 200', async () => {
  for (const value of ['0', '-1', '1.5', 'abc', '999999', '', ['1', '2']]) {
    assert.equal((await page.getServerSideProps({ query: { page: value }, res: response() })).notFound, true);
  }
  for (const query of [{ topic: 'missing' }, { topic: ['retrieval','lake'] }, { keyword: ['a','b'] }]) {
    assert.equal((await page.getServerSideProps({ query, res: response() })).notFound, true);
  }
});

test('valid page 2 renders its own records and empty searches remain usable but noindex', async () => {
  const res = response();
  const valid = await page.getServerSideProps({ query: { page: '2' }, res });
  assert.equal(valid.props.pageIndex, 2); assert.equal(valid.props.list.length, 6);
  assert.equal(res.headers['X-Robots-Tag'], undefined);
  const emptyRes = response();
  const empty = await page.getServerSideProps({ query: { keyword: 'no match' }, res: emptyRes });
  assert.equal(empty.props.total, 0); assert.equal(emptyRes.headers['X-Robots-Tag'], 'noindex, follow');
  assert.equal((await page.getServerSideProps({ query: { keyword: 'no match', page: '2' }, res: response() })).notFound, true);
});

test('JSON API rejects invalid pagination and sends noindex for navigation data', async () => {
  for (const query of [{ page: '999' }, { page: ['1', '2'] }, { topic: ['a', 'b'] }]) {
    const res = response(); await api({ query }, res); assert.equal(res.code, 400);
  }
  const res = response(); await api({ query: { page: '2' } }, res);
  assert.equal(res.code, 200); assert.equal(res.body.list.length, 6);
  assert.equal(res.headers['X-Robots-Tag'], 'noindex, follow');
});

test('Reference sitemap dates do not change merely because the site is rebuilt', async () => {
  const config = require('../sitemap.config');
  const paths = (await config.additionalPaths({})).filter(x => x.loc.startsWith('/ai-quick-reference/'));
  assert.equal(paths.length, 113);
  assert.ok(paths.every(x => !('lastmod' in x) && !('changefreq' in x)));
  const hub = await config.transform({ autoLastmod: true }, '/ai-quick-reference');
  assert.equal(hub.lastmod, undefined);
});

test('English Reference URI matching includes query-only hub requests', () => {
  const config = fs.readFileSync('conf/conf.d/client.conf', 'utf8');
  const rule = config.split('\n').find(x => x.includes('ai-quick-reference'));
  const expression = new RegExp(rule.match(/"~\*(.*?)"/)[1], 'i');
  for (const path of ['/ai-quick-reference', '/ai-quick-reference?page=2', '/ai-quick-reference?topic=retrieval', '/ai-quick-reference/concept', '/api/ai-quick-reference', '/api/ai-quick-reference?topic=retrieval&page=2']) assert.ok(expression.test(path));
  assert.equal(expression.test('/ai-quick-reference-other'), false);
});

test('ordinary readers with non-English cookies keep Reference API and filtered hub requests in English', () => {
  const config = fs.readFileSync('conf/conf.d/client.conf', 'utf8');
  const rule = config.split('\n').find(x => x.includes('ai-quick-reference'));
  const englishReference = new RegExp(rule.match(/"~\*(.*?)"/)[1], 'i');
  const redirectMap = config.match(/map "\$is_crawler:\$cookie_lang:\$user_page_lang" \$do_lang_redirect \{([\s\S]*?)\}/)[1];
  const redirects = new RegExp(redirectMap.match(/"~(.*?)" 1;/)[1]);
  for (const savedPreference of ['fr', 'zh', 'ja']) {
    for (const path of ['/ai-quick-reference?topic=lake', '/api/ai-quick-reference?page=2']) {
      const effectiveLanguage = englishReference.test(path) ? 'en' : savedPreference;
      assert.equal(redirects.test(`0:${effectiveLanguage}:en`), false, `${savedPreference}: ${path}`);
    }
    assert.equal(redirects.test(`0:${savedPreference}:en`), true, 'an unprotected API route would redirect');
  }
});
