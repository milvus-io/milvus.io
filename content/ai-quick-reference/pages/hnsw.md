---
slug: "what-is-hnsw"
title: "What is HNSW, and how should you tune it?"
topic: "retrieval"
order: 11
---

HNSW, or Hierarchical Navigable Small World, is a graph-based approximate nearest-neighbor index. It connects vectors at multiple levels. A search uses upper levels to approach a promising region, then explores a denser lower-level neighborhood to find candidates.

## The important trade-offs

The graph helps avoid comparing every stored vector, but its links consume memory in addition to the vector representation. Building the graph also takes time. A graph configuration that improves recall may require more memory or more work during indexing and search.

In Milvus HNSW, `M` controls graph connectivity, `efConstruction` affects exploration during construction, and search-time `ef` controls the search effort. Consult the versioned guide for valid values and constraints. Build-time and search-time parameters are different: changing a search parameter does not retroactively rebuild a better graph.

## A disciplined tuning sequence

First fix the embedding model, metric, and dataset. Build an exact-neighbor baseline for representative queries. With one graph configuration, sweep search-time effort to understand the recall/latency curve. If the target is unreachable or memory is excessive, compare other construction settings or index families.

Test under the production query mix, including filters and the expected number of concurrent requests. Increasing search effort can help recall while reducing sustainable throughput. Report the quality level at which a performance number was measured.

## When to compare alternatives

HNSW is a useful candidate when graph-based retrieval fits the latency and memory budget. It is not automatically the best choice for every corpus. Include IVF and compressed or disk-oriented alternatives when capacity, ingestion rate, cost, or workload shape dominates. Avoid choosing from a graph-only microbenchmark when the application also requires expensive filtering, payload retrieval, or reranking.

## Continue learning

- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus HNSW index](https://milvus.io/docs/hnsw.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
