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

export const memorySizeCalculator = ({ nb, d, nlist, M, indexType }) => {
  let theorySize = 0;
  let expandingRate = 0;
  switch (indexType) {
    case 'IVF_FLAT':
      theorySize = (nb + nlist) * d * 4;
      expandingRate = 2;
      return {
        theorySize,
        memorySize: theorySize * expandingRate,
      };

    case 'IVF_SQ8':
      theorySize = nb * d + nlist * d * 4;
      expandingRate = 3;
      return {
        theorySize,
        memorySize: theorySize * expandingRate,
      };

    case 'HNSW':
      theorySize = nb * d * 4 + nb * M * 8;
      expandingRate = 2;
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

export const rawFileSizeCalculator = ({ d, nb }) => {
  const sizeOfFloat = 4;
  return d * sizeOfFloat * nb;
};

export const indexNodeCalculator = (theorySize, segmentSize) => {
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

export const queryNodeCalculator = memorySize => {
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

export const rootCoordCalculator = nb => {
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

export const dataNodeCalculator = nb => {
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

export const proxyCalculator = memorySize => {
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

export const commonCoordCalculator = memorySize => {
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

export const isBetween = (value, { min, max }) => {
  return value >= min && value <= max;
};

export const etcdCalculator = rowFileSize => {
  let cpu = '';
  let memory = '';
  let podNumber = 0;
  let pvcPerPod = '';

  if (rowFileSize <= unitAny2BYTE(50, 'GB')) {
    cpu = '2 core';
    memory = '4 GB';
    podNumber = 3;
    pvcPerPod = 'SSD 30GB';
  } else if (
    rowFileSize > unitAny2BYTE(50, 'GB') &&
    rowFileSize <= unitAny2BYTE(500, 'GB')
  ) {
    cpu = '4 core';
    memory = '8 GB';
    podNumber = 3;
    pvcPerPod = 'SSD 30GB';
  } else {
    cpu = '8 core';
    memory = '16 GB';
    podNumber = 3;
    pvcPerPod = 'SSD 30GB';
  }

  return {
    cpu,
    memory,
    podNumber,
    pvcPerPod,
  };
};

export const minioCalculator = (rowFileSize, indexSize) => {
  let cpu = '';
  let memory = '';
  let podNumber = 0;
  let pvcPerPod = '';

  const { size, unit } = unitBYTE2Any(((rowFileSize + indexSize) * 3 * 2) / 4);

  if (rowFileSize <= unitAny2BYTE(50, 'GB')) {
    cpu = '2 core';
    memory = '8 GB';
    podNumber = 4;
    pvcPerPod = `${size} ${unit}`;
  } else if (
    rowFileSize > unitAny2BYTE(50, 'GB') &&
    rowFileSize <= unitAny2BYTE(500, 'GB')
  ) {
    cpu = '4 core';
    memory = '16 GB';
    podNumber = 4;
    pvcPerPod = `${size} ${unit}`;
  } else {
    cpu = '8 core';
    memory = '32 GB';
    podNumber = 4;
    pvcPerPod = `${size} ${unit}`;
  }

  return {
    cpu,
    memory,
    podNumber,
    pvcPerPod,
  };
};

export const pulsarCalculator = rowFileSize => {
  let bookie = {
    Cpu: '',
    Memory: '',
    'Pod Number': 0,
    '-Xms': '',
    '-Xmx': '',
    '-Xx': '',
    Journal: '',
    Ledgers: '',
  };
  let broker = {
    Cpu: '',
    Memory: '',
    '-Xms': '',
    '-Xmx': '',
    '-Xx': '',
    'Pod Number': 0,
  };
  let proxy = {
    Cpu: '',
    Memory: '',
    '-Xms': '',
    '-Xmx': '',
    '-Xx': '',
    'pod Number': 0,
  };
  let zookeeper = {
    Cpu: '1 core',
    Memory: '2 GB',
    '-Xms': '',
    '-Xmx': '',
    'Pod Number': 3,
    'Pvc Per Pod': 'SSD 20GB',
  };

  if (rowFileSize <= unitAny2BYTE(50, 'GB')) {
    bookie = {
      Cpu: '2 core',
      Memory: '16 GB',
      '-Xms': '4096 m',
      '-Xmx': '4096 m',
      '-Xx': '8192 m',
      'Pod Number': 3,
      Journal: '10 GB',
      Ledgers: 'SSD 25GB',
    };
    broker = {
      Cpu: '2 core',
      Memory: '18 GB',
      '-Xms': '4096 m',
      '-Xmx': '4096 m',
      '-Xx': '8192 m',
      'Pod Number': 2,
    };
    proxy = {
      Cpu: '2 core',
      Memory: '5 GB',
      '-Xms': '2048 m',
      '-Xmx': '2048 m',
      '-Xx': '2048 m',
      'Pod Number': 2,
    };
    zookeeper = {
      Cpu: '1 core',
      Memory: '2 GB',
      '-Xms': '1024 m',
      '-Xmx': '1024 m',
      'Pod Number': 3,
      'Pvc Per Pod': 'SSD 20GB',
    };
  } else if (
    rowFileSize > unitAny2BYTE(50, 'GB') &&
    rowFileSize <= unitAny2BYTE(500, 'GB')
  ) {
    bookie = {
      Cpu: '4 core',
      Memory: '32 GB',
      '-Xms': '8192 m',
      '-Xmx': '8192 m',
      '-Xx': '16384 m',
      'Pod Number': 3,
      Journal: '100 GB',
      Ledgers: 'SSD 250GB',
    };
    broker = {
      Cpu: '4 core',
      Memory: '36 GB',
      '-Xms': '8192 m',
      '-Xmx': '8192 m',
      '-Xx': '16384 m',
      'Pod Number': 2,
    };
    proxy = {
      Cpu: '4 core',
      Memory: '9 GB',
      '-Xms': '4096 m',
      '-Xmx': '4096 m',
      '-Xx': '4096 m',
      'Pod Number': 2,
    };
    zookeeper = {
      Cpu: '4 core',
      Memory: '4 GB',
      '-Xms': '2048 m',
      '-Xmx': '2048 m',
      'Pod Number': 3,
      'Pvc Per Pod': 'SSD 20GB',
    };
  } else {
    bookie = {
      Cpu: '8 core',
      Memory: '64 GB',
      '-Xms': '16384 m',
      '-Xmx': '16384 m',
      '-Xx': '32768 m',
      'Pod Number': 3,
      Journal: '100 GB',
      Ledgers: 'SSD 250GB',
    };
    broker = {
      Cpu: '8 core',
      Memory: '72 GB',
      '-Xms': '16384 m',
      '-Xmx': '16384 m',
      '-Xx': '32768 m',
      'Pod Number': 2,
    };
    proxy = {
      Cpu: '8 core',
      Memory: '18 GB',
      '-Xms': '8192 m',
      '-Xmx': '8192 m',
      '-Xx': '8192 m',
      'Pod Number': 2,
    };
    zookeeper = {
      cpu: '8 core',
      Memory: '8 GB',
      '-Xms': '4096 m',
      '-Xmx': '4096 m',
      'Pod Number': 3,
      'Pvc Per Pod': 'SSD 20GB',
    };
  }

  return {
    bookie,
    broker,
    proxy,
    zookeeper,
  };
};

export const kafkaCalculator = rowFileSize => {
  let broker = {
    Cpu: '',
    Memory: '',
    '-Xms': '',
    '-Xmx': '',
    'Pod Number': 0,
    'Pvc Per Pod': '',
  };
  let zookeeper = {
    Cpu: '',
    Memory: '',
    '-Xms': '',
    '-Xmx': '',
    'Pod Number': 0,
    'Pvc Per Pod': '',
  };

  const { size, unit } = unitBYTE2Any(rowFileSize);

  if (rowFileSize <= unitAny2BYTE(50, 'GB')) {
    broker = {
      Cpu: '2 core',
      Memory: '16 GB',
      '-Xms': '4096 m',
      '-Xmx': '4096 m',
      'Pod Number': 3,
      'Pvc Per Pod': `${size} ${unit}`,
    };
    zookeeper = {
      Cpu: '1 core',
      Memory: '2 GB',
      '-Xms': '1024 m',
      '-Xmx': '1024 m',
      'Pod Number': 3,
      'Pvc Per Pod': 'SSD 20GB',
    };
  } else if (
    rowFileSize > unitAny2BYTE(50, 'GB') &&
    rowFileSize <= unitAny2BYTE(500, 'GB')
  ) {
    broker = {
      Cpu: '4 core',
      Memory: '25 GB',
      '-Xms': '8192 m',
      '-Xmx': '8192 m',
      'Pod Number': 3,
      'Pvc Per Pod': `${size} ${unit}`,
    };
    zookeeper = {
      Cpu: '2 core',
      Memory: '4 GB',
      '-Xms': '2048 m',
      '-Xmx': '2048 m',
      'Pod Number': 3,
      'Pvc Per Pod': 'SSD 20GB',
    };
  } else {
    broker = {
      Cpu: '8 core',
      Memory: '50 GB',
      '-Xms': '16384 m',
      '-Xmx': '16384 m',
      'Pod Number': 3,
      'Pvc Per Pod': rowFileSize,
    };
    zookeeper = {
      Cpu: '4 core',
      Memory: '8 GB',
      '-Xms': '4096 m',
      '-Xmx': '4096 m',
      'Pod Number': 3,
      'Pvc Per Pod': 'SSD 20GB',
    };
  }

  return {
    broker,
    zookeeper,
  };
};

export const customYmlGenerator = ({
  rootCoord,
  proxy,
  queryNode,
  dataNode,
  indexNode,
  commonCoord,
}) => {
  return `
rootCoordinator:
  replicas: ${rootCoord.amount}
  resources: 
    limits:
      cpu: ${rootCoord.cpu}
      memory: ${rootCoord.memory}Gi
indexCoordinator:
  replicas: ${commonCoord.amount}
  resources: 
    limits:
      cpu: ${commonCoord.cpu}
      memory: ${commonCoord.memory}Gi
queryCoordinator:
  replicas: ${commonCoord.amount}
  resources: 
    limits:
      cpu: ${commonCoord.cpu}
      memory: ${commonCoord.memory}Gi
dataCoordinator:
  replicas: ${commonCoord.amount}
  resources: 
    limits:
      cpu: ${commonCoord.cpu}
      memory: ${commonCoord.memory}Gi
proxy:
  replicas: ${proxy.amount}
  resources: 
    limits:
      cpu: ${proxy.cpu}
      memory: ${proxy.memory}Gi
queryNode:
  replicas: ${queryNode.amount}
  resources: 
    limits:
      cpu: ${queryNode.cpu}
      memory: ${queryNode.memory}Gi
dataNode:
  replicas: ${dataNode.amount}
  resources: 
    limits:
      cpu: ${dataNode.cpu}
      memory: ${dataNode.memory}Gi
indexNode:
  replicas: ${indexNode.amount}
  resources: 
    limits:
      cpu: ${indexNode.cpu}
      memory: ${indexNode.memory}Gi
  `;
};
