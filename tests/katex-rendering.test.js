const { test, expect } = require('@playwright/test');

const BASE = process.env.BLOG_TEST_BASE_URL || 'http://127.0.0.1:8000';

test('blog superscripts and subscripts use the bundled KaTeX styles', async ({ page }) => {
  // Formula rendering must not depend on the unversioned CDN stylesheet.
  await page.route('https://assets.zilliz.com/katex/**', route => route.abort());
  await page.goto(`${BASE}/blog/a-brief-introduction-to-the-scann-index.md`);

  const formula = page.locator('.katex-display .katex');
  await expect(formula).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  const metrics = await formula.evaluate(element => {
    const rootSize = parseFloat(getComputedStyle(element).fontSize);
    const scripts = Array.from(element.querySelectorAll('.katex-html .msupsub .mord'))
      .filter(node => node.children.length === 0)
      .map(node => ({
        text: node.textContent,
        ratio: parseFloat(getComputedStyle(node).fontSize) / rootSize,
      }));
    return {
      scripts,
      mathmlPosition: getComputedStyle(element.querySelector('.katex-mathml')).position,
    };
  });

  // The real article includes both x_i and squared norms. A CSS/renderer
  // version mismatch leaves these scripts at the full formula font size.
  for (const symbol of ['i', '2']) {
    const scripts = metrics.scripts.filter(script => script.text === symbol);
    expect(scripts.length).toBeGreaterThan(0);
    for (const script of scripts) {
      expect(script.ratio).toBeCloseTo(0.7, 2);
    }
  }
  expect(metrics.mathmlPosition).toBe('absolute');
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await expect(page.locator('link[href*="assets.zilliz.com/katex/"]')).toHaveCount(0);
});
