const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
const input = (p, label) => p.getByText(label, { exact: true }).locator('..').locator('input:visible');
const bytes = text => {
  const match = text.match(/([\d.]+)\s*(GB|MB|KB|B)/);
  if (!match) throw new Error(`Missing memory value: ${text}`);
  return Number(match[1]) * 1024 ** ['B', 'KB', 'MB', 'GB'].indexOf(match[2]);
};
const value = (p, label) => p.getByText(label, { exact: true }).filter({ visible: true }).locator('..');
async function choose(p, current, next) {
  await p.getByRole('combobox').filter({ hasText: current }).click();
  await p.getByRole('option', { name: next, exact: true }).click();
}
async function download(p, button) {
  const ready = p.waitForEvent('download');
  await button.click();
  const result = await ready;
  expect(await result.failure()).toBeNull();
  return fs.readFile(await result.path(), 'utf8');
}
async function operator(p) {
  await choose(p, /^Helm Chart$/, 'Milvus Operator');
  return download(p, p.getByRole('button', { name: 'Milvus Operator', exact: true }));
}
for (const route of ['/tools/sizing', '/tools/sizing-v250']) {
  test(`${route}: minimum standalone totals and explicit mode survive recalculation`, async ({ page: p }) => {
    await p.goto(BASE + route);
    await input(p, 'Number of Vectors').fill('0.001');
    await input(p, 'Vector Dimension').fill('2');
    await expect(p.getByText('Standalone Node', { exact: true }).filter({ visible: true })).toBeVisible();
    await expect(p.locator('body')).not.toContainText(/NaN|Infinity/);
    await input(p, 'Number of Vectors').fill('20');
    await input(p, 'Vector Dimension').fill('768');
    await p.getByText('Standalone', { exact: true }).filter({ visible: true }).click();
    await input(p, 'Vector Dimension').fill('512');
    await expect(p.getByText('Standalone Node', { exact: true }).filter({ visible: true })).toBeVisible();
    await expect(p.locator('body')).not.toContainText(/NaN|Infinity/);
  });
}
test('v2.5 downloads Operator cluster YAML with valid mode and Pulsar/Kafka values', async ({ page: p }) => {
  await p.goto(BASE + '/tools/sizing-v250');
  await p.getByText('Distributed', { exact: true }).filter({ visible: true }).click();
  const pulsar = await operator(p);
  expect(pulsar).toContain('mode: cluster');
  expect(pulsar).toContain('msgStreamType: pulsar');
  expect(pulsar).not.toMatch(/pulsarv3|NaN|Infinity/);
  await p.getByText('Kafka', { exact: true }).first().click();
  const kafka = await download(p, p.getByRole('button', { name: 'Milvus Operator', exact: true }));
  expect(kafka).toContain('msgStreamType: kafka');
  expect(kafka).toContain('mode: cluster');
  expect(kafka).not.toMatch(/pulsarv3|NaN|Infinity/);
});
test('precision and sparse NNZ affect displayed footprint; SINDI only reduces loading memory', async ({ page: p }) => {
  await p.goto(BASE + '/tools/sizing');
  const raw = value(p, 'Raw Data Size:');
  await expect(raw).toContainText('2.9 GB');
  await choose(p, /Float32/, 'Float16 (FP16)');
  await expect(raw).toContainText('1.4 GB');
  await choose(p, /Float16/, 'BFloat16 (BF16)');
  await expect(raw).toContainText('1.4 GB');
  await choose(p, /BFloat16/, 'Int8');
  await expect(raw).toContainText('732.4 MB');
  await choose(p, /^Int8$/, 'Sparse Float');
  await expect(raw).toContainText('762.9 MB');
  await input(p, 'Average Non-zero Dimensions (avg_nnz)').fill('5000');
  await expect(raw).toContainText('37.3 GB');
  const memory = value(p, 'Loading Memory:');
  const before = await memory.innerText();
  await p.getByText('SINDI Compression (Milvus 3.0)', { exact: true }).locator('..').getByRole('switch').click();
  await expect.poll(async () => bytes(await memory.innerText())).toBeLessThan(bytes(before));
  await expect(raw).toContainText('37.3 GB');
  await p.getByText('Distributed', { exact: true }).filter({ visible: true }).click();
  await p.getByRole('tab', { name: /woodpecker/i }).click();
  const yaml = await operator(p);
  expect(yaml).toContain('streamingNode:');
  expect(yaml).toContain('woodpecker');
  expect(yaml).toContain('msgStreamType: woodpecker');
  expect(yaml).not.toContain('sizeMetric: mainIndex');
  expect(yaml).not.toMatch(/NaN|Infinity/);
});
test('GPU CAGRA estimates VRAM, reacts to graph degree, and downloads GPU Operator YAML', async ({ page: p }) => {
  await p.goto(BASE + '/tools/sizing');
  await p.getByRole('tab', { name: /GPU Sizing/ }).click();
  await choose(p, /^GPU_BRUTE_FORCE$/, 'GPU_CAGRA');
  const cagra = p.getByRole('combobox').filter({ hasText: 'GPU_CAGRA' });
  await expect(cagra).toBeVisible();
  const memory = value(p, 'GPU Memory');
  const before = await memory.innerText();
  await input(p, 'graph_degree').fill('128');
  await expect(memory).not.toHaveText(before);
  await expect(p.locator('body')).not.toContainText(/NaN|Infinity/);
  const yaml = await download(p, p.getByRole('button', { name: 'Download Operator YAML' }));
  expect(yaml).toContain('mode: standalone');
  expect(yaml).toContain('milvusdb/milvus:v2.6.25-gpu');
  expect(yaml).toContain('nvidia.com/gpu: "1"');
  expect(yaml).toContain('initMemSize: 2048');
  expect(yaml).toContain('maxMemSize: 4096');
  await p.getByText('Distributed', { exact: true }).filter({ visible: true }).click();
  const cluster = await download(p, p.getByRole('button', { name: 'Download Operator YAML' }));
  expect(cluster).toContain('mode: cluster');
  expect(cluster).toContain('queryNode:');
  expect(cluster).toContain('dataNode:');
  expect(cluster.match(/nvidia.com\/gpu:/g)).toHaveLength(2);
  expect(cluster).not.toMatch(/NaN|Infinity/);
});
