import { DependencyComponentEnum, ModeEnum, NodesValueType } from '@/types/sizing';

// Pinned to the version used by the official 3.0 installation guide.
export const MILVUS_V300_TAG = 'v3.0.5';
export const MILVUS_V300_IMAGE = `milvusdb/milvus:${MILVUS_V300_TAG}`;
export const MILVUS_V300_GPU_IMAGE = `${MILVUS_V300_IMAGE}-gpu`;
const LOCAL_DATA_PATH = '/var/lib/milvus/data';

interface DeploymentParams {
  proxy: NodesValueType;
  mixCoord: NodesValueType;
  streamNode: NodesValueType;
  queryNode: NodesValueType;
  dataNode: NodesValueType;
  standaloneNode: NodesValueType;
  etcdData: NodesValueType & { pvc: number };
  minioData: NodesValueType & { pvc: number };
  localDiskSize?: number;
  segmentSize?: number;
  sindiCompression?: boolean;
}

// New sparse codecs are opt-in in 3.0. Do not enable unrelated Storage V3 or
// scalar index format changes, or force an existing index to rebuild.
export const milvusV300RuntimeConfig = (p: Pick<DeploymentParams, 'segmentSize' | 'sindiCompression'>) => `mq:
  type: woodpecker
woodpecker:
  storage:
    type: minio
localStorage:
  path: ${LOCAL_DATA_PATH}
dataCoord:
  segment:
    maxSize: ${p.segmentSize ?? 1024}
${p.sindiCompression ? '  targetVecIndexVersion: 10\n' : ''}`;

const indent = (text: string, spaces: number) => text.trimEnd().split('\n').map(line => `${' '.repeat(spaces)}${line}`).join('\n');
// Local index/Mmap cache is split over query nodes (or held by standalone).
// Reserve 15% headroom and whole GiB so the scheduler can satisfy the estimate.
const localDiskGi = (p: DeploymentParams, cluster: boolean) => {
  const bytes = p.localDiskSize ?? 0;
  if (!Number.isFinite(bytes) || bytes <= 0) return 0;
  const count = cluster ? Math.max(1, p.queryNode.count) : 1;
  return Math.ceil(bytes * 1.15 / count / 1024 ** 3);
};
const resources = (node: NodesValueType, diskGi = 0) => `limits:
  cpu: ${node.cpu}
  memory: ${node.memory}Gi${diskGi ? `\n  ephemeral-storage: ${diskGi}Gi` : ''}
requests:
  cpu: ${node.cpu}
  memory: ${node.memory}Gi${diskGi ? `\n  ephemeral-storage: ${diskGi}Gi` : ''}`;
const cacheNode = (key: string) => key === 'standalone' || key === 'queryNode';
const operatorCache = (diskGi: number) => `      env:
      - name: LOCAL_STORAGE_SIZE
        value: "${diskGi}"
      volumeMounts:
      - name: sizing-local-data
        mountPath: ${LOCAL_DATA_PATH}
      volumes:
      - name: sizing-local-data
        emptyDir:
          sizeLimit: ${diskGi}Gi
`;

const ensureWoodpecker = (dependency: DependencyComponentEnum) => {
  if (dependency !== DependencyComponentEnum.Woodpecker) {
    throw new Error('The Milvus 3.0 profile uses embedded Woodpecker');
  }
};

export const helmYmlGeneratorV300 = (p: DeploymentParams, dependency: DependencyComponentEnum, mode: ModeEnum) => {
  ensureWoodpecker(dependency);
  const cluster = mode === ModeEnum.Cluster;
  const diskGi = localDiskGi(p, cluster);
  const nodes = cluster
    ? { mixCoordinator: p.mixCoord, proxy: p.proxy, streamingNode: p.streamNode, dataNode: p.dataNode, queryNode: p.queryNode }
    : { standalone: p.standaloneNode };
  return `# Milvus 3.0 profile: embedded Woodpecker; no separate WAL service.
image:
  all:
    repository: milvusdb/milvus
    tag: ${MILVUS_V300_TAG}
cluster:
  enabled: ${cluster}
streaming:
  enabled: true
  woodpecker:
    embedded: true
    storage:
      type: minio
woodpecker:
  enabled: false
pulsar:
  enabled: false
pulsarv3:
  enabled: false
kafka:
  enabled: false
indexNode:
  enabled: false
indexCoordinator:
  enabled: false
rootCoordinator:
  enabled: false
queryCoordinator:
  enabled: false
dataCoordinator:
  enabled: false
${Object.entries(nodes).map(([key, node]) => `${key}:\n  ${cluster ? `enabled: true\n  replicas: ${node.count}` : 'replicas: 1\n  messageQueue: woodpecker'}\n  resources:\n${indent(resources(node, cacheNode(key) ? diskGi : 0), 4)}${cacheNode(key) && diskGi ? '\n  disk:\n    enabled: true\n    size:\n      enabled: true' : ''}${key === 'standalone' ? '\n  persistence:\n    enabled: false' : ''}`).join('\n')}
${!cluster ? 'mixCoordinator:\n  enabled: false\n' : ''}extraConfigFiles:
  user.yaml: |
${indent(milvusV300RuntimeConfig(p), 4)}
etcd:
  replicaCount: ${p.etcdData.count}
  resources:
${indent(resources(p.etcdData), 4)}
  persistence:
    enabled: true
    size: ${p.etcdData.pvc}Gi
minio:
  mode: ${cluster ? 'distributed' : 'standalone'}
  replicas: ${p.minioData.count}
  resources:
${indent(resources(p.minioData), 4)}
  persistence:
    enabled: true
    size: ${p.minioData.pvc}Gi
`;
};

export const operatorYmlGeneratorV300 = (p: DeploymentParams, dependency: DependencyComponentEnum, mode: ModeEnum) => {
  ensureWoodpecker(dependency);
  const cluster = mode === ModeEnum.Cluster;
  const diskGi = localDiskGi(p, cluster);
  const nodes = cluster
    ? { mixCoord: p.mixCoord, proxy: p.proxy, streamingNode: p.streamNode, dataNode: p.dataNode, queryNode: p.queryNode }
    : { standalone: p.standaloneNode };
  return `apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  mode: ${cluster ? 'cluster' : 'standalone'}
  components:
    image: ${MILVUS_V300_IMAGE}
    streamingMode: true
${Object.entries(nodes).map(([key, node]) => `    ${key}:\n      replicas: ${node.count}\n      resources:\n${indent(resources(node, cacheNode(key) ? diskGi : 0), 8)}\n${cacheNode(key) && diskGi ? operatorCache(diskGi) : ''}`).join('\n')}
  config:
${indent(milvusV300RuntimeConfig(p), 4)}
  dependencies:
    msgStreamType: woodpecker
    etcd:
      inCluster:
        values:
          replicaCount: ${p.etcdData.count}
          resources:
${indent(resources(p.etcdData), 12)}
          persistence:
            enabled: true
            size: ${p.etcdData.pvc}Gi
    storage:
      inCluster:
        values:
          mode: ${cluster ? 'distributed' : 'standalone'}
          replicas: ${p.minioData.count}
          resources:
${indent(resources(p.minioData), 12)}
          persistence:
            enabled: true
            size: ${p.minioData.pvc}Gi
`;
};

// A deployment manifest cannot create a collection index. Export the matching
// index build separately so the compressed estimate has a concrete enablement path.
export const sparseIndexScriptV300 = (compressed: boolean, metric: 'IP' | 'BM25' = 'IP') => `"""Run after Milvus is healthy. Requires pymilvus>=3.0 and an existing sparse field.
For BM25, the field must be the output of an existing BM25 function.
Existing indexes must be explicitly migrated/rebuilt before expecting compression;
this script does not drop indexes, release collections, or modify existing data.
"""
import argparse
import os
from pymilvus import MilvusClient

parser = argparse.ArgumentParser()
parser.add_argument("collection")
parser.add_argument("field")
parser.add_argument("--index-name", default="sparse_v300")
args = parser.parse_args()
client = MilvusClient(uri=os.environ.get("MILVUS_URI", "http://localhost:19530"),
                      token=os.environ.get("MILVUS_TOKEN", ""))
indexes = client.prepare_index_params()
indexes.add_index(field_name=args.field, index_name=args.index_name,
                  index_type="SPARSE_INVERTED_INDEX", metric_type="${metric}",
                  params=${JSON.stringify(compressed
                    ? { inverted_index_algo: 'SINDI', inverted_index_codec: 'block_streamvbyte', quant_type: metric === 'IP' ? 'fp16' : 'u16' }
                    : { inverted_index_algo: 'DAAT_MAXSCORE' })})
client.create_index(collection_name=args.collection, index_params=indexes)
print(client.describe_index(collection_name=args.collection, index_name=args.index_name))
`;
