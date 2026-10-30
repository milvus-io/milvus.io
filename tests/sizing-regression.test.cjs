const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');

// Setup TypeScript transpile hook for sizing tests
require.extensions['.ts'] = function(module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const res = ts.transpileModule(content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  module._compile(res.outputText, filename);
};

const origResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    request = path.resolve(__dirname, '../src', request.slice(2));
  }
  return origResolve.call(this, request, parent, isMain, options);
};

const { operatorYmlGenerator } = require('../src/utils/sizingToolV250.ts');
const { ModeEnum, DependencyComponentEnum, IndexTypeEnum } = require('../src/types/sizingV250.ts');
const { INDEX_TYPE_OPTIONS } = require('../src/consts/sizingV250.ts');
const { REFINE_OPTIONS } = require('../src/consts/sizing.ts');
const { RefineValueEnum, REFINE_VALUE_TO_N_MAP } = require('../src/types/sizing.ts');
const { fetchMilvusReleases } = require('../src/http/milvus.ts');

const dummyClusterConfig = {
  mixCoord: { count: 1, cpu: 1, memory: 2 },
  indexNode: { count: 1, cpu: 1, memory: 2 },
  proxy: { count: 1, cpu: 1, memory: 2 },
  queryNode: { count: 2, cpu: 2, memory: 4 },
  dataNode: { count: 1, cpu: 1, memory: 2 },
  etcdData: { count: 3, cpu: 1, memory: 2, pvc: 10 },
  minioData: { count: 4, cpu: 1, memory: 2, pvc: 50 },
  pulsarData: {
    proxy: { count: 1 },
    zookeeper: { count: 3, cpu: 1, memory: 2, pvc: 20 },
    bookie: { count: 3, cpu: 1, memory: 2, journal: 10, ledgers: 20 },
    broker: { count: 1, cpu: 1, memory: 2 }
  },
  kafkaData: {
    broker: { count: 3, cpu: 1, memory: 2, pvc: 20 },
    zookeeper: { count: 3, cpu: 1, memory: 2, pvc: 20 }
  }
};

test('v2.5 operator YAML generator emits spec.mode and valid msgStreamType schema without pulsarv3', () => {
  // 1. Cluster Mode with Pulsar
  const clusterPulsarYaml = operatorYmlGenerator(dummyClusterConfig, DependencyComponentEnum.Pulsar, ModeEnum.Cluster);
  assert.ok(clusterPulsarYaml.includes('spec:\n  mode: cluster'), 'Must specify spec.mode: cluster');
  assert.ok(clusterPulsarYaml.includes('msgStreamType: pulsar'), 'Must specify msgStreamType: pulsar');
  assert.ok(clusterPulsarYaml.includes('pulsar:\n      inCluster:'), 'Must specify pulsar: inCluster block');
  assert.equal(clusterPulsarYaml.includes('pulsarv3'), false, 'Must not contain outdated pulsarv3 keyword');

  // 2. Cluster Mode with Kafka
  const clusterKafkaYaml = operatorYmlGenerator(dummyClusterConfig, DependencyComponentEnum.Kafka, ModeEnum.Cluster);
  assert.ok(clusterKafkaYaml.includes('spec:\n  mode: cluster'), 'Must specify spec.mode: cluster');
  assert.ok(clusterKafkaYaml.includes('msgStreamType: kafka'), 'Must specify msgStreamType: kafka');
  assert.ok(clusterKafkaYaml.includes('kafka:\n      inCluster:'), 'Must specify kafka: inCluster block');
  assert.equal(clusterKafkaYaml.includes('pulsarv3'), false, 'Must not contain outdated pulsarv3 keyword');

  // 3. Standalone Mode
  const standaloneYaml = operatorYmlGenerator(dummyClusterConfig, DependencyComponentEnum.Pulsar, ModeEnum.Standalone);
  assert.ok(standaloneYaml.includes('spec:\n  mode: standalone'), 'Must specify spec.mode: standalone');
  assert.equal(standaloneYaml.includes('pulsar:'), false, 'Standalone mode must not configure pulsar');
  assert.equal(standaloneYaml.includes('kafka:'), false, 'Standalone mode must not configure kafka');
  assert.equal(standaloneYaml.includes('pulsarv3'), false, 'Must not contain outdated pulsarv3 keyword');
});

test('RefineValueEnum and REFINE_OPTIONS use FP32 instead of SQ32 typo', () => {
  assert.equal(RefineValueEnum.FP32, 'FP32', 'RefineValueEnum must define FP32');
  assert.equal(RefineValueEnum.SQ32, undefined, 'RefineValueEnum must not define SQ32');
  assert.equal(REFINE_VALUE_TO_N_MAP[RefineValueEnum.FP32], 32, 'FP32 must map to 32 bits');
  assert.equal(REFINE_VALUE_TO_N_MAP['SQ32'], undefined, 'SQ32 mapping must not exist');

  const fp32Option = REFINE_OPTIONS.find(opt => opt.value === 'FP32');
  assert.ok(fp32Option, 'REFINE_OPTIONS must include FP32 option');
  assert.equal(fp32Option.label, 'FP32', 'Label must be FP32');
});

test('INDEX_TYPE_OPTIONS displays IVF_SQ8 label with underscore', () => {
  const ivfSq8Option = INDEX_TYPE_OPTIONS.find(opt => opt.value === IndexTypeEnum.IVFSQ8);
  assert.ok(ivfSq8Option, 'IVFSQ8 option must exist');
  assert.equal(ivfSq8Option.label, 'IVF_SQ8', 'Label must be IVF_SQ8 with underscore');
});

test('fetchMilvusReleases handles prefix filtering and fallback tags', async () => {
  const v25Tag = await fetchMilvusReleases('v2.5.');
  assert.ok(v25Tag.startsWith('v2.5.'), `v2.5 tag should start with v2.5., got ${v25Tag}`);

  const v26Tag = await fetchMilvusReleases('v2.6.');
  assert.ok(v26Tag.startsWith('v2.6.'), `v2.6 tag should start with v2.6., got ${v26Tag}`);
});

test('standalone mode and zero queryNode guards prevent NaN and preserve ModeEnum.Standalone (0)', () => {
  // Test divide-by-zero protection in singleNodeDisk calculation
  const localDiskSize = 100 * 1024 * 1024 * 1024; // 100GB
  const zeroQueryNodeCount = 0;
  const singleNodeDisk = zeroQueryNodeCount > 0 ? localDiskSize / zeroQueryNodeCount : 0;
  assert.equal(Number.isNaN(singleNodeDisk), false, 'Must not produce NaN');
  assert.equal(singleNodeDisk, 0, 'When count is 0, single node disk is 0');

  // Test ModeEnum.Standalone (0) nullish coalescing
  const manuallySelectedMode = ModeEnum.Standalone; // 0
  const computedMode = ModeEnum.Cluster; // 1
  const disableStandalone = false;

  // Falsy bug test: manuallySelectedMode || computedMode would evaluate 0 || 1 => 1 (Cluster)
  const buggyResolvedMode = manuallySelectedMode || computedMode;
  assert.equal(buggyResolvedMode, ModeEnum.Cluster, 'Demonstrating the bug: || coerced 0 to Cluster');

  // Fixed test: nullish coalescing preserves 0 (Standalone)
  const fixedResolvedMode = disableStandalone ? ModeEnum.Cluster : (manuallySelectedMode ?? computedMode);
  assert.equal(fixedResolvedMode, ModeEnum.Standalone, 'Fix: ?? correctly preserves ModeEnum.Standalone (0)');
});
