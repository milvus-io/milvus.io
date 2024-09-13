import { IndexTypeEnum } from '@/components/card/sizingToolCard/constants';
type DataSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';
type DataNode = {
  size: string;
  cpu: number;
  memory: number;
  amount: number;
};

type MilvusDataType = {
  cpu: number;
  memory: number;
  podNumber: number;
  pvcPerPodSize: number;
  pvcPerPodUnit: string;
  isError: boolean;
};

type ApacheType = 'pulsar' | 'kafka';

const ONE_MILLION = Math.pow(10, 6);

const defaultSizeContent = {
  size: 'Require more data',
  cpu: 0,
  memory: 0,
  amount: 0,
};

// one million
const $1M = Math.pow(10, 6);
/// one billion
const $1B = Math.pow(10, 9);

// collection shard, default value = 2;
const SHARD = 2;

export const unitBYTE2Any = (size: number, unit?: DataSizeUnit) => {
  if (unit) {
    const base = ['B', 'KB', 'MB', 'GB', 'TB'].findIndex(
      v => v === unit.toUpperCase()
    );
    return {
      unit,
      size: size / Math.pow(1024, base),
    };
  }

  let sizeStatus = 1;
  let baseUnit = 'BYTE';
  while (sizeStatus < 4 && size > 1024) {
    size = size / 1024;
    sizeStatus++;
  }
  sizeStatus === 1
    ? (baseUnit = 'B')
    : sizeStatus === 2
    ? (baseUnit = 'K')
    : sizeStatus === 3
    ? (baseUnit = 'M')
    : sizeStatus === 4
    ? (baseUnit = 'G')
    : sizeStatus === 5
    ? (baseUnit = 'T')
    : (baseUnit = 'K');

  size = Math.ceil(size * 10) / 10;
  return {
    size,
    unit: baseUnit,
  };
};

export const unitAny2BYTE = (size: number, unit: DataSizeUnit) => {
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

export const memorySizeCalculator: (params: {
  nb: number;
  d: number;
  nlist: number;
  M: number;
  indexType: string;
}) => {
  theorySize: number;
  memorySize: number;
} = ({ nb, d, nlist, M, indexType }) => {
  let theorySize = 0;
  let expandingRate = 0;
  switch (indexType) {
    case IndexTypeEnum.IVF_FLAT:
      theorySize = (nb + nlist) * d * 4;
      expandingRate = 2;
      return {
        theorySize,
        memorySize: theorySize * expandingRate,
      };

    case IndexTypeEnum.IVF_SQ8:
      theorySize = nb * d + nlist * d * 4;
      expandingRate = 3;
      return {
        theorySize,
        memorySize: theorySize * expandingRate,
      };

    case IndexTypeEnum.HNSW:
      theorySize = nb * d * 4 + nb * M * 8;
      expandingRate = 2;
      return {
        theorySize,
        memorySize: theorySize * expandingRate,
      };
    case IndexTypeEnum.DISKANN:
      theorySize = rawFileSizeCalculator({ d, nb }) / 4;
      expandingRate = 1;
      return {
        theorySize,
        memorySize: theorySize * expandingRate,
      };

    default:
      // FLAT
      theorySize = nb * d * 4;
      expandingRate = 2;
      return {
        theorySize,
        memorySize: theorySize * expandingRate,
      };
  }
};

export const rawFileSizeCalculator: (params: {
  d: number;
  nb: number;
}) => number = ({ d, nb }) => {
  const sizeOfFloat = 4;
  return d * sizeOfFloat * nb;
};

export const indexNodeCalculator = (
  theorySize: number,
  segmentSize: number
) => {
  const scale = segmentSize / 512;

  const size = Math.ceil((theorySize * 10) / 1024 / 1024 / 1024) / 10;
  if (size < 5 && size > 0) {
    return {
      size: `${4 * scale} core ${8 * scale} GB`,
      cpu: 4 * scale,
      memory: 8 * scale,
      amount: 1,
    };
  }

  if (size >= 5 && size < 20) {
    return {
      size: `${4 * scale} core ${8 * scale} GB`,
      cpu: 4 * scale,
      memory: 8 * scale,
      amount: 2,
    };
  }

  if (size >= 20 && size < 50) {
    return {
      size: `${8 * scale} core ${16 * scale} GB`,
      cpu: 8 * scale,
      memory: 16 * scale,
      amount: 2,
    };
  }

  if (size >= 50) {
    return {
      size: `${8 * scale} core ${16 * scale} GB`,
      cpu: 8 * scale,
      memory: 16 * scale,
      amount: 4,
    };
  }

  return defaultSizeContent;
};

export const queryNodeCalculator = (memorySize: number) => {
  const size = Math.ceil((memorySize * 10) / 1024 / 1024 / 1024) / 10;

  if (size > 0 && size < 16) {
    const scaleUp = Math.ceil(size / 4);

    return {
      size: `${scaleUp} core ${scaleUp * 4} GB`,
      cpu: scaleUp,
      memory: scaleUp * 4,
      amount: 1,
    };
  }

  if (size >= 16 && size < 96) {
    const scaleOut = Math.ceil(size / 16);
    return {
      size: '4 core 16 GB',
      cpu: 4,
      memory: 16,
      amount: scaleOut,
    };
  }

  if (size >= 96 && size < 384) {
    const scaleOut = Math.ceil(size / 32);
    return {
      size: '8 core 32 GB',
      cpu: 8,
      memory: 32,
      amount: scaleOut,
    };
  }

  if (size >= 384 && size < 4000) {
    const scaleOut = Math.ceil(size / 64);
    return {
      size: '8 core 64 GB',
      cpu: 8,
      memory: 64,
      amount: scaleOut,
    };
  }

  if (size >= 4000) {
    const scaleOut = Math.ceil(size / 128);
    return {
      size: '16 core 128 GB',
      cpu: 16,
      memory: 128,
      amount: scaleOut,
    };
  }

  return defaultSizeContent;
};

export const rootCoordCalculator = (nb: number) => {
  return nb === 0
    ? defaultSizeContent
    : nb < $1B
    ? {
        size: `1 core 2 GB`,
        cpu: 1,
        memory: 2,
        amount: 1,
      }
    : {
        size: '2 core 4 GB',
        cpu: 2,
        memory: 4,
        amount: 1,
      };
};

export const dataNodeCalculator = (nb: number) => {
  return nb === 0
    ? defaultSizeContent
    : nb < $1M * 40
    ? {
        size: '1 core 4 GB',
        cpu: 1,
        memory: 4,
        amount: 1,
      }
    : nb < $1B
    ? {
        size: '2 core 8 GB',
        cpu: 2,
        memory: 8,
        amount: 1,
      }
    : {
        size: '2 core 8 GB',
        cpu: 2,
        memory: 8,
        amount: SHARD,
      };
};

export const proxyCalculator = (memorySize: number) => {
  return memorySize === 0
    ? defaultSizeContent
    : memorySize < unitAny2BYTE(384, 'GB')
    ? {
        size: '1 core 4 GB',
        cpu: 1,
        memory: 4,
        amount: 1,
      }
    : {
        size: '2 core 8 GB',
        cpu: 2,
        memory: 8,
        amount: 1,
      };
};

export const commonCoordCalculator = (memorySize: number) => {
  const $1TB = unitAny2BYTE(1, 'TB');

  return memorySize < $1TB
    ? {
        size: '0.5 core 0.5 GB',
        cpu: 0.5,
        memory: 0.5,
        amount: 1,
      }
    : {
        size: '1 core 1 GB',
        cpu: 1,
        memory: 1,
        amount: 1,
      };
};

export const mixCoordCalculator = (nb: number) => {
  const numberOfVector = nb / ONE_MILLION;
  // unit is million
  if (numberOfVector <= 1) {
    return {
      size: '1 core 4 GB',
      cpu: 1,
      memory: 4,
      amount: 1,
    };
  } else if (numberOfVector > 1 && numberOfVector < 100) {
    return {
      size: '2 core 8 GB',
      cpu: 2,
      memory: 8,
      amount: 1,
    };
  } else {
    return {
      size: '4 core 16 GB',
      cpu: 4,
      memory: 16,
      amount: 1,
    };
  }
};

export const isBetween: (
  value: number,
  option: {
    min: number;
    max: number;
  }
) => boolean = (value, { min, max }) => {
  return value >= min && value <= max;
};

export const etcdCalculator = (rowFileSize?: number) => {
  let cpu = 0;
  let memory = 0;
  let podNumber = 0;
  let pvcPerPodSize = 0;
  let pvcPerPodUnit = '';
  let isError = false;

  if (!rowFileSize) {
    isError = true;
  } else {
    if (rowFileSize <= unitAny2BYTE(50, 'GB')) {
      cpu = 1;
      memory = 2;
      podNumber = 3;
      pvcPerPodSize = 30;
      pvcPerPodUnit = 'G';
    } else if (
      rowFileSize > unitAny2BYTE(50, 'GB') &&
      rowFileSize <= unitAny2BYTE(500, 'GB')
    ) {
      cpu = 2;
      memory = 4;
      podNumber = 3;
      pvcPerPodSize = 30;
      pvcPerPodUnit = 'G';
    } else {
      cpu = 4;
      memory = 8;
      podNumber = 3;
      pvcPerPodSize = 30;
      pvcPerPodUnit = 'G';
    }
  }

  return {
    cpu,
    memory,
    podNumber,
    pvcPerPodSize,
    pvcPerPodUnit,
    isError,
  };
};

export const minioCalculator = (rowFileSize?: number, indexSize?: number) => {
  let cpu = 0;
  let memory = 0;
  let podNumber = 0;
  let pvcPerPodSize = 0;
  let pvcPerPodUnit = '';
  let isError = false;

  if (!rowFileSize || !indexSize) {
    isError = true;
  } else {
    const { size, unit } = unitBYTE2Any(
      ((rowFileSize + indexSize) * 3 * 2) / 4
    );
    const intSize = Math.ceil(size / 10) * 10;

    if (rowFileSize <= unitAny2BYTE(50, 'GB') || !rowFileSize) {
      cpu = 1;
      memory = 2;
      podNumber = 4;
      pvcPerPodSize = intSize;
      pvcPerPodUnit = unit;
    } else if (
      rowFileSize > unitAny2BYTE(50, 'GB') &&
      rowFileSize <= unitAny2BYTE(500, 'GB')
    ) {
      cpu = 2;
      memory = 8;
      podNumber = 4;
      pvcPerPodSize = intSize;
      pvcPerPodUnit = unit;
    } else {
      cpu = 4;
      memory = 16;
      podNumber = 4;
      pvcPerPodSize = intSize;
      pvcPerPodUnit = unit;
    }
  }

  return {
    cpu,
    memory,
    podNumber,
    pvcPerPodSize,
    pvcPerPodUnit,
    isError,
  };
};

export const pulsarCalculator = (rowFileSize?: number) => {
  const minimumJournalSize = unitAny2BYTE(10, 'GB');
  const minimumLedgersSize = unitAny2BYTE(25, 'GB');

  let bookie = {
    cpu: {
      key: 'Cpu',
      size: 0,
      unit: '',
    },
    memory: {
      key: 'Memory',
      size: 0,
      unit: '',
    },
    xms: {
      key: '-Xms',
      size: 0,
      unit: '',
    },
    xmx: {
      key: '-Xmx',
      size: 0,
      unit: '',
    },
    xx: {
      key: '-Xx',
      size: 0,
      unit: '',
    },
    podNum: {
      key: 'Pod Number',
      value: 0,
    },
    journal: {
      key: 'Journal',
      size: 0,
      unit: '',
    },
    ledgers: {
      key: 'Ledgers',
      size: 0,
      unit: '',
      isSSD: true,
    },
  };
  let broker = {
    cpu: {
      key: 'Cpu',
      size: 0,
      unit: '',
    },
    memory: {
      key: 'Memory',
      size: 0,
      unit: '',
    },
    xms: {
      key: '-Xms',
      size: 0,
      unit: '',
    },
    xmx: {
      key: '-Xmx',
      size: 0,
      unit: '',
    },
    xx: {
      key: '-Xx',
      size: 0,
      unit: '',
    },
    podNum: {
      key: 'Pod Number',
      value: 0,
    },
  };
  let proxy = {
    cpu: {
      key: 'Cpu',
      size: 0,
      unit: '',
    },
    memory: {
      key: 'Memory',
      size: 0,
      unit: '',
    },
    xms: {
      key: '-Xms',
      size: 0,
      unit: '',
    },
    xmx: {
      key: '-Xmx',
      size: 0,
      unit: '',
    },
    xx: {
      key: '-Xx',
      size: 0,
      unit: '',
    },
    podNum: {
      key: 'Pod Number',
      value: 0,
    },
  };
  let zookeeper = {
    cpu: {
      key: 'Cpu',
      size: 0,
      unit: '',
    },
    memory: {
      key: 'Memory',
      size: 0,
      unit: '',
    },
    xms: {
      key: '-Xms',
      size: 0,
      unit: '',
    },
    xmx: {
      key: '-Xmx',
      size: 0,
      unit: '',
    },

    podNum: {
      key: 'Pod Number',
      value: 0,
    },
    pvc: {
      key: 'Pvc per Pod',
      size: 0,
      unit: '',
      isSSD: true,
    },
  };
  if (!rowFileSize) {
    return {
      bookie,
      broker,
      proxy,
      zookeeper,
    };
  }

  const journalData =
    rowFileSize > minimumJournalSize
      ? unitBYTE2Any(rowFileSize / 5)
      : { size: 10, unit: 'G' };
  const ledgersData =
    rowFileSize > minimumLedgersSize
      ? unitBYTE2Any(rowFileSize / 2)
      : { size: 25, unit: 'G' };

  const intJournalData = {
    size: Math.ceil(journalData.size / 10) * 10,
    unit: journalData.unit,
  };

  const intLedgersData = {
    size: Math.ceil(ledgersData.size / 10) * 10,
    unit: ledgersData.unit,
  };

  if (rowFileSize <= unitAny2BYTE(50, 'GB')) {
    bookie = {
      cpu: {
        key: 'Cpu',
        size: 1,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 8,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 2048,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 2048,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 4096,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      journal: {
        key: 'Journal',
        size: intJournalData.size,
        unit: intJournalData.unit,
      },
      ledgers: {
        key: 'Ledgers',
        size: intLedgersData.size,
        unit: intLedgersData.unit,
        isSSD: true,
      },
    };
    broker = {
      cpu: {
        key: 'Cpu',
        size: 2,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 9,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 2048,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 2048,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 4096,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 2,
      },
    };
    proxy = {
      cpu: {
        key: 'Cpu',
        size: 1,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 3,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 1024,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 1024,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 1024,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 2,
      },
    };
    zookeeper = {
      cpu: {
        key: 'Cpu',
        size: 1,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 1,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 512,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 512,
        unit: 'M',
      },

      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc per Pod',
        size: 20,
        unit: 'G',
        isSSD: true,
      },
    };
  } else if (
    rowFileSize > unitAny2BYTE(50, 'GB') &&
    rowFileSize <= unitAny2BYTE(500, 'GB')
  ) {
    bookie = {
      cpu: {
        key: 'Cpu',
        size: 2,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 16,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 4096,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 4096,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 8192,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      journal: {
        key: 'Journal',
        size: intJournalData.size,
        unit: intJournalData.unit,
      },
      ledgers: {
        key: 'Ledgers',
        size: intLedgersData.size,
        unit: intLedgersData.unit,
        isSSD: true,
      },
    };
    broker = {
      cpu: {
        key: 'Cpu',
        size: 2,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 18,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 4096,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 4096,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 8192,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 2,
      },
    };
    proxy = {
      cpu: {
        key: 'Cpu',
        size: 2,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 5,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 2048,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 2048,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 2048,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 2,
      },
    };
    zookeeper = {
      cpu: {
        key: 'Cpu',
        size: 1,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 2,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 1024,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 1024,
        unit: 'M',
      },

      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc per Pod',
        size: 20,
        unit: 'G',
        isSSD: true,
      },
    };
  } else {
    bookie = {
      cpu: {
        key: 'Cpu',
        size: 4,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 32,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 8192,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 8192,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 16384,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      journal: {
        key: 'Journal',
        size: intJournalData.size,
        unit: intJournalData.unit,
      },
      ledgers: {
        key: 'Ledgers',
        size: intLedgersData.size,
        unit: intLedgersData.unit,
        isSSD: true,
      },
    };
    broker = {
      cpu: {
        key: 'Cpu',
        size: 4,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 36,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 8192,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 8192,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 16384,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 2,
      },
    };
    proxy = {
      cpu: {
        key: 'Cpu',
        size: 4,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 9,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 4096,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 4096,
        unit: 'M',
      },
      xx: {
        key: '-Xx',
        size: 4096,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 2,
      },
    };
    zookeeper = {
      cpu: {
        key: 'Cpu',
        size: 2,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 4,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 2048,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 2048,
        unit: 'M',
      },

      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc per Pod',
        size: 20,
        unit: 'G',
        isSSD: true,
      },
    };
  }

  return {
    bookie,
    broker,
    proxy,
    zookeeper,
  };
};

export const kafkaCalculator = (rowFileSize?: number) => {
  let broker = {
    cpu: {
      key: 'Cpu',
      size: 0,
      unit: 'core',
    },
    memory: {
      key: 'Memory',
      size: 0,
      unit: 'G',
    },
    xms: {
      key: '-Xms',
      size: 0,
      unit: '',
    },
    xmx: {
      key: '-Xmx',
      size: 0,
      unit: '',
    },
    podNum: {
      key: 'Pod Number',
      value: 0,
    },
    pvc: {
      key: 'Pvc Per Pod',
      size: 0,
      unit: '',
      isSSD: false,
    },
  };
  let zookeeper = {
    cpu: {
      key: 'Cpu',
      size: 0,
      unit: 'core',
    },
    memory: {
      key: 'Memory',
      size: 0,
      unit: 'G',
    },
    xms: {
      key: '-Xms',
      size: 0,
      unit: '',
    },
    xmx: {
      key: '-Xmx',
      size: 0,
      unit: '',
    },
    podNum: {
      key: 'Pod Number',
      value: 0,
    },
    pvc: {
      key: 'Pvc Per Pod',
      size: 0,
      unit: '',
      isSSD: true,
    },
  };

  if (!rowFileSize) {
    return {
      broker,
      zookeeper,
    };
  }

  const minimumBrokerPvc = unitAny2BYTE(10, 'GB');

  const { size, unit } =
    minimumBrokerPvc > rowFileSize
      ? { size: 10, unit: 'G' }
      : unitBYTE2Any(rowFileSize);

  const intSize = Math.ceil(size / 10) * 10;

  if (rowFileSize <= unitAny2BYTE(50, 'GB')) {
    broker = {
      cpu: {
        key: 'Cpu',
        size: 1,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 7,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 2048,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 2048,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc Per Pod',
        size: intSize,
        unit: unit,
        isSSD: false,
      },
    };
    zookeeper = {
      cpu: {
        key: 'Cpu',
        size: 1,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 1,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 512,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 512,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc Per Pod',
        size: 20,
        unit: 'G',
        isSSD: true,
      },
    };
  } else if (
    rowFileSize > unitAny2BYTE(50, 'GB') &&
    rowFileSize <= unitAny2BYTE(500, 'GB')
  ) {
    broker = {
      cpu: {
        key: 'Cpu',
        size: 2,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 13,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 4096,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 4096,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc Per Pod',
        size: intSize,
        unit: unit,
        isSSD: false,
      },
    };
    zookeeper = {
      cpu: {
        key: 'Cpu',
        size: 1,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 2,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 1024,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 1024,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc Per Pod',
        size: 20,
        unit: 'G',
        isSSD: true,
      },
    };
  } else {
    broker = {
      cpu: {
        key: 'Cpu',
        size: 4,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 25,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 8192,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 8192,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc Per Pod',
        size: intSize,
        unit: unit,
        isSSD: false,
      },
    };
    zookeeper = {
      cpu: {
        key: 'Cpu',
        size: 2,
        unit: 'core',
      },
      memory: {
        key: 'Memory',
        size: 4,
        unit: 'G',
      },
      xms: {
        key: '-Xms',
        size: 2048,
        unit: 'M',
      },
      xmx: {
        key: '-Xmx',
        size: 2048,
        unit: 'M',
      },
      podNum: {
        key: 'Pod Number',
        value: 3,
      },
      pvc: {
        key: 'Pvc Per Pod',
        size: 20,
        unit: 'G',
        isSSD: true,
      },
    };
  }

  return {
    broker,
    zookeeper,
  };
};

export const helmYmlGenerator: (
  params: {
    proxy: DataNode;
    mixCoord: DataNode;
    indexNode: DataNode;
    commonCoord: DataNode;
    etcdData: MilvusDataType;
    minioData: MilvusDataType;
    pulsarData: any;
    kafkaData: any;
  },
  apacheType: ApacheType
) => any = (
  {
    proxy,
    mixCoord,
    indexNode,
    commonCoord,
    etcdData,
    minioData,
    pulsarData,
    kafkaData,
  },
  apacheType
) => {
  const pulsarConfig = `
pulsar:
  enabled: true
  proxy:
    resources:
      requests:
        memory: ${pulsarData.proxy.memory.size}${pulsarData.proxy.memory.unit}i
        cpu: ${pulsarData.proxy.cpu.size}
    replicaCount: ${pulsarData.proxy.podNum.value}
    configData:
      PULSAR_MEM: >
        -Xms${pulsarData.proxy.xms.size}${pulsarData.proxy.xms.unit}
        -Xmx${pulsarData.proxy.xmx.size}${pulsarData.proxy.xmx.unit}
        -XX:MaxDirectMemorySize=${pulsarData.proxy.xx.size}${pulsarData.proxy.xx.unit}
      httpNumThreads: "100"
  zookeeper:
    volumes:
      persistence: true
      data:
        name: data
        size: ${pulsarData.zookeeper.pvc.size}${pulsarData.zookeeper.pvc.unit}i   #SSD Required
        storageClassName:
    resources:
      requests:
        memory: ${pulsarData.zookeeper.memory.size}${pulsarData.zookeeper.memory.unit}i
        cpu: ${pulsarData.zookeeper.cpu.size}
    configData:
      PULSAR_MEM: >
        -Xms${pulsarData.zookeeper.xms.size}${pulsarData.zookeeper.xms.unit}
        -Xmx${pulsarData.zookeeper.xmx.size}${pulsarData.zookeeper.xmx.unit}
  bookkeeper:
    volumes:
      journal:
        name: journal
        size: ${pulsarData.bookie.journal.size}${pulsarData.bookie.journal.unit}i
        storageClassName:
      ledgers:
        name: ledgers
        size: ${pulsarData.bookie.ledgers.size}${pulsarData.bookie.ledgers.unit}i  #SSD Required
        storageClassName:
    resources:
      requests:
        memory: ${pulsarData.bookie.memory.size}${pulsarData.bookie.memory.unit}i
        cpu: ${pulsarData.bookie.cpu.size}
    configData:
      PULSAR_MEM: >
        -Xms${pulsarData.bookie.xms.size}${pulsarData.bookie.xms.unit}
        -Xmx${pulsarData.bookie.xmx.size}${pulsarData.bookie.xmx.unit}
        -XX:MaxDirectMemorySize=${pulsarData.bookie.xx.size}${pulsarData.bookie.xx.unit}
  broker:
    component: broker
    podMonitor:
      enabled: false
    replicaCount: ${pulsarData.broker.podNum.value}
    resources:
      requests:
        memory: ${pulsarData.broker.memory.size}${pulsarData.broker.memory.unit}i
        cpu: ${pulsarData.broker.cpu.size}
    configData:
      PULSAR_MEM: >
        -Xms${pulsarData.broker.xms.size}${pulsarData.broker.xms.unit}
        -Xmx${pulsarData.broker.xmx.size}${pulsarData.broker.xmx.unit}
        -XX:MaxDirectMemorySize=${pulsarData.broker.xx.size}${pulsarData.broker.xx.unit}
  `;

  const kafkaConfig = `
pulsar:
  enabled: false
kafka:
  enabled: true
  heapOpts: "-Xmx${kafkaData.broker.xmx.size}${kafkaData.broker.xmx.unit} -Xms${kafkaData.broker.xms.size}${kafkaData.broker.xms.unit}"
  persistence:
    enabled: true
    storageClass:
    accessMode: ReadWriteOnce
    size: ${kafkaData.broker.pvc.size}${kafkaData.broker.pvc.unit}
  resources:
    limits:
      cpu: ${kafkaData.broker.cpu.size}
      memory: ${kafkaData.broker.memory.size}${kafkaData.broker.memory.unit}i
  zookeeper:
    enabled: true
    replicaCount: ${kafkaData.zookeeper.podNum.value}
    heapSize: ${kafkaData.zookeeper.xms.size}  # zk heap size in MB
    persistence:
      enabled: true
      storageClass: ""
      accessModes:
        - ReadWriteOnce
      size: ${kafkaData.zookeeper.pvc.size}${kafkaData.zookeeper.pvc.unit}i   #SSD Required
    resources:
      limits:
        cpu: ${kafkaData.zookeeper.cpu.size}
        memory: ${kafkaData.zookeeper.memory.size}${kafkaData.zookeeper.memory.unit}i
  `;

  return `mixCoordinator:
  replicas: ${mixCoord.amount}
  resources: 
    limits:
      cpu: "${mixCoord.cpu}"
      memory: ${mixCoord.memory}Gi
proxy:
  replicas: ${proxy.amount}
  resources: 
    limits:
      cpu: ${proxy.cpu}
      memory: ${proxy.memory}Gi
indexNode:
  replicas: ${indexNode.amount}
  resources: 
    limits:
      cpu: ${indexNode.cpu}
      memory: ${indexNode.memory}Gi
etcd:
  autoCompactionMode: revision
  autoCompactionRetention: "1000"
  extraEnvVars:
  - name: ETCD_QUOTA_BACKEND_BYTES
    value: "4294967296"
  - name: ETCD_HEARTBEAT_INTERVAL
    value: "500"
  - name: ETCD_ELECTION_TIMEOUT
    value: "25000"
  - name: ETCD_SNAPSHOT_COUNT
    value: "10000"
  - name: ETCD_ENABLE_PPROF
    value: "true"
  persistence:
    accessMode: ReadWriteOnce
    enabled: true
    size: ${etcdData.pvcPerPodSize}${etcdData.pvcPerPodUnit}i  #SSD Required
    storageClass:
  replicaCount: ${etcdData.podNumber}
  resources:
    limits:
      cpu: ${etcdData.cpu}
      memory: ${etcdData.memory}Gi
    requests:
      cpu: ${etcdData.cpu}
      memory: ${etcdData.memory}Gi
${apacheType === 'pulsar' ? pulsarConfig : kafkaConfig}
minio:
  resources:
    limits:
      cpu: ${minioData.cpu}
      memory: ${minioData.memory}Gi
  persistence:
    storageClass:
    accessMode: ReadWriteOnce
    size: ${minioData.pvcPerPodSize}${minioData.pvcPerPodUnit}i
  `;
};

export const operatorYmlGenerator: (
  params: {
    mixCoord: DataNode;
    proxy: DataNode;
    indexNode: DataNode;
    commonCoord: DataNode;
    etcdData: MilvusDataType;
    minioData: MilvusDataType;
    pulsarData: any;
    kafkaData: any;
  },
  apacheType: ApacheType
) => any = (
  {
    mixCoord,
    proxy,
    indexNode,
    commonCoord,
    etcdData,
    minioData,
    pulsarData,
    kafkaData,
  },
  apacheType
) => {
  const pulsarConfig = `
    pulsar:
      inCluster:
        values:
          proxy:
            replicaCount: ${pulsarData.proxy.podNum.value}
            configData:
              PULSAR_MEM: >
                -Xms${pulsarData.proxy.xms.size}${pulsarData.proxy.xms.unit}
                -Xmx${pulsarData.proxy.xmx.size}${pulsarData.proxy.xmx.unit}
                -XX:MaxDirectMemorySize=${pulsarData.proxy.xx.size}${pulsarData.proxy.xx.unit}
              httpNumThreads: "100"
          zookeeper:
            volumes:
              persistence: true
              data:
                name: data
                size: ${pulsarData.zookeeper.pvc.size}${pulsarData.zookeeper.pvc.unit}i   #SSD Required
                storageClassName:
            resources:
              requests:
                memory: ${pulsarData.zookeeper.memory.size}${pulsarData.zookeeper.memory.unit}i
                cpu: ${pulsarData.zookeeper.cpu.size}
            configData:
              PULSAR_MEM: >
                -Xms${pulsarData.zookeeper.xms.size}${pulsarData.zookeeper.xms.unit}
                -Xmx${pulsarData.zookeeper.xmx.size}${pulsarData.zookeeper.xmx.unit}
          bookkeeper:
            volumes:
              journal:
                name: journal
                size: ${pulsarData.bookie.journal.size}${pulsarData.bookie.journal.unit}i
                storageClassName:
              ledgers:
                name: ledgers
                size: ${pulsarData.bookie.ledgers.size}${pulsarData.bookie.ledgers.unit}i   #SSD Required
                storageClassName:
            resources:
              requests:
                memory: ${pulsarData.bookie.memory.size}${pulsarData.bookie.memory.unit}i
                cpu: ${pulsarData.bookie.cpu.size}
            configData:
              PULSAR_MEM: >
                -Xms${pulsarData.bookie.xms.size}${pulsarData.bookie.xms.unit}
                -Xmx${pulsarData.bookie.xmx.size}${pulsarData.bookie.xmx.unit}
                -XX:MaxDirectMemorySize=${pulsarData.bookie.xx.size}${pulsarData.bookie.xx.unit}
          broker:
            component: broker
            podMonitor:
              enabled: false
            replicaCount: ${pulsarData.broker.podNum.value}
            resources:
              requests:
                memory: ${pulsarData.broker.memory.size}${pulsarData.broker.memory.unit}i
                cpu: ${pulsarData.broker.cpu.size}
            configData:
              PULSAR_MEM: >
                -Xms${pulsarData.broker.xms.size}${pulsarData.broker.xms.unit}
                -Xmx${pulsarData.broker.xmx.size}${pulsarData.broker.xmx.unit}
                -XX:MaxDirectMemorySize=${pulsarData.broker.xx.size}${pulsarData.broker.xx.unit}
  `;

  const kafkaConfig = `
    msgStreamType: kafka
    kafka:
      inCluster:
        values:
          heapOpts: "-Xmx${kafkaData.broker.xmx.size}${kafkaData.broker.xmx.unit} -Xms${kafkaData.broker.xms.size}${kafkaData.broker.xms.unit}"
          persistence:
            enabled: true
            storageClass:
            accessMode: ReadWriteOnce
            size: ${kafkaData.broker.pvc.size}${kafkaData.broker.pvc.unit}i
          resources:
            limits:
              cpu: ${kafkaData.broker.cpu.size}
              memory: ${kafkaData.broker.memory.size}${kafkaData.broker.memory.unit}i
          zookeeper:
            enabled: true
            replicaCount: ${kafkaData.zookeeper.podNum.value}
            heapSize: ${kafkaData.zookeeper.xms.size}  # zk heap size in MB
            persistence:
              enabled: true
              storageClass: ""
              accessModes:
                - ReadWriteOnce
              size: ${kafkaData.zookeeper.pvc.size}${kafkaData.zookeeper.pvc.unit}i #SSD Required
            resources:
              limits:
                cpu: ${kafkaData.zookeeper.cpu.size}
                memory: ${kafkaData.zookeeper.memory.size}${kafkaData.zookeeper.memory.unit}i
  `;

  const apacheConfig = apacheType === 'pulsar' ? pulsarConfig : kafkaConfig;

  return `apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  components:
    mixCoord:
      replicas: ${mixCoord.amount}
      resources:
        limits:
          cpu: ${mixCoord.cpu}
          memory: ${mixCoord.memory}Gi
    indexNode:
      replicas: ${indexNode.amount}
      resources:
        limits:
          cpu: ${indexNode.cpu}
          memory: ${indexNode.memory}Gi
    proxy:
      replicas: ${proxy.amount}
      resources:
        limits:
          cpu: ${proxy.cpu}
          memory: ${proxy.memory}Gi
  config: {}
  dependencies:
    etcd:
      inCluster:
        values:
          autoCompactionMode: revision
          autoCompactionRetention: "1000"
          extraEnvVars:
          - name: ETCD_QUOTA_BACKEND_BYTES
            value: "4294967296"
          - name: ETCD_HEARTBEAT_INTERVAL
            value: "500"
          - name: ETCD_ELECTION_TIMEOUT
            value: "25000"
          - name: ETCD_SNAPSHOT_COUNT
            value: "10000"
          - name: ETCD_ENABLE_PPROF
            value: "true"
          persistence:
            accessMode: ReadWriteOnce
            enabled: true
            size: ${etcdData.pvcPerPodSize}${etcdData.pvcPerPodUnit}i   #SSD Required
            storageClass:
          replicaCount: ${etcdData.podNumber}
          resources:
            limits:
              cpu: ${etcdData.cpu}
              memory: ${etcdData.memory}Gi
            requests:
              cpu: ${etcdData.cpu}
              memory: ${etcdData.memory}Gi
    ${apacheConfig}
    storage:
      inCluster:
        values:
          mode: distributed
          resources:
            limits: 
              cpu: ${minioData.cpu}
              memory: ${minioData.memory}Gi
          persistence:
            storageClass:
            accessMode: ReadWriteOnce
            size: ${minioData.pvcPerPodSize}${minioData.pvcPerPodUnit}i

  `;
};
