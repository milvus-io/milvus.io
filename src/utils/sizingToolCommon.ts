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
  let baseUnit = 'BYTE';
  while (sizeStatus < units.length - 1 && size > 1024) {
    size = size / 1024;
    sizeStatus++;
  }
  baseUnit = units[sizeStatus];
  const decimal = sizeStatus >= 4 ? 100 : 10;
  size = Math.round(size * decimal) / decimal;
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
  }) => {
    const { num, d, withScalar, scalarAvg } = params;

    const vectorRaw = (num * d * ONE_MILLION * 32) / 8; // bytes
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
