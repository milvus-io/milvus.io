const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.INDEX2_BASE_URL || 'http://localhost:8000';

test.describe('/index2 shell', () => {
  test('page loads with correct title and noindex meta', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page).toHaveTitle(/Milvus/);
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robots).toContain('noindex');
  });
});
