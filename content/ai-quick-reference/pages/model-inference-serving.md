---
slug: "model-inference-serving"
title: "How should you serve and version embedding and reranking models for Milvus?"
topic: "models"
order: 130
---

Model serving separates representation generation from vector storage. It can isolate model dependencies, share GPUs across applications, and allow ingestion and interactive queries to use distinct capacity plans. A serving protocol does not make all models compatible: TEI, vLLM, provider APIs, and native processors support different architectures and request schemas.

![Version the representation before indexing it](/images/ai-reference/encoding.svg)

## Define the endpoint contract

Record the model revision, tokenizer/processor, query and document instructions, output dimension, normalization, batching, and truncation. For multimodal input, preserve how images, frames, audio, and mixed content are serialized. A text-only embeddings endpoint must not be treated as an arbitrary multimedia endpoint because both return arrays.

For Milvus Model, a TEI embedding wrapper and TEI reranker wrapper are explicit client interfaces. The service still must support the selected model and route. ONNX and Model2Vec wrappers are alternative encoding implementations rather than alternate names for a remote inference server. Choose based on measurable task quality and operational constraints.

## Separate online and offline work

Offline document encoding can batch large workloads and resume from stable source IDs. Query encoding usually needs bounded tail latency and sufficient capacity during ingestion. Track processed documents, failed inputs, persisted vectors, and source revisions separately so a completed job does not hide skipped records.

## Version the index with the model

Create a new field or collection when the representation changes unless compatibility is explicitly guaranteed. Compare held-out queries, filtered results, and costs before cutover, and define what happens to concurrent writes. For rerankers, pin the model and input serialization and revalidate thresholds. This makes a model upgrade a controlled data change, not a silent change in search meaning.

## Example to test

Send the same bounded fixture through local and served inference and compare output dimensions and tolerated numerical differences. Then test timeout and retry behavior. Serving an endpoint successfully does not prove that its pooling or preprocessing matches the checkpoint.

## From concept to implementation

- [Review embedding representation and integration paths](https://milvus.io/docs/embeddings.md).
- [Distinguish external inference from server orchestration](https://milvus.io/docs/embedding-function-overview.md).

## Continue learning

- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
- [How do client model wrappers, server Functions, and rank fusion differ?](/ai-quick-reference/milvus-model-functions)
- [How should you design a scalable embedding-generation pipeline?](/ai-quick-reference/how-to-build-distributed-embedding-pipelines)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Hugging Face TEI](https://github.com/huggingface/text-embeddings-inference)
- [TEI embedding client interface](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/tei.py)
- [TEI reranking client interface](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/tei.py)
- [Model-specific serving instructions](https://github.com/Tencent/WeMM-Embedding)
