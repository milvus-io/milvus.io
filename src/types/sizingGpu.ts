export type DataSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';

export enum SegmentSizeEnum {
  _512MB = '512',
  _1024MB = '1024',
  _2048MB = '2048',
}

export enum ModeEnum {
  Standalone,
  Cluster,
}

export enum GpuIndexTypeEnum {
  GPU_BRUTE_FORCE = 'GPU_BRUTE_FORCE',
  GPU_IVF_FLAT = 'GPU_IVF_FLAT',
  GPU_IVF_PQ = 'GPU_IVF_PQ',
  GPU_CAGRA = 'GPU_CAGRA',
}

/**
 * Which lifecycle stage produced the GPU memory upper bound.
 *
 * Whether `Build` can win with two or more segments depends on the index:
 * BRUTE_FORCE (no temporary at all) and IVF_FLAT (`trainRows × (4d+4)` is
 * always below `n × (4d+8)`) guarantee that the resident total wins, but
 * IVF_PQ and CAGRA do not — IVF_PQ trains on uncompressed float32 vectors
 * while storing compressed codes, and CAGRA's intermediate graph can be far
 * wider than `d + graph_degree`. Never assume a segment count from this value.
 */
export enum GpuLifecycleStageEnum {
  Build = 'build',
  Resident = 'resident',
  Equal = 'equal',
}

export enum GpuValidationErrorEnum {
  InvalidNumber = 'invalidNumber',
  NlistOutOfRange = 'nlistOutOfRange',
  TrainFractionOutOfRange = 'trainFractionOutOfRange',
  PqDimOutOfRange = 'pqDimOutOfRange',
  PqCodeNotByteAligned = 'pqCodeNotByteAligned',
  IntermediateDegreeTooSmall = 'intermediateDegreeTooSmall',
}

/**
 * Index parameters that take part in the GPU memory formulas. Parameters that
 * are irrelevant to the selected index type are still carried (at their default
 * values) so the shape stays stable across index switches.
 */
export interface IGpuIndexParams {
  /** IVF cluster count. */
  nlist: number;
  /** IVF kmeans_trainset_fraction, (0, 1]. */
  trainFraction: number;
  /** PQ subspace count (`m`). `0` means "resolve with the cuVS auto rule". */
  pqDim: number;
  /** PQ code width in bits. */
  pqBits: number;
  /** CAGRA out-degree of the final graph. */
  graphDegree: number;
  /** CAGRA out-degree of the intermediate graph built during construction. */
  intermediateDegree: number;
}

export interface IGpuSizingParams {
  /** Vector count, in millions. */
  num: number;
  /** Vector dimension. */
  d: number;
  indexType: GpuIndexTypeEnum;
  withScalar: boolean;
  /** Average scalar bytes per row. */
  scalarAvg: number;
  /** Segment size in MB. */
  segSize: number;
  mode: ModeEnum;
  indexParams: IGpuIndexParams;
}

/** Per-component breakdown of one segment's resident index data. */
export interface IGpuIndexMemory {
  total: number;
  /** BRUTE_FORCE / CAGRA raw vectors, and the vector half of an IVF_FLAT list. */
  dataset?: number;
  /** BRUTE_FORCE precomputed norms. */
  norms?: number;
  /** IVF inverted lists (vectors or PQ codes, plus per-row ids). */
  lists?: number;
  /** The PQ code half of an IVF_PQ list. */
  codes?: number;
  /** The per-row id half of an IVF list. */
  indices?: number;
  /** IVF centroids. */
  centers?: number;
  /** IVF centroid norms. */
  centerNorms?: number;
  /** CAGRA adjacency list. */
  graph?: number;
  /** IVF_PQ bytes per encoded vector. */
  codeBytes?: number;
}

export type NodesValueType = {
  cpu: number;
  /** Host memory in GB. */
  memory: number;
  count: number;
  /** Per-node GPU memory in bytes. Absent for nodes that need no GPU. */
  gpuMemory?: number;
};

const NodesType = {
  queryNode: 'Query Node',
  proxy: 'Proxy',
  mixCoord: 'Mix Coord',
  dataNode: 'Data Node',
  streamNode: 'Stream Node',
} as const;

export type NodesKeyType = keyof typeof NodesType;

export interface IGpuCalculateResult {
  rawDataSize: number;
  vectorRawDataSize: number;
  scalarRawDataSize: number;
  /** Host loading memory in bytes. */
  memorySize: number;
  segmentRowCount: number;
  segmentCount: number;
  /** Index parameters after auto-resolution and clamping. */
  effectiveIndexParams: IGpuIndexParams;
  segmentIndexMemory: IGpuIndexMemory;
  segmentBuildTemporaryMemory: number;
  /** Peak GPU memory while building one segment, in bytes. */
  buildMemorySize: number;
  /** GPU memory with every segment's index resident, in bytes. */
  residentMemorySize: number;
  lifecycleMaxMemorySize: number;
  /** lifecycleMaxMemorySize with the safety factor applied, in bytes. */
  gpuMemorySize: number;
  limitingStage: GpuLifecycleStageEnum;
  clusterNodeConfig: Record<NodesKeyType, NodesValueType>;
  standaloneNodeConfig: NodesValueType;
  mode: ModeEnum;
}
