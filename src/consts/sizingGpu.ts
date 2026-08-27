import {
  GpuIndexTypeEnum,
  GpuValidationErrorEnum,
  IGpuIndexMemory,
  IGpuIndexParams,
  ModeEnum,
  SegmentSizeEnum,
} from '@/types/sizingGpu';

export const ONE_MILLION = Math.pow(10, 6);

/** Head-room applied to the host loading memory, same as the CPU sizing tool. */
export const CPU_LOADING_SAFETY_FACTOR = 1.15;
/** Head-room applied to the GPU lifecycle maximum. */
export const GPU_MEMORY_SAFETY_FACTOR = 1.5;

export const FLOAT_BYTES = 4;
/** sizeof(IdxT) for IVF inverted lists (int64_t). */
export const IVF_ID_BYTES = 8;
/** sizeof(IdxT) for the CAGRA adjacency list (uint32_t). */
export const GRAPH_ID_BYTES = 4;

/** `m` / `pq_dim` sentinel meaning "let cuVS pick the value". */
export const PQ_DIM_AUTO = 0;

export const VECTOR_RANGE_CONFIG = {
  min: 0.001,
  max: 10000,
  defaultValue: 1,
  domain: [0, 25, 50, 75, 100],
  range: [1, 10, 100, 1000, 10000],
};

export const DIMENSION_RANGE_CONFIG = {
  min: 2,
  max: 32768,
  defaultValue: 768,
  domain: [0, 25, 50, 75, 100],
  range: [2, 128, 768, 1536, 32768],
};

export const N_LIST_RANGE_CONFIG = {
  min: 1,
  max: 65536,
  defaultValue: 128,
  domain: [0, 10, 20, 40, 70, 100],
  range: [1, 16, 128, 4096, 16384, 65536],
};

export const TRAIN_FRACTION_RANGE_CONFIG = {
  min: 0.01,
  max: 1,
  step: 0.05,
  defaultValue: 0.5,
};

export const PQ_DIM_RANGE_CONFIG = {
  min: 0,
  max: 32768,
  defaultValue: PQ_DIM_AUTO,
};

export const GRAPH_DEGREE_RANGE_CONFIG = {
  min: 1,
  max: 1024,
  defaultValue: 64,
  domain: [0, 25, 50, 75, 100],
  range: [1, 8, 64, 256, 1024],
};

export const INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG = {
  min: 1,
  max: 2048,
  defaultValue: 128,
  domain: [0, 25, 50, 75, 100],
  range: [1, 16, 128, 512, 2048],
};

export const PQ_BITS_OPTIONS = [4, 5, 6, 7, 8].map(value => ({
  label: `${value}`,
  value,
}));
export const PQ_BITS_DEFAULT_VALUE = 8;

export const DEFAULT_GPU_INDEX_PARAMS: IGpuIndexParams = {
  nlist: N_LIST_RANGE_CONFIG.defaultValue,
  trainFraction: TRAIN_FRACTION_RANGE_CONFIG.defaultValue,
  pqDim: PQ_DIM_RANGE_CONFIG.defaultValue,
  pqBits: PQ_BITS_DEFAULT_VALUE,
  graphDegree: GRAPH_DEGREE_RANGE_CONFIG.defaultValue,
  intermediateDegree: INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG.defaultValue,
};

/** Index parameters that actually reach the memory formulas, per index type. */
export const GPU_INDEX_PARAM_KEYS: Record<
  GpuIndexTypeEnum,
  (keyof IGpuIndexParams)[]
> = {
  [GpuIndexTypeEnum.GPU_BRUTE_FORCE]: [],
  [GpuIndexTypeEnum.GPU_IVF_FLAT]: ['nlist', 'trainFraction'],
  [GpuIndexTypeEnum.GPU_IVF_PQ]: ['nlist', 'pqDim', 'pqBits', 'trainFraction'],
  [GpuIndexTypeEnum.GPU_CAGRA]: ['graphDegree', 'intermediateDegree'],
};

export const GPU_INDEX_TYPE_OPTIONS = [
  {
    label: 'GPU_BRUTE_FORCE',
    value: GpuIndexTypeEnum.GPU_BRUTE_FORCE,
  },
  {
    label: 'GPU_IVF_FLAT',
    value: GpuIndexTypeEnum.GPU_IVF_FLAT,
  },
  {
    label: 'GPU_IVF_PQ',
    value: GpuIndexTypeEnum.GPU_IVF_PQ,
  },
  {
    label: 'GPU_CAGRA',
    value: GpuIndexTypeEnum.GPU_CAGRA,
  },
];

export const SEGMENT_SIZE_OPTIONS = [
  {
    label: '512 MB',
    value: SegmentSizeEnum._512MB,
  },
  {
    label: '1024 MB',
    value: SegmentSizeEnum._1024MB,
  },
  {
    label: '2048 MB',
    value: SegmentSizeEnum._2048MB,
  },
];

export const MODE_OPTIONS = [
  {
    label: 'Standalone',
    value: ModeEnum.Standalone,
  },
  {
    label: 'Distributed',
    value: ModeEnum.Cluster,
  },
];

/**
 * Fixed cluster tiers, picked with `hostMemoryGB < memoryUpperBound`.
 * Mirrors the kernel demo, which drops Index Node and adds Stream Node
 * relative to the CPU sizing tool's FIXED_QUERY_NODE_CONFIG.
 */
export const GPU_FIXED_NODE_CONFIG = [
  {
    memoryUpperBound: 8,
    queryNode: { cpu: 2, memory: 8, count: 1 },
    proxy: { cpu: 1, memory: 4, count: 1 },
    mixCoord: { cpu: 1, memory: 4, count: 1 },
    dataNode: { cpu: 2, memory: 8, count: 1 },
  },
  {
    memoryUpperBound: 16,
    queryNode: { cpu: 4, memory: 16, count: 1 },
    proxy: { cpu: 2, memory: 8, count: 1 },
    mixCoord: { cpu: 2, memory: 8, count: 1 },
    dataNode: { cpu: 4, memory: 16, count: 1 },
  },
  {
    memoryUpperBound: 32,
    queryNode: { cpu: 4, memory: 16, count: 2 },
    proxy: { cpu: 2, memory: 8, count: 1 },
    mixCoord: { cpu: 2, memory: 8, count: 1 },
    dataNode: { cpu: 4, memory: 16, count: 2 },
  },
  {
    memoryUpperBound: 48,
    queryNode: { cpu: 4, memory: 16, count: 3 },
    proxy: { cpu: 2, memory: 8, count: 1 },
    mixCoord: { cpu: 2, memory: 8, count: 1 },
    dataNode: { cpu: 4, memory: 16, count: 2 },
  },
  {
    memoryUpperBound: 64,
    queryNode: { cpu: 4, memory: 16, count: 4 },
    proxy: { cpu: 2, memory: 8, count: 1 },
    mixCoord: { cpu: 2, memory: 8, count: 1 },
    dataNode: { cpu: 4, memory: 16, count: 2 },
  },
  {
    memoryUpperBound: 80,
    queryNode: { cpu: 4, memory: 16, count: 5 },
    proxy: { cpu: 2, memory: 8, count: 1 },
    mixCoord: { cpu: 2, memory: 8, count: 1 },
    dataNode: { cpu: 4, memory: 16, count: 4 },
  },
  {
    memoryUpperBound: 96,
    queryNode: { cpu: 4, memory: 16, count: 6 },
    proxy: { cpu: 2, memory: 8, count: 1 },
    mixCoord: { cpu: 2, memory: 8, count: 1 },
    dataNode: { cpu: 4, memory: 16, count: 4 },
  },
];

/** Query node sizing above the fixed tiers; CPU is always `memory / 4`. */
export const GPU_LARGE_QUERY_NODE_TIERS = [
  { memoryUpperBound: 512, memory: 32 },
  { memoryUpperBound: 2048, memory: 64 },
  { memoryUpperBound: Infinity, memory: 128 },
];

export const GPU_LARGE_BASIC_NODE_CONFIG = {
  proxy: { cpu: 8, memory: 32, count: 1 },
  mixCoord: { cpu: 8, memory: 32, count: 1 },
  dataNode: { cpu: 8, memory: 16, count: 8 },
};

/** One stream node unit covers 16 query node cores. */
export const STREAM_NODE_CORES_PER_UNIT = 16;

export const GPU_STREAM_NODE_TIERS = [
  { unitsUpperBound: 1, cpu: 2, memory: 8, count: 1 },
  { unitsUpperBound: 2, cpu: 4, memory: 16, count: 1 },
  { unitsUpperBound: 4, cpu: 4, memory: 16, count: 2 },
  { unitsUpperBound: 8, cpu: 8, memory: 32, count: 2 },
];

/** Applied above the last stream node tier; count is `ceil(units / 4)`. */
export const GPU_STREAM_NODE_LARGE_CONFIG = { cpu: 8, memory: 32 };
export const GPU_STREAM_NODE_LARGE_UNITS_PER_NODE = 4;

/** Documentation link shown next to the index picker. */
export const GPU_INDEX_DOC_LINK = '/docs/gpu_index.md';

/** Short labels used in the GPU vs CPU comparison header. */
export const GPU_INDEX_SHORT_LABELS: Record<GpuIndexTypeEnum, string> = {
  [GpuIndexTypeEnum.GPU_BRUTE_FORCE]: 'BRUTE_FORCE',
  [GpuIndexTypeEnum.GPU_IVF_FLAT]: 'IVF_FLAT',
  [GpuIndexTypeEnum.GPU_IVF_PQ]: 'IVF_PQ',
  [GpuIndexTypeEnum.GPU_CAGRA]: 'CAGRA',
};

/**
 * Which `IGpuIndexMemory` components make up the per-segment breakdown list,
 * in display order, for each index type.
 */
export const GPU_INDEX_BREAKDOWN_KEYS: Record<
  GpuIndexTypeEnum,
  (keyof IGpuIndexMemory)[]
> = {
  [GpuIndexTypeEnum.GPU_BRUTE_FORCE]: ['dataset', 'norms'],
  [GpuIndexTypeEnum.GPU_IVF_FLAT]: [
    'dataset',
    'indices',
    'centers',
    'centerNorms',
  ],
  [GpuIndexTypeEnum.GPU_IVF_PQ]: ['codes', 'indices', 'centers', 'centerNorms'],
  [GpuIndexTypeEnum.GPU_CAGRA]: ['dataset', 'graph'],
};

/** Enum names, shown verbatim in the validation banner. */
export const GPU_VALIDATION_ERROR_CODES: Record<
  GpuValidationErrorEnum,
  string
> = {
  [GpuValidationErrorEnum.InvalidNumber]: 'InvalidNumber',
  [GpuValidationErrorEnum.NlistOutOfRange]: 'NlistOutOfRange',
  [GpuValidationErrorEnum.TrainFractionOutOfRange]: 'TrainFractionOutOfRange',
  [GpuValidationErrorEnum.PqDimOutOfRange]: 'PqDimOutOfRange',
  [GpuValidationErrorEnum.PqCodeNotByteAligned]: 'PqCodeNotByteAligned',
  [GpuValidationErrorEnum.IntermediateDegreeTooSmall]:
    'IntermediateDegreeTooSmall',
};
