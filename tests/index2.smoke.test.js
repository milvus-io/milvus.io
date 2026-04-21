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

test.describe('/index2 capability pillars', () => {
  test('renders all four pillar titles', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    // Use heading-level queries to avoid collision with hero subtitle copy
    // (the hero subtitle mentions "hybrid search, built-in embeddings").
    await expect(
      page.getByRole('heading', { level: 3, name: 'Hybrid Search, Built-in' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Embeddings Without the Pipeline' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Memory That Scales With Your Agent' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'MCP-Native' })
    ).toBeVisible();
  });
});

test.describe('/index2 code walkthrough', () => {
  test('renders tab labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByRole('tab', { name: /Add Memory/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Semantic Recall/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Multi-tenant/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Serve as MCP Server/i })).toBeVisible();
  });
});

test.describe('/index2 architecture', () => {
  test('renders architecture header and pillars', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText(/Built for the Real Scale of AI/i)).toBeVisible();
    await expect(page.getByText(/Storage–Compute Disaggregation/)).toBeVisible();
    await expect(page.getByText(/Billion-Scale at a Fraction of the Cost/)).toBeVisible();
    await expect(page.getByText(/Multi-Tenant by Design/)).toBeVisible();
    await expect(page.getByText(/Deploy Anywhere, Same API/)).toBeVisible();
  });
});
