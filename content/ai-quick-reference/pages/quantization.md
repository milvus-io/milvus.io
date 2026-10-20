---
slug: "what-is-vector-quantization-in-embeddings"
title: "What is vector quantization, and what does it trade off?"
topic: "retrieval"
order: 13
---

Vector quantization replaces full-precision coordinates with a smaller code so an index can use fewer bytes for storage and distance estimation. It is lossy in general: a query compares the original or transformed vector with an approximation, so recall can change. Quantization is part of an index representation; it is not the same as an embedding model producing a lower-dimensional vector.

![Treat compression as another approximation](/images/ai-reference/quantization.svg)

## Estimate the raw vector memory first

For `N` vectors, dimension `D`, and 32-bit floats, raw vector payload is `N × D × 4` bytes, before IDs, metadata, index structures, allocator overhead, and caches. One million 768-dimensional FP32 vectors therefore hold 3.072 GB of vector values (about 2.86 GiB).

If every coordinate is stored as one 8-bit scalar, the payload is about `N × D × 1` bytes: 0.768 GB in this example, close to 4× compression of the vector values. That does **not** mean the whole service shrinks by 4×: the index graph, centroids/codebooks, identifiers, and any retained high-precision refinement vectors still consume space.

## Four quantization families

| Method | How the compact representation is formed | What it means for memory/search |
| --- | --- | --- |
| Scalar Quantization (SQ/SQ8) | Map each coordinate to a lower-bit integer level, such as 8 bits instead of FP32. | Simple per-coordinate compression; often around 4× less vector payload at SQ8, with approximation error from rounded values. |
| Product Quantization (PQ) | Split a vector into `m` subvectors; map each subvector to a centroid in a learned codebook, storing the centroid ID. | Code size is roughly `m × nbits` bits per vector, plus shared codebooks. Distance estimates use lookup tables; aggressive compression can reduce recall. |
| Product Residual Quantization (PRQ) | Apply PQ, then quantize the residual error with further product-quantization stages. | Extra residual codes use more bytes/build work than a single PQ stage; they aim to represent the remaining error more closely. Actual recall and latency still need measurement. |
| RaBitQ | Use a randomized, binary (`D`-bit) code and a corrected distance estimator for high-dimensional vectors; Milvus exposes it with IVF as `IVF_RABITQ`. | The code can be about 32× smaller than a `D`-coordinate FP32 payload, before auxiliary values/refinement. It is not simply storing coordinate signs; normalization and correction terms matter. |

For example, a 768-dimensional vector with 96 PQ subcodes and 8 bits per subcode stores a 96-byte code, versus 3,072 raw FP32 bytes. That is a 32× vector-code ratio before shared codebooks and the rest of the index. It does not predict recall or total loaded memory.

## Compression and index structure are separate choices

IVF selects coarse centroid regions; SQ/PQ/RaBitQ describe the stored representation or distance estimator. HNSW selects neighbors through a graph; HNSW_SQ/PQ/PRQ pair graph navigation with compressed vectors. DiskANN uses graph navigation organized for disk access and keeps compact PQ codes available for approximate distance checks. GPU_CAGRA is a GPU graph; GPU_IVF_PQ is a GPU IVF structure with PQ. The name often signals a combination of layers.

A refiner may keep or fetch higher-precision vectors to rescore a shortlist. Refinement can improve ordering among candidates but cannot recover a vector that the preceding structure never selected. Include that full-precision data in memory or I/O budgets.

## What each abbreviation means in Milvus

- `SQ8`: scalar quantization to 8-bit coordinates, e.g. `IVF_SQ8` or `HNSW_SQ` where supported.
- `PQ`: product quantization. It commonly appears with IVF (`IVF_PQ`), HNSW (`HNSW_PQ`), and disk-oriented search.
- `PRQ`: product residual quantization—PQ followed by residual quantization stages—available in `HNSW_PRQ` in documented Milvus configurations.
- `RaBitQ`: randomized 1-bit vector quantization with a distance estimator; `IVF_RABITQ` combines it with IVF candidate selection.

These names are versioned index configurations, not promises that every vector type, metric, or deployment exposes the same combination. Consult the matching guide before choosing parameters.

## Compare the same job

Keep vectors, metric, eligible records, and queries fixed. Compare each compressed index with an exact baseline at matched Recall@k and application relevance. Record code bytes, total index and loaded memory, graph/centroid overhead, any raw-vector retention, build time, latency, and refinement I/O. A lower code size is useful only when the entire configuration meets the quality and cost target.

## Example to test

Start with IVF_FLAT as an uncompressed IVF baseline. Compare IVF_SQ8, IVF_PQ, and IVF_RABITQ at the same recall target and query set. Then compare HNSW_PQ or HNSW_PRQ if graph search is relevant. Separate two error sources: not probing the region/node that contains the neighbor versus approximating its distance after it becomes a candidate.

## From concept to implementation

- [Review Milvus index families and composition](https://milvus.io/docs/index-explained.md).
- [Compare scalar and product quantization in IVF](https://milvus.io/docs/ivf-sq8.md).
- [Read HNSW product residual quantization](https://milvus.io/docs/hnsw-prq.md).
- [Read IVF_RABITQ and its refinement options](https://milvus.io/docs/ivf-rabitq.md).

## Continue learning

- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [How do HNSW_SQ, HNSW_PQ, and HNSW_PRQ change the trade-offs?](/ai-quick-reference/hnsw-sq-pq-prq-tradeoffs)
- [What is IVF_RABITQ, and how should you evaluate it?](/ai-quick-reference/what-is-ivf-rabitq)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)

## Implementation guides and sources

- [Milvus index structures and memory trade-offs](https://milvus.io/docs/index-explained.md)
- [IVF scalar quantization](https://milvus.io/docs/ivf-sq8.md)
- [IVF product quantization](https://milvus.io/docs/ivf-pq.md)
- [HNSW product residual quantization](https://milvus.io/docs/hnsw-prq.md)
- [IVF_RABITQ](https://milvus.io/docs/ivf-rabitq.md)
- [RaBitQ original paper](https://arxiv.org/abs/2405.12497)

Sources checked: 2026-10-20. Compression ratios estimate vector codes only; measure complete loaded indexes on the target release.
