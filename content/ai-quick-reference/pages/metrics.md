---
slug: "what-is-the-role-of-distance-metrics-in-embeddings"
title: "How do cosine similarity, inner product, and L2 differ?"
topic: "foundations"
order: 5
---

A similarity metric defines how vectors are compared. Choose it to match the embedding model's training and recommended retrieval configuration. Changing the metric changes the ranking problem; it is not simply a performance setting.

## The three common choices

| Metric | What it measures | Direction of a better match |
| --- | --- | --- |
| Cosine similarity | Alignment of vector directions, normalized by their lengths | Larger |
| Inner product | Dot product, influenced by both alignment and magnitude | Larger |
| L2 distance | Geometric distance between vectors | Smaller |

Milvus reports squared L2 distances, so thresholds must use the scale returned by the system. Do not copy a threshold calibrated for cosine into an L2 search. Sparse full-text retrieval with BM25 has its own scoring semantics and should not be interpreted as cosine similarity.

## Understand normalization

For nonzero unit-normalized vectors, inner product equals cosine similarity. Squared L2 is then `2 - 2 × inner_product`, so the rankings are equivalent apart from ties and numeric effects. Without normalization, that relationship does not hold: vector magnitude can change an inner-product ranking.

Normalization is therefore part of the model and data contract. Apply it consistently if the model expects it. Do not silently normalize a model whose output magnitudes carry useful ranking information, and handle zero vectors explicitly because their cosine direction is undefined.

## Test the decision

Use the same vectors and queries to compare candidate metrics on a judged dataset. Check both relevant and irrelevant pairs, then calibrate application thresholds using the actual returned values. If you change a collection's embedding model or metric, rebuild or migrate the relevant index configuration as required by the deployed version. Store the chosen metric with the evaluation record so future benchmark runs remain comparable.

## Example to test

For unit vectors q=(1,0) and d=(0.8,0.6), cosine and inner product are 0.8; squared L2 is 0.4. These illustrative values show why score thresholds cannot be copied across metrics.

## From concept to implementation

- [Run a first verified search](https://milvus.io/docs/quickstart.md).
- [Explore hands-on Milvus projects](https://milvus.io/bootcamp).

## Continue learning

- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [When should you use range search instead of only top-k?](/ai-quick-reference/when-to-use-vector-range-search)
- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Milvus similarity metrics](https://milvus.io/docs/metric.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
