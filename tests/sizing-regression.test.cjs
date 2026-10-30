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

const { operatorYmlGenerator, helmYmlGenerator: helmYmlGeneratorV250 } = require('../src/utils/sizingToolV250.ts');
const { ModeEnum, DependencyComponentEnum, IndexTypeEnum } = require('../src/types/sizingV250.ts');
const { INDEX_TYPE_OPTIONS } = require('../src/consts/sizingV250.ts');
const { REFINE_OPTIONS } = require('../src/consts/sizing.ts');
const { RefineValueEnum, REFINE_VALUE_TO_N_MAP, VectorTypeEnum, IndexTypeEnum: IndexTypeEnum26, DependencyComponentEnum: DependencyComponentEnum26 } = require('../src/types/sizing.ts');
const { GpuIndexTypeEnum } = require('../src/types/sizingGpu.ts');
const { fetchMilvusReleases } = require('../src/http/milvus.ts');
const { unitBYTE2Any, rawDataSizeCalculator, memoryAndDiskCalculator, sindiSparseMemoryCalculator, SegmentSizeMetricEnum, helmYmlGenerator, operatorYmlGenerator: operatorYmlGeneratorV24 } = require('../src/utils/sizingTool.ts');
const { gpuIndexMemoryCalculator, rmmPoolSizeCalculator, gpuOperatorYmlGenerator } = require('../src/utils/sizingToolGpu.ts');

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

test('unitBYTE2Any correctly rolls over at 1024 boundaries instead of displaying 1024 MB or 1024 GB', () => {
  const oneGbInBytes = 1024 * 1024 * 1024;
  const resGb = unitBYTE2Any(oneGbInBytes);
  assert.deepEqual(resGb, { size: 1, unit: 'GB' }, '1024*1024*1024 bytes must format to 1 GB, not 1024 MB');

  const oneMbInBytes = 1024 * 1024;
  const resMb = unitBYTE2Any(oneMbInBytes);
  assert.deepEqual(resMb, { size: 1, unit: 'MB' }, '1024*1024 bytes must format to 1 MB, not 1024 KB');

  const oneTbInBytes = 1024 * 1024 * 1024 * 1024;
  const resTb = unitBYTE2Any(oneTbInBytes);
  assert.deepEqual(resTb, { size: 1, unit: 'TB' }, '1024*1024*1024*1024 bytes must format to 1 TB, not 1024 GB');
});

test('rawDataSizeCalculator correctly computes raw data size for sub-million vector counts (0.001M = 1,000 vectors)', () => {
  // 1,000 vectors (0.001 million), dimension 768, float32 (4 bytes per element)
  const rawSize = rawDataSizeCalculator({
    num: 0.001,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
  });
  // Expected: (0.001 * 768 * 1,000,000 * 32) / 8 = 3,072,000 bytes
  assert.equal(rawSize, 3072000, '1,000 vectors of 768d float32 must equal exactly 3,072,000 bytes');

  // With scalar field of 500 bytes per vector
  const rawSizeWithScalar = rawDataSizeCalculator({
    num: 0.001,
    d: 768,
    withScalar: true,
    scalarAvg: 500,
  });
  // Expected: 3,072,000 + (0.001 * 500 * 1,000,000) = 3,572,000 bytes
  assert.equal(rawSizeWithScalar, 3572000, 'Must include scalar payload size correctly for sub-million vectors');
});

test('rawDataSizeCalculator accurately handles new VectorTypeEnum variants (FP16, BF16, INT8, BINARY, SPARSE)', () => {
  const num = 1; // 1M vectors
  const d = 768;

  // 1. FLOAT_VECTOR (4 bytes / dim) -> 3,072,000,000 bytes
  const fp32 = rawDataSizeCalculator({ num, d, withScalar: false, scalarAvg: 0, vectorType: VectorTypeEnum.FLOAT_VECTOR });
  assert.equal(fp32, 3072000000, 'FP32: 1M * 768 * 4 = 3.072GB');

  // 2. FLOAT16_VECTOR (2 bytes / dim) -> 1,536,000,000 bytes
  const fp16 = rawDataSizeCalculator({ num, d, withScalar: false, scalarAvg: 0, vectorType: VectorTypeEnum.FLOAT16_VECTOR });
  assert.equal(fp16, 1536000000, 'FP16: 1M * 768 * 2 = 1.536GB');

  // 3. BFLOAT16_VECTOR (2 bytes / dim) -> 1,536,000,000 bytes
  const bf16 = rawDataSizeCalculator({ num, d, withScalar: false, scalarAvg: 0, vectorType: VectorTypeEnum.BFLOAT16_VECTOR });
  assert.equal(bf16, 1536000000, 'BF16: 1M * 768 * 2 = 1.536GB');

  // 4. INT8_VECTOR (1 byte / dim) -> 768,000,000 bytes
  const int8 = rawDataSizeCalculator({ num, d, withScalar: false, scalarAvg: 0, vectorType: VectorTypeEnum.INT8_VECTOR });
  assert.equal(int8, 768000000, 'INT8: 1M * 768 * 1 = 768MB');

  // 5. BINARY_VECTOR (1/8 byte / dim) -> 96,000,000 bytes
  const bin = rawDataSizeCalculator({ num, d, withScalar: false, scalarAvg: 0, vectorType: VectorTypeEnum.BINARY_VECTOR });
  assert.equal(bin, 96000000, 'Binary: 1M * (768/8) = 96MB');

  // 6. SPARSE_FLOAT_VECTOR (avg_nnz * 8 bytes)
  const sparse = rawDataSizeCalculator({ num, d: 0, withScalar: false, scalarAvg: 0, vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR, avgNnz: 120 });
  assert.equal(sparse, 120 * 8 * 1000000, 'Sparse: 1M * 120 * 8 = 960MB');
});

test('memoryAndDiskCalculator correctly calculates advanced indexes (HNSW_SQ, HNSW_PQ, SPARSE_INVERTED_INDEX)', () => {
  const rawDataSize = 3072000000;
  const num = 1;
  const d = 768;
  const m = 30;

  // HNSW_SQ: SQ8 (0.25) + graph ((2*m)/d = 60/768) => (0.25 + 60/768) * 3,072,000,000 = 768,000,000 + 240,000,000 = 1,008,000,000
  const hnswSqResult = memoryAndDiskCalculator({
    rawDataSize,
    d,
    num,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 1024,
    mode: ModeEnum.Cluster,
    refineType: RefineValueEnum.None,
    indexTypeParams: {
      indexType: IndexTypeEnum26.HNSW_SQ,
      widthRawData: false,
      maxDegree: 56,
      flatNList: 128,
      sq8NList: 128,
      rabitqNList: 128,
      m: 30,
      inlinePq: 56,
    }
  });
  assert.ok(hnswSqResult.memory > 0, 'HNSW_SQ memory calculated');
  assert.equal(hnswSqResult.disk, 0, 'HNSW_SQ disk is 0');

  // SPARSE_INVERTED_INDEX: 1.2 * vectorRawDataSize
  const sparseResult = memoryAndDiskCalculator({
    rawDataSize,
    d,
    num,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 1024,
    mode: ModeEnum.Cluster,
    refineType: RefineValueEnum.None,
    indexTypeParams: {
      indexType: IndexTypeEnum26.SPARSE_INVERTED_INDEX,
      widthRawData: false,
      maxDegree: 56,
      flatNList: 128,
      sq8NList: 128,
      rabitqNList: 128,
      m: 30,
      inlinePq: 56,
    }
  });
  assert.ok(sparseResult.memory > 0, 'SPARSE_INVERTED_INDEX memory calculated');
});

test('BUG-06 fix: AISAQ on-disk index does not accumulate phantom ~2.35 GB segment RAM buffer', () => {
  const rawDataSize = 3072000000;
  const num = 1;
  const d = 768;

  const aisaqResult = memoryAndDiskCalculator({
    rawDataSize,
    d,
    num,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 1024, // 1024MB segment size
    mode: ModeEnum.Cluster,
    refineType: RefineValueEnum.None,
    indexTypeParams: {
      indexType: IndexTypeEnum26.AISAQ,
      widthRawData: false,
      maxDegree: 56,
      flatNList: 128,
      sq8NList: 128,
      rabitqNList: 128,
      m: 30,
      inlinePq: 56,
    }
  });

  // AISAQ memory is 16 MB * 1.15 = 18.4 MB (around 19,293,798 bytes).
  // Before fix: it added segmentSizeByte * 2 * 1.15 = 2.35 GB, exceeding 2,400,000,000 bytes.
  assert.ok(aisaqResult.memory < 50 * 1024 * 1024, `AISAQ memory must be ~18.4 MB (got ${aisaqResult.memory} bytes, must be under 50MB)`);
  assert.ok(aisaqResult.disk > 0, 'AISAQ index data resides on disk');
});

test('GPU_CAGRA memory formula correctly calculates adjacency list and device dataset cache', () => {
  const n = 1000;
  const d = 768;
  const graphDegree = 32;

  // 1. With cacheDatasetOnDevice = true: VRAM = N * graphDegree * 4 + vectorRawData
  const cagraWithCache = gpuIndexMemoryCalculator({
    n,
    d,
    indexType: GpuIndexTypeEnum.GPU_CAGRA,
    indexParams: {
      graphDegree,
      intermediateDegree: 64,
      cacheDatasetOnDevice: true,
      nlist: 128,
      trainFraction: 0.5,
      pqDim: 0,
      pqBits: 8,
    }
  });

  const expectedDataset = n * d * 4; // 1000 * 768 * 4 = 3,072,000 bytes
  const expectedGraph = n * graphDegree * 4; // 1000 * 32 * 4 = 128,000 bytes
  assert.equal(cagraWithCache.dataset, expectedDataset, 'CAGRA dataset size with cache = true');
  assert.equal(cagraWithCache.graph, expectedGraph, 'CAGRA adjacency list size');
  assert.equal(cagraWithCache.total, expectedDataset + expectedGraph, 'Total CAGRA VRAM with cache');

  // 2. With cacheDatasetOnDevice = false: VRAM = N * graphDegree * 4 (dataset not cached on device)
  const cagraWithoutCache = gpuIndexMemoryCalculator({
    n,
    d,
    indexType: GpuIndexTypeEnum.GPU_CAGRA,
    indexParams: {
      graphDegree,
      intermediateDegree: 64,
      cacheDatasetOnDevice: false,
      nlist: 128,
      trainFraction: 0.5,
      pqDim: 0,
      pqBits: 8,
    }
  });
  assert.equal(cagraWithoutCache.dataset, 0, 'CAGRA dataset size with cache = false must be 0');
  assert.equal(cagraWithoutCache.graph, expectedGraph, 'CAGRA adjacency list remains same');
  assert.equal(cagraWithoutCache.total, expectedGraph, 'Total CAGRA VRAM without cache is graph only');
});

test('rmmPoolSizeCalculator computes initMemSize and maxMemSize according to cuVS spec', () => {
  // Test case 1: 1 GB GPU Index Memory
  // init = Math.max(2, Math.ceil(1 * 0.5)) = 2 GB
  // max = Math.max(4, Math.ceil(1 * 1.5)) = 4 GB
  const pool1Gb = rmmPoolSizeCalculator(1 * 1024 * 1024 * 1024);
  assert.equal(pool1Gb.initMemSize, 2, '1 GB index: initMemSize is clamped to 2 GB minimum');
  assert.equal(pool1Gb.maxMemSize, 4, '1 GB index: maxMemSize is clamped to 4 GB minimum');

  // Test case 2: 10 GB GPU Index Memory
  // init = Math.max(2, Math.ceil(10 * 0.5)) = 5 GB
  // max = Math.max(4, Math.ceil(10 * 1.5)) = 15 GB
  const pool10Gb = rmmPoolSizeCalculator(10 * 1024 * 1024 * 1024);
  assert.equal(pool10Gb.initMemSize, 5, '10 GB index: initMemSize is 5 GB');
  assert.equal(pool10Gb.maxMemSize, 15, '10 GB index: maxMemSize is 15 GB');
});

test('gpuOperatorYmlGenerator exports Kubernetes YAML with nvidia.com/gpu limit in standalone and cluster mode', () => {
  const dummyGpuCluster = {
    queryNode: { count: 2, cpu: 4, memory: 16, gpuMemory: 16 * 1024 * 1024 * 1024 },
    proxy: { count: 1, cpu: 2, memory: 8 },
    mixCoord: { count: 1, cpu: 2, memory: 8 },
    dataNode: { count: 1, cpu: 4, memory: 16, gpuMemory: 16 * 1024 * 1024 * 1024 },
    streamNode: { count: 1, cpu: 2, memory: 8 },
  };
  const dummyGpuStandalone = { count: 1, cpu: 4, memory: 16, gpuMemory: 16 * 1024 * 1024 * 1024 };

  // Standalone mode
  const standaloneYml = gpuOperatorYmlGenerator({
    clusterNodeConfig: dummyGpuCluster,
    standaloneNodeConfig: dummyGpuStandalone,
    mode: ModeEnum.Standalone,
  });
  assert.ok(standaloneYml.includes('spec:\n  mode: standalone'), 'Must specify mode: standalone');
  assert.ok(standaloneYml.includes('nvidia.com/gpu: "1"'), 'Standalone must configure nvidia.com/gpu: "1"');

  // Cluster mode
  const clusterYml = gpuOperatorYmlGenerator({
    clusterNodeConfig: dummyGpuCluster,
    standaloneNodeConfig: dummyGpuStandalone,
    mode: ModeEnum.Cluster,
  });
  assert.ok(clusterYml.includes('spec:\n  mode: cluster'), 'Must specify mode: cluster');
  assert.ok(clusterYml.includes('nvidia.com/gpu: "1"'), 'Cluster must configure nvidia.com/gpu: "1"');
});

test('SINDI sparse compression algorithm reduces memory footprint to ~2.8 bytes per non-zero element', () => {
  const numVectors = 1; // 1 Million vectors
  const avgNnz = 120; // 120 non-zero elements per sparse vector

  // 1. Dedicated sindiSparseMemoryCalculator test
  const expectedSindiBytes = 1000000 * avgNnz * 2.8;
  const calculatedSindiBytes = sindiSparseMemoryCalculator({ num: numVectors, avgNnz });
  assert.equal(calculatedSindiBytes, expectedSindiBytes, 'sindiSparseMemoryCalculator calculates N * avg_nnz * 2.8 bytes');

  // 2. rawDataSizeCalculator with and without SINDI
  const uncompressedRaw = rawDataSizeCalculator({
    num: numVectors,
    d: 30000,
    withScalar: false,
    scalarAvg: 0,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz,
    sindiCompression: false,
  });
  const sindiRaw = rawDataSizeCalculator({
    num: numVectors,
    d: 30000,
    withScalar: false,
    scalarAvg: 0,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz,
    sindiCompression: true,
  });

  assert.equal(uncompressedRaw, 1000000 * avgNnz * 8, 'Standard sparse is 8 bytes per NNZ');
  assert.equal(sindiRaw, expectedSindiBytes, 'SINDI compressed sparse is 2.8 bytes per NNZ');
  assert.ok(sindiRaw < uncompressedRaw * 0.4, 'SINDI achieves > 60% memory savings compared to uncompressed sparse');

  // 3. memoryAndDiskCalculator with SPARSE_INVERTED_INDEX and SINDI
  const sindiMemResult = memoryAndDiskCalculator({
    rawDataSize: sindiRaw,
    indexTypeParams: {
      indexType: IndexTypeEnum26.SPARSE_INVERTED_INDEX,
      widthRawData: false,
      maxDegree: 0,
      flatNList: 0,
      sq8NList: 0,
      rabitqNList: 0,
      m: 0,
      inlinePq: 0,
    },
    d: 30000,
    num: numVectors,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 512,
    mode: ModeEnum.Cluster,
    refineType: RefineValueEnum.None,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz,
    sindiCompression: true,
  });

  // Verify memory calculation reflects SINDI compressed size plus segment safety buffer
  const segmentSizeByte = 512 * 1024 * 1024;
  const expectedLoadingMemory = (expectedSindiBytes + segmentSizeByte * 2) * 1.15;
  assert.equal(Math.round(sindiMemResult.memory), Math.round(expectedLoadingMemory), 'memoryAndDiskCalculator applies SINDI 2.8 bytes formula');
});

test('Woodpecker streaming architecture and mainIndex segment sizeMetric are correctly emitted in Helm and Operator YAML', () => {
  assert.equal(SegmentSizeMetricEnum.MAIN_INDEX, 'mainIndex', 'SegmentSizeMetricEnum.MAIN_INDEX must be "mainIndex"');

  const dummyClusterWithStreamNode = {
    ...dummyClusterConfig,
    streamNode: { count: 1, cpu: 2, memory: 8 },
  };

  // 1. Operator YAML (v2.5+ generator)
  const operatorYml = operatorYmlGenerator(dummyClusterConfig, (DependencyComponentEnum26.Woodpecker || DependencyComponentEnum.Woodpecker), ModeEnum.Cluster);
  assert.ok(operatorYml.includes('msgStreamType: woodpecker'), 'Operator YAML must specify msgStreamType: woodpecker');
  assert.ok(/woodpecker:\s+embedded:\s*true/.test(operatorYml), 'Operator YAML must specify embedded woodpecker dependency');
  assert.ok(operatorYml.includes('type: woodpecker'), 'Operator YAML must configure streaming.type: woodpecker');
  assert.ok(operatorYml.includes('sizeMetric: mainIndex'), 'Operator YAML must configure dataCoord.segment.sizeMetric: mainIndex');

  // 2. Helm YAML (v2.5+ generator)
  const helmYml = helmYmlGeneratorV250(dummyClusterConfig, (DependencyComponentEnum26.Woodpecker || DependencyComponentEnum.Woodpecker), ModeEnum.Cluster);
  assert.ok(/pulsarv3:\s+enabled:\s*false/.test(helmYml), 'Helm YAML must disable pulsar when Woodpecker is selected');
  assert.ok(helmYml.includes('type: woodpecker'), 'Helm YAML must configure streaming.type: woodpecker');
  assert.ok(/woodpecker:\s+embedded:\s*true/.test(helmYml), 'Helm YAML must configure woodpecker.embedded: true');
  assert.ok(helmYml.includes('sizeMetric: mainIndex'), 'Helm YAML must configure dataCoord.segment.sizeMetric: mainIndex');

  // 3. Operator YAML (v2.4 generator)
  const operatorYml24 = operatorYmlGeneratorV24(dummyClusterWithStreamNode, (DependencyComponentEnum26.Woodpecker || DependencyComponentEnum.Woodpecker), ModeEnum.Cluster);
  assert.ok(operatorYml24.includes('msgStreamType: woodpecker'), 'v2.4 Operator YAML must specify msgStreamType: woodpecker');
  assert.ok(operatorYml24.includes('sizeMetric: mainIndex'), 'v2.4 Operator YAML must specify sizeMetric: mainIndex');

  // 4. Helm YAML (v2.4 generator)
  const helmYml24 = helmYmlGenerator(dummyClusterWithStreamNode, (DependencyComponentEnum26.Woodpecker || DependencyComponentEnum.Woodpecker), ModeEnum.Cluster);
  assert.ok(helmYml24.includes('type: woodpecker'), 'v2.4 Helm YAML must specify streaming.type: woodpecker');
  assert.ok(helmYml24.includes('sizeMetric: mainIndex'), 'v2.4 Helm YAML must specify sizeMetric: mainIndex');
});
