---
slug: "what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy"
title: "How do you choose an embedding model for retrieval?"
topic: "foundations"
order: 4
---

Choose an embedding model by measuring its performance on the retrieval task you need to serve. A public leaderboard is useful for producing a shortlist, but it cannot establish how a model handles your terminology, languages, document formats, access filters, or difficult queries.

## Build a representative comparison

Create a held-out set of real questions with judged relevant passages. Include common queries, rare entities, exact identifiers, paraphrases, and cases where the right response is that no useful evidence exists. Keep the corpus and chunking strategy fixed for the initial comparison so differences are attributable to the model.

Use each model's intended query/document encoding instructions. Compare relevance metrics and inspect failures manually. If one candidate requires different chunking because of its input limit, record that change and evaluate the resulting pipeline separately rather than presenting it as a model-only comparison.

## Account for the operating cost

Measure document-encoding throughput, query-encoding latency, vector dimension, memory requirements, and whether encoding is local or hosted. Long input support does not mean long passages will retrieve well. Licensing, supported languages, data-handling requirements, and revision stability also affect whether a model is usable in your environment.

Consider the complete retrieval pipeline. A compact embedding model plus keyword search and reranking may meet the task better than a larger embedding model alone. Conversely, reranking cannot recover an important document that never enters the candidate set.

## Plan a reversible migration

Keep the existing embeddings while evaluating a new model in a separate field or collection. Record model version and metric with the evaluation results. Compare the same query slices, then switch traffic only after the relevance and latency targets are met. Preserve a rollback path and define how new writes will be indexed during the transition.

## Continue learning

- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)

## Implementation guides and sources

- [Sentence Transformers usage](https://www.sbert.net/docs/sentence_transformer/usage/usage.html)
- [Supported similarity metrics](https://milvus.io/docs/metric.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
