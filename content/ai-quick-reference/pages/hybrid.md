---
slug: "what-is-hybrid-search-and-when-should-i-use-it"
title: "What is hybrid search, and when should you use it?"
topic: "retrieval"
order: 16
---

Hybrid search combines multiple retrieval signals into a final candidate ranking. A common text-search design combines dense semantic embeddings with BM25 keyword retrieval. Other designs combine different embedding models or modalities. The benefit depends on whether the paths recover useful candidates that the others miss.

## Start from complementary failures

Dense retrieval can help with paraphrases, while lexical retrieval can help with exact error codes, names, or specialist terms. Build a query set that contains both. Inspect dense-only and keyword-only results before combining them. If both paths miss the needed evidence, fusion is unlikely to fix the underlying corpus or representation problem.

Use compatible eligibility rules across paths. A document excluded by a tenant or version constraint must not reappear through the other retriever. Track a stable record ID so duplicates from different paths can be combined correctly.

## Choose a fusion method

Milvus hybrid search can run searches over multiple vector fields and combine candidates with a ranker. Reciprocal Rank Fusion uses ranking positions, while weighted approaches combine signals according to their configured scoring behavior. Raw scores from different representations should not be added without understanding their scales and normalization.

Candidate limits matter independently of final top-k. A later ranker can only choose among retrieved candidates. Increasing candidate pools may improve coverage while adding retrieval, transfer, and reranking cost.

## Evaluate the complete pipeline

Compare each individual path with the hybrid result on identical queries, corpus, filters, and judgments. Report exact-term and paraphrase performance separately, along with latency and resource use. Add a model reranker only if it improves the final task enough to justify its cost. Follow the implementation guide for the deployed Milvus version and retain the simplest pipeline that meets the acceptance criteria.

## Continue learning

- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How can hybrid and multimodal search improve product discovery?](/ai-quick-reference/hybrid-multimodal-product-search)
- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [How does semantic search differ from keyword search?](/ai-quick-reference/what-is-semantic-search-and-how-does-it-differ-from-keyword-search)
- [What is reranking, and when should you apply it?](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it)

## Implementation guides and sources

- [Multi-vector hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Reciprocal rank fusion](https://milvus.io/docs/rrf-ranker.md)
- [BM25 full-text search](https://milvus.io/docs/full-text-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
