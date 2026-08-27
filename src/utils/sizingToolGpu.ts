import {
  CPU_LOADING_SAFETY_FACTOR,
  DEFAULT_GPU_INDEX_PARAMS,
  FLOAT_BYTES,
  GPU_FIXED_NODE_CONFIG,
  GPU_INDEX_PARAM_KEYS,
  GPU_LARGE_BASIC_NODE_CONFIG,
  GPU_LARGE_QUERY_NODE_TIERS,
  GPU_MEMORY_SAFETY_FACTOR,
  GPU_STREAM_NODE_LARGE_CONFIG,
  GPU_STREAM_NODE_LARGE_UNITS_PER_NODE,
  GPU_STREAM_NODE_TIERS,
  GRAPH_ID_BYTES,
  IVF_ID_BYTES,
  N_LIST_RANGE_CONFIG,
  ONE_MILLION,
  PQ_DIM_AUTO,
  STREAM_NODE_CORES_PER_UNIT,
} from '@/consts/sizingGpu';
import {
  GpuIndexTypeEnum,
  GpuLifecycleStageEnum,
  GpuValidationErrorEnum,
  IGpuCalculateResult,
  IGpuIndexMemory,
  IGpuIndexParams,
  IGpuSizingParams,
  NodesKeyType,
  NodesValueType,
} from '@/types/sizingGpu';

// Re-export common utilities
export {
  unitBYTE2Any,
  unitAny2BYTE,
  formatNumber,
  formatOutOfCalData,
} from './sizingToolCommon';

import {
  unitAny2BYTE,
  unitBYTE2Any,
  standaloneNodeConfigCalculator,
} from './sizingToolCommon';

const isIvfIndex = (indexType: GpuIndexTypeEnum) =>
  indexType === GpuIndexTypeEnum.GPU_IVF_FLAT ||
  indexType === GpuIndexTypeEnum.GPU_IVF_PQ;

/**
 * cuVS v26.02.00 `ivf_pq::index<IdxT>::calculate_pq_dim()`: halve dimensions of
 * 128 and above, round down to a multiple of 32, and fall back to the largest
 * power of two when the vector is too short for that.
 */
export const calculatePqDim = (d: number) => {
  let candidate = Math.floor(d);
  if (candidate >= 128) {
    candidate = Math.floor(candidate / 2);
  }

  const multipleOf32 = Math.floor(candidate / 32) * 32;
  if (multipleOf32 > 0) {
    return multipleOf32;
  }

  let powerOfTwo = 1;
  while (powerOfTwo * 2 <= candidate) {
    powerOfTwo *= 2;
  }
  return powerOfTwo;
};

/**
 * Normalise the index parameters for one index type: parameters that do not
 * reach that index type's memory formulas fall back to their defaults, and an
 * `m` / `pq_dim` of 0 is resolved through the cuVS auto rule.
 */
export const resolveIndexParams = (params: {
  d: number;
  indexType: GpuIndexTypeEnum;
  indexParams: IGpuIndexParams;
}): IGpuIndexParams => {
  const { d, indexType, indexParams } = params;
  const activeKeys = GPU_INDEX_PARAM_KEYS[indexType];

  const resolved: IGpuIndexParams = { ...DEFAULT_GPU_INDEX_PARAMS };
  activeKeys.forEach(key => {
    resolved[key] = indexParams[key];
  });

  if (activeKeys.includes('pqDim') && resolved.pqDim === PQ_DIM_AUTO) {
    resolved.pqDim = calculatePqDim(d);
  }

  return resolved;
};

/**
 * Returns the first violated constraint, or `null` when the input is usable.
 * Note that `nlist` is additionally clamped to the segment row count during the
 * calculation itself, which is a silent adjustment rather than an error.
 */
export const validateGpuSizingParams = (
  params: IGpuSizingParams
): GpuValidationErrorEnum | null => {
  const { num, d, segSize, withScalar, scalarAvg, indexType } = params;
  const indexParams = resolveIndexParams(params);
  const scalarBytes = withScalar ? scalarAvg : 0;

  const values = [
    num,
    d,
    segSize,
    scalarBytes,
    indexParams.nlist,
    indexParams.trainFraction,
    indexParams.pqDim,
    indexParams.pqBits,
    indexParams.graphDegree,
    indexParams.intermediateDegree,
  ];

  if (
    values.some(value => !Number.isFinite(value) || value < 0) ||
    num <= 0 ||
    d < 2 ||
    segSize <= 0
  ) {
    return GpuValidationErrorEnum.InvalidNumber;
  }

  if (
    isIvfIndex(indexType) &&
    (indexParams.nlist < N_LIST_RANGE_CONFIG.min ||
      indexParams.nlist > N_LIST_RANGE_CONFIG.max)
  ) {
    return GpuValidationErrorEnum.NlistOutOfRange;
  }

  if (
    isIvfIndex(indexType) &&
    (indexParams.trainFraction <= 0 || indexParams.trainFraction > 1)
  ) {
    return GpuValidationErrorEnum.TrainFractionOutOfRange;
  }

  if (indexType === GpuIndexTypeEnum.GPU_IVF_PQ) {
    if (indexParams.pqDim < 1 || indexParams.pqDim > d) {
      return GpuValidationErrorEnum.PqDimOutOfRange;
    }
    if ((indexParams.pqDim * indexParams.pqBits) % 8 !== 0) {
      return GpuValidationErrorEnum.PqCodeNotByteAligned;
    }
  }

  if (
    indexType === GpuIndexTypeEnum.GPU_CAGRA &&
    indexParams.intermediateDegree < indexParams.graphDegree
  ) {
    return GpuValidationErrorEnum.IntermediateDegreeTooSmall;
  }

  return null;
};

/**
 * Resident index data of a single segment, in bytes. This part occupies GPU
 * memory during build, load and search alike.
 */
export const gpuIndexMemoryCalculator = (params: {
  n: number;
  d: number;
  indexType: GpuIndexTypeEnum;
  indexParams: IGpuIndexParams;
}): IGpuIndexMemory => {
  const { n, d, indexType, indexParams } = params;
  const { nlist, pqDim, pqBits, graphDegree } = indexParams;

  switch (indexType) {
    case GpuIndexTypeEnum.GPU_BRUTE_FORCE: {
      const dataset = n * d * FLOAT_BYTES;
      const norms = n * FLOAT_BYTES;
      return { total: dataset + norms, dataset, norms };
    }
    case GpuIndexTypeEnum.GPU_IVF_FLAT: {
      const lists = n * (d * FLOAT_BYTES + IVF_ID_BYTES);
      const centers = nlist * d * FLOAT_BYTES;
      const centerNorms = nlist * FLOAT_BYTES;
      return {
        total: lists + centers + centerNorms,
        lists,
        // The two halves of `lists`, reported for display only.
        dataset: n * d * FLOAT_BYTES,
        indices: n * IVF_ID_BYTES,
        centers,
        centerNorms,
      };
    }
    case GpuIndexTypeEnum.GPU_IVF_PQ: {
      const codeBytes = Math.ceil((pqDim * pqBits) / 8);
      const lists = n * (codeBytes + IVF_ID_BYTES);
      const centers = nlist * d * FLOAT_BYTES;
      const centerNorms = nlist * FLOAT_BYTES;
      return {
        total: lists + centers + centerNorms,
        lists,
        // The two halves of `lists`, reported for display only.
        codes: n * codeBytes,
        indices: n * IVF_ID_BYTES,
        centers,
        centerNorms,
        codeBytes,
      };
    }
    case GpuIndexTypeEnum.GPU_CAGRA:
    default: {
      const dataset = n * d * FLOAT_BYTES;
      const graph = n * graphDegree * GRAPH_ID_BYTES;
      return { total: dataset + graph, dataset, graph };
    }
  }
};

/**
 * Extra GPU memory held only while a single segment's index is being built,
 * on top of the resident index data.
 */
export const gpuBuildTemporaryMemoryCalculator = (params: {
  n: number;
  d: number;
  indexType: GpuIndexTypeEnum;
  indexParams: IGpuIndexParams;
}) => {
  const { n, d, indexType, indexParams } = params;

  if (isIvfIndex(indexType)) {
    const trainRows = Math.floor(n * indexParams.trainFraction);
    return trainRows * d * FLOAT_BYTES + trainRows * FLOAT_BYTES;
  }

  if (indexType === GpuIndexTypeEnum.GPU_CAGRA) {
    return n * indexParams.intermediateDegree * GRAPH_ID_BYTES;
  }

  return 0;
};

/** Host loading memory, in bytes. Same formula as the CPU tool's FLAT branch. */
export const hostLoadingMemoryCalculator = (params: {
  num: number;
  d: number;
  withScalar: boolean;
  scalarAvg: number;
  segSize: number;
}) => {
  const { num, d, withScalar, scalarAvg, segSize } = params;
  const segmentSizeByte = unitAny2BYTE(segSize, 'MB');
  const totalN = num * ONE_MILLION;

  const vectorRawDataSize = totalN * d * FLOAT_BYTES;
  const scalarRawDataSize = withScalar ? totalN * scalarAvg : 0;

  return (
    (vectorRawDataSize + 2 * segmentSizeByte) * CPU_LOADING_SAFETY_FACTOR +
    scalarRawDataSize
  );
};

/** Stream node sizing, driven by the total number of query node cores. */
export const streamNodeConfigCalculator = (params: {
  queryNodeCores: number;
}): NodesValueType => {
  const units = Math.ceil(params.queryNodeCores / STREAM_NODE_CORES_PER_UNIT);
  const tier = GPU_STREAM_NODE_TIERS.find(
    item => units <= item.unitsUpperBound
  );

  if (tier) {
    return { cpu: tier.cpu, memory: tier.memory, count: tier.count };
  }

  return {
    ...GPU_STREAM_NODE_LARGE_CONFIG,
    count: Math.ceil(units / GPU_STREAM_NODE_LARGE_UNITS_PER_NODE),
  };
};

/** Cluster node sizing, driven by the host loading memory. */
export const clusterNodeConfigCalculator = (params: {
  memory: number;
}): Record<NodesKeyType, NodesValueType> => {
  const { size: memoryGB } = unitBYTE2Any(params.memory, 'GB');

  const fixed = GPU_FIXED_NODE_CONFIG.find(
    item => memoryGB < item.memoryUpperBound
  );

  if (fixed) {
    const queryNode = { ...fixed.queryNode };
    return {
      queryNode,
      proxy: { ...fixed.proxy },
      mixCoord: { ...fixed.mixCoord },
      dataNode: { ...fixed.dataNode },
      streamNode: streamNodeConfigCalculator({
        queryNodeCores: queryNode.cpu * queryNode.count,
      }),
    };
  }

  const tier =
    GPU_LARGE_QUERY_NODE_TIERS.find(item => memoryGB < item.memoryUpperBound) ||
    GPU_LARGE_QUERY_NODE_TIERS[GPU_LARGE_QUERY_NODE_TIERS.length - 1];
  const queryNode = {
    cpu: tier.memory / 4,
    memory: tier.memory,
    count: Math.ceil(memoryGB / tier.memory),
  };

  return {
    queryNode,
    proxy: { ...GPU_LARGE_BASIC_NODE_CONFIG.proxy },
    mixCoord: { ...GPU_LARGE_BASIC_NODE_CONFIG.mixCoord },
    dataNode: { ...GPU_LARGE_BASIC_NODE_CONFIG.dataNode },
    streamNode: streamNodeConfigCalculator({
      queryNodeCores: queryNode.cpu * queryNode.count,
    }),
  };
};

/**
 * Full GPU sizing estimate. Call `validateGpuSizingParams` first: this function
 * assumes the input already passed validation.
 */
export const gpuSizingCalculator = (
  params: IGpuSizingParams
): IGpuCalculateResult => {
  const { num, d, indexType, withScalar, scalarAvg, segSize, mode } = params;

  const totalN = num * ONE_MILLION;
  const segmentSizeByte = unitAny2BYTE(segSize, 'MB');
  const rowBytes = d * FLOAT_BYTES;
  const segmentRowCount = Math.max(
    1,
    Math.min(totalN, Math.floor(segmentSizeByte / rowBytes))
  );
  const segmentCount = Math.ceil(totalN / segmentRowCount);

  // nlist can never exceed the number of rows it has to cluster.
  const resolvedParams = resolveIndexParams(params);
  const effectiveIndexParams: IGpuIndexParams = {
    ...resolvedParams,
    nlist: Math.min(resolvedParams.nlist, segmentRowCount),
  };

  const vectorRawDataSize = totalN * rowBytes;
  const scalarRawDataSize = withScalar ? totalN * scalarAvg : 0;
  const memorySize = hostLoadingMemoryCalculator({
    num,
    d,
    withScalar,
    scalarAvg,
    segSize,
  });

  const segmentIndexMemory = gpuIndexMemoryCalculator({
    n: segmentRowCount,
    d,
    indexType,
    indexParams: effectiveIndexParams,
  });
  const segmentBuildTemporaryMemory = gpuBuildTemporaryMemoryCalculator({
    n: segmentRowCount,
    d,
    indexType,
    indexParams: effectiveIndexParams,
  });

  const buildMemorySize =
    segmentIndexMemory.total + segmentBuildTemporaryMemory;
  const residentMemorySize = segmentIndexMemory.total * segmentCount;
  const lifecycleMaxMemorySize = Math.max(buildMemorySize, residentMemorySize);
  const gpuMemorySize = lifecycleMaxMemorySize * GPU_MEMORY_SAFETY_FACTOR;

  let limitingStage = GpuLifecycleStageEnum.Equal;
  if (buildMemorySize > residentMemorySize) {
    limitingStage = GpuLifecycleStageEnum.Build;
  } else if (residentMemorySize > buildMemorySize) {
    limitingStage = GpuLifecycleStageEnum.Resident;
  }

  const standaloneNodeConfig: NodesValueType = {
    ...standaloneNodeConfigCalculator({ memory: memorySize }),
    gpuMemory: gpuMemorySize,
  };

  // Query nodes hold every segment's index; the data node only needs enough
  // memory to build one segment at a time.
  const clusterNodeConfig = clusterNodeConfigCalculator({ memory: memorySize });
  clusterNodeConfig.queryNode.gpuMemory =
    (residentMemorySize * GPU_MEMORY_SAFETY_FACTOR) /
    clusterNodeConfig.queryNode.count;
  clusterNodeConfig.dataNode.gpuMemory =
    buildMemorySize * GPU_MEMORY_SAFETY_FACTOR;

  return {
    rawDataSize: vectorRawDataSize + scalarRawDataSize,
    vectorRawDataSize,
    scalarRawDataSize,
    memorySize,
    segmentRowCount,
    segmentCount,
    effectiveIndexParams,
    segmentIndexMemory,
    segmentBuildTemporaryMemory,
    buildMemorySize,
    residentMemorySize,
    lifecycleMaxMemorySize,
    gpuMemorySize,
    limitingStage,
    clusterNodeConfig,
    standaloneNodeConfig,
    mode,
  };
};
