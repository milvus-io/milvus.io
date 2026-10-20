---
slug: "what-is-vector-reranking-and-when-should-you-apply-it"
title: "What is reranking, and when should you apply it?"
topic: "retrieval"
order: 17
---

Reranking reevaluates an initial candidate set against a query. First-stage retrieval searches a large corpus efficiently; the second stage spends more computation on a smaller set. A reranker can be a cross-encoder, a listwise model, or another relevance-scoring method. Its output is usually an order or relevance score rather than an embedding to index.

## Distinguish two meanings of reranking

Rank fusion such as reciprocal rank fusion combines rankings from dense and sparse retrieval. A learned query-document reranker examines candidate content. Both can appear in one pipeline, but they are different computations and should not be described as the same model capability.

For a product-search task, retrieve permitted candidates with dense and keyword signals, fuse them if useful, then apply a learned model to the bounded candidate list. Preserve source IDs through every step. An item excluded by a filter or absent from the candidate pool cannot be recovered by the second stage.

## Choose by measurable benefit

Use the current reranker catalog to compare hosted, self-operated, text, listwise, and visual options. Freeze the candidate pool when comparing models. Judge top-result relevance and NDCG together with latency, request size, cost, and failures. Include queries that need exact identifiers and queries with no relevant evidence.

## Preserve the input contract

Record model revision, field serialization, maximum context, truncation, and how returned positions map to IDs. Scores from different models are not automatically comparable probabilities. If candidate count or serialization changes, revalidate thresholds and quality. Keep a no-rerank baseline: the additional stage is justified by measured application value, not simply by its presence in an architecture diagram.

## Continue learning

- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)

## Implementation guides and sources

- [Retrieve and rerank architecture](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)
- [Milvus reranking concepts](https://milvus.io/docs/reranking.md)

Sources checked: 2026-10-20. Model rankings are dated snapshots; use the guide for your deployed version.
