export type DataSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';
export enum SegmentSizeEnum {
  _512MB = '512',
  _1024MB = '1024',
  _2048MB = '2048',
}

export enum IndexTypeEnum {
  FLAT = 'FLAT',
  SCANN = 'SCANN',
  HNSW = 'HNSW',
  IVF_FLAT = 'IVF_FLAT',
  IVFSQ8 = 'IVFSQ8',
  IVFRABITQ = 'IVFRABITQ',
  DISKANN = 'DISKANN',
}

export interface IIndexType {
  indexType: IndexTypeEnum;
  widthRawData: boolean;
  maxDegree: number;
  flatNList: number;
  sq8NList: number;
  rabitqNList: number;
  m: number;
}

export enum DependencyComponentEnum {
  Pulsar = 'pulsar',
  Kafka = 'kafka',
  Woodpecker = 'woodpecker',
}

export enum ModeEnum {
  Standalone,
  Cluster,
}

const NodesType = {
  queryNode: 'Query Node',
  proxy: 'Proxy',
  mixCoord: 'Mix Coord',
  dataNode: 'Data Node',
  streamNode: 'Stream Node',
} as const;

export type NodesKeyType = keyof typeof NodesType;
export type NodesValueType = {
  cpu: number;
  memory: number;
  count: number;
};

export type PulsarDataType = {
  bookie: NodesValueType & {
    journal: number;
    ledgers: number;
  };
  broker: NodesValueType;
  proxy: NodesValueType;
  zookeeper: NodesValueType & {
    pvc: number;
  };
};

export type KafkaDataType = {
  broker: NodesValueType & {
    pvc: number;
  };
  zookeeper: NodesValueType & {
    pvc: number;
  };
};

export type DependencyConfigType = {
  etcd: NodesValueType & {
    pvc: number;
  };
  minio: NodesValueType & {
    pvc: number;
  };
  pulsar?: PulsarDataType;
  kafka?: KafkaDataType;
};

export interface ICalculateResult {
  rawDataSize: number;
  memorySize: number;
  localDiskSize: number;
  clusterNodeConfig: Record<NodesKeyType, NodesValueType>;
  standaloneNodeConfig: NodesValueType;
  dependencyConfig: DependencyConfigType;
  mode: ModeEnum;
  dependency: DependencyComponentEnum;
  isOutOfCalculate: boolean;
}
