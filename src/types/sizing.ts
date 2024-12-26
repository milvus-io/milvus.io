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

type DependencyBaseConfigType = {
  cpu: number;
  memory: number;
  count: number;
};

export type DependencyConfigType = {
  etcd: DependencyBaseConfigType & {
    pvc: number;
  };
  minio: DependencyBaseConfigType & {
    pvc: number;
  };
  pulsar?: {
    bookie: DependencyBaseConfigType & {
      journal: number;
      ledgers: number;
    };
    broker: DependencyBaseConfigType;
    proxy: DependencyBaseConfigType;
    zookeeper: DependencyBaseConfigType & {
      pvc: number;
    };
  };
  kafka?: {
    broker: DependencyBaseConfigType & {
      pvc: number;
    };
    zookeeper: DependencyBaseConfigType & {
      pvc: number;
    };
  };
};

export interface ICalculateResult {
  rawDataSize: number;
  memorySize: number;
  localDiskSize: number;
  nodeConfig: Record<NodesKeyType, NodesValueType>;
  dependencyConfig: DependencyConfigType;
  mode: ModeEnum;
  dependency: DependencyComponentEnum;
}
