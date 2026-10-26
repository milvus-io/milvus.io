const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const code = ts.transpileModule(fs.readFileSync('src/utils/acquisition-context.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const attributionScope = { exports: {}, URL, URLSearchParams };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/utils/cloud-attribution.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, attributionScope);
const scope = { exports: {}, URL, URLSearchParams, Date,
  require: name => name === './cloud-attribution' ? attributionScope.exports : require(name),
};
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

test('versioned API page labels are safe for handoff, including existing sessions and incoming context', () => {
  const expected = '/api-reference/restful/v2.5.x/v2/Partition-v2/Has.md';
  for (const group of ['Partition (v2)', 'Partition%20(v2)', 'Partition%20%28v2%29']) {
    const path = `/api-reference/restful/v2.5.x/v2/${group}/Has.md`;
    const store = storage();
    const first = getAcquisitionContext('milvus.io', path + '?tab=example#code', '', store);
    assert.equal(first.first_landing_page, expected);
    assert.equal(first.session_entry_page, expected);

    // A browser session started before the fix must recover on its next page.
    store.setItem(CONTEXT_KEY, JSON.stringify({ ...first, first_landing_page: path, session_entry_page: path }));
    const later = getAcquisitionContext('milvus.io', '/docs/quickstart.md', '', store);
    assert.equal(later.first_landing_page, expected);
    assert.equal(later.session_entry_page, expected);
    assert.equal(later.first_touch_at, first.first_touch_at);
    assert.equal(JSON.parse(store.getItem(CONTEXT_KEY)).first_landing_page, expected);

    const query = new URLSearchParams({ first_landing_page: path, session_entry_page: path, first_touch_at: first.first_touch_at });
    const incoming = getAcquisitionContext('milvus.io', '/docs?' + query, '');
    assert.equal(incoming.first_landing_page, expected);
    assert.equal(incoming.session_entry_page, expected);
  }
});
