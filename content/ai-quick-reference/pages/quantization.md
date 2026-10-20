---
slug: "what-is-vector-quantization-in-embeddings"
title: "What is vector quantization, and what does it trade off?"
topic: "retrieval"
order: 13
---

Vector quantization represents vectors with fewer bits or compact codes. It can reduce storage, memory use, or distance-computation cost, but the compressed representation usually loses information. Whether that loss matters must be measured on the retrieval task.

## Common forms

Scalar quantization reduces the precision used for individual coordinates. Product quantization divides a vector into parts and represents each part using a learned codebook. Binary representations use another set of encoding and distance assumptions. These approaches are not interchangeable, and an embedding model's own low-precision inference is a separate concern from index-side vector compression.

An index can combine a search structure with quantization. For example, IVF_PQ first selects promising IVF regions and then uses product-quantized representations for candidate comparisons. Missing a region and approximating a distance are two different sources of error.

## Measure quality at equal conditions

Use identical source vectors, queries, metric, and eligibility rules when comparing compressed and uncompressed indexes. Report exact-neighbor recall, application relevance, latency, and total memory. A smaller index is not a win if the application needs substantially more search effort or reranking to recover acceptable results.

Some configurations refine candidates with higher-precision vectors. Refinement can improve ranking among retrieved candidates, but it cannot recover a candidate that never reaches that stage. Include the retained full vectors and refinement work in capacity and latency measurements.

## Make the operational decision

Choose compression when its measured resource savings justify the quality and processing trade-offs. Recheck results after a model or data-distribution change. Record the encoding, index parameters, and baseline used in the experiment, and keep original data or reproducible embeddings so the representation can be rebuilt. The Milvus index guide describes supported combinations; use the options available in your deployed version.

## Continue learning

- [How do HNSW_SQ, HNSW_PQ, and HNSW_PRQ change the trade-offs?](/ai-quick-reference/hnsw-sq-pq-prq-tradeoffs)
- [What is IVF_RABITQ, and how should you evaluate it?](/ai-quick-reference/what-is-ivf-rabitq)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [How do cosine similarity, inner product, and L2 differ?](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Index compression and refinement](https://milvus.io/docs/index-explained.md)
- [Product quantization in IVF_PQ](https://milvus.io/docs/ivf-pq.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
