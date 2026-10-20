const assert = require('node:assert/strict');
const {
  publication,
  topics,
  loadPublishedFaqRows,
} = require('../src/server/ai-reference-catalog');
const base = process.env.REFERENCE_TEST_URL || 'http://127.0.0.1:8011';

async function get(path) {
  return fetch(base + path, {
    redirect: 'manual',
    signal: AbortSignal.timeout(90000),
  });
}

(async () => {
  const rows = await loadPublishedFaqRows();
  const demoRows = new Map(
    rows.filter(row => row.Demo).map(row => [row.URL, row])
  );
  const retained = Object.keys(publication).filter(
    slug => publication[slug].status === 'source-checked'
  );
  const api = await get('/api/ai-quick-reference');
  assert.equal(api.status, 200);
  const list = await api.json();
  assert.equal(list.total, retained.length);
  const pages = Math.ceil(list.total / list.pageSize);
  const allItems = [...list.list];
  for (let page = 2; page <= pages; page++) {
    const response = await get(`/api/ai-quick-reference?page=${page}`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.pageIndex, page);
    assert.equal(data.total, retained.length);
    allItems.push(...data.list);
    const rendered = await get(`/ai-quick-reference?page=${page}`);
    assert.equal(rendered.status, 200);
    const html = await rendered.text();
    const nextData = JSON.parse(
      html.match(
        /<script\b[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
      )[1]
    );
    assert.deepEqual(nextData.props.pageProps.list, data.list);
  }
  assert.deepEqual(
    allItems.map(item => item.url).sort(),
    retained.slice().sort()
  );

  for (const topic of topics) {
    const response = await get(`/api/ai-quick-reference?topic=${topic.id}`);
    const data = await response.json();
    assert.ok(data.list.length > 0);
    assert.ok(data.list.every(item => item.topic === topic.id));
  }
  assert.equal(
    (await get('/api/ai-quick-reference?topic=unknown')).status,
    400
  );
  assert.equal((await get('/ai-quick-reference?topic=unknown')).status, 404);
  const filtered = await (
    await get('/api/ai-quick-reference?topic=retrieval&keyword=hybrid')
  ).json();
  assert.equal(filtered.total, 1);

  for (const slug of retained) {
    const response = await get(`/ai-quick-reference/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    const canonical = (html.match(/<link\b[^>]*>/g) || []).filter(tag =>
      /rel="canonical"/.test(tag)
    );
    assert.equal(canonical.length, 1, slug);
    assert.ok(
      canonical[0].includes(`https://milvus.io/ai-quick-reference/${slug}`),
      slug
    );
    assert.ok(html.includes('Continue learning'), slug);
    assert.ok(html.includes('Implementation guides and sources'), slug);
    assert.ok(!html.includes(':contentReference[oaicite:'), slug);
    const nextData = JSON.parse(
      html.match(
        /<script\b[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
      )[1]
    );
    const props = nextData.props.pageProps;
    const demo = demoRows.get(slug);
    assert.equal(props.data.demo, demo?.Demo || '', slug);
    assert.equal(props.data.demoDescription, demo?.Demo_description || '', slug);
    if (demo) {
      const escapedDescription = demo.Demo_description.replace(
        /[&<>"']/g,
        char =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
          })[char]
      );
      assert.ok(html.includes(escapedDescription), slug);
    }
    assert.ok(
      props.recommendFaq.every(
        item => publication[item.url]?.status === 'source-checked'
      )
    );
    for (const path of [props.previousUrl, props.nextUrl].filter(Boolean)) {
      assert.ok(path.startsWith('/ai-quick-reference/'));
      assert.equal(
        publication[path.slice('/ai-quick-reference/'.length)]?.status,
        'source-checked'
      );
    }
  }
  let merged = 0;
  for (const [slug, record] of Object.entries(publication)) {
    if (record.status !== 'merged') continue;
    const response = await get(`/ai-quick-reference/${slug}`);
    assert.equal(response.status, 308, slug);
    assert.equal(
      response.headers.get('location'),
      `/ai-quick-reference/${record.target}`
    );
    merged++;
  }
  const retiredSamples = new Map();
  for (const [slug, record] of Object.entries(publication)) {
    if (record.status === 'retired' && !retiredSamples.has(record.reason))
      retiredSamples.set(record.reason, slug);
  }
  for (const slug of retiredSamples.values()) {
    assert.equal((await get(`/ai-quick-reference/${slug}`)).status, 404, slug);
  }
  assert.equal((await get('/assets/milvus-faq.csv')).status, 404);
  console.log(
    JSON.stringify({
      retained: retained.length,
      listPages: pages,
      merged,
      retiredSamples: retiredSamples.size,
      topicFilters: topics.length,
      legacyCsv: 404,
      demoPages: demoRows.size,
      status: 'passed',
    })
  );
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
