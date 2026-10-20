---
slug: "sentence-transformers-with-milvus"
title: "How do Sentence Transformers models feed a Milvus retrieval pipeline?"
topic: "frameworks"
order: 109
---

Sentence Transformers is a library for running and training retrieval models. Its current interfaces include dense embedding models, cross-encoders, sparse encoders, and multi-vector models. The dedicated MultiVectorEncoder family was introduced in version 6.0; its availability must not be assumed for older environments or for a text-only Milvus Model wrapper. Milvus stores compatible representations and retrieves candidates; the library supplies model inference, not database persistence or application orchestration.

## Keep the encoding contract explicit

Load a pinned model revision and use its documented query and document instructions, pooling, and normalization. Inspect the returned array shape before defining a Milvus field. Equal vector dimensions do not mean two models share an embedding space. If you change models, plan a separate collection or vector field and a controlled re-embedding process.

For a multilingual document assistant, encode a small set of documents, insert their IDs and metadata, and encode several known questions. Confirm that expected documents appear before building a large index. The model card may require particular library versions or optional code; reproduce that environment instead of assuming one generic loading example works for every model.

## Add a second stage when useful

A cross-encoder scores the query together with each candidate document. Retrieve a bounded candidate set from Milvus and apply the reranker outside that first-stage index. Multi-vector representations need an appropriate late-interaction design; they are not interchangeable with one dense vector per document.

## Evaluate the whole path

Record embedding throughput, memory, retrieval recall, reranking latency, and final relevance. Use the same candidate pool when comparing rerankers. A model's benchmark position helps form a shortlist, but performance on your corpus, hardware, and target language still needs its own measurement.

## Example to test

Encode the same fixture through the model's documented query and document paths, then inspect shape and normalization. Keep checkpoint and preprocessing recorded. A generic encode call may hide task-specific prompts required by the selected model.

## From concept to implementation

- [Use the topic-specific integration guide](https://sbert.net/).
- [Keep a direct-client verification baseline](https://milvus.io/docs/quickstart.md).

## Continue learning

- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
- [How should you serve and version embedding and reranking models for Milvus?](/ai-quick-reference/model-inference-serving)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How do cosine similarity, inner product, and L2 differ?](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings)

## Implementation guides and sources

- [Sentence Transformers documentation](https://sbert.net/)
- [Retrieve and rerank workflow](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)

