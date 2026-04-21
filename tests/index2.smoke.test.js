const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.INDEX2_BASE_URL || 'http://localhost:8000';

test.describe('/index2 shell', () => {
  test('page loads with correct title and noindex meta', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page).toHaveTitle(/Vector Database That Powers AI/);
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robots).toContain('noindex');
  });
});

test.describe('/index2 hero', () => {
  test('renders headline, subtitle, and primary CTA placeholder', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(
      page.getByRole('heading', { level: 1, name: /Vector Database That Powers AI/i })
    ).toBeVisible();
    await expect(page.getByText(/hybrid search, built-in embeddings/i)).toBeVisible();
    await expect(page.getByText(/⚠️ PLACEHOLDER/i)).toBeVisible();
    await expect(page.locator('img[alt*="Attu"]').first()).toBeVisible();
  });
});
