// Run the same HTTP acceptance against localhost, preview or production.
// REFERENCE_TEST_SCOPE=retired checks only removed endpoints when a local
// checkout has no docs/blog submodules. The default also verifies live pages,
// landing links, llms.txt and every child sitemap.
const assert = require('node:assert/strict');

const base = new URL(process.env.REFERENCE_TEST_URL || 'http://127.0.0.1:8033');
const scope = process.env.REFERENCE_TEST_SCOPE || 'all';
assert.ok(['all', 'retired'].includes(scope), 'REFERENCE_TEST_SCOPE must be all or retired');
const timeout = Number(process.env.REFERENCE_REQUEST_TIMEOUT_MS || 30000);
const retiredLink = /(?:ai-quick-reference|\/images\/ai-reference|milvus-faq\.csv)/i;
const agents = [
  { name: 'playwright', ua: 'Playwright-Test/1.0', cookies: '' },
  { name: 'googlebot-zh', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', cookies: 'lang=zh' },
  { name: 'chrome-en', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', cookies: 'lang=en' },
  { name: 'chrome-fr', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', cookies: 'lang=fr' },
];
let requests = 0;

async function request(path, method = 'GET', agent = agents[0]) {
  let url = new URL(path, base);
  const history = [];
  const cookies = new Map(agent.cookies.split(';').filter(Boolean).map(item => item.trim().split('=')));
  for (let redirects = 0; redirects <= 8; redirects++) {
    assert.equal(url.origin, base.origin, 'acceptance must stay on the requested environment');
    const response = await fetch(url, {
      method, redirect: 'manual', signal: AbortSignal.timeout(timeout),
      headers: {
        'User-Agent': agent.ua, 'Accept-Language': 'en-US,en;q=0.9',
        Cookie: [...cookies].map(([key, value]) => key + '=' + value).join('; '),
      },
    });
    requests++;
    for (const value of response.headers.getSetCookie()) {
      const pair = value.split(';')[0];
      const equals = pair.indexOf('=');
      if (equals > 0) cookies.set(pair.slice(0, equals), pair.slice(equals + 1));
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      assert.ok(location, method + ' ' + path + ': redirect without location');
      await response.arrayBuffer();
      const target = new URL(location, url);
      history.push({ from: url.href, to: target.href, status: response.status });
      url = target;
      continue;
    }
    return { response, body: await response.text(), redirects, history };
  }
  throw new Error(method + ' ' + path + ': too many redirects');
}

async function retired(path, agent) {
  for (const method of ['GET', 'HEAD']) {
    const { response, body, history } = await request(path, method, agent);
    const label = agent.name + ' ' + method + ' ' + path;
    assert.equal(response.status, 410, label);
    for (const hop of history) {
      const from = new URL(hop.from), to = new URL(hop.to);
      // Next's default slash normalization precedes middleware locally.
      // A retirement must never enter locale redirects or cookie challenges.
      assert.ok([301, 308].includes(hop.status) && from.pathname.endsWith('/') &&
        to.pathname === from.pathname.slice(0, -1) && to.search === from.search,
      label + ': unexpected redirect before retirement');
    }
    assert.match(response.headers.get('x-robots-tag') || '', /\bnoindex\b/i, label);
    assert.equal(response.headers.get('location'), null, label);
    if (method === 'HEAD') assert.equal(body, '', label + ': HEAD must have no response body');
  }
}

async function healthy(path) {
  const { response, body } = await request(path);
  assert.equal(response.status, 200, path);
  assert.equal(retiredLink.test(body), false, path + ': still advertises the removed collection');
  console.log('healthy', path);
  return body;
}

async function sitemaps() {
  const queue = ['/sitemap.xml'];
  const visited = new Set();
  while (queue.length) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);
    assert.ok(visited.size <= 100, 'unexpectedly many child sitemaps');
    const xml = await healthy(path);
    if (/<sitemapindex\b/i.test(xml)) {
      for (const match of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
        const child = new URL(match[1].trim().replace(/&amp;/g, '&'), base);
        // Sitemap URLs are canonical production URLs even on preview; request
        // their paths from the selected environment instead of contacting prod.
        assert.ok(/^\/sitemap[^/]*\.xml$/.test(child.pathname), 'unexpected sitemap path ' + child.pathname);
        queue.push(child.pathname + child.search);
      }
    }
  }
  return visited.size;
}

(async () => {
  let buildId;
  if (scope === 'all') {
    const home = await healthy('/');
    buildId = home.match(/"buildId":"([^"]+)"/)?.[1];
    assert.ok(buildId, 'homepage must expose the served Next build ID');
  }
  const paths = [
    '/ai-quick-reference', '/ai-quick-reference/', '/ai-quick-reference?topic=retrieval&page=2',
    '/ai-quick-reference?keyword=hybrid', '/ai-quick-reference/agentic-search',
    '/ai-quick-reference/a-legacy-article.md', '/fr/ai-quick-reference/agentic-search',
    '/zh-hant/ai-quick-reference', '/api/ai-quick-reference?page=999',
    '/zh/api/ai-quick-reference?keyword=search', '/images/ai-reference/agentic-search.svg',
    '/zh/images/ai-reference/agentic-search.svg', '/assets/milvus-faq.csv',
    '/_next/data/' + (buildId || 'old-build-id') + '/ai-quick-reference.json',
    '/_next/data/' + (buildId || 'old-build-id') + '/ai-quick-reference/agentic-search.json',
    '/_next/data/' + (buildId || 'old-build-id') + '/zh/ai-quick-reference/agentic-search.json',
  ];
  for (const agent of agents) {
    for (let index = 0; index < paths.length; index += 4) {
      await Promise.all(paths.slice(index, index + 4).map(path => retired(path, agent)));
    }
    console.log('retirement GET/HEAD passed', agent.name, paths.length, 'paths');
  }
  let sitemapCount = 0;
  if (scope === 'all') {
    for (const path of [
      '/docs/quickstart.md', '/learn-ai-and-vectordb', '/solutions', '/compare',
      '/solutions/hybrid-search', '/compare/milvus-vs-pgvector',
      '/zh/solutions', '/zh/compare', '/llms.txt',
    ]) await healthy(path);
    sitemapCount = await sitemaps();
  }
  console.log(JSON.stringify({ status: 'passed', base: base.origin, scope, buildId, retiredPaths: paths.length, agents: agents.length, sitemapCount, requests }));
})().catch(error => { console.error(error); process.exitCode = 1; });
