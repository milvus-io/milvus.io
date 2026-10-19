const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const {
  publication,
  contentHash,
  validateRows,
  loadPublishedFaqRows,
  selectRelated,
} = require('../src/server/ai-reference-catalog');

function fixture(
  answer = 'A useful explanation. [Source](https://milvus.io/docs/quickstart.md)'
) {
  const row = {
    URL: 'concept',
    Questions: 'What is a vector?',
    Answers: answer,
    Tag: 'foundations',
  };
  const catalog = {
    concept: {
      status: 'source-checked',
      topic: 'foundations',
      checkedAt: '2026-10-20',
      sources: ['https://milvus.io/docs/quickstart.md'],
      sha256: contentHash(row),
    },
  };
  return { row, catalog };
}

test('the complete catalog publishes only the curated source-checked concepts', async () => {
  const rows = await loadPublishedFaqRows();
  assert.equal(rows.length, 36);
  assert.equal(new Set(rows.map(row => row.URL)).size, rows.length);
  assert.equal(
    rows[0].URL,
    'what-is-a-vector-database-and-why-is-it-important'
  );
  assert.ok(
    rows.every(row => publication[row.URL].status === 'source-checked')
  );
  assert.equal(fs.existsSync('public/assets/milvus-faq.csv'), false);
});

test('unreviewed, retired, and changed content cannot enter the catalog', () => {
  const { row, catalog } = fixture();
  assert.throws(() => validateRows([row], {}), /Unapproved/);
  assert.throws(
    () => validateRows([row], { concept: { status: 'retired' } }),
    /retired/
  );
  assert.throws(
    () =>
      validateRows(
        [{ ...row, Answers: row.Answers + ' unsupported claim' }],
        catalog
      ),
    /without review/
  );
  assert.throws(() => validateRows([], catalog), /missing from content/);
});

test('empty content, duplicate URLs, and generated citation artifacts fail validation', () => {
  const { row, catalog } = fixture();
  assert.throws(
    () => validateRows([{ ...row, Answers: '' }], catalog),
    /Empty/
  );
  assert.throws(() => validateRows([row, row], catalog), /Duplicate/);
  const bad = fixture(
    'Claim :contentReference[oaicite:1]. [Source](https://milvus.io/docs/quickstart.md)'
  );
  assert.throws(() => validateRows([bad.row], bad.catalog), /Unresolved/);
});

test('a source-check record requires visible source evidence', () => {
  const { row, catalog } = fixture();
  catalog.concept.sources = ['https://milvus.io/docs/not-cited.md'];
  assert.throws(() => validateRows([row], catalog), /source evidence/);
});

test('internal references and merge targets must resolve directly to published concepts', () => {
  const { row, catalog } = fixture(
    '[Retired](/ai-quick-reference/old) [Source](https://milvus.io/docs/quickstart.md)'
  );
  catalog.old = { status: 'retired' };
  assert.throws(() => validateRows([row], catalog), /non-canonical/);
  const valid = fixture();
  valid.catalog.old = { status: 'merged', target: 'missing' };
  assert.throws(() => validateRows([valid.row], valid.catalog), /merge target/);
});

test('sitemap and serving catalog contain exactly the same retained URLs', async () => {
  const rows = await loadPublishedFaqRows();
  const paths = await require('../sitemap.config').additionalPaths({});
  assert.deepEqual(
    paths
      .filter(item => item.loc.startsWith('/ai-quick-reference/'))
      .map(item => item.loc)
      .sort(),
    rows.map(row => `/ai-quick-reference/${row.URL}`).sort()
  );
  assert.ok(
    !paths.some(item =>
      item.loc.endsWith('/what-are-the-token-limits-for-claude-code')
    )
  );
});

test('related links follow the article reading path without self-links or retired targets', async () => {
  const rows = await loadPublishedFaqRows();
  const items = rows.map(row => ({ url: row.URL, topic: row.Tag }));
  for (const item of items) {
    const links = selectRelated(items, item.url, item.topic);
    assert.ok(links.length >= 2 && links.length <= 4);
    assert.ok(
      links.every(
        link =>
          link.url !== item.url &&
          publication[link.url].status === 'source-checked'
      )
    );
  }
});
