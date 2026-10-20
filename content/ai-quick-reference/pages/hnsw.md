---
slug: "what-is-hnsw"
title: "What is HNSW, and how should you tune it?"
topic: "retrieval"
order: 11
---

HNSW, or Hierarchical Navigable Small World, is a graph-based approximate-nearest-neighbor (ANN) index. It builds a hierarchy of neighbor graphs: a query starts from a sparse upper layer to move across the space, then descends to denser lower layers for local search. HNSW is the in-memory graph-search structure; optional SQ/PQ/PRQ variants compress vector representations separately.

![HNSW hierarchical graph navigation](/images/ai-reference/hnsw.svg)

## The important trade-offs

The graph helps avoid comparing every stored vector, but its links consume memory in addition to the vector representation. Building the graph also takes time. A graph configuration that improves recall may require more memory or more work during indexing and search.

In Milvus HNSW, `M` controls graph connectivity, `efConstruction` affects exploration during construction, and search-time `ef` controls the search effort. Consult the versioned guide for valid values and constraints. Build-time and search-time parameters are different: changing a search parameter does not retroactively rebuild a better graph.

## A disciplined tuning sequence

First fix the embedding model, metric, and dataset. Build an exact-neighbor baseline for representative queries. With one graph configuration, sweep search-time effort to understand the recall/latency curve. If the target is unreachable or memory is excessive, compare other construction settings or index families.

Test under the production query mix, including filters and the expected number of concurrent requests. Increasing search effort can help recall while reducing sustainable throughput. Report the quality level at which a performance number was measured.

## When to compare alternatives

HNSW is a useful candidate when graph-based retrieval fits the latency and memory budget. It is not automatically the best choice for every corpus. Include IVF and compressed or disk-oriented alternatives when capacity, ingestion rate, cost, or workload shape dominates. Avoid choosing from a graph-only microbenchmark when the application also requires expensive filtering, payload retrieval, or reranking.

## Keep the tuning variables separate

| Parameter | Stage | Question to investigate |
| --- | --- | --- |
| M | Graph construction | Does different connectivity justify its graph memory and build cost? |
| efConstruction | Graph construction | Does more construction exploration improve the reachable quality curve? |
| ef | Query | How much recall is gained for added search work on this fixed graph? |

A useful experiment changes one stage at a time. Keep filters and concurrency in the saved run configuration. If exact retrieval is already irrelevant, fix the model or data before rebuilding a graph; graph tuning only changes how well the index approximates the selected vector-ranking problem.

## Example to test

Sweep search-time ef with one fixed graph before rebuilding with a different M. This separates search effort from graph connectivity. Save each recall and p95 pair so the chosen configuration has an explicit operating point.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [How do HNSW_SQ, HNSW_PQ, and HNSW_PRQ change the trade-offs?](/ai-quick-reference/hnsw-sq-pq-prq-tradeoffs)
- [What is GPU_CAGRA, and when does it help vector search?](/ai-quick-reference/what-is-gpu-cagra)
- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus HNSW index](https://milvus.io/docs/hnsw.md)
- [Milvus hierarchical graph index](https://milvus.io/docs/hnsw.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
