const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const utils = 'src/utils';
function load(name, env = {}) {
  const scope = { exports: {}, URL, URLSearchParams, Date, ...env };
  scope.require = id => load(id.replace('./', ''), env);
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(utils, name + '.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, scope);
  return scope.exports;
}
function store(value) { const data = new Map(value ? [['growth_entry_context_v1', JSON.stringify(value)]] : []); return { getItem: k => data.get(k), setItem: (k,v) => data.set(k,v) }; }
const { getAcquisitionContext } = load('acquisition-context');
test('first campaign is atomic across routes and a cross-site/OAuth handoff', () => {
  const storage = store();
  const a = getAcquisitionContext('milvus.io', '/docs/start?utm_source=google&utm_campaign=A&gclid=clickA', 'https://search.example/?secret=1', storage);
  const b = getAcquisitionContext('milvus.io', '/pricing?utm_source=reddit&utm_campaign=B&gclid=clickB', '', storage);
  assert.equal(b.first_touch_version, '2');
  assert.equal(b.first_landing_page, '/docs/start');
  assert.equal(b.first_utm_campaign, 'A');
  assert.equal(b.first_gclid, 'clickA');
  assert.equal(b.first_referrer_host, 'search.example');
  const handoff = '/cloud?' + new URLSearchParams({ ...b, utm_campaign: 'B', gclid: 'clickB' });
  const c = getAcquisitionContext('zilliz.com', handoff, 'https://milvus.io', store());
  assert.equal(c.first_utm_campaign, 'A');
  assert.equal(c.session_entry_page, '/cloud');
  assert.equal(c.first_touch_at, a.first_touch_at);
});
test('direct and legacy first touches do not acquire a later campaign', () => {
  const storage = store();
  getAcquisitionContext('zilliz.com', '/direct', '', storage);
  const later = getAcquisitionContext('zilliz.com', '/paid?utm_source=google&gclid=later', '', storage);
  assert.equal(later.first_utm_source, undefined);
  assert.equal(later.first_gclid, undefined);
  const legacy = store({first_touch_at: new Date().toISOString(), first_landing_page: '/old', first_entry_site: 'milvus.io', attribution_version: '1'});
  const migrated = getAcquisitionContext('zilliz.com', '/paid?utm_source=google', '', legacy);
  assert.equal(migrated.first_landing_page, '/old');
  assert.equal(migrated.first_touch_version, undefined);
  assert.equal(migrated.first_utm_source, undefined);
  assert.equal(migrated.attribution_version, '2');
});
test('untrusted cached extras and query secrets never enter first bundle', () => {
  const context = getAcquisitionContext('zilliz.com', '/start?email=private&token=secret&utm_campaign=ok#secret', '', store());
  assert.equal(context.first_landing_page, '/start');
  assert.equal(context.first_utm_campaign, 'ok');
  assert.equal(context.email, undefined);
  assert.equal(context.first_token, undefined);
});
test('handoff is a new consented ID per activation; revocation removes stale ID', () => {
  let consent = 'unknown', counter = 0;
  const document = { get cookie() { return consent === 'unknown' ? '' : 'CookieConsent=' + (consent === 'granted'); } };
  const cc = { validConsent: () => consent !== 'unknown', allowedCategory: category => category === 'analytics' && consent === 'granted' };
  const { activateHandoff } = load('growth-measurement', { window: { cc }, document, crypto: { randomUUID: () => 'uuid-' + (++counter) } });
  const url = new URL('https://cloud.zilliz.com/signup?handoff_id=stale');
  assert.equal(activateHandoff(url).handoff_id, '');
  consent = 'granted';
  const first = activateHandoff(url).handoff_id;
  assert.equal(first, url.searchParams.get('handoff_id'));
  assert.notEqual(activateHandoff(url).handoff_id, first);
  consent = 'denied';
  assert.equal(activateHandoff(url).handoff_id, '');
  assert.equal(url.searchParams.has('handoff_id'), false);
  assert.equal(url.searchParams.get('analytics_consent'), 'denied');
});
