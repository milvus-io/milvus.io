import { format } from 'd3-format';

const defaultSizeContent = {
  size: 'Require more data',
  amount: 0,
};

// one million
const $1M = Math.pow(10, 6);
/// one billion
const $1B = Math.pow(10, 9);

// collection shard, default value = 2;
const SHARD = 2;

export const unitBYTE2Any = size => {
  let sizeStatus = 1;
  let unit = 'BYTE';
  while (sizeStatus < 4 && size > 1024) {
    size = size / 1024;
    sizeStatus++;
  }
  sizeStatus === 1
    ? (unit = 'B')
    : sizeStatus === 2
    ? (unit = 'KB')
    : sizeStatus === 3
    ? (unit = 'MB')
    : sizeStatus === 4
    ? (unit = 'GB')
    : sizeStatus === 5
    ? (unit = 'TB')
    : (unit = 'KB');

  size = Math.ceil(size * 10) / 10;
  return {
    size,
    unit,
  };
};

export const unitAny2BYTE = (size, unit) => {
  const charts = [
    {
      label: 'B',
      value: 0,
    },
    {
      label: 'KB',
      value: 1,
    },
    {
      label: 'MB',
      value: 2,
    },
    {
      label: 'GB',
      value: 3,
    },
    {
      label: 'TB',
      value: 4,
    },
  ];
  const value = charts.find(v => v.label === unit.toUpperCase())?.value || 0;
  return Math.pow(1024, value) * size;
};

export const formatVectors = value => {
  return format('~s')(value).replace('G', 'B');
};

export const memorySizeCalculator = ({ nb, d, nlist, M, indexType }) => {
  let theorySize = 0;
  let expandingRate = 0;
  switch (indexType) {
    case 'IVF_FLAT':
      theorySize = (nb + nlist) * d * 4;
      expandingRate = 2;
      return theorySize * expandingRate;

    case 'IVF_SQ8':
      theorySize = (nb + nlist) * d * 4;
      expandingRate = 3;
      return theorySize * expandingRate;

    case 'HNSW':
      theorySize = nb * d * 4 + nb * M * 8;
      expandingRate = 2;
      return theorySize * expandingRate;

    default:
      // FLAT
      theorySize = nb * d * 4;
      expandingRate = 2;
      return theorySize * expandingRate;
  }
};

export const rawFileSizeCalculator = ({ d, nb }) => {
  const sizeOfFloat = 4;
  return d * sizeOfFloat * nb;
};

export const indexNodeCalculator = (memorySize, segmentSize) => {
  const scale = segmentSize / 512;

  const size = Math.ceil((memorySize * 10) / 1024 / 1024 / 1024) / 10;
  if (size < 2 && size > 0) {
    return {
      size: `${4 * scale} core ${8 * scale} GB`,
      amount: 1,
    };
  }

  if (size >= 2 && size < 5) {
    return {
      size: `${4 * scale} core ${8 * scale} GB`,
      amount: 2,
    };
  }

  if (size >= 5 && size < 10) {
    return {
      size: `${8 * scale} core ${16 * scale} GB`,
      amount: 2,
    };
  }

  if (size >= 10 && size < 20) {
    return {
      size: `${8 * scale} core ${16 * scale} GB`,
      amount: 4,
    };
  }

  if (size >= 20) {
    return {
      size: `${8 * scale} core ${16 * scale} GB`,
      amount: 6,
    };
  }
  return defaultSizeContent;
};

export const queryNodeCalculator = memorySize => {
  const size = Math.ceil((memorySize * 10) / 1024 / 1024 / 1024) / 10;

  if (size > 0 && size < 16) {
    const scaleUp = Math.ceil(size / 4);

    return {
      size: `${scaleUp} core ${scaleUp * 4} GB`,
      amount: 1,
    };
  }

  if (size >= 16 && size < 96) {
    const scaleOut = Math.ceil(size / 16);
    return {
      size: '4 core 16 GB',
      amount: scaleOut,
    };
  }

  if (size >= 96 && size < 384) {
    const scaleOut = Math.ceil(size / 32);
    return {
      size: '8 core 32 GB',
      amount: scaleOut,
    };
  }

  if (size >= 384) {
    const scaleOut = Math.ceil(size / 32);
    return {
      size: '8 core 32 GB',
      amount: scaleOut,
    };
  }

  return defaultSizeContent;
};

export const rootCoordCalculator = nb => {
  return nb == 0
    ? defaultSizeContent
    : nb < $1B
    ? {
        size: `1 core 2 GB`,
        amount: 1,
      }
    : {
        size: '2 core 4 GB',
        amount: 2,
      };
};

export const dataNodeCalculator = nb => {
  return nb == 0
    ? defaultSizeContent
    : nb < $1M * 2
    ? {
        size: '1 core 4 GB',
        amount: 1,
      }
    : nb < $1B
    ? {
        size: '2 core 8 GB',
        amount: 1,
      }
    : {
        size: '2 core 8 GB',
        amount: SHARD,
      };
};

export const proxyCalculator = memorySize => {
  return memorySize == 0
    ? defaultSizeContent
    : memorySize < unitAny2BYTE(384, 'GB')
    ? {
        size: '1 core 4 GB',
        amount: 1,
      }
    : {
        size: '2 core 8 GB',
        amount: 1,
      };
};

export const isBetween = (value, { min, max }) => {
  console.log(value >= min, value <= max);
  return value >= min && value <= max;
};
