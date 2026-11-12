# Milvus 3.0 sizing and deployment profile

`/tools/sizing-v300` is a separate profile from `/tools/sizing` (2.6) and
`/tools/sizing-v250` (2.5). It is available from the version selector and localized
routes. The profile covers dense/binary/sparse CPU sizing and GPU sizing.

## Deployment contract

The generated Helm values pin chart **5.0.33** and Milvus **v3.0.5**. Operator
manifests pin the same Milvus image and use the **1.3.0** CRD. GPU exports select
`milvusdb/milvus:v3.0.5-gpu`; they require CUDA 12.9-compatible infrastructure,
NVIDIA drivers and the Kubernetes NVIDIA device plugin.

The CPU profile uses embedded Woodpecker backed by object storage. Its memory
and CPU are included in the standalone/streaming node estimate, so the chart
explicitly disables the separate Woodpecker service. Cluster manifests contain
one consolidated MixCoord, Proxy, StreamingNode, DataNode (including index
building), and QueryNode. Separate legacy coordinators and IndexNode are disabled.
Etcd and MinIO resources and PVCs use the calculator's dependency estimates.
Single-node exports instead use the standalone resource estimate and standalone
MinIO. Both modes export Helm values and Operator manifests.

The selected segment size is passed to `dataCoord.segment.maxSize` in MB. The
runtime config explicitly selects `mq.type: woodpecker` and
`woodpecker.storage.type: minio`; it does not rely on an inherited MQ default.
No website environment variables or database migrations are required.

## Sparse index enablement

The SINDI control is only exposed in the 3.0 profile. Enabling it exports
`dataCoord.targetVecIndexVersion: 10` in both Helm's `extraConfigFiles.user.yaml`
and Operator's `spec.config`. This is required for new sparse codecs in 3.0.
It does **not** enable unrelated scalar index versions or Storage V3/Loon.

A deployment manifest cannot build a collection index. The separate Python
script download creates an index on an existing sparse field, selecting:

| Metric | Algorithm | Codec | Posting values |
| --- | --- | --- | --- |
| IP (SPLADE) | SINDI | block_streamvbyte | fp16 |
| BM25 | SINDI | block_streamvbyte | u16 |

Without compression, the script uses DAAT_MAXSCORE and leaves codec/quantization
settings unspecified. BM25 requires a field produced by an existing BM25 function.
The estimated compressed index budget is approximately 2.8 bytes/non-zero entry;
actual usage depends on the distribution and encoding. Raw vector storage always
uses 8 bytes/non-zero entry. No 3.0 compression control is offered on 2.5/2.6.

## Apply and acceptance order

1. Select version, data type, count, dimension/average NNZ, metric, compression,
   segment size and deployment mode. Download the selected Helm values or Operator
   manifest and, for sparse vectors, the index script.
2. For a new cluster, install the pinned chart or Operator using the page's
   commands. Ensure a default StorageClass, suitable object storage/PVC capacity,
   and enough CPU/RAM (plus GPU infrastructure when applicable).
3. For an existing installation, back up first and merge the generated resource
   and runtime settings into its existing Helm values/complete CR. Do not replace
   credentials, storage endpoints, namespaces or release identities with sample
   defaults. Keep a newer supported Operator rather than downgrading it.
4. Apply the configuration and verify a completed rollout. A ConfigMap change
   does not prove that existing processes have loaded it; confirm pod restart or
   supported dynamic reload, the running image and effective runtime settings.
5. Wait for readiness. Confirm Woodpecker, MixCoord consolidation, requested
   resources and persistent volumes. For compressed sparse indexing, confirm
   effective `dataCoord.targetVecIndexVersion=10` before building the index.
6. Install `pymilvus>=3.0`. Set `MILVUS_URI` and optionally `MILVUS_TOKEN`, then run
   `python milvus-3-sparse-index.py COLLECTION FIELD`. The script prints
   `describe_index` for inspection. It never drops indexes or releases collections.
   Existing indexes need an explicit, separately planned rebuild/migration; an
   image upgrade alone does not apply compression. New serialized index formats
   can limit rollback, so plan backups and rollback before opting in.
7. Verify index build completion and collection loading, then execute a
   representative search (IP/SPLADE or BM25) on your own data. Compare measured
   memory/storage with the estimate. Local tests do not replace this acceptance.

## Validation performed

- Calculator and YAML structural regression tests cover legacy 2.5/2.6 and the
  four 3.0 combinations of standalone/cluster and compression on/off.
- Browser tests cover version navigation, script downloads for both metrics,
  exact image/config/resource propagation, compression-off behavior, GPU image
  selection and isolation of the old profiles.
- Both modes were rendered with the actual Helm 5.0.33 chart; resulting Milvus
  workloads use v3.0.5 and the rendered ConfigMap contains the selected runtime
  settings. CPU Operator manifests were validated offline against the official
  1.3.0 CRD OpenAPI schema. Generated Python scripts were syntax-compiled.
- No live Kubernetes cluster has been installed, upgraded, restarted or written
  to as part of this change. Runtime activation and real search acceptance remain
  deployment-time checks.

## Upstream references

- [3.0 compatibility and index-version opt-in](https://milvus.io/docs/release_notes.md)
- [3.0 Helm installation](https://milvus.io/docs/install_cluster-helm.md)
- [Milvus v3.0.5 runtime defaults](https://github.com/milvus-io/milvus/blob/v3.0.5/configs/milvus.yaml)
- [Operator 1.3.0 CRD](https://github.com/zilliztech/milvus-operator/blob/v1.3.0/config/crd/bases/milvus.io_milvuses.yaml)
- [Sparse index configuration](https://milvus.io/docs/sparse-inverted-index.md)
- [Knowhere sparse codec and quantization configuration](https://github.com/zilliztech/knowhere/blob/main/src/index/sparse/sparse_index_config.h)

`sizeMetric: mainIndex` and `streaming.type: woodpecker` are intentionally not
invented as deployment settings: they are not part of the verified v3.0.5 runtime
configuration contract. The profile uses supported segment/MQ settings instead.
