const { test, expect } = require('@playwright/test');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
const rangeInput = (page, label) => page.getByText(label, { exact: true }).locator('..').locator('input:visible');

for (const route of ['/tools/sizing', '/tools/sizing-v250']) {
  test(`${route}: vector switching preserves independent NNZ/dimension values and binary constraints`, async ({ page }) => {
    await page.goto(`${BASE}${route}`);
    const vectorSelect = page.getByRole('combobox').filter({ hasText: /Float32|Sparse Float|Binary/ });
    await vectorSelect.click();
    await page.getByRole('option', { name: 'Sparse Float', exact: true }).click();
    await expect(rangeInput(page, 'Average Non-zero Dimensions (avg_nnz)')).toHaveValue('100');
    await rangeInput(page, 'Average Non-zero Dimensions (avg_nnz)').fill('200');
    await rangeInput(page, 'Average Non-zero Dimensions (avg_nnz)').blur();
    await vectorSelect.click();
    await page.getByRole('option', { name: 'Float32 (FP32)', exact: true }).click();
    await expect(rangeInput(page, 'Vector Dimension')).toHaveValue('768');
    await vectorSelect.click();
    await page.getByRole('option', { name: 'Sparse Float', exact: true }).click();
    await expect(rangeInput(page, 'Average Non-zero Dimensions (avg_nnz)')).toHaveValue('200');
    await vectorSelect.click();
    await page.getByRole('option', { name: 'Binary', exact: true }).click();
    await rangeInput(page, 'Vector Dimension').fill('127');
    await rangeInput(page, 'Vector Dimension').blur();
    await expect(rangeInput(page, 'Vector Dimension')).toHaveValue('128');
    await page.getByRole('combobox').filter({ hasText: /^BIN_FLAT$/ }).click();
    await expect(page.getByRole('option', { name: 'BIN_IVF_FLAT', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'IVF_FLAT', exact: true })).toHaveCount(0);
    await page.getByRole('option', { name: 'BIN_IVF_FLAT', exact: true }).click();
    await expect(page.getByText('nlist', { exact: true })).toBeVisible();
  });
}

test('keyboard entry preserves drafts before numeric and Binary normalization', async ({ page }) => {
  await page.goto(`${BASE}/tools/sizing`);
  const count = rangeInput(page, 'Number of Vectors');
  await count.fill('');
  await expect(count).toHaveValue('');
  await count.pressSequentially('0.125');
  await expect(count).toHaveValue('0.125');
  await count.blur();
  await expect(count).toHaveValue('0.125');
  await page.getByRole('combobox').filter({ hasText: /Float32/ }).click();
  await page.getByRole('option', { name: 'Binary', exact: true }).click();
  const dimension = rangeInput(page, 'Vector Dimension');
  await dimension.fill('');
  await dimension.pressSequentially('127');
  await expect(dimension).toHaveValue('127');
  await dimension.blur();
  await expect(dimension).toHaveValue('128');
});
