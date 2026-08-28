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
  GpuIndexTypeEnum,
  GpuValidationErrorEnum,
  IGpuCalculateResult,
  IGpuSizingParams,
  ModeEnum,
  SegmentSizeEnum,
} from '@/types/sizingGpu';
import {
  gpuSizingCalculator,
  validateGpuSizingParams,
} from '@/utils/sizingToolGpu';

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

/** One consistent set of results. Only replaced while the input is valid. */
export interface IGpuSnapshot {
  params: IGpuSizingParams;
  result: IGpuCalculateResult;
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

export const buildGpuPayload = (form: IGpuFormState): IGpuPayload => {
  const params = toGpuSizingParams(form);

  return {
    error: validateGpuSizingParams(params),
    snapshot: {
      params,
      result: gpuSizingCalculator(params),
    },
  };
};

/**
 * Derived from the defaults at module scope so the first paint already shows
 * real numbers, on the server and on the client alike.
 */
export const INITIAL_GPU_SNAPSHOT = buildGpuPayload(DEFAULT_GPU_FORM).snapshot;
