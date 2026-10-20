---
slug: "milvus-model-functions"
title: "What are your options for generating embeddings alongside Milvus?"
topic: "production"
order: 129
---

If you're evaluating Milvus for a retrieval or RAG application, you have three distinct ways to get embeddings and reranking into the pipeline, and they involve different trade-offs in who runs the model, who manages credentials, and how failures surface. Picking one deliberately — rather than discovering the boundary mid-build — saves a rewrite later.

## Option 1: Generate embeddings yourself, in your application

You call a model wrapper or the model's native runtime from your own code, inspect the resulting vectors, and insert them into Milvus. Reranking can work the same way: fetch candidates from Milvus, then call a reranking model separately in your application. This option gives you the most control — you own the inference dependencies, batching, and retries — while Milvus owns the indexed representation and retrieval. It is the right default if you already run model inference elsewhere, or want to swap providers without touching the database layer.

## Option 2: Let Milvus call a model provider for you

Milvus supports server-side embedding Functions and a Model Ranker that can call a configured external model provider as part of ingestion or search, so your application can send raw text and let Milvus handle the embedding or reranking call. This reduces the amount of inference plumbing your application needs to own, but it is not the same as running arbitrary model weights inside Milvus: you still configure a specific provider, and built-in Functions like BM25 or MinHash don't invoke an external model at all. Check provider configuration, server/client version compatibility, endpoint reachability, and request limits for your deployment before relying on this path.

One concrete limit worth knowing: the Model Ranker evaluates one VARCHAR field at a time and can't be used with grouping search. Its text interface doesn't extend to visual-document reranking — a multimodal application will likely need Option 1 or a separately supported interface instead.

## Option 3: Combine results without a model at all

Rank fusion (RRF or weighted fusion) combines rankings or scores from multiple retrieval paths — for example dense and sparse search — and doesn't require invoking a learned model. This is useful when you want to blend retrieval signals cheaply, but it's not a substitute for a cross-encoder's content evaluation, and a model reranker in turn can't recover candidates that fusion or first-stage search already excluded. Treat candidate coverage, model relevance, and fusion as three things to evaluate independently, with source IDs kept consistent across each step.

## Example to test

Trace where credentials and inference actually execute for each option you're considering, and test endpoint failure and retry behavior before committing. RRF combines rankings without learned-model inference, so don't report its latency and failure profile as if it were a hosted reranker.

If you want a managed service to run embedding and reranking calls for you without self-hosting that infrastructure, [Zilliz Cloud](https://zilliz.com/cloud) packages this alongside the database.

## From concept to implementation

- [Add observability to the workflow](https://milvus.io/docs/monitor_overview.md).
- [Find community support and contribution channels](https://milvus.io/community).

## Continue learning

- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
- [How should you serve and version embedding and reranking models for Milvus?](/ai-quick-reference/model-inference-serving)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)

## Implementation guides and sources

- [Server embedding Functions](https://milvus.io/docs/embedding-function-overview.md)
- [Model Ranker capabilities and limits](https://milvus.io/docs/model-ranker-overview.md)
- [RRF rank fusion](https://milvus.io/docs/rrf-ranker.md)
- [Client-side model wrappers](https://github.com/milvus-io/milvus-model/tree/v0.3.4/src/pymilvus/model)
