import {
  DIMENSION_RANGE_CONFIG,
  GRAPH_DEGREE_RANGE_CONFIG,
  INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG,
  N_LIST_RANGE_CONFIG,
  PQ_BITS_DEFAULT_VALUE,
  PQ_DIM_RANGE_CONFIG,
  TRAIN_FRACTION_RANGE_CONFIG,
  VECTOR_RANGE_CONFIG,
} from '@/consts/sizingGpu';
import {
  M_RANGE_CONFIG,
  MAX_NODE_DEGREE_RANGE_CONFIG,
  N_LIST_RANGE_CONFIG as CPU_N_LIST_RANGE_CONFIG,
} from '@/consts/sizing';
import {
  GpuIndexTypeEnum,
  GpuValidationErrorEnum,
  IGpuCalculateResult,
  IGpuSizingParams,
  ModeEnum,
  SegmentSizeEnum,
} from '@/types/sizingGpu';
import { IndexTypeEnum, RefineValueEnum } from '@/types/sizing';
import {
  gpuSizingCalculator,
  validateGpuSizingParams,
} from '@/utils/sizingToolGpu';
import {
  memoryAndDiskCalculator,
  rawDataSizeCalculator,
} from '@/utils/sizingTool';

/** Every value the GPU form owns. Off-index parameters are kept, not reset. */
export interface IGpuFormState {
  num: number;
  dimension: number;
  withScalar: boolean;
  scalarAvg: number;
  indexType: GpuIndexTypeEnum;
  nlist: number;
  trainFraction: number;
  pqDim: number;
  pqBits: number;
  graphDegree: number;
  intermediateDegree: number;
  segmentSize: SegmentSizeEnum;
  mode: ModeEnum;
}

export const DEFAULT_GPU_FORM: IGpuFormState = {
  num: VECTOR_RANGE_CONFIG.defaultValue,
  dimension: DIMENSION_RANGE_CONFIG.defaultValue,
  withScalar: false,
  scalarAvg: 0,
  indexType: GpuIndexTypeEnum.GPU_BRUTE_FORCE,
  nlist: N_LIST_RANGE_CONFIG.defaultValue,
  trainFraction: TRAIN_FRACTION_RANGE_CONFIG.defaultValue,
  pqDim: PQ_DIM_RANGE_CONFIG.defaultValue,
  pqBits: PQ_BITS_DEFAULT_VALUE,
  graphDegree: GRAPH_DEGREE_RANGE_CONFIG.defaultValue,
  intermediateDegree: INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG.defaultValue,
  segmentSize: SegmentSizeEnum._1024MB,
  mode: ModeEnum.Standalone,
};

/** The CPU tool's own numbers for the same data scale, for the comparison card. */
export interface IGpuCpuBaseline {
  rawDataSize: number;
  memorySize: number;
}

/** One consistent set of results. Only replaced while the input is valid. */
export interface IGpuSnapshot {
  params: IGpuSizingParams;
  result: IGpuCalculateResult;
  cpuBaseline: IGpuCpuBaseline;
}

export interface IGpuPayload {
  error: GpuValidationErrorEnum | null;
  snapshot: IGpuSnapshot;
}

export const toGpuSizingParams = (form: IGpuFormState): IGpuSizingParams => ({
  num: form.num,
  d: form.dimension,
  indexType: form.indexType,
  withScalar: form.withScalar,
  scalarAvg: form.scalarAvg,
  segSize: Number(form.segmentSize),
  mode: form.mode,
  indexParams: {
    nlist: form.nlist,
    trainFraction: form.trainFraction,
    pqDim: form.pqDim,
    pqBits: form.pqBits,
    graphDegree: form.graphDegree,
    intermediateDegree: form.intermediateDegree,
  },
});

/**
 * The CPU tab's FLAT baseline at the GPU tab's data scale, produced by the CPU
 * tool's own calculator rather than by a second copy of the formula.
 */
const cpuBaselineCalculator = (form: IGpuFormState): IGpuCpuBaseline => {
  const shared = {
    num: form.num,
    d: form.dimension,
    withScalar: form.withScalar,
    scalarAvg: form.scalarAvg,
  };
  const rawDataSize = rawDataSizeCalculator(shared);

  const { memory } = memoryAndDiskCalculator({
    ...shared,
    rawDataSize,
    offLoading: false,
    segSize: Number(form.segmentSize),
    mode: form.mode,
    refineType: RefineValueEnum.None,
    indexTypeParams: {
      indexType: IndexTypeEnum.FLAT,
      widthRawData: false,
      maxDegree: MAX_NODE_DEGREE_RANGE_CONFIG.defaultValue,
      inlinePq: MAX_NODE_DEGREE_RANGE_CONFIG.defaultValue,
      flatNList: CPU_N_LIST_RANGE_CONFIG.defaultValue,
      sq8NList: CPU_N_LIST_RANGE_CONFIG.defaultValue,
      rabitqNList: CPU_N_LIST_RANGE_CONFIG.defaultValue,
      m: M_RANGE_CONFIG.defaultValue,
    },
  });

  return { rawDataSize, memorySize: memory };
};

export const buildGpuPayload = (form: IGpuFormState): IGpuPayload => {
  const params = toGpuSizingParams(form);

  return {
    error: validateGpuSizingParams(params),
    snapshot: {
      params,
      result: gpuSizingCalculator(params),
      cpuBaseline: cpuBaselineCalculator(form),
    },
  };
};

/**
 * Derived from the defaults at module scope so the first paint already shows
 * real numbers, on the server and on the client alike.
 */
export const INITIAL_GPU_SNAPSHOT = buildGpuPayload(DEFAULT_GPU_FORM).snapshot;
