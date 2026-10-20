---
slug: "gpu-ivf-flat-vs-gpu-ivf-pq"
title: "How do GPU_IVF_FLAT and GPU_IVF_PQ differ?"
topic: "retrieval"
order: 61
---

GPU_IVF_FLAT and GPU_IVF_PQ use an inverted-file organization with GPU execution. Both narrow the candidate space using coarse clusters. Their main representation difference is that FLAT retains full vector values for candidate scoring, while PQ uses product-quantized codes to reduce representation cost and introduce an additional approximation.

## Separate cluster selection from compression

In an IVF search, the number of clusters considered affects both work and recall. Searching too few can miss useful candidates even when their scores would be accurate inside the chosen clusters. Quantization adds another source of ranking error after candidate regions are selected.

This distinction matters during tuning. Compare IVF_FLAT-style behavior with an exact baseline first, then evaluate PQ at similar search effort and quality targets. Otherwise it is difficult to tell whether a missing neighbor was excluded by the coarse search or misranked by compression.

## Size the GPU configuration realistically

Account for index structures, vectors or codes, temporary search memory, and any retained data needed by the supported implementation. Check the exact index's dimension, metric, top-k, and hardware constraints in the Milvus guide. Limits are implementation-specific and can change across releases.

A smaller compressed representation can enable a useful capacity point, but memory savings should be measured over the complete loaded index. Include CPU memory and transfer costs in the service estimate. Avoid presenting a code-size ratio as the same ratio for the entire deployment.

## Match the benchmark to serving

Use identical vectors, filters, query sets, and recall measurements for GPU_IVF_FLAT, GPU_IVF_PQ, and a graph-based candidate such as GPU_CAGRA. Test the batch sizes and concurrency that the application can actually sustain.

Measure build time, loading, cold and warm behavior, tail latency, and errors in addition to throughput. If PQ loses relevance on a small but important query slice, inspect those failures before accepting the average score. Select the index that meets the workload's quality and capacity requirements with the lowest complete operating cost, rather than assuming that either GPU acceleration or compression is automatically beneficial.

## Continue learning

- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [What is GPU_CAGRA, and when does it help vector search?](/ai-quick-reference/what-is-gpu-cagra)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [GPU_IVF_FLAT configuration](https://milvus.io/docs/gpu-ivf-flat.md)
- [GPU_IVF_PQ configuration](https://milvus.io/docs/gpu-ivf-pq.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
