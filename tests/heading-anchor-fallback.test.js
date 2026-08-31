const { test, expect } = require('@playwright/test');

// Run against a local dev/preview server by default: `pnpm dev` then
// `pnpm test:anchors`. Point BASE_URL at any deployment to check it there.
const BASE = process.env.BASE_URL || 'http://localhost:8000';

// This page carries `## Upsert in merge mode | Milvus v2.6.2+`, whose id the
// docs pipeline renders with the badge marker baked in. See
// src/hooks/use-heading-anchor-fallback.ts for why that happens.
const PAGE = '/docs/upsert-entities.md';
const CLEAN_HASH = 'Upsert-in-merge-mode';
const BADGED_ID = 'Upsert-in-merge-mode--Milvus-v262+';

// A heading is "landed on" when it sits just below the sticky header rather
// than anywhere else in the viewport.
const expectLandedOn = async (page, id) => {
  const top = await page
    .locator(`[id="${id}"]`)
    .evaluate(el => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThan(0);
  expect(top).toBeLessThan(200);
};

test('a hash written without the badge lands on the badged heading', async ({
  page,
}) => {
  await page.goto(`${BASE}${PAGE}#${CLEAN_HASH}`);
  await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 });

  await expectLandedOn(page, BADGED_ID);
  // The address bar is normalised, so the link copied from here works alone.
  expect(decodeURIComponent(page.url())).toContain(`#${BADGED_ID}`);
});

test('a hash carrying a badge the heading no longer has still lands', async ({
  page,
}) => {
  // What a link shared before the id generator was fixed looks like once the
  // docs are regenerated without the badge in the id.
  await page.goto(`${BASE}${PAGE}#Overview--Milvus-v262%2B`);
  await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 });

  await expectLandedOn(page, 'Overview');
  expect(decodeURIComponent(page.url())).toContain('#Overview');
});

test('an exact hash is left to the browser', async ({ page }) => {
  await page.goto(`${BASE}${PAGE}#Overview`);
  await page.waitForTimeout(1200);

  await expectLandedOn(page, 'Overview');
  expect(decodeURIComponent(page.url())).toContain('#Overview');
});

test('a hash matching nothing scrolls nowhere', async ({ page }) => {
  await page.goto(`${BASE}${PAGE}#No-Such-Heading-At-All`);
  await page.waitForTimeout(1200);

  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect(page.url()).toContain('#No-Such-Heading-At-All');
});

test('an in-page anchor click resolves too', async ({ page }) => {
  await page.goto(BASE + PAGE);
  await page.waitForLoadState('networkidle');

  await page.evaluate(hash => {
    window.location.hash = hash;
  }, CLEAN_HASH);
  await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 });

  expect(decodeURIComponent(page.url())).toContain(`#${BADGED_ID}`);
});

test('still resolves after client-side navigation to another doc', async ({
  page,
}) => {
  await page.goto(BASE + PAGE);
  await page.waitForLoadState('networkidle');

  await page.evaluate(() =>
    window.next.router.push('/docs/insert-update-delete.md')
  );
  await page.waitForFunction(
    () => location.pathname.includes('insert-update-delete'),
    null,
    { timeout: 10000 }
  );

  await page.evaluate(() => {
    window.location.hash = 'Overview';
  });
  await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 });
  await expectLandedOn(page, 'Overview');
});
