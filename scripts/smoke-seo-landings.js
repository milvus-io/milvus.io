// HTTP-only SSR checks: runnable against a local server or a deployed preview.
const assert = require('node:assert/strict');
const { getLandingSitemapPaths, readPages } = require('../src/server/seo-landing-catalog');
const base = process.env.LANDING_TEST_URL || 'http://127.0.0.1:8033';
const pages = [...readPages('en'), ...readPages('zh')];
const get = async path => {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  return response.text();
};
(async () => {
  const assets = new Set();
  for (const { loc } of getLandingSitemapPaths()) {
    const html = await get(loc);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, loc);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, loc);
    assert.ok(html.includes(`href="https://milvus.io${loc}"`), loc);
    assert.ok(html.includes('content="index,follow"'), loc);
    assert.equal((html.match(/hrefLang="(en|zh-Hans|x-default)"/g) || html.match(/hreflang="(en|zh-Hans|x-default)"/g) || []).length >= 3, true, loc);
    const data = JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]);
    assert.equal(data.props.pageProps.lang, loc.startsWith('/zh/') ? 'zh' : 'en');
    const page = data.props.pageProps.page;
    if (page) {
      assert.equal(page.notes, undefined); assert.equal(page.sem_seed_for_zilliz, undefined);
      assert.equal(page.path, loc);
      for (const r of data.props.pageProps.related) assert.ok(html.includes(`href="${r.path}"`));
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
      assert.equal(graph.find(x => x['@type'] === 'FAQPage').mainEntity.length, page.faqs.length);
      for (const item of graph.find(x => x['@type'] === 'FAQPage').mainEntity) assert.ok(item.acceptedAnswer.text);
    }
    for (const m of html.matchAll(/(?:src|content)="(?:https:\/\/milvus.io)?(\/(?:images\/seo-landings|og)\/[^"?]+)"/g)) assets.add(m[1]);
    assert.ok(!html.includes('href="/lp/'), loc);
    console.log('SSR passed', loc);
  }
  for (const path of assets) await get(path);
  for (const path of ['/solutions/unknown-topic', '/fr/solutions/hybrid-search']) assert.equal((await fetch(base + path)).status, 404);
  assert.equal(pages.length, 24);
  console.log(JSON.stringify({ pages: pages.length, hubs: 4, assets: assets.size, status: 'passed' }));
})().catch(e => { console.error(e); process.exitCode = 1; });
