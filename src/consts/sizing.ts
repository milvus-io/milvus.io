import {
  SegmentSizeEnum,
  IndexTypeEnum,
  DependencyComponentEnum,
  ModeEnum,
} from '@/types/sizing';

export const ONE_MILLION = Math.pow(10, 6);
export const ONE_BILLION = Math.pow(10, 9);

export const VECTOR_RANGE_CONFIG = {
  min: 1,
  max: 10000,
  defaultValue: 1,
  domain: [0, 25, 50, 75, 100],
  range: [1, 10, 100, 1000, 10000],
};

export const DIMENSION_RANGE_CONFIG = {
  min: 2,
  max: 32768,
  defaultValue: 768,
  domain: [0, 25, 50, 75, 100],
  range: [2, 128, 768, 1536, 32768],
};

export const MAX_NODE_DEGREE_RANGE_CONFIG = {
  min: 1,
  max: 2048,
  defaultValue: 56,
  domain: [0, 20, 40, 60, 80, 100],
  range: [1, 8, 32, 128, 512, 2048],
};

export const M_RANGE_CONFIG = {
  min: 2,
  max: 2048,
  defaultValue: 30,
  domain: [0, 20, 40, 60, 80, 100],
  range: [2, 8, 32, 128, 512, 2048],
};

export const N_LIST_RANGE_CONFIG = {
  min: 1,
  max: 65536,
  defaultValue: 128,
  domain: [0, 10, 20, 40, 70, 100],
  range: [1, 16, 128, 4096, 16384, 65536],
};

export const SEGMENT_SIZE_OPTIONS = [
  {
    label: '512 MB',
    value: SegmentSizeEnum._512MB,
  },
  {
    label: '1024 MB',
    value: SegmentSizeEnum._1024MB,
  },
  {
    label: '2048 MB',
    value: SegmentSizeEnum._2048MB,
  },
];

export const INDEX_TYPE_OPTIONS = [
  {
    label: 'FLAT',
    value: IndexTypeEnum.FLAT,
  },
  {
    label: 'SCANN',
    value: IndexTypeEnum.SCANN,
  },
  {
    label: 'HNSW',
    value: IndexTypeEnum.HNSW,
  },
  {
    label: 'IVF_FLAT',
    value: IndexTypeEnum.IVF_FLAT,
  },
  {
    label: 'IVFSQ8',
    value: IndexTypeEnum.IVFSQ8,
  },
  {
    label: 'IVF_RABITQ',
    value: IndexTypeEnum.IVFRABITQ,
  },
  {
    label: 'DISKANN',
    value: IndexTypeEnum.DISKANN,
  },
];

export const DEPENDENCY_COMPONENTS = [
  {
    label: 'Pulsar',
    value: DependencyComponentEnum.Pulsar,
  },
  {
    label: 'Kafka',
    value: DependencyComponentEnum.Kafka,
  },
  {
    label: 'Woodpecker',
    value: DependencyComponentEnum.Woodpecker,
  },
];

export const MODE_OPTIONS = [
  {
    label: 'Standalone',
    value: ModeEnum.Standalone,
  },
  {
    label: 'Distributed',
    value: ModeEnum.Cluster,
  },
];

export const helmCodeExample = `helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update 
helm install my-release milvus/milvus -f helmConfigYml.yml    
`;

export const operatorCodeExample = `helm repo add milvus-operator https://zilliztech.github.io/milvus-operator/
helm repo update milvus-operator
helm -n milvus-operator upgrade --install milvus-operator milvus-operator/milvus-operator
kubectl create -f operatorConfigYml.yml
`;
export const dockerComposeExample = `wget https://github.com/milvus-io/milvus/releases/download/latest/milvus-standalone-docker-compose.yml -O docker-compose.yml
sudo docker compose up -d`;

export const HELM_CONFIG_FILE_NAME = 'helmConfigYml.yml';
export const OPERATOR_CONFIG_FILE_NAME = 'operatorConfigYml.yml';

export const MAXIMUM_AVERAGE_LENGTH = 60 * ONE_MILLION;
