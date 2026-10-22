const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const code = ts.transpileModule(fs.readFileSync('src/utils/acquisition-context.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const scope = { exports: {}, URL, URLSearchParams, Date };
vm.runInNewContext(code, scope);
const { getAcquisitionContext, CONTEXT_KEY } = scope.exports;
const storage = () => { const values = new Map(); return { getItem: k => values.get(k), setItem: (k,v) => values.set(k,v) }; };
test('organic entry survives later content routes; URLs never retain query or fragment', () => {
  const store = storage();
  const first = getAcquisitionContext('milvus.io', '/docs/quickstart.md?email=private@example.com#code', 'https://www.google.com/search?q=private', store);
  const later = getAcquisitionContext('milvus.io', '/compare/milvus-vs-pgvector', '', store);
  assert.equal(later.first_landing_page, '/docs/quickstart.md');
  assert.equal(later.first_referrer_host, 'www.google.com');
  assert.equal(later.first_touch_at, first.first_touch_at);
  assert.equal(later.first_touch_scope, 'browser_session');
  assert.ok(!JSON.stringify(later).includes('private'));
});
test('owned-site handoff retains earlier site; unsupported keys cannot propagate', () => {
  const store = storage();
  const time = '2026-01-01T00:00:00.000Z';
  const result = getAcquisitionContext('zilliz.com', '/cloud?first_entry_site=milvus.io&first_landing_page=%2Fdocs%2Frag.md&first_touch_at='+time+'&token=private', '', store);
  assert.equal(result.first_entry_site, 'milvus.io');
  assert.equal(result.first_landing_page, '/docs/rag.md');
  assert.ok(!JSON.stringify(result).includes('private'));
});
test('blocked or corrupted storage and invalid dates do not break navigation', () => {
  const blocked = { getItem() { throw Error(); }, setItem() { throw Error(); } };
  assert.equal(getAcquisitionContext('milvus.io', '/', '', blocked).first_landing_page, '/');
  const store = storage(); store.setItem(CONTEXT_KEY, '{');
  assert.equal(getAcquisitionContext('milvus.io', '/', '', store).first_entry_site, 'milvus.io');
  store.setItem(CONTEXT_KEY, JSON.stringify({ first_touch_at: 'invalid', first_entry_site: 'evil.example', first_landing_page: '//evil.example', token: 'secret' }));
  const result = getAcquisitionContext('milvus.io', '/docs', '', store);
  assert.equal(result.first_entry_site, 'milvus.io');
  assert.equal(result.first_landing_page, '/docs');
  assert.ok(!JSON.stringify(result).includes('secret'));
});
