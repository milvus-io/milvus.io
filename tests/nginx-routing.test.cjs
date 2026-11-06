const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const conf = fs.readFileSync(
  path.join(__dirname, '../conf/conf.d/client.conf'),
  'utf8'
);

test('docs language redirect strips explicit /en prefix instead of producing /docs/<lang>/en/* (#3041)', () => {
  const docsRewriteMatch = conf.match(
    /rewrite\s+(\^\/docs\(\?:\/\([^)]+\)\)\?\(\/\.\*\)\?\$)\s+\/docs\/\$cookie_lang\$2\s+permanent;/
  );
  assert.ok(docsRewriteMatch, 'docs language rewrite rule must exist');
  const docsRegex = new RegExp(docsRewriteMatch[1]);

  const m = '/docs/en/milvus_lite.md'.match(docsRegex);
  assert.ok(m, '/docs/en/milvus_lite.md must match docs rewrite regex');
  assert.equal(m[1], 'en');
  assert.equal(m[2], '/milvus_lite.md');
  assert.equal(`/docs/es${m[2]}`, '/docs/es/milvus_lite.md');

  const rootRewriteMatch = conf.match(
    /rewrite\s+(\^\/\([^)]+\)\(\/\.\*\)\?\$)\s+\/\$cookie_lang\$2\s+permanent;/
  );
  assert.ok(rootRewriteMatch, 'root language rewrite rule must exist');
  const rootRegex = new RegExp(rootRewriteMatch[1]);
  const rm = '/en/milvus-demos'.match(rootRegex);
  assert.ok(rm);
  assert.equal(rm[1], 'en');
  assert.equal(rm[2], '/milvus-demos');
});

test('English-only routes lock $cookie_lang to en so non-English browsers do not 301 to missing /[lang]/ pages', () => {
  const cookieLangBlock = conf.match(/map\s+\$request_uri\s+\$cookie_lang\s*\{([^}]+)\}/);
  assert.ok(cookieLangBlock, 'map $request_uri $cookie_lang block must exist');
  const rules = [...cookieLangBlock[1].matchAll(/"~\*([^"]+)"\s+'([^']+)';/g)].map(
    ([, pattern, lang]) => ({ regex: new RegExp(pattern, 'i'), lang })
  );

  const resolveFixedLang = uri => {
    const hit = rules.find(r => r.regex.test(uri));
    return hit ? hit.lang : null;
  };

  for (const uri of [
    '/learn-milvus',
    '/learn-milvus/',
    '/learn-milvus/hnsw',
    '/learn-ai-and-vectordb',
    '/tools/sizing-enterprise',
    '/tools/sizing-v250-enterprise',
    '/api-reference/go/v2.6.x/About.md',
  ]) {
    assert.equal(resolveFixedLang(uri), 'en', uri);
  }
});

test('Go API reference v3.0.x+ redirects to v2.6.x line alongside cpp, rust, and csharp fallbacks', () => {
  const goDeep = /^\/api-reference\/go\/v[3-9]\.[0-9]+\.x\/(.+)$/;
  const goRoot = /^\/api-reference\/go\/v[3-9]\.[0-9]+\.x\/?$/;
  assert.ok(conf.includes('rewrite ^/api-reference/go/v[3-9]\\.[0-9]+\\.x/(.+)$ /api-reference/go/v2.6.x/$1 permanent;'));
  assert.ok(conf.includes('rewrite ^/api-reference/go/v[3-9]\\.[0-9]+\\.x/?$ /api-reference/go/v2.6.x/About.md permanent;'));

  const deepMatch = '/api-reference/go/v3.0.x/Client/New.md'.match(goDeep);
  assert.ok(deepMatch);
  assert.equal(`/api-reference/go/v2.6.x/${deepMatch[1]}`, '/api-reference/go/v2.6.x/Client/New.md');
  assert.ok(goRoot.test('/api-reference/go/v3.0.x'));
  assert.ok(goRoot.test('/api-reference/go/v3.0.x/'));
});

test('$do_lang_redirect regex anchors (?!\\1$) so zh-hant -> zh transitions are not suppressed', () => {
  assert.match(
    conf,
    /"~\^0:\(\[\^:\]\+\):\(\?!\\1\$\)"\s+1;/,
    'expected $do_lang_redirect map to anchor (?!\\1$)'
  );
  const doRedirectRegex = /^0:([^:]+):(?!\1$)/;
  assert.equal(doRedirectRegex.test('0:zh:zh'), false);
  assert.equal(doRedirectRegex.test('0:zh-hant:zh-hant'), false);
  assert.equal(doRedirectRegex.test('0:zh:zh-hant'), true);
  assert.equal(doRedirectRegex.test('0:zh-hant:zh'), true);
});
