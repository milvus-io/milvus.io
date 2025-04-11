import { ONE_MILLION, FIXED_QUERY_NODE_CONFIG } from '@/consts/sizing';
import {
  NodesValueType,
  DependencyComponentEnum,
  DependencyConfigType,
  IIndexType,
  IndexTypeEnum,
  ModeEnum,
  PulsarDataType,
  KafkaDataType,
  NodesKeyType,
  DataSizeUnit,
} from '@/types/sizing';
/**
 * params list:
 * num: number: number of vectors
 * d: number: dimension of vectors
 * withScalar: boolean: whether with scalar data
 * scalarAvg: number: average length of scalar data
 * maxDegree: number: maximum degree of the node
 * segSize: number: segment size
 *
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
    {
      label: 'PB',
      value: 5,
    },
    {
      label: 'EB',
      value: 6,
    },
  ];
  const value = charts.find(v => v.label === unit.toUpperCase())?.value || 0;
  return Math.pow(1024, value) * size;
};

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

export const formatOutOfCalData = <T>(params: { data: T; isOut: boolean }) => {
  const { data, isOut } = params;
  if (isOut) {
    return '--';
  }
  return data;
};

// raw data size calculator
export const rawDataSizeCalculator = (params: {
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

const $1M768D = rawDataSizeCalculator({
  num: 1,
  d: 768,
  withScalar: false,
  scalarAvg: 0,
});
export const $10M768D = rawDataSizeCalculator({
  num: 10,
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
export const $1B768D = rawDataSizeCalculator({
  num: 1000,
  d: 768,
  withScalar: false,
  scalarAvg: 0,
});

// loading memory and disk calculator
export const memoryAndDiskCalculator = (params: {
  rawDataSize: number;
  indexTypeParams: IIndexType;
  d: number;
  num: number;
  withScalar: boolean;
  offLoading: boolean;
  scalarAvg: number;
  segSize: number;
  mode: ModeEnum;
}) => {
  const {
    rawDataSize,
    num,
    d,
    withScalar,
    scalarAvg,
    offLoading,
    indexTypeParams,
    segSize,
    mode,
  } = params;
  const { indexType, widthRawData, maxDegree, m, flatNList, sq8NList } =
    indexTypeParams;
  const segmentSizeByte = unitAny2BYTE(segSize, 'MB');
  const vectorRawDataSize = ((num * d * 32) / 8) * ONE_MILLION;

  let result = {
    memory: 0,
    disk: 0,
  };
  const rowSize = (d * 32) / 8;

  switch (indexType) {
    case IndexTypeEnum.FLAT:
      result = {
        memory: vectorRawDataSize,
        disk: 0,
      };
      break;
    case IndexTypeEnum.IVF_FLAT:
      result = {
        memory: vectorRawDataSize + flatNList * rowSize,
        disk: 0,
      };
      break;
    case IndexTypeEnum.IVFSQ8:
      result = {
        memory: vectorRawDataSize / 4 + sq8NList * rowSize,
        disk: 0,
      };
      break;
    case IndexTypeEnum.SCANN:
      result = {
        memory: widthRawData
          ? (9 / 8) * vectorRawDataSize
          : (1 / 8) * vectorRawDataSize,
        disk: 0,
      };
      break;
    case IndexTypeEnum.HNSW:
      result = {
        memory: (1 + (2 * m) / d) * vectorRawDataSize,
        disk: 0,
      };

      break;
    case IndexTypeEnum.DISKANN:
      result = {
        memory: vectorRawDataSize / 4,
        disk: (1 + maxDegree / d) * vectorRawDataSize,
      };
      break;
    default:
      result = {
        memory: 0,
        disk: 0,
      };
      break;
  }

  const scalarLoadingMemory = withScalar
    ? offLoading
      ? (num * scalarAvg * ONE_MILLION) / 10
      : num * scalarAvg * ONE_MILLION
    : 0;

  const scalarLocalDisk = offLoading ? num * scalarAvg * ONE_MILLION : 0;

  if (indexType === IndexTypeEnum.DISKANN) {
    const vectorLoadingMemory = result.memory * 1.15;
    return {
      memory: vectorLoadingMemory + scalarLoadingMemory, // bytes
      disk: scalarLocalDisk + result.disk, // bytes
    };
  }

  const vectorLoadingMemory = (result.memory + segmentSizeByte * 2) * 1.15;

  return {
    memory: vectorLoadingMemory + scalarLoadingMemory, // bytes
    disk: scalarLocalDisk + result.disk, // bytes
  };
};

export const standaloneNodeConfigCalculator = (params: { memory: number }) => {
  const { size: memoryGb } = unitBYTE2Any(params.memory, 'GB');
  const MEMORY_SIZE_OPTIONS = [8, 16, 32, 64];
  const properMemorySize = MEMORY_SIZE_OPTIONS.find(item => item >= memoryGb);
  const properCoreSize = properMemorySize / 4;

  return {
    cpu: properCoreSize,
    memory: properMemorySize,
    count: 1,
  };
};

// query nodes calculator
export const clusterNodesConfigCalculator = (params: { memory: number }) => {
  const { size: memoryGB } = unitBYTE2Any(params.memory, 'GB');

  const queryNodeCount =
    memoryGB >= 2048
      ? Math.ceil(memoryGB / 128)
      : memoryGB >= 512
      ? Math.ceil(memoryGB / 64)
      : memoryGB >= 96
      ? Math.ceil(memoryGB / 32)
      : 0;

  const basicLargeNodeConfig = {
    proxy: {
      cpu: 8,
      memory: 32,
      count: 1,
    },
    mixCoord: {
      cpu: 8,
      memory: 32,
      count: 1,
    },
    dataNode: {
      cpu: 8,
      memory: 32,
      count: 1,
    },
    indexNode: {
      cpu: 8,
      memory: 16,
      count: 8,
    },
  };
  const queryNodesConfig = [
    ...FIXED_QUERY_NODE_CONFIG,
    {
      memory: [96, 512],
      queryNode: {
        cpu: 8,
        memory: 32,
        count: queryNodeCount,
      },
      ...basicLargeNodeConfig,
    },
    {
      memory: [512, 2048],
      queryNode: {
        cpu: 16,
        memory: 64,
        count: queryNodeCount,
      },
      ...basicLargeNodeConfig,
    },
    {
      memory: [2048, Infinity],
      queryNode: {
        cpu: 32,
        memory: 128,
        count: queryNodeCount,
      },
      ...basicLargeNodeConfig,
    },
  ];

  const properMemorySection = queryNodesConfig.find(
    v => v.memory[0] <= memoryGB && v.memory[1] > memoryGB
  );
  return {
    queryNode: properMemorySection?.queryNode,
    proxy: properMemorySection?.proxy,
    mixCoord: properMemorySection?.mixCoord,
    dataNode: properMemorySection?.dataNode,
    indexNode: properMemorySection?.indexNode,
  };
};

export const dependencyCalculator = (params: {
  num: number;
  d: number;
  mode: ModeEnum;
  withScalar: boolean;
  scalarAvg: number;
  loadingMemory: number;
}): DependencyConfigType => {
  const { num, d, mode, scalarAvg, withScalar, loadingMemory } = params;
  const MINIMUM_MINIO_PVC_SIZE = 30; //GB
  const MINIMUM_PULSAR_LEDGERS = 20; //GB
  const MAXIMUM_PULSAR_JOURNAL = 50; //GB

  // unit: bytes
  const rawDataSize = rawDataSizeCalculator({
    num,
    d,
    withScalar,
    scalarAvg,
  });

  const minioPvc = Math.max(
    Math.ceil((rawDataSize + loadingMemory) / 1024 / 1024 / 1024),
    MINIMUM_MINIO_PVC_SIZE
  ); // GB

  const pulsarLedgers = Math.max(
    Math.ceil(rawDataSize / 1024 / 1024 / 1024),
    MINIMUM_PULSAR_LEDGERS
  ); // GB

  const pulsarJournal = Math.min(pulsarLedgers * 0.5, MAXIMUM_PULSAR_JOURNAL); // GB

  const kafkaBrokerPvc = pulsarLedgers;

  let etcdBaseConfig = {
    cpu: 0,
    memory: 0,
    pvc: 0,
    count: 0,
  };
  let minioBaseConfig = {
    cpu: 0,
    memory: 0,
    pvc: 0,
    count: 0,
  };
  let pulsarBaseConfig = {
    bookie: {
      cpu: 0,
      memory: 0,
      count: 0,
      journal: 0,
      ledgers: 0,
    },
    broker: {
      cpu: 0,
      memory: 0,
      count: 0,
    },
    proxy: {
      cpu: 0,
      memory: 0,
      count: 0,
    },
    zookeeper: {
      cpu: 0,
      memory: 0,
      count: 0,
      pvc: 0,
    },
  };
  let kafkaBaseConfig = {
    broker: {
      cpu: 0,
      memory: 0,
      count: 0,
      pvc: 0,
    },
    zookeeper: {
      cpu: 0,
      memory: 0,
      count: 0,
      pvc: 0,
    },
  };

  switch (mode) {
    case ModeEnum.Standalone:
      etcdBaseConfig = {
        cpu: 0.5,
        memory: 1,
        pvc: 10,
        count: 1,
      };
      minioBaseConfig = {
        cpu: 1,
        memory: 4,
        pvc: minioPvc,
        count: 1,
      };

      if (rawDataSize >= $1M768D) {
        etcdBaseConfig.memory = 2;
        minioBaseConfig.memory = 8;
      }

      return {
        etcd: etcdBaseConfig,
        minio: minioBaseConfig,
        pulsar: undefined,
        kafka: undefined,
      };
    case ModeEnum.Cluster:
      etcdBaseConfig = {
        cpu: 1,
        memory: 4,
        pvc: 20,
        count: 3,
      };
      minioBaseConfig = {
        cpu: 1,
        memory: 8,
        pvc: minioPvc,
        count: 4,
      };

      pulsarBaseConfig = {
        bookie: {
          cpu: 1,
          memory: 8,
          count: 3,
          journal: pulsarLedgers,
          ledgers: pulsarJournal,
        },
        broker: {
          cpu: 1,
          memory: 4,
          count: 2,
        },
        proxy: {
          cpu: 0.5,
          memory: 4,
          count: 2,
        },
        zookeeper: {
          cpu: 0.5,
          memory: 2,
          count: 3,
          pvc: 30,
        },
      };

      kafkaBaseConfig = {
        broker: {
          cpu: 2,
          memory: 8,
          count: 3,
          pvc: kafkaBrokerPvc,
        },
        zookeeper: {
          cpu: 0.5,
          memory: 2,
          count: 3,
          pvc: 30,
        },
      };

      if (rawDataSize >= $10M768D && rawDataSize <= $100M768D) {
        minioBaseConfig = {
          cpu: 1,
          memory: 8,
          pvc: minioPvc,
          count: 4,
        };
        pulsarBaseConfig = {
          bookie: {
            cpu: 1,
            memory: 8,
            count: 3,
            journal: pulsarLedgers,
            ledgers: pulsarJournal,
          },
          broker: {
            cpu: 1,
            memory: 4,
            count: 2,
          },
          proxy: {
            cpu: 0.5,
            memory: 4,
            count: 2,
          },
          zookeeper: {
            cpu: 0.5,
            memory: 2,
            count: 3,
            pvc: 30,
          },
        };

        kafkaBaseConfig = {
          broker: {
            cpu: 2,
            memory: 8,
            count: 3,
            pvc: kafkaBrokerPvc,
          },
          zookeeper: {
            cpu: 0.5,
            memory: 2,
            count: 3,
            pvc: 30,
          },
        };
      }
      if (rawDataSize >= $100M768D && rawDataSize <= $1B768D) {
        etcdBaseConfig = {
          cpu: 1,
          memory: 8,
          pvc: 50,
          count: 3,
        };
        minioBaseConfig = {
          cpu: 1,
          memory: 8,
          pvc: minioPvc,
          count: 4,
        };

        pulsarBaseConfig = {
          bookie: {
            cpu: 2,
            memory: 16,
            count: 3,
            journal: pulsarLedgers,
            ledgers: pulsarJournal,
          },
          broker: {
            cpu: 2,
            memory: 8,
            count: 2,
          },
          proxy: {
            cpu: 1,
            memory: 4,
            count: 2,
          },
          zookeeper: {
            cpu: 0.5,
            memory: 4,
            count: 3,
            pvc: 100,
          },
        };

        kafkaBaseConfig = {
          broker: {
            cpu: 4,
            memory: 16,
            count: 3,
            pvc: kafkaBrokerPvc,
          },
          zookeeper: {
            cpu: 0.5,
            memory: 4,
            count: 3,
            pvc: 100,
          },
        };
      }

      return {
        etcd: etcdBaseConfig,
        minio: minioBaseConfig,
        pulsar: pulsarBaseConfig,
        kafka: kafkaBaseConfig,
      };
  }
};

export const milvusOverviewDataCalculator = (params: {
  standaloneNodeConfig: NodesValueType;
  clusterNodeConfig: Record<NodesKeyType, NodesValueType>;
  mode: ModeEnum;
}) => {
  const { standaloneNodeConfig, clusterNodeConfig, mode } = params;
  const { queryNode, proxy, mixCoord, dataNode, indexNode } = clusterNodeConfig;
  const milvusCpu =
    mode === ModeEnum.Standalone
      ? standaloneNodeConfig.cpu
      : queryNode.cpu * queryNode.count +
        proxy.cpu * proxy.count +
        mixCoord.cpu * mixCoord.count +
        dataNode.cpu * dataNode.count +
        indexNode.cpu * indexNode.count;

  const milvusMemory =
    mode === ModeEnum.Standalone
      ? standaloneNodeConfig.memory
      : queryNode.memory * queryNode.count +
        proxy.memory * proxy.count +
        mixCoord.memory * mixCoord.count +
        dataNode.memory * dataNode.count +
        indexNode.memory * indexNode.count;

  return {
    milvusCpu: milvusCpu || 0,
    milvusMemory: milvusMemory || 0,
  };
};

export const dependencyOverviewDataCalculator = (params: {
  mode: ModeEnum;
  dependency: DependencyComponentEnum;
  dependencyConfig: DependencyConfigType;
}) => {
  const { mode, dependency, dependencyConfig } = params;
  const { etcd, minio, pulsar, kafka } = dependencyConfig;

  const pulsarCpu =
    mode === ModeEnum.Standalone
      ? 0
      : pulsar.bookie.cpu * pulsar.bookie.count +
        pulsar.broker.cpu * pulsar.broker.count +
        pulsar.zookeeper.cpu * pulsar.zookeeper.count +
        pulsar.proxy.cpu * pulsar.proxy.count;
  const kafkaCpu =
    mode === ModeEnum.Standalone
      ? 0
      : kafka.broker.cpu * kafka.broker.count +
        kafka.zookeeper.cpu * kafka.zookeeper.count;
  const streamPlatformCpu =
    dependency === DependencyComponentEnum.Pulsar ? pulsarCpu : kafkaCpu;
  const dependencyCpu =
    etcd.cpu * etcd.count + minio.cpu * minio.count + streamPlatformCpu;

  const pulsarMemory =
    mode === ModeEnum.Standalone
      ? 0
      : pulsar.bookie.memory * pulsar.bookie.count +
        pulsar.broker.memory * pulsar.broker.count +
        pulsar.zookeeper.memory * pulsar.zookeeper.count +
        pulsar.proxy.memory * pulsar.proxy.count;
  const kafkaMemory =
    mode === ModeEnum.Standalone
      ? 0
      : kafka.broker.memory * kafka.broker.count +
        kafka.zookeeper.memory * kafka.zookeeper.count;

  const streamPlatformMemory =
    dependency === DependencyComponentEnum.Pulsar ? pulsarMemory : kafkaMemory;

  const dependencyMemory =
    etcd.memory * etcd.count +
    minio.memory * minio.count +
    streamPlatformMemory;

  const pulsarStorage =
    mode === ModeEnum.Standalone
      ? 0
      : (pulsar.bookie.journal + pulsar.bookie.ledgers) * pulsar.bookie.count +
        pulsar.zookeeper.pvc * pulsar.zookeeper.count;
  const kafkaStorage =
    mode === ModeEnum.Standalone
      ? 0
      : kafka.broker.pvc * kafka.broker.count +
        kafka.zookeeper.pvc * kafka.zookeeper.count;
  const streamPlatformStorage =
    dependency === DependencyComponentEnum.Pulsar
      ? pulsarStorage
      : kafkaStorage;

  const dependencyStorage =
    etcd.pvc * etcd.count + minio.pvc * minio.count + streamPlatformStorage;

  return {
    dependencyCpu,
    dependencyMemory,
    dependencyStorage,
  };
};

export const helmYmlGenerator: (
  params: {
    proxy: NodesValueType;
    mixCoord: NodesValueType;
    indexNode: NodesValueType;
    etcdData: NodesValueType & {
      pvc: number;
    };
    minioData: NodesValueType & {
      pvc: number;
    };
    pulsarData: PulsarDataType;
    kafkaData: KafkaDataType;
  },
  apacheType: DependencyComponentEnum,
  mode: ModeEnum
) => any = (
  { proxy, mixCoord, indexNode, etcdData, minioData, pulsarData, kafkaData },
  apacheType,
  mode
) => {
  const pulsarConfig =
    mode === ModeEnum.Standalone
      ? ''
      : `
pulsar:
  enabled: true
  proxy:
    resources:
      requests:
        memory: ${pulsarData.proxy.memory}Gi
        cpu: ${pulsarData.proxy.cpu}
    replicaCount: ${pulsarData.proxy.count}
    configData:
      httpNumThreads: "100"
  zookeeper:
    volumes:
      persistence: true
      data:
        name: data
        size: ${pulsarData.zookeeper.pvc}Gi   #SSD Required
        storageClassName:
    resources:
      requests:
        memory: ${pulsarData.zookeeper.memory}Gi
        cpu: ${pulsarData.zookeeper.cpu}
  bookkeeper:
    volumes:
      journal:
        name: journal
        size: ${pulsarData.bookie.journal}Gi
        storageClassName:
      ledgers:
        name: ledgers
        size: ${pulsarData.bookie.ledgers}Gi  #SSD Required
        storageClassName:
    resources:
      requests:
        memory: ${pulsarData.bookie.memory}Gi
        cpu: ${pulsarData.bookie.cpu}
  broker:
    component: broker
    podMonitor:
      enabled: false
    replicaCount: ${pulsarData.broker.count}
    resources:
      requests:
        memory: ${pulsarData.broker.memory}Gi
        cpu: ${pulsarData.broker.cpu}
  `;

  const kafkaConfig =
    mode === ModeEnum.Standalone
      ? ''
      : `
pulsar:
  enabled: false
kafka:
  enabled: true
  persistence:
    enabled: true
    storageClass:
    accessMode: ReadWriteOnce
    size: ${kafkaData.broker.pvc}Gi
  resources:
    limits:
      cpu: ${kafkaData.broker.cpu}
      memory: ${kafkaData.broker.memory}Gi
  zookeeper:
    enabled: true
    replicaCount: ${kafkaData.zookeeper.count}
    persistence:
      enabled: true
      storageClass: ""
      accessModes:
        - ReadWriteOnce
      size: ${kafkaData.zookeeper.pvc}Gi   #SSD Required
    resources:
      limits:
        cpu: ${kafkaData.zookeeper.cpu}
        memory: ${kafkaData.zookeeper.memory}Gi
  `;

  return `mixCoordinator:
  replicas: ${mixCoord.count}
  resources: 
    limits:
      cpu: "${mixCoord.cpu}"
      memory: ${mixCoord.memory}Gi
proxy:
  replicas: ${proxy.count}
  resources: 
    limits:
      cpu: ${proxy.cpu}
      memory: ${proxy.memory}Gi
indexNode:
  replicas: ${indexNode.count}
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
    size: ${etcdData.pvc}Gi  #SSD Required
    storageClass:
  replicaCount: ${etcdData.count}
  resources:
    limits:
      cpu: ${etcdData.cpu}
      memory: ${etcdData.memory}Gi
    requests:
      cpu: ${etcdData.cpu}
      memory: ${etcdData.memory}Gi
${apacheType === DependencyComponentEnum.Pulsar ? pulsarConfig : kafkaConfig}
minio:
  resources:
    limits:
      cpu: ${minioData.cpu}
      memory: ${minioData.memory}Gi
  persistence:
    storageClass:
    accessMode: ReadWriteOnce
    size: ${minioData.pvc}Gi
  `;
};

export const operatorYmlGenerator: (
  params: {
    proxy: NodesValueType;
    mixCoord: NodesValueType;
    indexNode: NodesValueType;
    etcdData: NodesValueType & {
      pvc: number;
    };
    minioData: NodesValueType & {
      pvc: number;
    };
    pulsarData: PulsarDataType;
    kafkaData: KafkaDataType;
  },
  apacheType: DependencyComponentEnum,
  mode: ModeEnum
) => string = (
  { mixCoord, proxy, indexNode, etcdData, minioData, pulsarData, kafkaData },
  apacheType,
  mode
) => {
  const pulsarConfig =
    mode === ModeEnum.Standalone
      ? ''
      : `
    pulsar:
      inCluster:
        values:
          proxy:
            replicaCount: ${pulsarData.proxy.count}
            configData:
              httpNumThreads: "100"
          zookeeper:
            volumes:
              persistence: true
              data:
                name: data
                size: ${pulsarData.zookeeper.pvc}Gi   #SSD Required
                storageClassName:
            resources:
              requests:
                memory: ${pulsarData.zookeeper.memory}Gi
                cpu: ${pulsarData.zookeeper.cpu}
          bookkeeper:
            volumes:
              journal:
                name: journal
                size: ${pulsarData.bookie.journal}Gi
                storageClassName:
              ledgers:
                name: ledgers
                size: ${pulsarData.bookie.ledgers}Gi   #SSD Required
                storageClassName:
            resources:
              requests:
                memory: ${pulsarData.bookie.memory}Gi
                cpu: ${pulsarData.bookie.cpu}
          broker:
            component: broker
            podMonitor:
              enabled: false
            replicaCount: ${pulsarData.broker.count}
            resources:
              requests:
                memory: ${pulsarData.broker.memory}Gi
                cpu: ${pulsarData.broker.cpu}
  `;

  const kafkaConfig =
    mode === ModeEnum.Standalone
      ? ''
      : `
    msgStreamType: kafka
    kafka:
      inCluster:
        values:
          persistence:
            enabled: true
            storageClass:
            accessMode: ReadWriteOnce
            size: ${kafkaData.broker.pvc}Gi
          resources:
            limits:
              cpu: ${kafkaData.broker.cpu}
              memory: ${kafkaData.broker.memory}Gi
          zookeeper:
            enabled: true
            replicaCount: ${kafkaData.zookeeper.count}
            persistence:
              enabled: true
              storageClass: ""
              accessModes:
                - ReadWriteOnce
              size: ${kafkaData.zookeeper.pvc}Gi #SSD Required
            resources:
              limits:
                cpu: ${kafkaData.zookeeper.cpu}
                memory: ${kafkaData.zookeeper.memory}Gi
  `;

  const apacheConfig =
    apacheType === DependencyComponentEnum.Pulsar ? pulsarConfig : kafkaConfig;

  return `apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  components:
    mixCoord:
      replicas: ${mixCoord.count}
      resources:
        limits:
          cpu: ${mixCoord.cpu}
          memory: ${mixCoord.memory}Gi
    indexNode:
      replicas: ${indexNode.count}
      resources:
        limits:
          cpu: ${indexNode.cpu}
          memory: ${indexNode.memory}Gi
    proxy:
      replicas: ${proxy.count}
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
            size: ${etcdData.pvc}Gi   #SSD Required
            storageClass:
          replicaCount: ${etcdData.count}
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
            size: ${minioData.pvc}Gi
  `;
};
