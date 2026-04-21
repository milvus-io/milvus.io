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
    // Placeholder appears in both hero and final CTA (by design — they share copy
    // until the real CLI command is decided). Scope to the first occurrence.
    await expect(page.getByText(/⚠️ PLACEHOLDER/i).first()).toBeVisible();
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
    await expect(
      page.getByRole('heading', { level: 2, name: /Built for the Real Scale of AI/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Storage–Compute Disaggregation' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Billion-Scale at a Fraction of the Cost' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Multi-Tenant by Design' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Deploy Anywhere, Same API' })
    ).toBeVisible();
  });
});

test.describe('/index2 ecosystem', () => {
  test('renders all four category headers', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(
      page.getByRole('heading', { level: 3, name: 'Agent Frameworks' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Model APIs' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'RAG Stacks' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Eval & Observability' })
    ).toBeVisible();
  });
});

test.describe('/index2 production', () => {
  test('renders trusted-in-production heading and numbers strip', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    const heading = page.getByRole('heading', {
      level: 2,
      name: /Trusted in production/i,
    });
    await expect(heading).toBeVisible();
    // Scope stats to the production section (sibling of its heading) to avoid
    // collision with hero stats and the community card. Values are now pulled
    // live from global-stats.json so assert on the format not the exact number.
    const productionSection = page.locator('section').filter({ has: heading });
    await expect(
      productionSection.getByText(/^\d+M\+$/).first()
    ).toBeVisible();
    await expect(
      productionSection.getByText(/^\d+(\.\d+)?K$/).first()
    ).toBeVisible();
  });
});

test.describe('/index2 loved', () => {
  test('renders Loved by Developers and three authors', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(
      page.getByRole('heading', { level: 2, name: /Loved by GenAI developers/i })
    ).toBeVisible();
    await expect(page.getByText(/Nandula Asel/)).toBeVisible();
    await expect(page.getByText(/Bhargav Mankad/)).toBeVisible();
    await expect(page.getByText(/Igor Gorbenko/)).toBeVisible();
  });
});

test.describe('/index2 community', () => {
  test('renders community stats and meetups card', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(
      page.getByRole('heading', { level: 3, name: /Join the community/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: /Unstructured Data Meetups/i })
    ).toBeVisible();
  });
});

test.describe('/index2 final CTA', () => {
  test('renders three start paths', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(
      page.getByRole('heading', { level: 2, name: /Start building in minutes/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Python' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Cloud' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Docs' })
    ).toBeVisible();
  });
});
