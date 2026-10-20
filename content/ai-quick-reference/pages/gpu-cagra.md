---
slug: "what-is-gpu-cagra"
title: "What is GPU_CAGRA, and when does it help vector search?"
topic: "retrieval"
order: 60
---

Milvus offers two families of GPU index: `GPU_CAGRA`, a graph-based index, and `GPU_IVF_FLAT`/`GPU_IVF_PQ`, cluster-based indexes carried over from CPU IVF but executed on the GPU. CAGRA builds a proximity graph and explores it with GPU-parallel graph traversal; GPU_IVF assigns vectors to coarse centroid cells and scans the cells a query selects. Both target the same problem — using GPU parallelism to search large vector sets faster than a CPU index — but they get there through different candidate structures, and that difference drives when each one actually wins.

![Treat compression as another approximation](/images/ai-reference/quantization.svg)

## When CAGRA's graph wins

A graph index spends more effort at build time constructing high-quality navigation links, then does comparatively little redundant work at query time: traversal follows a small set of promising edges toward the answer instead of touching whole clusters. That makes CAGRA the stronger candidate when recall at low latency matters most and the dataset fits the device memory budget for the graph plus vectors. CAGRA also tends to need less search-parameter retuning across recall targets than IVF, because graph traversal degrades more gracefully as search effort is reduced — IVF's recall can fall off a cliff once `nprobe` undershoots the cells that hold the true neighbors.

The cost is construction: graph build is more GPU-memory- and time-intensive than building IVF centroids, and CAGRA's graph (plus per-node neighbor lists) adds structural memory on top of the vectors, similar to how HNSW's links add memory on top of raw vectors on CPU.

## When GPU_IVF wins

GPU_IVF_FLAT and GPU_IVF_PQ are the better starting point when the workload needs fast, cheap index builds, frequent rebuilds, or a simple capacity lever. Centroid assignment is cheap to construct relative to a graph, and `nlist`/`nprobe` give a direct, well-understood knob for trading search coverage against latency. GPU_IVF_PQ's product-quantized codes also give a more predictable memory-reduction path than compressing a graph: compacting vectors under IVF doesn't touch a navigation structure the way PQ-compressing HNSW or CAGRA does, so the capacity gain is closer to the raw code-size ratio.

GPU_IVF is also the safer choice when the corpus changes often. Rebuilding or incrementally extending centroid lists is lighter-weight than rebuilding a navigation graph, so if the collection sees continuous high-volume inserts, GPU_IVF's lower rebuild cost can outweigh CAGRA's better query-time recall/latency curve.

## The concrete trade-off, side by side

| Dimension | GPU_CAGRA | GPU_IVF_FLAT / GPU_IVF_PQ |
| --- | --- | --- |
| Candidate selection | Graph traversal from entry points | Coarse centroid cells, `nprobe` of them visited |
| Build cost | Higher — graph construction is the expensive step | Lower — centroid training and assignment |
| Representation | Full vectors by default | Full (FLAT) or product-quantized (PQ) codes |
| Recall/latency degradation | Graceful as search effort drops | Can fall sharply if `nprobe` is too low |
| Rebuild/update cost | Higher — graph edits are not cheap | Lower — centroid lists update more easily |
| Best fit | Stable or slowly-changing corpus, recall-sensitive low-latency serving | Frequent rebuilds, simple memory-reduction lever via PQ, throughput-oriented batch search |

## Evaluate the request shape before either one

Batch size and concurrency strongly affect how much useful work reaches the GPU for both index types. An offline job with many query vectors utilizes hardware differently from a low-rate interactive service. Include time waiting to form a batch, query transfer, and result transfer in the application's latency measurement — kernel-only speed does not establish end-to-end latency.

Budget device memory for the graph or centroid structures, the vector representation, optional retained refinement data, and temporary work. Device memory is a hard capacity constraint; additional host memory does not make an oversized GPU configuration workable. The Milvus guide also documents a supported mode that adapts a GPU_CAGRA index for CPU search during loading — treat that as a distinct deployment and benchmark configuration, not evidence that a GPU-serving measurement applies to the CPU-adapted path.

## Compare useful work per operating cost

Measure recall, successful query throughput, p95/p99 latency, GPU utilization, device memory, CPU use, and transfer overhead for both CAGRA and GPU_IVF on the same dataset and query mix. Include index build time and recovery after loading onto a replacement node. A GPU is worth its cost when it serves enough quality-constrained work to offset it — a high peak QPS figure measured at a large batch size only matters if the application can actually generate that workload without violating its response-time requirement.

## Example to test

Build CAGRA and GPU_IVF_PQ on the same corpus. Sweep CAGRA's search effort against an exact baseline and separately sweep GPU_IVF_PQ's `nprobe`; compare the recall/latency curves at matched recall targets, then compare each one's build time and memory footprint. If the application also rebuilds the index frequently, weight that rebuild cost into the decision rather than comparing query-time numbers alone.

## From concept to implementation

- [Configure GPU_CAGRA parameters and loading modes](https://milvus.io/docs/gpu-cagra.md).
- [Configure GPU_IVF_FLAT and GPU_IVF_PQ](https://milvus.io/docs/gpu-ivf-pq.md).
- [Compare Milvus index structures and supported field types](https://milvus.io/docs/index-explained.md).

## Continue learning

- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [How do batching, latency, and throughput interact in vector search?](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus GPU_CAGRA parameters and loading modes](https://milvus.io/docs/gpu-cagra.md)
- [Milvus GPU_IVF_FLAT configuration](https://milvus.io/docs/gpu-ivf-flat.md)
- [Milvus GPU_IVF_PQ configuration](https://milvus.io/docs/gpu-ivf-pq.md)
- [NVIDIA cuVS vector-search implementations](https://github.com/NVIDIA/cuvs)
- [CAGRA research paper](https://arxiv.org/abs/2308.15136)
