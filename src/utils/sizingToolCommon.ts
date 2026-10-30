import { VectorTypeEnum, SegmentSizeMetricEnum } from '@/types/sizing';
export { VectorTypeEnum, SegmentSizeMetricEnum };

/**
 * Common utility functions shared between sizing tool versions
 */

export type DataSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';

/**
 * Convert bytes to a human-readable format
 */
export const unitBYTE2Any = (size: number, unit?: DataSizeUnit) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
  if (unit) {
    const base = units.findIndex(v => v === unit.toUpperCase());
    return {
      unit,
      size: size / Math.pow(1024, base),
    };
  }

  let sizeStatus = 0;
  while (sizeStatus < units.length - 1 && size >= 1024) {
    size = size / 1024;
    sizeStatus++;
  }
  const decimal = sizeStatus >= 4 ? 100 : 10;
  size = Math.round(size * decimal) / decimal;
  if (size >= 1024 && sizeStatus < units.length - 1) {
    size = size / 1024;
    sizeStatus++;
    const nextDecimal = sizeStatus >= 4 ? 100 : 10;
    size = Math.round(size * nextDecimal) / nextDecimal;
  }
  const baseUnit = units[sizeStatus];
  return {
    size,
    unit: baseUnit,
  };
};

/**
 * Convert any unit to bytes
 */
export const unitAny2BYTE = (size: number, unit: DataSizeUnit) => {
  const charts = [
    { label: 'B', value: 0 },
    { label: 'KB', value: 1 },
    { label: 'MB', value: 2 },
    { label: 'GB', value: 3 },
    { label: 'TB', value: 4 },
    { label: 'PB', value: 5 },
    { label: 'EB', value: 6 },
  ];
  const value = charts.find(v => v.label === unit.toUpperCase())?.value || 0;
  return Math.pow(1024, value) * size;
};

/**
 * Format large numbers with unit suffixes (K, M, B, T)
 */
export const formatNumber = (num: number) => {
  const units = ['', 'K', 'M', 'B', 'T'];
  let i = 0;
  let number = num;
  while (number > 1000 && i < 4) {
    number = Math.round((number / 1000) * 10) / 10;
    i += 1;
  }

  return {
    num: number,
    unit: units[i],
  };
};

/**
 * Format data for out-of-calculation state
 */
export const formatOutOfCalData = <T>(params: { data: T; isOut: boolean }) => {
  const { data, isOut } = params;
  if (isOut) {
    return '--';
  }
  return data;
};

/**
 * Calculate standalone node configuration based on memory requirement
 */
export const standaloneNodeConfigCalculator = (params: { memory: number }) => {
  const { size: memoryGb } = unitBYTE2Any(params.memory, 'GB');

  let properMemorySize = 0;
  if (memoryGb <= 8) {
    properMemorySize = 8;
  } else if (memoryGb <= 16) {
    properMemorySize = 16;
  } else {
    properMemorySize = Math.ceil(memoryGb / 32) * 32;
  }
  const properCoreSize = properMemorySize / 4;

  return {
    cpu: properCoreSize,
    memory: properMemorySize,
    count: 1,
  };
};

/**
 * Create rawDataSizeCalculator with configurable ONE_MILLION constant
 */
export const createRawDataSizeCalculator = (ONE_MILLION: number) => {
  return (params: {
    num: number;
    d: number;
    withScalar: boolean;
    scalarAvg: number;
    vectorType?: VectorTypeEnum;
    avgNnz?: number;
    sindiCompression?: boolean;
  }) => {
    const { num, d, withScalar, scalarAvg, vectorType, avgNnz, sindiCompression } = params;

    let vectorBytesPerItem: number;
    switch (vectorType) {
      case VectorTypeEnum.FLOAT16_VECTOR:
      case VectorTypeEnum.BFLOAT16_VECTOR:
        vectorBytesPerItem = d * 2;
        break;
      case VectorTypeEnum.INT8_VECTOR:
        vectorBytesPerItem = d * 1;
        break;
      case VectorTypeEnum.BINARY_VECTOR:
        vectorBytesPerItem = d / 8;
        break;
      case VectorTypeEnum.SPARSE_FLOAT_VECTOR:
        // Standard sparse vector: avgNnz * 8 bytes (dim int32 + val float32)
        // Milvus 3.0 SINDI compressed: avgNnz * 2.8 bytes
        vectorBytesPerItem = (avgNnz ?? d) * (sindiCompression ? 2.8 : 8);
        break;
      case VectorTypeEnum.FLOAT_VECTOR:
      default:
        vectorBytesPerItem = (d * 32) / 8;
        break;
    }

    const vectorRaw = num * ONE_MILLION * vectorBytesPerItem; // bytes
    const scalarRaw = withScalar ? num * scalarAvg * ONE_MILLION : 0; // bytes

    return vectorRaw + scalarRaw;
  };
};

/**
 * Create data size constants based on rawDataSizeCalculator
 */
export const createDataSizeConstants = (
  rawDataSizeCalculator: ReturnType<typeof createRawDataSizeCalculator>
) => {
  const $1M768D = rawDataSizeCalculator({
    num: 1,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
  });

  const $10M768D = rawDataSizeCalculator({
    num: 10,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
  });

  const $50M768D = rawDataSizeCalculator({
    num: 50,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
  });

  const $100M768D = rawDataSizeCalculator({
    num: 100,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
  });

  const $500M768D = rawDataSizeCalculator({
    num: 500,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
  });

  const $1B768D = rawDataSizeCalculator({
    num: 1000,
    d: 768,
    withScalar: false,
    scalarAvg: 0,
  });

  return {
    $1M768D,
    $10M768D,
    $50M768D,
    $100M768D,
    $500M768D,
    $1B768D,
  };
};

/**
 * SINDI sparse vector memory calculator (Milvus 3.0):
 * Returns estimated memory footprint in bytes.
 * Memory_sindi = N * avg_nnz * 2.8 bytes (compressed inverted index & posting list)
 */
export const sindiSparseMemoryCalculator = (params: {
  num: number;
  avgNnz: number;
  ONE_MILLION?: number;
}) => {
  const { num, avgNnz, ONE_MILLION = 1000000 } = params;
  return num * ONE_MILLION * avgNnz * 2.8;
};
