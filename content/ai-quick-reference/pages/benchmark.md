---
slug: "what-tools-help-benchmark-vector-search-performance"
title: "How should you benchmark vector search performance?"
topic: "production"
order: 32
---

A useful vector-search benchmark compares systems under the same workload and quality requirements. It should be reproducible from recorded data, configuration, and environment details. A single QPS number without recall, concurrency, or hardware context is difficult to interpret.

![Control the workload before comparing performance](/images/ai-reference/benchmark.svg)

## Define the experiment

Record corpus snapshot, vector dimension and type, embedding model, metric, query set, top-k, filters, payload fields, and update activity. Specify hardware or managed-service configuration, software versions, index parameters, and the load generator. State whether clients are local to the service and whether network time is included.

Keep exact-neighbor recall separate from judged application relevance. For ANN comparisons, build a compatible exact baseline and report performance at matched recall targets. For product-quality comparisons, use relevance judgments and the full retrieval pipeline.

## Measure more than steady-state QPS

Collect latency percentiles, successful request throughput, errors, memory, and resource utilization. Include index build time, loading time, ingestion throughput, and recovery behavior where these affect the product. Distinguish warm-cache measurements from cold or changing-data conditions.

VectorDBBench supplies repeatable workloads for several database operations and retrieval scenarios. Use a workload that matches your question and inspect its configuration. A published dataset is a starting point; it may not represent your filter selectivity, tenant skew, modalities, or update patterns.

## Avoid misleading comparisons

Run repeated trials and retain raw results. Explain any differences in data layout, tuning access, resource allocation, or failure handling. Do not compare one configuration's best-quality run with another's maximum-throughput run. Report the resulting quality/performance curve and choose the operating point that satisfies the application, rather than turning one favorable benchmark into a universal product claim.

## Example to test

Compare two indexes only after fixing corpus, query set, filters, and recall target. Report client-observed p95 alongside offered and completed throughput. A faster run with a growing request backlog has not met the same service objective.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [How do GPU-accelerated indexes compare in Milvus?](/ai-quick-reference/what-is-gpu-cagra)
- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do batching, latency, and throughput interact in vector search?](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)

## Implementation guides and sources

- [VectorDBBench workloads and setup](https://github.com/zilliztech/VectorDBBench)
- [Index performance trade-offs](https://milvus.io/docs/index-explained.md)
