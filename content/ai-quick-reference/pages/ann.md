---
slug: "what-is-approximate-nearestneighbor-ann-search"
title: "What is approximate nearest-neighbor search?"
topic: "retrieval"
order: 10
---

Nearest-neighbor search starts with a query vector, a set of eligible vectors, a metric, and a requested `k`. It returns the `k` closest vectors under that metric. This is the k-nearest-neighbor (kNN) problem; the name describes what result is requested.

An **exact kNN** method evaluates enough of the eligible set to guarantee the true top-k for the chosen metric. A brute-force FLAT scan is the simplest exact baseline: compare the query with every eligible vector. An **approximate nearest-neighbor (ANN)** method uses an index or other shortcut to reduce work. It aims to return most of the true neighbors faster or with fewer resources, but can miss a true neighbor. In practice “kNN” is sometimes used loosely for the task and sometimes contrasted with approximate methods; here, exact kNN means the exact result, while ANN names an approximate way to find it.

![Hash buckets, graph navigation, and IVF partitions are different ANN structures](/images/ai-reference/ann-families.svg)

## Three common ANN index families

| Family | How it narrows the search | Main approximation or cost |
| --- | --- | --- |
| Hashing / locality-sensitive hashing (LSH) | Hash functions are designed so similar items have a higher chance of landing in the same bucket; search examines matching buckets and candidate collisions. | Bucket collisions can include false positives, and other near neighbors can be missed. The specific LSH scheme and distance matter. |
| Graph | Vectors form a neighbor graph; search walks links from entry points toward promising regions. HNSW adds graph layers to support coarse-to-fine navigation. | Graph links take memory and construction work. Search exploration controls the amount of work and candidate coverage. |
| Inverted file (IVF) | Train or calculate centroids, assign vectors to coarse cells, then search selected cells nearest the query. In Milvus, `nlist` controls the built partitions and `nprobe` the cells visited for a query. | Unvisited cells cannot contribute candidates; searching more cells costs more but can improve recall. |

These are broad families, not the whole design space or mutually exclusive choices. Compression/quantization is a separate design axis: IVF_PQ combines IVF partitioning with compressed vector codes, for example. Exact FLAT search has no such approximate candidate index.

## A Milvus-specific hashing distinction

“Hashing” in ANN literature often means LSH schemes for a chosen vector similarity. In current Milvus documentation, `MINHASH_LSH` is a specific index for binary MinHash signatures and set similarity (Jaccard), commonly used for near-duplicate detection. It is not a general LSH index for dense floating-point semantic embeddings. Check field type and metric compatibility before treating two methods with “LSH” in the name as interchangeable.

## Measure the approximation against an exact result

For the same query, metric, filters, corpus snapshot, and `k`, compare ANN hits with exact FLAT results. Exact-neighbor Recall@k is the overlap with that exact top-k. Measure this separately from judged relevance: a fast ANN index can faithfully approximate an embedding model that is unsuitable for the application.

Also record build time, memory, query latency, throughput, filters, and update behavior. Raise search effort or visit more IVF cells when recall is too low; compare a different structure when the quality/resource curve does not meet the target. Do not compare methods on different eligibility rules or corpus snapshots.

## Example to test

On one fixed eligible collection, run exact FLAT and an ANN configuration for the same query set. Report exact-neighbor Recall@10, judged relevance, and latency separately. If IVF misses a neighbor in an unvisited cell, increasing `nprobe` tests that hypothesis; if a graph configuration misses it, vary its search effort independently.

## From concept to implementation

- [Compare Milvus vector index structures](https://milvus.io/docs/index-explained.md).
- [Tune the HNSW graph index](https://milvus.io/docs/hnsw.md).
- [Configure IVF partitions and search effort](https://milvus.io/docs/ivf-flat.md).
- [Use MinHash LSH for binary-set similarity](https://milvus.io/docs/minhash-lsh.md).

## Continue learning

- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus vector-index structures](https://milvus.io/docs/index-explained.md)
- [https://milvus.io/docs/metric.md](https://milvus.io/docs/metric.md)
- [Milvus nearest-neighbor search](https://milvus.io/docs/single-vector-search.md)
- [Milvus HNSW graph index](https://milvus.io/docs/hnsw.md)
- [Milvus IVF index](https://milvus.io/docs/ivf-flat.md)
- [Milvus MINHASH_LSH](https://milvus.io/docs/minhash-lsh.md)
- [Hashing for similarity search: a survey](https://arxiv.org/abs/1408.2927)
- [HNSW original paper](https://arxiv.org/abs/1603.09320)

Sources checked: 2026-10-20. Verify implementation details against the deployed Milvus version.
