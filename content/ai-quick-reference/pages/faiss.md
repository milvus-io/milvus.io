---
slug: "what-is-faiss"
title: "What is FAISS, and how does it relate to vector indexes?"
topic: "retrieval"
order: 132
---

FAISS (Facebook AI Similarity Search) is a library for efficient similarity search and clustering of dense vectors. It is not one ANN algorithm. FAISS provides multiple index structures and representation/compression methods, and it can compose them through an index-factory string. The query problem stays “find the nearest vectors”; the chosen index recipe changes how the library finds and stores them.

## A factory string names a composition

| Recipe component | Role | Example |
| --- | --- | --- |
| `Flat` | Compare the full vectors in the selected set; exact but exhaustive | `Flat` |
| `IVF` | Assign vectors to centroid lists and probe selected lists | `IVF64,Flat` |
| `HNSW` | Navigate a neighbor graph | `HNSW16,Flat` |
| `PQ` | Replace a vector with compact subvector code IDs | `OPQ16,IVF64,PQ16x4` |
| Refiner | Re-score a retrieved shortlist at higher precision where supported | `IVF64,PQ8x4,RFlat` |

This illustrates why “FAISS versus HNSW” is an apples-to-oranges comparison: FAISS is the library; HNSW is a graph algorithm that can be one of the library's index structures. IVF is a partitioning scheme, and PQ is a compression method. Some recipes compose more than one.

## FAISS and Milvus

Milvus uses Knowhere as a vector execution layer that integrates several index implementations. Milvus 3.0 also documents an advanced `FAISS` index passthrough: the `faiss_index_name` parameter supplies the factory string. Prefer a dedicated Milvus index type for a common recipe when it fits; dedicated types have their own documented parameter contract.

The passthrough does not make every upstream FAISS recipe or operation automatically available in Milvus. Compatibility depends on the field type, metric, compiled adapter, and whether the factory supports the Milvus operations your query uses. The current FAISS guide documents supported examples and limits, including filtering behavior. Version-check and validate the exact recipe before relying on it.

## When this distinction helps

Use FAISS directly when an application wants a vector-search library inside its own process and owns the surrounding data lifecycle. Use Milvus when the application needs a database service, collection lifecycle, filtering, persistence, and distributed serving. A FAISS index can be one building block inside Milvus through supported integration; it does not replace the rest of the database responsibilities.

## Example to inspect

Read `IVF64,Flat` as IVF candidate partitioning followed by full-vector scoring in selected lists. Read `HNSW16,Flat` as HNSW graph navigation with full-vector values. Read `OPQ16,IVF64,PQ16x4` as a transform, IVF partitioning, and PQ codes. For any recipe, verify its field type, metric, search parameters, filters, and version support.

## From concept to implementation

- [Read Milvus's FAISS passthrough guide](https://milvus.io/docs/faiss.md).
- [Understand the Knowhere vector execution layer](https://milvus.io/docs/knowhere.md).

## Continue learning

- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)

## Implementation guides and sources

- [Milvus FAISS passthrough and supported factory examples](https://milvus.io/docs/faiss.md)
- [Knowhere index execution layer](https://milvus.io/docs/knowhere.md)
- [FAISS source repository and library overview](https://github.com/facebookresearch/faiss)
