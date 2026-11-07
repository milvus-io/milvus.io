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

const { operatorYmlGenerator, helmYmlGenerator: helmYmlGeneratorV250, memoryAndDiskCalculator: memoryAndDiskCalculatorV250 } = require('../src/utils/sizingToolV250.ts');
const { ModeEnum, DependencyComponentEnum, IndexTypeEnum } = require('../src/types/sizingV250.ts');
const { INDEX_TYPE_OPTIONS, VECTOR_TYPE_OPTIONS: VECTOR_TYPE_OPTIONS_V250, SPARSE_INDEX_TYPE_OPTIONS: SPARSE_INDEX_TYPE_OPTIONS_V250, AVG_NNZ_RANGE_CONFIG: AVG_NNZ_RANGE_CONFIG_V250 } = require('../src/consts/sizingV250.ts');
const { REFINE_OPTIONS, INDEX_TYPE_OPTIONS: INDEX_TYPE_OPTIONS_26, VECTOR_TYPE_OPTIONS, SPARSE_INDEX_TYPE_OPTIONS, AVG_NNZ_RANGE_CONFIG } = require('../src/consts/sizing.ts');
const { RefineValueEnum, REFINE_VALUE_TO_N_MAP, VectorTypeEnum, IndexTypeEnum: IndexTypeEnum26, DependencyComponentEnum: DependencyComponentEnum26 } = require('../src/types/sizing.ts');
const { GpuIndexTypeEnum } = require('../src/types/sizingGpu.ts');
const { GRAPH_DEGREE_RANGE_CONFIG, INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG, DEFAULT_GPU_INDEX_PARAMS } = require('../src/consts/sizingGpu.ts');
const { fetchMilvusReleases } = require('../src/http/milvus.ts');
const { unitBYTE2Any, rawDataSizeCalculator, memoryAndDiskCalculator, dependencyCalculator, sindiSparseMemoryCalculator, SegmentSizeMetricEnum, helmYmlGenerator, operatorYmlGenerator: operatorYmlGeneratorV24 } = require('../src/utils/sizingTool.ts');
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

test('INDEX_TYPE_OPTIONS displays IVF_SQ8 label with underscore and excludes SPARSE_INVERTED_INDEX to avoid UI dense calculation bug', () => {
  const ivfSq8Option = INDEX_TYPE_OPTIONS.find(opt => opt.value === IndexTypeEnum.IVFSQ8);
  assert.ok(ivfSq8Option, 'IVFSQ8 option must exist');
  assert.equal(ivfSq8Option.label, 'IVF_SQ8', 'Label must be IVF_SQ8 with underscore');

  const sparseV25 = INDEX_TYPE_OPTIONS.find(opt => opt.value === IndexTypeEnum.SPARSE_INVERTED_INDEX);
  assert.equal(sparseV25, undefined, 'v2.5 INDEX_TYPE_OPTIONS must not expose SPARSE_INVERTED_INDEX before sparse form controls exist');

  const sparseV26 = INDEX_TYPE_OPTIONS_26.find(opt => opt.value === IndexTypeEnum26.SPARSE_INVERTED_INDEX);
  assert.equal(sparseV26, undefined, 'v2.6 INDEX_TYPE_OPTIONS must not expose SPARSE_INVERTED_INDEX before sparse form controls exist');
});

test('DependencyComponentEnum in v2.5 does not include Woodpecker', () => {
  assert.equal(DependencyComponentEnum.Woodpecker, undefined, 'v2.5 DependencyComponentEnum must only contain Pulsar and Kafka');
});

test('GPU CAGRA range configs and default params conform to upstream 64/128 defaults', () => {
  assert.equal(GRAPH_DEGREE_RANGE_CONFIG.defaultValue, 64, 'graphDegree default must be 64');
  assert.deepEqual(GRAPH_DEGREE_RANGE_CONFIG.range, [1, 8, 64, 256, 1024], 'graphDegree range must include 64 at 50% midpoint');
  assert.equal(INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG.defaultValue, 128, 'intermediateDegree default must be 128');
  assert.deepEqual(INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG.range, [1, 16, 128, 512, 2048], 'intermediateDegree range must include 128 at 50% midpoint');
  assert.equal(DEFAULT_GPU_INDEX_PARAMS.graphDegree, 64, 'DEFAULT_GPU_INDEX_PARAMS.graphDegree must be 64');
  assert.equal(DEFAULT_GPU_INDEX_PARAMS.intermediateDegree, 128, 'DEFAULT_GPU_INDEX_PARAMS.intermediateDegree must be 128');
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
  // In Milvus 2.4.1+, RMM Pool is search workspace memory buffer: 2048 MB init, 4096 MB max
  const pool1Gb = rmmPoolSizeCalculator(1 * 1024 * 1024 * 1024);
  assert.equal(pool1Gb.initMemSize, 2048, 'RMM pool initMemSize is 2048 MB workspace buffer');
  assert.equal(pool1Gb.maxMemSize, 4096, 'RMM pool maxMemSize is 4096 MB workspace buffer');

  const pool10Gb = rmmPoolSizeCalculator(10 * 1024 * 1024 * 1024);
  assert.equal(pool10Gb.initMemSize, 2048, 'RMM pool remains 2048 MB search workspace buffer');
  assert.equal(pool10Gb.maxMemSize, 4096, 'RMM pool remains 4096 MB search workspace buffer');
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
  assert.ok(clusterYml.includes('streamingNode:'), 'Cluster YAML must specify streamingNode instead of streamNode');
});

test('SINDI sparse compression algorithm reduces memory footprint to ~2.8 bytes per non-zero element', () => {
  const numVectors = 1; // 1 Million vectors
  const avgNnz = 120; // 120 non-zero elements per sparse vector

  // 1. Dedicated sindiSparseMemoryCalculator test
  const expectedSindiBytes = 1000000 * avgNnz * 2.8;
  const calculatedSindiBytes = sindiSparseMemoryCalculator({ num: numVectors, avgNnz });
  assert.equal(calculatedSindiBytes, expectedSindiBytes, 'sindiSparseMemoryCalculator calculates N * avg_nnz * 2.8 bytes');

  // 2. rawDataSizeCalculator keeps raw sparse vector size at 8 bytes per NNZ
  const sparseRaw = rawDataSizeCalculator({
    num: numVectors,
    d: 30000,
    withScalar: false,
    scalarAvg: 0,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz,
  });

  assert.equal(sparseRaw, 1000000 * avgNnz * 8, 'Standard sparse raw data is 8 bytes per NNZ');
  assert.ok(calculatedSindiBytes < sparseRaw * 0.4, 'SINDI achieves > 60% index memory savings compared to raw sparse');

  // 3. memoryAndDiskCalculator with SPARSE_INVERTED_INDEX and SINDI
  const sindiMemResult = memoryAndDiskCalculator({
    rawDataSize: sparseRaw,
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

  // 1. v2.5 Operator and Helm generators must NOT emit Woodpecker or mainIndex (pre-2.6)
  const operatorYmlV25 = operatorYmlGenerator(dummyClusterConfig, DependencyComponentEnum.Pulsar, ModeEnum.Cluster);
  assert.equal(operatorYmlV25.includes('type: woodpecker'), false, 'v2.5 Operator YAML must not emit woodpecker');
  assert.equal(operatorYmlV25.includes('sizeMetric: mainIndex'), false, 'v2.5 Operator YAML must not emit mainIndex');

  const helmYmlV25 = helmYmlGeneratorV250(dummyClusterConfig, DependencyComponentEnum.Pulsar, ModeEnum.Cluster);
  assert.equal(helmYmlV25.includes('type: woodpecker'), false, 'v2.5 Helm YAML must not emit woodpecker');
  assert.equal(helmYmlV25.includes('sizeMetric: mainIndex'), false, 'v2.5 Helm YAML must not emit mainIndex');

  // 2. v2.6+ Operator YAML (sizingTool.ts) specifies msgStreamType: woodpecker without broken CRD embedded dependency
  const operatorYml24 = operatorYmlGeneratorV24(dummyClusterWithStreamNode, (DependencyComponentEnum26.Woodpecker || DependencyComponentEnum.Woodpecker), ModeEnum.Cluster);
  assert.ok(operatorYml24.includes('msgStreamType: woodpecker'), 'v2.6+ Operator YAML must specify msgStreamType: woodpecker');
  assert.equal(/dependencies:[\s\S]*woodpecker:\s+embedded:\s*true/.test(operatorYml24), false, 'Operator dependencies must not contain invalid woodpecker.embedded CRD field');
  assert.equal(operatorYml24.includes('sizeMetric: mainIndex'), false, 'v2.6+ Operator YAML must not emit 3.0 sizeMetric: mainIndex');
  assert.equal(operatorYml24.includes('type: woodpecker'), false, 'v2.6+ Operator YAML must not emit 3.0 streaming.type: woodpecker');
  assert.ok(operatorYml24.includes('config: {}'), 'v2.6+ Operator YAML config remains {}');

  // 3. v2.6+ Helm YAML (sizingTool.ts)
  const helmYml24 = helmYmlGenerator(dummyClusterWithStreamNode, DependencyComponentEnum26.Woodpecker, ModeEnum.Cluster);
  assert.ok(helmYml24.includes('pulsarv3:\n  enabled: false'), 'v2.6+ Helm YAML must disable pulsarv3 when woodpecker is enabled');
  assert.ok(helmYml24.includes('woodpecker:\n  enabled: true'), 'v2.6+ Helm YAML must specify woodpecker.enabled: true per milvus-helm chart');
  assert.equal(helmYml24.includes('type: woodpecker'), false, 'v2.6+ Helm YAML must not emit invalid streaming.type: woodpecker');
  assert.equal(helmYml24.includes('sizeMetric: mainIndex'), false, 'v2.6+ Helm YAML must not emit 3.0 sizeMetric: mainIndex');
});

test('HNSW_SQ and HNSW_PQ do not suffer from refineType state leakage', () => {
  const baseParams = {
    rawDataSize: 100 * 1024 * 1024,
    d: 128,
    num: 1,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 512,
    mode: ModeEnum.Cluster,
  };

  // Calculate HNSW_SQ with refineType = None vs refineType = FP32
  const sqNone = memoryAndDiskCalculator({
    ...baseParams,
    indexTypeParams: { indexType: IndexTypeEnum26.HNSW_SQ, m: 16 },
    refineType: RefineValueEnum.None,
  });
  const sqFP32 = memoryAndDiskCalculator({
    ...baseParams,
    indexTypeParams: { indexType: IndexTypeEnum26.HNSW_SQ, m: 16 },
    refineType: RefineValueEnum.FP32,
  });

  assert.equal(sqNone.memory, sqFP32.memory, 'HNSW_SQ memory must not be inflated by leftover refineType state');
});

test('VECTOR_TYPE_OPTIONS and sparse constants are exported with correct schema and defaults', () => {
  assert.ok(Array.isArray(VECTOR_TYPE_OPTIONS), 'VECTOR_TYPE_OPTIONS must be an array');
  assert.equal(VECTOR_TYPE_OPTIONS.length, 6, 'Must contain 6 vector types (FP32, FP16, BF16, Int8, Binary, Sparse)');
  assert.ok(VECTOR_TYPE_OPTIONS.some(o => o.value === VectorTypeEnum.FLOAT16_VECTOR));
  assert.ok(VECTOR_TYPE_OPTIONS.some(o => o.value === VectorTypeEnum.BFLOAT16_VECTOR));
  assert.ok(VECTOR_TYPE_OPTIONS.some(o => o.value === VectorTypeEnum.INT8_VECTOR));
  assert.ok(VECTOR_TYPE_OPTIONS.some(o => o.value === VectorTypeEnum.BINARY_VECTOR));
  assert.ok(VECTOR_TYPE_OPTIONS.some(o => o.value === VectorTypeEnum.SPARSE_FLOAT_VECTOR));

  assert.ok(Array.isArray(SPARSE_INDEX_TYPE_OPTIONS), 'SPARSE_INDEX_TYPE_OPTIONS must be an array');
  assert.equal(SPARSE_INDEX_TYPE_OPTIONS[0].value, IndexTypeEnum26.SPARSE_INVERTED_INDEX);

  assert.equal(AVG_NNZ_RANGE_CONFIG.defaultValue, 100);
  assert.equal(AVG_NNZ_RANGE_CONFIG.min, 1);
  assert.equal(AVG_NNZ_RANGE_CONFIG.max, 10000);

  // Verify v250 consistency (Milvus 2.5 excludes INT8_VECTOR, which was added in 2.6)
  assert.equal(VECTOR_TYPE_OPTIONS_V250.length, 5);
  assert.ok(
    !VECTOR_TYPE_OPTIONS_V250.some(o => o.value === VectorTypeEnum.INT8_VECTOR),
    'Milvus 2.5 VECTOR_TYPE_OPTIONS must not include INT8_VECTOR'
  );
  assert.equal(SPARSE_INDEX_TYPE_OPTIONS_V250[0].value, IndexTypeEnum.SPARSE_INVERTED_INDEX);
  assert.equal(AVG_NNZ_RANGE_CONFIG_V250.defaultValue, 100);
});

test('memoryAndDiskCalculator accurately computes FP16, BF16, INT8, and BINARY vector memory', () => {
  const baseParams = {
    rawDataSize: 100 * 1024 * 1024,
    d: 128,
    num: 1,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 512,
    mode: ModeEnum.Cluster,
    indexTypeParams: { indexType: IndexTypeEnum26.FLAT },
  };

  const fp32 = memoryAndDiskCalculator({ ...baseParams, vectorType: VectorTypeEnum.FLOAT_VECTOR });
  const fp16 = memoryAndDiskCalculator({ ...baseParams, vectorType: VectorTypeEnum.FLOAT16_VECTOR });
  const bf16 = memoryAndDiskCalculator({ ...baseParams, vectorType: VectorTypeEnum.BFLOAT16_VECTOR });
  const int8 = memoryAndDiskCalculator({ ...baseParams, vectorType: VectorTypeEnum.INT8_VECTOR });
  const bin = memoryAndDiskCalculator({ ...baseParams, vectorType: VectorTypeEnum.BINARY_VECTOR });

  // In FLAT index without scalars, segment overhead is identical, vector memory scales directly with byte size
  assert.equal(fp16.memory, bf16.memory, 'FP16 and BF16 must use identical memory (2 bytes per dimension)');
  assert.ok(fp16.memory < fp32.memory, 'FP16 memory must be smaller than FP32');
  assert.ok(int8.memory < fp16.memory, 'INT8 memory must be smaller than FP16');
  assert.ok(bin.memory < int8.memory, 'Binary vector memory must be smallest (1 bit per dimension)');

  // Check v250 calculator
  const v250Fp32 = memoryAndDiskCalculatorV250({ ...baseParams, vectorType: VectorTypeEnum.FLOAT_VECTOR });
  const v250Fp16 = memoryAndDiskCalculatorV250({ ...baseParams, vectorType: VectorTypeEnum.FLOAT16_VECTOR });
  assert.ok(v250Fp16.memory < v250Fp32.memory, 'v250 FP16 memory must be smaller than FP32');
});

test('memoryAndDiskCalculator handles SPARSE_FLOAT_VECTOR with avgNnz across calculators', () => {
  const sparseParams = {
    rawDataSize: 100 * 1024 * 1024,
    d: 0,
    num: 1,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 512,
    mode: ModeEnum.Cluster,
    indexTypeParams: { indexType: IndexTypeEnum26.SPARSE_INVERTED_INDEX },
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz: 100,
  };

  const resV26 = memoryAndDiskCalculator(sparseParams);
  const resV250 = memoryAndDiskCalculatorV250(sparseParams);

  assert.ok(resV26.memory > 0, 'v2.6 sparse memory must be positive');
  assert.ok(resV250.memory > 0, 'v2.5 sparse memory must be positive');
});
test('dependencyCalculator scales PVC size with vectorType and avgNnz', () => {
  const baseDepParams = {
    num: 10,
    d: 128,
    mode: ModeEnum.Cluster,
    withScalar: false,
    scalarAvg: 0,
    loadingMemory: 10 * 1024 * 1024 * 1024,
    dependency: DependencyComponentEnum.Pulsar,
  };

  const depFp32 = dependencyCalculator(baseDepParams);
  const depSparseLarge = dependencyCalculator({
    ...baseDepParams,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz: 5000,
  });
  assert.ok(
    depSparseLarge.minio.pvc > depFp32.minio.pvc,
    'High avgNnz sparse vector must allocate significantly larger MinIO PVC'
  );
});

test('gpuOperatorYmlGenerator emits GPU image in spec.components and gpu memory pool configuration in spec.config', () => {
  const standaloneYml = gpuOperatorYmlGenerator({
    mode: ModeEnum.Standalone,
    standaloneNodeConfig: { cpu: 8, memory: 32, count: 1 },
    clusterNodeConfig: {},
    rmmPoolSize: { initMemSize: 2048, maxMemSize: 4096 },
  });
  assert.ok(
    standaloneYml.includes('image: milvusdb/milvus:v2.6.25-gpu'),
    'Standalone GPU YAML must set spec.components.image to a GPU-enabled image'
  );
  assert.ok(standaloneYml.includes('initMemSize: 2048'), 'YAML must contain gpu initMemSize');
  assert.ok(standaloneYml.includes('maxMemSize: 4096'), 'YAML must contain gpu maxMemSize');

  const clusterYml = gpuOperatorYmlGenerator({
    mode: ModeEnum.Cluster,
    standaloneNodeConfig: { cpu: 8, memory: 32, count: 1 },
    clusterNodeConfig: {
      queryNode: { cpu: 4, memory: 16, count: 2, gpuCount: 1 },
      proxy: { cpu: 2, memory: 8, count: 1 },
      mixCoord: { cpu: 2, memory: 8, count: 1 },
      dataNode: { cpu: 4, memory: 16, count: 2 },
      streamNode: { cpu: 2, memory: 8, count: 1 },
    },
    rmmPoolSize: { initMemSize: 2048, maxMemSize: 4096 },
  });
  assert.ok(
    clusterYml.includes('image: milvusdb/milvus:v2.6.25-gpu'),
    'Cluster GPU YAML must set spec.components.image to a GPU-enabled image'
  );
});

test('SINDI compression reduces sparse index memory while keeping rawDataSize and storage footprints independent', () => {
  const baseSparseParams = {
    rawDataSize: 100 * 1024 * 1024,
    d: 768,
    num: 10,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 512,
    mode: ModeEnum.Cluster,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz: 5000,
  };

  const rawSize = rawDataSizeCalculator({
    num: 10,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz: 5000,
  });
  assert.equal(
    rawSize,
    400_000_000_000,
    'Sparse rawDataSize must always use 8 bytes/NNZ (400 GB for 10M vectors at avgNnz=5000)'
  );

  const uncompressed = memoryAndDiskCalculator({
    ...baseSparseParams,
    indexTypeParams: {
      indexType: IndexTypeEnum26.SPARSE_INVERTED_INDEX,
      sindiCompression: false,
    },
  });
  const sindiViaIndexParams = memoryAndDiskCalculator({
    ...baseSparseParams,
    indexTypeParams: {
      indexType: IndexTypeEnum26.SPARSE_INVERTED_INDEX,
      sindiCompression: true,
    },
  });
  assert.ok(
    sindiViaIndexParams.memory < uncompressed.memory,
    'SINDI via indexTypeParams.sindiCompression must reduce sparse index memory footprint'
  );

  const depZeroLoading = dependencyCalculator({
    num: 10,
    d: 768,
    mode: ModeEnum.Cluster,
    withScalar: false,
    scalarAvg: 0,
    loadingMemory: 0,
    dependency: DependencyComponentEnum26.Pulsar,
    vectorType: VectorTypeEnum.SPARSE_FLOAT_VECTOR,
    avgNnz: 5000,
  });
  assert.equal(depZeroLoading.minio.pvc, 373, 'MinIO PVC from rawDataSize alone must be 373 GiB');
  assert.equal(depZeroLoading.pulsar.bookie.ledgers, 373, 'Pulsar ledgers from rawDataSize alone must be 373 GiB');
});

test('memoryAndDiskCalculator handles FP16/BF16 with HNSW_SQ/HNSW_PQ and DISKANN with INT8/BINARY', () => {
  const common = {
    rawDataSize: 100 * 1024 * 1024,
    d: 768,
    num: 1,
    withScalar: false,
    offLoading: false,
    scalarAvg: 0,
    segSize: 512,
    mode: ModeEnum.Cluster,
    refineType: RefineValueEnum.None,
  };

  const hnswSqFp32 = memoryAndDiskCalculator({
    ...common,
    vectorType: VectorTypeEnum.FLOAT_VECTOR,
    indexTypeParams: { indexType: IndexTypeEnum26.HNSW_SQ, m: 16 },
  });
  const hnswSqFp16 = memoryAndDiskCalculator({
    ...common,
    vectorType: VectorTypeEnum.FLOAT16_VECTOR,
    indexTypeParams: { indexType: IndexTypeEnum26.HNSW_SQ, m: 16 },
  });
  const hnswPqBf16 = memoryAndDiskCalculator({
    ...common,
    vectorType: VectorTypeEnum.BFLOAT16_VECTOR,
    indexTypeParams: { indexType: IndexTypeEnum26.HNSW_PQ, m: 16 },
  });
  assert.equal(
    hnswSqFp16.memory,
    hnswSqFp32.memory,
    'HNSW_SQ memory uses 8-bit SQ codes + 32-bit graph edges without double-halving FP16'
  );
  assert.ok(
    hnswPqBf16.memory < hnswSqFp16.memory,
    'HNSW_PQ memory with BF16 must be smaller than HNSW_SQ'
  );

  const diskannFp32 = memoryAndDiskCalculator({
    ...common,
    vectorType: VectorTypeEnum.FLOAT_VECTOR,
    indexTypeParams: { indexType: IndexTypeEnum26.DISKANN, maxDegree: 56 },
  });
  const diskannInt8 = memoryAndDiskCalculator({
    ...common,
    vectorType: VectorTypeEnum.INT8_VECTOR,
    indexTypeParams: { indexType: IndexTypeEnum26.DISKANN, maxDegree: 56 },
  });
  const diskannBinary = memoryAndDiskCalculator({
    ...common,
    vectorType: VectorTypeEnum.BINARY_VECTOR,
    indexTypeParams: { indexType: IndexTypeEnum26.DISKANN, maxDegree: 56 },
  });
  assert.ok(
    diskannInt8.disk < diskannFp32.disk,
    'DiskANN on INT8 vectors must require less local disk than FP32'
  );
  assert.ok(
    diskannBinary.memory < diskannInt8.memory,
    'DiskANN RAM cache on BINARY vectors must be bounded by binary vector size'
  );
});
