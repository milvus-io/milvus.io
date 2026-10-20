---
slug: "what-is-gpu-cagra"
title: "What is GPU_CAGRA, and when does it help vector search?"
topic: "retrieval"
order: 60
---

CAGRA is a graph-based approximate nearest-neighbor approach optimized for GPU execution. Milvus exposes GPU_CAGRA with documented build and search controls. It is a candidate when GPU parallelism and the workload's request shape can justify the device memory and operating cost.

## Evaluate the request shape

Batch size and concurrency strongly affect how much useful work reaches the GPU. An offline job with many query vectors can utilize hardware differently from a low-rate interactive service. Include time waiting to form a batch, query transfer, and result transfer in the application's latency measurement.

Budget for the graph, vector representation, optional retained data, and temporary work. Device memory is a capacity constraint; additional host memory does not automatically make an oversized GPU configuration workable. Check supported data types, metrics, and deployment requirements in the current Milvus guide.

## Keep build and search decisions separate

Graph construction parameters affect index quality, size, and preparation cost. Search parameters affect how broadly a request explores the built graph. Sweep search effort against an exact-vector baseline before changing multiple construction and execution settings together.

The Milvus guide also documents a supported mode that adapts a GPU_CAGRA index for CPU search during loading. Treat that as a distinct deployment and benchmark configuration. It does not establish that a GPU-serving measurement applies to the CPU-adapted path or to other GPU index families.

## Compare useful work per operating cost

Measure recall, successful query throughput, p95/p99 latency, GPU utilization, device memory, CPU use, and transfer overhead. Include index build time and recovery after loading onto a replacement node. Compare GPU_CAGRA with GPU IVF and CPU candidates on the same dataset and query mix.

A GPU can be valuable when it serves enough quality-constrained work to offset its cost. A high peak QPS figure measured at a large batch size is only useful when the application can generate that workload without violating its response-time requirement. Retain the complete hardware and batching configuration with the result.

## Continue learning

- [How do GPU_IVF_FLAT and GPU_IVF_PQ differ?](/ai-quick-reference/gpu-ivf-flat-vs-gpu-ivf-pq)
- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [How do batching, latency, and throughput interact in vector search?](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus GPU_CAGRA parameters and loading modes](https://milvus.io/docs/gpu-cagra.md)
- [NVIDIA cuVS vector-search implementations](https://github.com/NVIDIA/cuvs)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
