---
slug: "what-is-hybrid-search-and-when-should-i-use-it"
title: "What is hybrid search, and when should you use it?"
topic: "retrieval"
order: 16
---

Hybrid search combines multiple retrieval signals into a final candidate ranking. A common text-search design combines dense semantic embeddings with BM25 keyword retrieval. Other designs combine different embedding models or modalities. The benefit depends on whether the paths recover useful candidates that the others miss. Read [how semantic and keyword search differ](/ai-quick-reference/what-is-semantic-search-and-how-does-it-differ-from-keyword-search) and [how BM25 ranks text](/ai-quick-reference/what-is-fulltext-search) first; this page explains how to combine their candidate lists.

![Two retrieval signals, one inspected candidate pool](/images/ai-reference/hybrid.svg)

## Start from complementary failures

Dense retrieval can help with paraphrases, while lexical retrieval can help with exact error codes, names, or specialist terms. Build a query set that contains both. Inspect dense-only and keyword-only results before combining them. If both paths miss the needed evidence, fusion is unlikely to fix the underlying corpus or representation problem.

Use compatible eligibility rules across paths. A document excluded by a tenant or version constraint must not reappear through the other retriever. Track a stable record ID so duplicates from different paths can be combined correctly.

## Choose a fusion method

Milvus hybrid search can run searches over multiple vector fields and combine candidates with a ranker. Reciprocal Rank Fusion uses ranking positions, while weighted approaches combine signals according to their configured scoring behavior. Raw scores from different representations should not be added without understanding their scales and normalization.

Candidate limits matter independently of final top-k. A later ranker can only choose among retrieved candidates. Increasing candidate pools may improve coverage while adding retrieval, transfer, and reranking cost.

## Evaluate the complete pipeline

Compare each individual path with the hybrid result on identical queries, corpus, filters, and judgments. Report exact-term and paraphrase performance separately, along with latency and resource use. Add a model reranker only if it improves the final task enough to justify its cost. Follow the implementation guide for the deployed Milvus version and retain the simplest pipeline that meets the acceptance criteria.

## Design queries that distinguish the signals

| Query class | What to inspect |
| --- | --- |
| Exact product or error identifier | Analyzer output and lexical candidate retention |
| Description using different vocabulary | Dense candidate relevance |
| Identifier plus a conceptual requirement | Both candidate lists and fused ordering |
| Unauthorized or obsolete source | Eligibility rules on every retrieval path |

RRF uses rank positions, while a learned reranker scores candidate content with a model. They solve different steps and can be combined when the deployment supports the chosen route. Preserve the original lists during evaluation instead of judging only the final generated answer.

## Example to test

Keep dense and lexical candidate IDs for the same query. If neither list contains the needed evidence, fusion cannot recover it. If one list contains it but the fused output loses it, inspect rank fusion and candidate depth.

## From concept to implementation

- [Build multi-vector hybrid search](https://milvus.io/docs/multi-vector-search.md).
- [Configure Reciprocal Rank Fusion and WeightedRanker](https://milvus.io/docs/rrf-ranker.md).
- [Try the hybrid semantic + full-text search Bootcamp demo](https://milvus.io/bootcamp).

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
