---
slug: "what-is-vector-reranking-and-when-should-you-apply-it"
title: "What is reranking, and when should you apply it?"
topic: "retrieval"
order: 17
---

Reranking reorders a candidate set after an initial retrieval step. The first stage aims to find plausible matches efficiently; a later stage can spend more computation on a smaller set. This is useful when a more expensive relevance model improves the order of candidates enough to justify added latency and cost.

## Distinguish fusion from model scoring

Rank fusion combines ranked lists from different retrieval paths. A cross-encoder or other model reranker evaluates query–candidate pairs using a richer scoring model. Both can affect the final order, but they perform different work and have different operating costs.

For example, dense and keyword retrieval may each return candidates. A fusion strategy merges them, then a model reranker evaluates the best combined candidates before the application chooses its final evidence. Not every task needs all these stages.

## Candidate coverage is the limit

A reranker cannot select a relevant document that the first stage did not retrieve. Diagnose candidate recall before tuning the second stage. If the evidence is absent, revisit embeddings, chunking, filters, corpus quality, or search effort. If it is present but ranked poorly, reranking is a more plausible intervention.

The candidate pool is a separate parameter from final top-k. Larger pools can improve coverage but increase model work, network transfer, and tail latency. Long candidate passages may also exceed a model's input limit or increase truncation risk.

## Decide with a controlled experiment

Keep first-stage candidates fixed while comparing rerankers. Measure final relevance, evidence coverage, latency percentiles, and cost per request. Include rare entities, exact identifiers, and hard negatives with similar wording. Verify that source IDs and access restrictions survive the handoff between stages. Use a reranker when the measured user benefit warrants the additional dependency and operational complexity.

## Continue learning

- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do batching, latency, and throughput interact in vector search?](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search)

## Implementation guides and sources

- [Reranking models](https://milvus.io/docs/rerankers-overview.md)
- [Rank fusion in Milvus](https://milvus.io/docs/rrf-ranker.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
