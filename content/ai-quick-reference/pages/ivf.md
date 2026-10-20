---
slug: "how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process"
title: "How do IVF indexes use centroids to search vectors?"
topic: "retrieval"
order: 12
---

An inverted-file (IVF) vector index divides the vector space into regions represented by centroids. During search, it chooses promising regions and compares candidates inside them. This reduces the number of vectors examined, but a true neighbor in an unsearched region can be missed.

![IVF centroid and region selection](/images/ai-reference/ivf.svg)

## Understand the two main controls

In Milvus IVF_FLAT, `nlist` is a build-time choice governing the number of clusters, while `nprobe` controls how many clusters are searched for a query. Increasing search coverage generally increases work and may improve exact-neighbor recall. The useful settings depend on the data distribution, corpus size, metric, and workload.

More clusters are not automatically better. They change the sizes and boundaries of the regions, the cost of selecting regions, and the balance of work inside them. Evaluate build configuration and search effort together rather than applying one formula to every dataset.

## IVF_FLAT versus compressed variants

IVF_FLAT keeps full vectors for the comparisons within selected regions. IVF_PQ adds product quantization, reducing representation size while introducing another source of approximation. These are distinct trade-offs: searching too few regions and using compressed distances can each affect recall.

When diagnosing a quality loss, first compare region coverage with a fixed representation, then compare compression under controlled conditions. Keep the same queries and exact baseline. This helps distinguish a search-budget problem from quantization error.

## Validate on the live workload shape

Include selective filters, uneven data distributions, and the expected request concurrency. Measure index construction, loading, memory, recall, and tail latency. If the corpus changes substantially, check whether the existing configuration still performs well. A configuration selected for one snapshot should not be assumed optimal after major growth or a model migration.

## Diagnose two different sources of misses

| Controlled comparison | What it can reveal |
| --- | --- |
| Fixed IVF_FLAT build, vary nprobe | Candidate-region coverage versus search work |
| Different nlist, matched query protocol | A build-layout change and its downstream effect |
| Full versus compressed representation | Additional distance approximation and capacity trade-offs |

Do not change all three together and attribute the result to one parameter. Save the training/build corpus revision as well as the query set: changing the data distribution can move the operating point even with identical configuration strings.

## Example to test

If increasing nprobe improves recall while vectors and compression remain fixed, region coverage was a limiting factor. Compare a different nlist only as a separate build experiment, including its construction and loading costs.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [How do GPU_IVF_FLAT and GPU_IVF_PQ differ?](/ai-quick-reference/gpu-ivf-flat-vs-gpu-ivf-pq)
- [What is IVF_RABITQ, and how should you evaluate it?](/ai-quick-reference/what-is-ivf-rabitq)
- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)

## Implementation guides and sources

- [Milvus IVF_FLAT index](https://milvus.io/docs/ivf-flat.md)
- [Milvus IVF_PQ index](https://milvus.io/docs/ivf-pq.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
