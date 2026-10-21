const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { readPages, getLandingProps, getLandingPaths, getLandingSitemapPaths } = require('../src/server/seo-landing-catalog');
const evidence = require('../content/seo-landings/benchmark-evidence.json');
const aiq = require('../content/seo-landings/aiq-index.json');

test('six solution and two comparison pages have reciprocal Chinese twins', () => {
  const en = readPages('en'), zh = readPages('zh');
  assert.equal(en.length, 8); assert.equal(zh.length, 8);
  for (const p of en) {
    const twin = zh.find(t => t.slug === p.slug);
    assert.equal(twin.path, '/zh' + p.path);
    assert.equal(twin.code?.code, p.code?.code);
  }
  for (const lang of ['en', 'zh']) {
    assert.equal(getLandingPaths(lang, 'solutions').paths.length, 6);
    assert.equal(getLandingPaths(lang, 'compare').paths.length, 2);
    assert.equal(getLandingPaths(lang, 'solutions').fallback, false);
  }
});

test('all canonical destinations and hubs enter the sitemap exactly once', async () => {
  const sitemap = require('../sitemap.config');
  const landingPaths = getLandingSitemapPaths();
  assert.equal(landingPaths.length, 20);
  assert.equal(new Set(landingPaths.map(p => p.loc)).size, 20);
  const paths = await sitemap.additionalPaths(sitemap);
  for (const p of landingPaths) {
    assert.equal(paths.filter(x => x.loc === p.loc).length, 1);
    assert.deepEqual(await sitemap.transform(sitemap, p.loc), p);
  }
});

test('unknown slugs and unsupported languages cannot become duplicate pages', () => {
  assert.deepEqual(getLandingProps('en', 'solutions', 'unknown'), { notFound: true });
  assert.deepEqual(getLandingProps('fr', 'solutions', 'hybrid-search'), { notFound: true });
  assert.deepEqual(readPages('../../'), []);
});

test('published props exclude editorial caveats, research and paid campaign seeds', () => {
  for (const lang of ['en', 'zh']) for (const p of readPages(lang)) {
    const group = p.path.includes('/compare/') ? 'compare' : 'solutions';
    const props = getLandingProps(lang, group, p.path.split('/').pop()).props;
    assert.ok(props.twinPath);
    for (const key of ['notes', 'research', 'sem_seed_for_zilliz', 'keywords']) assert.equal(props.page[key], undefined);
    assert.ok(props.related.length);
    assert.equal(props.references.length, p.aiq.length);
    for (const slug of p.aiq) assert.ok(aiq[slug], slug);
    for (const r of props.related) assert.ok(readPages(lang).some(x => x.path === r.path));
  }
});

test('concept links point to the actual published AI Reference catalog', async () => {
  const { loadPublishedFaqRows } = require('../src/server/ai-reference-catalog');
  const published = new Set((await loadPublishedFaqRows()).map(p => p.URL));
  for (const lang of ['en', 'zh']) for (const page of readPages(lang)) {
    for (const slug of page.aiq) assert.ok(published.has(slug), `${page.path}: ${slug}`);
  }
});

test('public benchmark rows reproduce verified QPS, P99 and recall configurations', () => {
  for (const lang of ['en', 'zh']) for (const p of readPages(lang)) {
    const charts = [...(p.bench || []), ...(p.sections || []).flatMap(s => s.bench || [])];
    for (const b of charts) for (const r of b.rows) {
      const row = evidence.rows.find(x => x.db_name === r.label);
      assert.ok(row, r.label); assert.ok(Math.abs(row.qps - r.value) < 0.011);
      assert.match(b.sourceUrl, /^https:\/\/github.com\/zilliztech\/VectorDBBench\/blob\//);
      assert.ok(b.source);
      const latency = r.detail.match(/P99\s+([\d.]+)/);
      assert.ok(latency); assert.ok(Math.abs(Number(latency[1]) - row.latency) < 0.001);
      const recall = r.detail.match(/recall\s+([\d.]+)/);
      if (recall) assert.ok(Math.abs(Number(recall[1]) - row.recall) < 0.00001);
    }
  }
});

test('hero diagrams and 1200x630 social cards exist for every locale', () => {
  for (const lang of ['en', 'zh']) for (const p of readPages(lang)) {
    const svg = fs.readFileSync(`public/images/seo-landings/${p.slug}-${lang}.svg`, 'utf8');
    assert.match(svg, /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.doesNotMatch(svg, /<script|onload=|href="https?:/i);
    const og = fs.readFileSync(`public/og/${p.slug}${lang === 'zh' ? '-zh' : ''}.png`);
    assert.equal(og.readUInt32BE(16), 1200); assert.equal(og.readUInt32BE(20), 630);
  }
});

test('agent page identifies RLS as enterprise-only and requires tenant filters', () => {
  for (const lang of ['en', 'zh']) {
    const p = readPages(lang).find(p => p.slug === 'database-for-ai-agents');
    assert.match(p.benefits[1].body, lang === 'zh' ? /仅.*企业版/ : /only.*enterprise edition/);
    assert.match(p.description, lang === 'zh' ? /企业版.*行级权限/ : /enterprise edition.*row-level security/);
    assert.match(p.feature_blocks[0].bullets[0], lang === 'zh' ? /每次请求.*租户过滤/ : /tenant filter on every request/);
  }
});

test('landing URLs keep their own EN/ZH locale before cookie-based redirects', () => {
  const conf = fs.readFileSync('conf/conf.d/client.conf', 'utf8');
  const map = conf.match(/map \$request_uri \$cookie_lang \{([\s\S]*?)\n\}/)[1];
  const rules = [...map.matchAll(/"~\*([^"]+)"\s+'(en|zh)'/g)];
  const locale = uri => rules.find(m => new RegExp(m[1], 'i').test(uri))?.[2];
  for (const path of getLandingSitemapPaths().map(p => p.loc)) {
    assert.equal(locale(path), path.startsWith('/zh/') ? 'zh' : 'en');
    assert.equal(locale(path + '?utm_source=test'), path.startsWith('/zh/') ? 'zh' : 'en');
  }
  for (const path of ['/solutions-other', '/compare-old', '/docs/zh/quickstart.md']) assert.equal(locale(path), undefined);
});
