---
slug: "how-does-vector-search-manage-memory-usage"
title: "How do you estimate memory for vector search?"
topic: "production"
order: 33
---

Estimate vector-search memory in layers: raw vectors (`count × dimension × bytes per value`), plus the index structure, plus scalar fields and IDs, multiplied by the number of in-memory replicas, plus headroom for query execution, ingestion, and maintenance. For float32 vectors, one million 768-dimensional embeddings are about 3.07 GB raw before anything else is added. The index type decides whether the total lands well above that figure (HNSW keeps the vectors and adds a graph) or well below it (quantized and disk-based indexes keep a compressed copy in RAM).

![Memory hierarchy for vector search](/images/ai-reference/memory.svg)

## Step 1: How big are the raw vectors?

`raw_vector_bytes = row_count × dimension × bytes_per_component`

Milvus supports several dense vector types, and the element size changes the result directly:

| Milvus field type | Bytes per dimension | 768-dim vector |
| --- | --- | --- |
| `FLOAT_VECTOR` (float32) | 4 | 3,072 bytes |
| `FLOAT16_VECTOR`, `BFLOAT16_VECTOR` | 2 | 1,536 bytes |
| `INT8_VECTOR` | 1 | 768 bytes |
| `BINARY_VECTOR` | 1/8 (one bit) | 96 bytes |

Sparse vectors (`SPARSE_FLOAT_VECTOR`) scale with the number of non-zero entries, not the dimension, so measure them from real data.

Keep decimal and binary units apart. One million 768-dimensional float32 vectors are 3,072,000,000 bytes: 3.07 GB, or 2.86 GiB. Cloud instance memory is usually quoted in GiB, so mixing the two understates need by about 7%.

## Step 2: How much does the index add?

The index can store the full vectors, a compressed copy, or mostly live on disk. The [Milvus index guide](https://milvus.io/docs/index-explained.md) works through these for one million 128-dimensional vectors:

| Index | What stays in memory | 1M × 128-dim example |
| --- | --- | --- |
| IVF_FLAT | Full vectors plus centroids and assignments | About 515 MB |
| IVF_SQ8 | 1-byte scalar-quantized vectors plus overhead | About 131 MB |
| IVF_PQ (8 sub-quantizers) | 8-byte PQ codes plus overhead | About 11 MB |
| HNSW (32 links per node) | Full vectors (512 MB) plus graph (128 MB) | About 640 MB |
| HNSW_PQ (8 sub-quantizers) | PQ codes plus graph | About 136 MB |

For HNSW the graph cost is roughly `row_count × links × 4 bytes`. Following the original [HNSW paper](https://arxiv.org/abs/1603.09320), the bottom layer usually allows about `2·M` links per node, so with Milvus's default `M = 30` budget about 60 links, or 240 bytes, per vector, plus a little for upper layers. With large embeddings the vectors dominate, which is why compression mostly targets them.

**DISKANN** keeps the graph and full vectors on NVMe SSD and holds PQ codes in RAM. The `pq_code_budget_gb_ratio` parameter sets PQ memory as a fraction of raw vector size; its default is 0.125, with `search_cache_budget_gb_ratio` adding an optional cache for hot disk data. See [when to use DISKANN](/ai-quick-reference/what-is-diskann).

Quantized indexes often keep a refinement step that rereads higher-precision vectors for the final candidates. Check whether your chosen index stores those vectors, so you count them once, not twice. The [quantization guide](/ai-quick-reference/what-is-vector-quantization-in-embeddings) and the [HNSW_SQ, HNSW_PQ, and HNSW_PRQ comparison](/ai-quick-reference/hnsw-sq-pq-prq-tradeoffs) explain the recall cost of each option.

## Step 3: What else lives in memory?

- **Primary keys and scalar fields** that are loaded for filtering and output. Long text or JSON payloads can outweigh compact vectors.
- **Scalar indexes** built for filtering.
- **Growing segments**: recently inserted data that has not yet been sealed and indexed.
- **Replicas**: every [in-memory replica](https://milvus.io/docs/replica.md) holds a full copy of the loaded segments, so two replicas double the serving memory.
- **Query working memory**: candidate lists, result sets, and reranking buffers, which grow with concurrency, top-k, and batch size.
- **Peaks** during index builds, compaction, node restarts, and rebalancing.

## Step 4: A worked example

An illustrative estimate, not a measurement. Assume 10 million 768-dimensional float32 vectors, an HNSW index with the default `M = 30`, and 2 replicas.

| Item | Calculation | Result |
| --- | --- | --- |
| Raw vectors | 10,000,000 × 768 × 4 bytes | 30.72 GB (28.6 GiB) |
| HNSW bottom-layer links | 10,000,000 × 60 × 4 bytes | 2.40 GB |
| One serving copy | 30.72 + 2.40 | 33.12 GB |
| Two replicas | 2 × 33.12 | 66.24 GB |

Then add scalar fields, growing segments, query working memory, and headroom for builds and failover, and confirm on real data.

Swapping the index changes the picture. The same vectors as IVF_SQ8 need about 10,000,000 × 768 × 1 byte = 7.68 GB for the quantized copy per replica. With DISKANN at the default PQ ratio, about 0.125 × 30.72 GB = 3.84 GB of PQ codes sit in RAM while the rest lives on SSD. Each choice trades memory against recall and latency, so benchmark it before committing.

## How can you reduce memory in Milvus?

- **Load only what you query.** The `load_fields` option loads just the listed fields; only those can be used as filters or output fields. Always include the primary key and at least one vector field. `skip_load_dynamic_field=True` skips the dynamic `$meta` field when no query needs it. See [load and release](https://milvus.io/docs/load-and-release.md).
- **Release idle collections.** Unloaded collections use no query-node memory.
- **Use mmap.** [Memory mapping](https://milvus.io/docs/mmap.md) lets the OS page field data and indexes from local disk, configurable per cluster (`queryNode.mmap.*`), per collection (`mmap.enabled`), or per index. Performance stays close to in-memory while the working set fits in page cache; HNSW tolerates mmap better than IVF indexes when memory runs short. It must be set before the collection is loaded.
- **Use tiered storage.** From Milvus 2.6.4, [tiered storage](https://milvus.io/docs/tiered-storage-overview.md) loads only metadata at first and fetches field data and index files from object storage on demand, with eviction controlled by watermarks such as `memoryHighWatermarkRatio`. Queries that touch cold data pay extra latency.
- **Pick a smaller representation.** FLOAT16 or INT8 vectors, a quantized index, or DISKANN.

## Validate the estimate

Load a representative slice, then measure query-node resident memory under a realistic query and insert mix. Repeat at two or three sizes and check the growth is close to linear before extrapolating. Watch the peaks during index builds and node restarts, not just steady state. Keep the schema, index parameters, and version with the estimate so it can be redone when any of them change.

## Related reading

- [How do you turn a Milvus workload into a capacity and cost estimate?](/ai-quick-reference/milvus-capacity-planning)
- [How does mmap differ from a disk-oriented ANN index?](/ai-quick-reference/how-mmap-differs-from-diskann)
- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)
- [How do you compare managed and self-hosted vector-search costs?](/ai-quick-reference/what-are-the-tradeoffs-of-using-a-cloudbased-vector-store-service-in-a-rag-system-evaluation-in-terms-of-latency-variance-network-costs-etc-versus-a-local-inmemory-store)

For a quick starting point, enter your vector count, dimension, and index type into the [Milvus sizing tool](https://milvus.io/tools/sizing), which returns loading memory, CPU, and disk for Standalone or Distributed deployments. On [Zilliz Cloud](https://zilliz.com/cloud), capacity is sold in compute units per cluster type, so you can compare memory-heavy and disk-tiered options on the [pricing page](https://zilliz.com/pricing).

## Sources

- [Milvus index explained (memory estimates)](https://milvus.io/docs/index-explained.md)
- [Milvus DISKANN](https://milvus.io/docs/diskann.md)
- [Milvus mmap](https://milvus.io/docs/mmap.md)
- [Milvus tiered storage](https://milvus.io/docs/tiered-storage-overview.md)
- [Milvus load and release](https://milvus.io/docs/load-and-release.md)
- [Malkov and Yashunin, HNSW](https://arxiv.org/abs/1603.09320)
- [Milvus sizing tool](https://milvus.io/tools/sizing)
