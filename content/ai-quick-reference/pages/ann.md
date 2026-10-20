---
slug: "what-is-approximate-nearestneighbor-ann-search"
title: "What is approximate nearest-neighbor search?"
topic: "retrieval"
order: 10
---

Nearest-neighbor search starts with a query vector, an eligible dataset, a metric, and a requested `k`. It asks for the `k` closest vectors. That request is the k-nearest-neighbor (kNN) problem. An exact method guarantees the true top-k for the eligible set and metric; a FLAT scan is the simple exhaustive baseline. An approximate nearest-neighbor (ANN) method uses an index to reduce work and can miss true neighbors. “kNN” is sometimes used for the result task and sometimes contrasted with ANN; here exact kNN means a guaranteed exact result, while ANN names an approximate solution.

![Hash buckets, graph navigation, and IVF partitions are different ANN structures](/images/ai-reference/ann-families.svg)

## The main structures: hashing, graphs, and IVF

ANN indexes narrow the candidate set through one of a few structural ideas: hashing schemes that bucket similar items together (LSH, or Milvus's `MINHASH_LSH` for binary MinHash/Jaccard similarity specifically), graphs that navigate neighbor links toward promising results (HNSW, DiskANN's Vamana graph, GPU_CAGRA), and IVF's coarse centroid partitions that a query probes selectively. Compression (SQ, PQ, PRQ, RaBitQ) is a separate axis that combines with any of these — IVF_PQ is IVF partitioning plus product-quantized codes, HNSW_PQ is graph navigation plus PQ-compressed vectors. FLAT has no approximate candidate structure at all; it is the exhaustive baseline.

Naming alone does not establish interchangeability: `MINHASH_LSH` is not a general LSH index for dense semantic embeddings, so check the field type and metric before assuming two similarly named methods solve the same problem. For the full decision table — which structure to pick for a given workload, dataset size, and resource budget — see [how to choose a vector index for your workload](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload).

## FAISS is the implementation library layer

FAISS is a vector-search and clustering library, not an algorithm name. Its index-factory recipes can combine components such as `IVF64,Flat`, `HNSW16,Flat`, or `OPQ16,IVF64,PQ16x4`. In Milvus, Knowhere integrates multiple libraries and Milvus 3.0 documents an advanced `FAISS` passthrough. A recipe valid in standalone FAISS is not automatically supported for every Milvus field, metric, filter, or operation. Prefer a dedicated Milvus index type unless a tested recipe requires passthrough.

## Match the index to the resource constraint

HNSW often suits fast in-memory graph search when its link memory fits. IVF limits search to selected coarse regions and has variants that store full or compressed vectors. DiskANN trades SSD reads for capacity beyond RAM. GPU_CAGRA uses GPU parallelism for graph construction/search; it needs an actual GPU-shaped workload to pay off. These are starting hypotheses, not universal rankings.

Quantization separately reduces the bytes used for vectors or distance estimates. [The quantization guide](/ai-quick-reference/what-is-vector-quantization-in-embeddings) explains SQ, PQ, PRQ, and RaBitQ, including what remains in memory after compression.

## Measure against exact neighbors

For the same eligible data, metric, query set, and `k`, compare approximate results with an exact FLAT baseline. Report exact-neighbor Recall@k separately from judged application relevance. Also record build time, index bytes, resident memory, latency, throughput, update/rebuild behavior, and any SSD or GPU cost. A family name alone does not state the quality or end-to-end footprint.

## Example to test

For a fixed corpus, compare FLAT, HNSW, IVF_FLAT, IVF_PQ, DiskANN, and GPU_CAGRA only where the required hardware exists. Hold query, filters, and recall target constant. For each index, say which structure selects candidates and whether its distance values are full precision or quantized. Do not describe FAISS as a peer algorithm in this comparison: it is a library through which some of those algorithms can be built.

## From concept to implementation

- [Compare Milvus index structures and supported field types](https://milvus.io/docs/index-explained.md).
- [Use MINHASH_LSH for binary MinHash/Jaccard signatures](https://milvus.io/docs/minhash-lsh.md).
- [Read the FAISS passthrough guide and its limits](https://milvus.io/docs/faiss.md).

## Continue learning

- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [What is FAISS, and how does it relate to vector indexes?](/ai-quick-reference/what-is-faiss)
- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [What is GPU_CAGRA, and when does it help vector search?](/ai-quick-reference/what-is-gpu-cagra)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)

## Implementation guides and sources

- [Milvus index structures](https://milvus.io/docs/index-explained.md)
- [FAISS passthrough and its limits](https://milvus.io/docs/faiss.md)
- [HNSW](https://milvus.io/docs/hnsw.md)
- [DiskANN](https://milvus.io/docs/diskann.md)
- [GPU_CAGRA](https://milvus.io/docs/gpu-cagra.md)
- [IVF](https://milvus.io/docs/ivf-flat.md)
- [IVF_PQ](https://milvus.io/docs/ivf-pq.md)
