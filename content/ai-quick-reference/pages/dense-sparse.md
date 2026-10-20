---
slug: "what-are-dense-and-sparse-embeddings"
title: "What are dense and sparse embeddings?"
topic: "foundations"
order: 6
---

Dense and sparse embeddings represent information differently. A dense vector generally has a fixed set of coordinates with many nonzero values. A sparse vector represents only its nonzero dimensions. Sparse dimensions can correspond to terms or learned features; the meaning depends on how the representation was produced.

## What this means for retrieval

Dense models often retrieve paraphrases and semantically related passages even when wording differs. Sparse retrieval is useful when particular terms or learned sparse features are strong signals. BM25 is a term-based relevance model, while learned sparse models are a different family; neither should be described as interchangeable with every sparse representation.

These are tendencies, not guarantees. A dense model can fail on a specialist abbreviation, and keyword retrieval can fail when a user describes the right concept with different words. Evaluate the query classes that matter in your product instead of choosing solely from representation size.

## Store and combine them correctly

In Milvus, dense and sparse representations use appropriate field and index types. BM25 full-text search can generate its sparse representation from analyzed text. If you use a learned sparse model, follow that model's encoding and metric requirements rather than applying the BM25 configuration automatically.

A hybrid pipeline can retrieve candidates from both representations and combine their rankings. Do not add raw scores blindly: cosine, inner product, and BM25 scores can have different distributions. Use a supported fusion strategy and validate it with representative queries.

## A useful comparison

Run dense-only, sparse-only, and hybrid retrieval against one fixed corpus. Inspect exact IDs, rare terms, paraphrases, and mixed queries separately. Compare relevance at the same final top-k, together with latency, indexing time, and resource use. Keep both paths only when their added value justifies the operational complexity.

## Continue learning

- [How does a sparse inverted index differ from dense ANN?](/ai-quick-reference/how-sparse-inverted-indexes-work)
- [How do scalar indexes support filtered vector search?](/ai-quick-reference/how-scalar-indexes-support-vector-search)
- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [What is full-text search, and how does BM25 fit?](/ai-quick-reference/what-is-fulltext-search)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)

## Implementation guides and sources

- [Dense vector fields](https://milvus.io/docs/dense-vector.md)
- [BM25 full-text search](https://milvus.io/docs/full-text-search.md)
- [Sparse inverted index](https://milvus.io/docs/sparse-inverted-index.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
