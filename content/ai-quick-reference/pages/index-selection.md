---
slug: "how-do-you-choose-the-right-index-type-for-your-workload"
title: "How do you choose a vector index for your workload?"
topic: "retrieval"
order: 14
---

There is no single best vector index. For dense-vector search, a useful first pass compares five choices: exact FLAT search, an in-memory graph such as HNSW, centroid-partitioned IVF, disk-oriented DiskANN, and GPU indexes such as GPU_CAGRA or GPU_IVF. They optimize different constraints. Quantization (SQ, PQ, PRQ, or RaBitQ) is a separate representation choice that can be combined with some structures; it is not a sixth candidate-search family. `AUTOINDEX` is a convenient Milvus-managed choice, not another algorithm family.

![Control the workload before comparing performance](/images/ai-reference/benchmark.svg)

## Start with the workload, not the vector count

Write down the vector field type and metric, corpus size and growth, dimension, requested top-K, filter selectivity, query concurrency and batch size, write/update rate, latency target, and available RAM, SSD, and GPU memory. A million frequently updated vectors with selective filters can behave very differently from a static archive of the same size. Include index build and load time, returned payload, and any reranking stage in the end-to-end budget.

Use exact FLAT search on a representative subset or workload as the quality reference. For a small effective candidate set, FLAT can also be the serving choice: it scans every eligible vector, returns exact neighbors for the configured metric, and avoids graph or centroid-index overhead. Its work grows with the number of eligible vectors and dimension, so it becomes expensive when that set is large.

## Five common choices and their trade-offs

| Choice | How it narrows or executes search | Good starting point when… | Main cost or limitation |
| --- | --- | --- | --- |
| **FLAT** (exact scan) | Computes the metric against every eligible vector; there is no approximate candidate index. | The eligible set is small, exact neighbors are required, or a ground-truth baseline is needed. GPU brute force is a related hardware-specific option. | Work grows with eligible vector count and dimension. Large scans consume substantial compute and can miss latency targets. |
| **HNSW** (graph) | Navigates a layered neighbor graph toward likely neighbors; `ef` controls search effort. | Vectors and graph fit in RAM, low latency and strong recall matter, and the result count is relatively small. | Graph links add substantial memory and index-build work. Higher `ef` explores more candidates and can raise latency. |
| **IVF** (centroid partitions) | Assigns vectors to centroid cells and searches selected cells; `nlist` sets the built partition count and `nprobe` the cells visited by a query. | You want a tunable scan, expect larger result sets or throughput-oriented search, or need a straightforward base for compressed variants. | Unvisited cells cannot contribute results. Increasing `nprobe` improves coverage at added compute and latency; too many partitions also add training and centroid work. |
| **DiskANN** (SSD graph) | Uses a Vamana graph organized for disk access, with compact PQ codes in memory for approximate distance checks. | The working set is larger than available RAM and local SSD/NVMe is available. | Search depends on random-read latency, IOPS, cache warmth, and device contention. Disk capacity alone does not guarantee low query latency. |
| **GPU indexes** (`GPU_CAGRA`, `GPU_IVF_FLAT`, `GPU_IVF_PQ`) | Use GPU-parallel graph traversal or GPU IVF candidate scans; CAGRA is the graph option. | The workload has enough concurrent or batched queries to use GPU parallelism and the index fits the available device resources. | The GPU-enabled Milvus deployment, device memory, build resources, transfers, batching delay, and operating cost all matter. A GPU index may lose its advantage on sparse, low-volume traffic. |

These are starting hypotheses, not a universal ranking. A large top-K, restrictive filters, and write-heavy traffic can change the result; compare configurations using the same eligible data and query distribution. Milvus exposes additional specialized types, including SCANN and AISAQ; confirm field, metric, release, and deployment support before adding them to the shortlist.

## Treat compression as a second decision

First choose how candidates are found; then decide how vector values are represented. `IVF_FLAT` keeps full vectors inside probed cells. `IVF_SQ8` uses per-coordinate scalar quantization; `IVF_PQ` and `IVF_RABITQ` use more compact codes with different distance-estimation trade-offs. HNSW also has SQ/PQ/PRQ variants. These can reduce vector payload, but codebooks, centroids, graph links, IDs, refinement vectors, and runtime buffers remain. A refiner can improve ordering among retrieved candidates; it cannot recover a true neighbor that the candidate search never found.

If memory is tight, compare the uncompressed form with an SQ/PQ/RaBitQ variant at a matched Recall@K target. Measure complete loaded-index memory and any retained high-precision data, not only the code size. See the [quantization guide](/ai-quick-reference/what-is-vector-quantization-in-embeddings) for the memory arithmetic and compression mechanisms.

## A practical selection path

1. **No special constraint yet?** Start with Milvus `AUTOINDEX` for a sensible managed default, then inspect the actual workload and compare explicit index types if you need tighter control.
2. **Small eligible set or exact answers?** Use FLAT, at least as the evaluation baseline. Strong filters may shrink the eligible set enough that scanning it is competitive.
3. **Low latency, small top-K, and enough RAM?** Benchmark HNSW. Sweep `ef` against Recall@K and latency; include graph memory and build time.
4. **Need controllable candidate coverage or compressed vectors?** Start with IVF_FLAT, then test `nprobe`; try IVF_SQ8, IVF_PQ, or IVF_RABITQ only if measured memory savings justify the recall and refinement trade-offs.
5. **Data exceeds RAM but fits a fast local SSD serving design?** Benchmark DiskANN under realistic cache, I/O, and concurrency conditions.
6. **A GPU is available and the traffic can keep it busy?** Compare GPU_CAGRA with GPU_IVF_FLAT/PQ using the real query batch and concurrency pattern. Account for device memory and transfer time.

AUTOINDEX, explicit index types, and their supported parameters vary by Milvus release. Confirm the actual selected type and exact parameter contract in the deployed version before treating a trial result as a production recommendation.

## Compare at equal quality and realistic load

Hold the embedding model, corpus snapshot, metric, filters, query set, and top-K fixed. First measure exact FLAT neighbors; then compare ANN Recall@K separately from judged application relevance. For each candidate, sweep search effort at fixed construction parameters and compare the quality/latency curve. Do not compare one index at its highest QPS with another at its highest recall.

Record p50/p95/p99 latency under realistic concurrency, throughput, index build and load time, total resident memory, disk I/O or GPU use, write behavior, and operating cost. Include both cold and warm cache cases where relevant. Re-run after changing the model, corpus distribution, filter pattern, hardware, or traffic mix; an index recommendation is conditional on those assumptions.

## Example comparison

For a static in-memory collection with top-20 queries, compare FLAT, HNSW, and IVF_FLAT, then add a compressed variant if memory is the constraint. For a collection larger than RAM, compare DiskANN with the best feasible memory-based configuration. For batch-heavy GPU traffic, compare GPU_CAGRA and GPU_IVF. Use one query set and one recall target; report why a candidate missed the target as either candidate coverage or approximate distance error.

## From concept to implementation

- [Compare Milvus index structures, supported field types, and memory estimates](https://milvus.io/docs/index-explained.md).
- [Read the Milvus index-selection decision guide](https://milvus.io/docs/index_selection.md).
- [Understand HNSW graph search and its parameters](https://milvus.io/docs/hnsw.md).
- [Understand IVF partitions and `nprobe`](https://milvus.io/docs/ivf-flat.md).
- [Understand DiskANN's Vamana graph and SSD behavior](https://milvus.io/docs/diskann.md).
- [Review GPU_CAGRA and GPU search parameters](https://milvus.io/docs/gpu-cagra.md).
- [Compare SQ, PQ, PRQ, and RaBitQ](https://milvus.io/ai-quick-reference/what-is-vector-quantization-in-embeddings).
- [Read the FAISS/Milvus library distinction](https://milvus.io/ai-quick-reference/what-is-faiss).
