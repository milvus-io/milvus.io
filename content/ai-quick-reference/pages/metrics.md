---
slug: "what-is-the-role-of-distance-metrics-in-embeddings"
title: "How do cosine similarity, inner product, and L2 differ?"
topic: "foundations"
order: 5
---

A vector score defines how representations are compared. Cosine, inner product, and L2 emphasize different geometry. Choose the score expected by the model or representation; changing it can change the ranking problem, rather than merely making the same search faster.

![Angle, projection, and distance can produce different rankings](/images/ai-reference/similarity-metrics.svg)

## Read the geometry and the formulas

For vectors q and d:

| Comparison | Formula | Geometric reading | Better match |
| --- | --- | --- | --- |
| Cosine similarity | `(q · d) / (||q|| ||d||)` | Direction alignment; ignores positive rescaling of either vector | Larger |
| Inner product (IP) | `q · d = Σ q_i d_i` | Signed projection multiplied by vector length; uses direction and magnitude | Larger |
| Squared L2 | `Σ (q_i - d_i)^2` | Squared straight-line separation | Smaller |

Cosine is undefined for a zero-length vector. Inner product and cosine are similarities, not mathematical distances satisfying every metric axiom. Milvus returns squared L2 rather than its square root; this preserves L2 ranking but changes threshold units.

## An example where the rankings differ

Use q=(1,0), A=(0.8,0.6), and B=(2,0). A has length 1 and B has length 2. B points in exactly the same direction as q, so its cosine is 1; A's cosine is 0.8. IP is 2 for B and 0.8 for A. Squared L2 is 1 for B but 0.4 for A, so L2 prefers A. The diagram uses these exact coordinates and illustrative calculations, not measured retrieval quality.

This does not prove one comparison is better. It shows that a model's magnitude convention matters. A system that silently normalizes its stored vectors can change an intended inner-product ordering.

## When normalization makes the rankings agree

For nonzero unit vectors, IP equals cosine, and squared L2 is `2 - 2 × IP`. Rankings then agree apart from ties and numerical effects. Normalize both query and documents only when appropriate for the representation; keep zero-vector handling explicit.

BM25 uses its own lexical score. Multi-vector MaxSim aggregates multiple pair scores and is usually directional. Neither should be treated as another label for ordinary cosine or L2. See [multi-vector search and MaxSim](/ai-quick-reference/what-is-multi-vector-retrieval).

## Example to test

Compute the three scores for the vectors above, then normalize B to (1,0) and compute again. Verify the algebra before configuring a collection. On real data, compare judged relevance under the model's supported choices; a toy geometry example does not establish the best metric for a product.

## From concept to implementation

- [Check Milvus score definitions and returned values](https://milvus.io/docs/metric.md).
- [Configure the dense-vector field](https://milvus.io/docs/dense-vector.md).

## Continue learning

- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [What is multi-vector retrieval, and how do MaxSim and MUVERA work?](/ai-quick-reference/what-is-multi-vector-retrieval)
- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [When should you use range search instead of only top-k?](/ai-quick-reference/when-to-use-vector-range-search)

## Implementation guides and sources

- [Milvus similarity metrics](https://milvus.io/docs/metric.md)

Sources checked: 2026-10-20. Algorithms and illustrative calculations are documentation-reviewed; model inference and target-release deployment were not run.
