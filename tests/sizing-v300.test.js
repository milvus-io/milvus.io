const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const yaml = require('js-yaml');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
async function choose(p, current, next) {
  await p.getByRole('combobox').filter({ hasText: current }).click();
  await p.getByRole('option', { name: next, exact: true }).click();
}
async function download(p, name) {
  const ready = p.waitForEvent('download');
  await p.getByRole('button', { name, exact: true }).click();
  const d = await ready;
  expect(await d.failure()).toBeNull();
  return fs.readFile(await d.path(), 'utf8');
}
test('3.0 is selectable and sparse enablement reaches standalone and cluster exports', async ({ page: p }) => {
  await p.goto(BASE + '/tools/sizing');
  await choose(p, /^Milvus 2.6.x$/, 'Milvus 3.0.x');
  await expect(p).toHaveURL(/sizing-v300/);
  await choose(p, /Float32/, 'Sparse Float');
  const toggle = p.getByText('SINDI Compression (Milvus 3.0)', { exact: true }).locator('..').getByRole('switch');
  await toggle.click();
  await choose(p, /^1024 MB$/, '512 MB');
  const helm = yaml.load(await download(p, 'Helm Chart'));
  expect(helm.cluster.enabled).toBe(false);
  expect(helm.standalone.resources.limits.cpu).toBeGreaterThan(0);
  expect(helm.image.all.tag).toBe('v3.0.5');
  expect(helm.standalone.messageQueue).toBe('woodpecker');
  expect(helm.streaming.woodpecker.embedded).toBe(true);
  expect(yaml.load(helm.extraConfigFiles['user.yaml']).dataCoord).toEqual({ segment: { maxSize: 512 }, targetVecIndexVersion: 10 });
  const ip = await download(p, 'Download Sparse Index Script');
  expect(ip).toContain('"quant_type":"fp16"');
  expect(ip).toContain('"inverted_index_algo":"SINDI"');
  await p.getByRole('combobox', { name: 'Sparse Metric' }).selectOption('BM25');
  const bm25 = await download(p, 'Download Sparse Index Script');
  expect(bm25).toContain('metric_type="BM25"');
  expect(bm25).toContain('"quant_type":"u16"');
  await choose(p, /^Helm Chart$/, 'Milvus Operator');
  const standalone = yaml.load(await download(p, 'Milvus Operator'));
  expect(standalone.spec.mode).toBe('standalone');
  expect(standalone.spec.components.standalone.resources.limits.memory).toMatch(/Gi$/);
  expect(standalone.spec.dependencies.msgStreamType).toBe('woodpecker');
  await p.getByText('Distributed', { exact: true }).filter({ visible: true }).click();
  await choose(p, /^Helm Chart$/, 'Milvus Operator');
  const cluster = yaml.load(await download(p, 'Milvus Operator'));
  expect(cluster.spec.mode).toBe('cluster');
  expect(cluster.spec.components.image).toBe('milvusdb/milvus:v3.0.5');
  expect(cluster.spec.config.dataCoord.targetVecIndexVersion).toBe(10);
  expect(cluster.spec.components.streamingMode).toBe(true);
  expect(cluster.spec.components.mixCoord.replicas).toBe(1);
  expect(cluster.spec.components.indexNode).toBeUndefined();
  expect(cluster.spec.components.rootCoord).toBeUndefined();
  await toggle.click();
  const uncompressed = yaml.load(await download(p, 'Milvus Operator'));
  expect(uncompressed.spec.config.dataCoord.targetVecIndexVersion).toBeUndefined();
  expect(await download(p, 'Download Sparse Index Script')).not.toContain('"quant_type"');
});
test('2.6 and 2.5 never offer 3.0 sparse codec controls', async ({ page: p }) => {
  for (const path of ['/tools/sizing', '/tools/sizing-v250']) {
    await p.goto(BASE + path);
    await choose(p, /Float32/, 'Sparse Float');
    await expect(p.getByText('SINDI Compression (Milvus 3.0)', { exact: true })).toHaveCount(0);
    await expect(p.getByRole('button', { name: 'Download Sparse Index Script' })).toHaveCount(0);
  }
});
test('3.0 GPU profile exports the matching GPU image', async ({ page: p }) => {
  await p.goto(BASE + '/tools/sizing-v300?tab=gpu');
  await expect(p.getByRole('tab', { name: /GPU Sizing/ })).toHaveAttribute('aria-selected', 'true');
  const manifest = yaml.load(await download(p, 'Download Operator YAML'));
  expect(manifest.spec.components.image).toBe('milvusdb/milvus:v3.0.5-gpu');
  expect(manifest.spec.components.streamingMode).toBe(true);
  expect(manifest.spec.dependencies.msgStreamType).toBe('woodpecker');
});

test('localized 3.0 profile has the correct version and Chinese enablement help', async ({ page: p }) => {
  await p.goto(BASE + '/zh/tools/sizing-v300');
  await expect(p.getByRole('combobox').filter({ hasText: /^Milvus 3.0.x$/ })).toBeVisible();
  await choose(p, /Float32/, 'Sparse Float');
  await expect(p.getByRole('combobox', { name: '稀疏向量度量', exact: true })).toBeVisible();
  await expect(p.getByRole('button', { name: '下载稀疏索引脚本', exact: true })).toBeVisible();
});
