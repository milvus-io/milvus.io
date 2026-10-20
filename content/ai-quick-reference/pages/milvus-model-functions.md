---
slug: "milvus-model-functions"
title: "How do client model wrappers, server Functions, and rank fusion differ?"
topic: "production"
order: 129
---

Three different interfaces are often described as model support. A Python-side wrapper generates embeddings or reranks candidates in the application. A Milvus server Function can call a configured external model provider as part of ingestion or search. Rank fusion combines rankings or scores and need not invoke a learned model at all. Select the path explicitly before designing credentials, networking, and failure handling.

## Client-side model inference

The application calls a wrapper or the model's native runtime, inspects the resulting vectors, and inserts them into Milvus. Application-side reranking fetches candidates and calls a model separately. The application owns inference dependencies, batching, and retries, while the database owns the indexed representation and retrieval.

## Server-coordinated provider calls

The embedding Function documentation describes raw-text fields, a configured external provider, and explicitly defined output-vector fields. Model Ranker sends candidate text to a model service during search. Neither arrangement implies that arbitrary model weights are loaded into Milvus. Also distinguish these provider-backed calls from built-in BM25 or MinHash Functions: not every server Function invokes an external learned model. Verify provider configuration, server/client versions, endpoint reachability, and request limits for the deployed system.

The checked Model Ranker guide lists material limits: it evaluates one VARCHAR field at a time and cannot be used with grouping search. Its text interface is not proof of native visual-document reranking. A multimodal application may require application-side inference or a separately supported interface.

## Fusion and model scoring remain distinct

RRF and weighted fusion combine multiple retrieval paths. They do not replace a cross-encoder's content evaluation. Conversely, a model reranker cannot recover candidates omitted by the first stage. Evaluate candidate coverage, model relevance, latency, and operational failures independently, and keep source IDs consistent through each transition.

## Example to test

Trace where credentials and inference execute in a client wrapper and a server Function. Test endpoint failure and retries. RRF combines rankings without learned-model inference, so its latency and failure model should not be reported as a hosted reranker.

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

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
