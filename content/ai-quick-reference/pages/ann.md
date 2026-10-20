---
slug: "what-is-approximate-nearestneighbor-ann-search"
title: "What is approximate nearest-neighbor search?"
topic: "retrieval"
order: 10
---

Approximate nearest-neighbor (ANN) methods seek lower search cost by limiting candidate exploration, approximating vector comparisons, or combining both. They may miss neighbors returned by an exact baseline; a particular query or configuration can still reach full agreement. Measure recall, latency, and resource use together rather than assuming that approximation always loses quality or always runs faster.

![HNSW hierarchical graph navigation](/images/ai-reference/hnsw.svg)

## Separate two meanings of recall

ANN recall asks whether the approximate index returns the neighbors that an exact search would return for the same vectors, metric, eligibility rules, and k. Retrieval relevance asks whether those neighbors actually help answer the user's question. An ANN index can achieve high exact-neighbor recall while an unsuitable embedding model retrieves the wrong information.

Use these measurements separately. If exact search already misses relevant evidence, adjusting ANN parameters will not solve the representation problem. If exact search is good but approximate search drops useful neighbors, index configuration deserves attention.

## How indexes reduce work

Graph indexes such as HNSW navigate connections between nearby points. IVF-style indexes divide the space into regions and search selected regions. Quantization can reduce representation size or comparison cost, adding another approximation. Some systems combine these techniques.

Each choice has build-time, storage, memory, and update costs. A setting that is fast on a static unfiltered benchmark may behave differently with selective filters or concurrent writes. Benchmark the eligible subset and workload that the application actually uses.

## Tune against a target

Construct an exact baseline on representative data, then sweep search parameters while keeping the model, corpus, metric, k, hardware, and filters fixed. Record recall together with p95/p99 latency, throughput, and memory. Select a point that meets an explicit quality and latency requirement rather than maximizing QPS at an unspecified recall level.

## Example to test

If exact search returns ten eligible neighbors and ANN finds eight of them, exact-neighbor Recall@10 is 0.8. This illustrative calculation says nothing about whether those ten passages answer the question; relevance needs separate labels.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Vector index design and trade-offs](https://milvus.io/docs/index-explained.md)
- [Similarity metrics](https://milvus.io/docs/metric.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
