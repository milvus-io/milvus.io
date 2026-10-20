---
slug: "what-is-semantic-search-and-how-does-it-differ-from-keyword-search"
title: "How does semantic search differ from keyword search?"
topic: "retrieval"
order: 8
---

Keyword and semantic search use different evidence. Lexical search analyzes text into terms and scores documents that share query terms. Semantic search encodes text into vectors and finds nearby representations, which can match different wording. Neither signal should be expected to solve the other's failure cases.

![Two retrieval signals, one inspected candidate pool](/images/ai-reference/hybrid.svg)

## Keyword matching is not always exact matching

An analyzer can lowercase text, split tokens, remove punctuation, or apply language-specific rules. That determines which terms a lexical system can match. A BM25 full-text query ranks documents from their matching terms; it does not mean that every query term must appear, nor does it guarantee an exact phrase. Use phrase matching or a filter when the condition itself must be true.

Lexical evidence is often valuable for error codes, product names, version strings, identifiers, and specialist vocabulary. Its limits follow from the query and indexed text producing different tokens. A semantic encoder can bridge paraphrases, but similar meanings do not reliably preserve an exact identifier, negation, version, or numeric value.

## Combine the signals as hybrid retrieval

For a query such as “HNSW index returns an outdated result,” a BM25 path can retain the literal `HNSW` term while a dense path may find passages phrased as “stale search results.” In Milvus, a common design searches a BM25-generated sparse field and a dense vector field, applies the same authorization and metadata eligibility to both, then merges their candidate lists with a supported ranker such as Reciprocal Rank Fusion (RRF) or WeightedRanker.

The order matters: each path first produces its own candidate list; fusion then reorders the candidates that were found. Fusion cannot recover a relevant document missing from both lists. Candidate depth, eligibility rules, and final ranking all affect the result.

## Decide from the query mix

Build judged examples for exact identifiers, paraphrases, mixed queries, and queries with no valid answer. Compare lexical-only, dense-only, and hybrid retrieval using identical source data, filters, and final top-k. Inspect candidate lists before fusion. Keep the extra path when it improves relevant evidence enough to justify index size, ingestion, latency, and maintenance costs.

## Example to test

Search once for `E-1042`, once for a paraphrase describing the same error, and once for both together. Check analyzer output, candidates from each path, and the fused order. Treat required phrase or access conditions as explicit constraints rather than hoping a ranking score will enforce them.

## From concept to implementation

- [Build BM25 full-text retrieval](https://milvus.io/docs/full-text-search.md).
- [Combine dense and sparse candidates](https://milvus.io/docs/multi-vector-search.md).

## Continue learning

- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [What is full-text search, and how does BM25 fit?](/ai-quick-reference/what-is-fulltext-search)
- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)

## Implementation guides and sources

- [Milvus full-text search and BM25](https://milvus.io/docs/full-text-search.md)
- [Milvus hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Milvus reranking](https://milvus.io/docs/reranking.md)

Sources checked: 2026-10-20. Verify implementation details against the deployed Milvus version.
