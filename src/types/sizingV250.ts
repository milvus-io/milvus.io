export enum VectorTypeEnum {
  FLOAT_VECTOR = 'FLOAT_VECTOR',
  FLOAT16_VECTOR = 'FLOAT16_VECTOR',
  BFLOAT16_VECTOR = 'BFLOAT16_VECTOR',
  INT8_VECTOR = 'INT8_VECTOR',
  BINARY_VECTOR = 'BINARY_VECTOR',
  SPARSE_FLOAT_VECTOR = 'SPARSE_FLOAT_VECTOR',
}

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
  HNSW_SQ = 'HNSW_SQ',
  HNSW_PQ = 'HNSW_PQ',
  IVF_FLAT = 'IVF_FLAT',
  IVFSQ8 = 'IVFSQ8',
  SPARSE_INVERTED_INDEX = 'SPARSE_INVERTED_INDEX',
  DISKANN = 'DISKANN',
}

export interface IIndexType {
  indexType: IndexTypeEnum;
  widthRawData: boolean;
  maxDegree: number;
  flatNList: number;
  sq8NList: number;
  m: number;
}

export enum DependencyComponentEnum {
  Pulsar,
  Kafka,
  Woodpecker,
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
  indexNode: 'Index Node',
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
