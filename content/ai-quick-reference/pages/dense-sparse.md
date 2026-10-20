---
slug: "what-are-dense-and-sparse-embeddings"
title: "What are dense and sparse embeddings?"
topic: "foundations"
order: 6
---

Search `database error 500` against a support corpus. A dense encoder turns that phrase into something like `[0.2, -0.4, 0.7, 0.1, ...]`, a fixed-length array where every position holds a value and the meaning lives in the pattern across all of them. A BM25-style sparse encoder instead keeps a handful of nonzero weights keyed to actual vocabulary terms — `database`, `error`, `500` — and ignores the rest of a huge vocabulary. Same query, two very different representations: one dense and opaque, one sparse and inspectable. That is the real distinction. It is not about model size, "semantic" versus "keyword," or which one is better; it is about how the coordinates are populated and what each nonzero position means. A sparse vector can have plenty of nonzero entries — it is not a one-hot vector — and a dense vector is not automatically more "intelligent" just because it is harder to read.

![Dense and sparse describe coordinate occupancy, not model size](/images/ai-reference/vector-representations.svg)

## Read a small example

Take a toy vocabulary with positions for `database`, `vector`, `memory`, and many other terms. A weighted lexical vector might have nonzero entries only for a few terms. Its coordinate IDs have a vocabulary meaning. A dense representation such as `[0.2, -0.4, 0.7, 0.1]` instead uses latent features; a single coordinate usually cannot be read as one word.

These are explanatory numbers, not outputs of a real model. Logical dimension, number of nonzeros, numeric precision, and index overhead all affect storage. Sparse storage is cheaper than dense storage only when the nonzero count stays low relative to the vocabulary; a dense query that expands to thousands of nonzero terms can cost more to store and score than a compact dense vector.

## Statistical and learned sparse retrieval differ

TF-IDF uses term and corpus statistics. BM25 additionally applies its term-frequency saturation and document-length normalization within its scoring formulation. Neither requires an LLM. A BM25 pipeline can create sparse term representations for lexical search, but its scoring configuration is not interchangeable with arbitrary sparse inner-product vectors.

SPLADE-style models learn sparse vocabulary weights and can expand beyond literal input terms. That makes learned sparse retrieval different from simply counting keywords. It also means a learned sparse encoder and an analyzer-based BM25 Function are different components, even if both ultimately use an inverted index.

Dense representations can come from neural encoders or classical learned projections. They may express useful paraphrase relationships, but density alone does not imply semantic quality. Similarly, sparsity alone does not establish exact-match behavior: the vocabulary, expansion, and analyzer matter.

## Choose fields and scores deliberately

In Milvus, client-generated learned sparse representations use a sparse field and a supported score/index path. Built-in BM25 full-text search starts from analyzed text and a BM25 Function. Keep this distinct from a client-side fitted BM25 encoder. Use the deployment's documented configuration rather than swapping score names between these routes.

For hybrid search, retrieve through dense and sparse paths separately, then use a supported, evaluated fusion policy. Raw cosine and BM25 scores need not share a scale. Preserve both candidate lists so a gain or failure can be attributed to the actual signal.

## Example to test

Evaluate an exact error code, a paraphrased symptom, and a mixed query on the same corpus. Check analyzer output, dense-only results, sparse-only results, and fusion. Some queries may favor either route; keep both only if measured relevance justifies the extra operating cost.

## From concept to implementation

- [Use the sparse-vector data representation](https://milvus.io/docs/sparse_vector.md).
- [Follow the built-in BM25 workflow](https://milvus.io/docs/full-text-search.md).

## Continue learning

- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [What is full-text search, and how does BM25 fit?](/ai-quick-reference/what-is-fulltext-search)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How does a sparse inverted index differ from dense ANN?](/ai-quick-reference/how-sparse-inverted-indexes-work)

## Implementation guides and sources

- [Dense vector fields](https://milvus.io/docs/dense-vector.md)
- [BM25 full-text search](https://milvus.io/docs/full-text-search.md)
- [Sparse inverted index](https://milvus.io/docs/sparse-inverted-index.md)
- [SPLADE learned vocabulary weighting](https://arxiv.org/abs/2107.05720)
