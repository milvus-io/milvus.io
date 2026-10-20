---
slug: "milvus-model-library-support"
title: "What does the released Milvus Model library actually support?"
topic: "ecosystem"
order: 128
---

Milvus Model is a Python-side library that wraps selected embedding and reranking interfaces. It does not mean every listed model executes inside the Milvus database. On 2026-10-20 we inspected the published pymilvus.model 0.3.4 wheel, verified its SHA-256 against PyPI metadata, and parsed its exports: twelve dense, two sparse, two hybrid, and seven reranker classes. DefaultEmbeddingFunction is an additional alias to OnnxEmbeddingFunction.

## Read the versioned support matrix

| Category | Export | 0.3.4 default, not a recommendation | Purpose and boundary |
|---|---|---|---|
| dense | [`OpenAIEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/openai.py) | `text-embedding-ada-002` | Hosted OpenAI text embeddings; choose an explicit verified model rather than relying on the historical default. |
| dense | [`SentenceTransformerEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/sentence_transformer.py) | `all-MiniLM-L6-v2` | General text-model loading and encoding; checkpoint instructions and loader compatibility still matter. |
| dense | [`VoyageEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/voyageai.py) | `voyage-3-large` | Hosted Voyage embeddings; 0.3.4 dimension metadata does not enumerate the Voyage 4 family. |
| dense | [`JinaEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/jinaai.py) | `jina-embeddings-v3` | Jina text API with task/dimension options; do not infer support for omni multimedia payloads. |
| dense | [`TEIEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/tei.py) | `not fixed / endpoint` | Call a configured TEI embedding endpoint; model availability is a property of that service. |
| dense | [`OnnxEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/onnx.py) | `GPTCache/paraphrase-albert-onnx` | Load its expected ONNX model/tokenizer layout; not an arbitrary ONNX graph loader. |
| dense | [`CohereEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/cohere.py) | `embed-english-light-v3.0` | Hosted Cohere embeddings with query/document handling; validate newer API model options. |
| dense | [`MistralAIEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/mistralai.py) | `mistral-embed` | Mistral text embedding API wrapper; check the selected model and provider SDK. |
| dense | [`NomicEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/nomic.py) | `nomic-embed-text-v1.5` | Nomic SDK-based text encoding; locality depends on its configured SDK mode. |
| dense | [`InstructorEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/instructor.py) | `hkunlp/instructor-xl` | Instruction-conditioned text embedding with a dedicated instruction/text interface. |
| dense | [`Model2VecEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/model2vec_embed.py) | `minishlab/potion-base-8M` | Static text embeddings via Model2Vec; useful for a compact inference baseline. |
| dense | [`GeminiEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/gemini.py) | `gemini-embedding-exp-03-07` | Gemini text embedding wrapper; its default and dimension map do not certify Embedding 2 multimodal behavior. |
| sparse | [`SpladeEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/sparse/splade.py) | `naver/splade-cocondenser-ensembledistil` | Learned lexical sparse encoding with model-specific vocabulary and pruning options. |
| sparse | [`BM25EmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/sparse/bm25/bm25.py) | `not fixed / endpoint` | Client-side corpus-fitted BM25 sparse encoding, separate from the server BM25 Function. |
| hybrid | [`BGEM3EmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/hybrid/bge_m3.py) | `BAAI/bge-m3` | BGE-M3 dense/sparse and optional ColBERT output, which require separate field/scoring choices. |
| hybrid | [`MGTEEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/hybrid/mgte.py) | `Alibaba-NLP/gte-multilingual-base` | Multilingual GTE dense/sparse outputs; inspect the returned representation dictionary. |
| reranker | [`CohereRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/cohere.py) | `rerank-english-v3.0` | Application-side Cohere query/document reranking. |
| reranker | [`BGERerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/bgereranker.py) | `BAAI/bge-reranker-v2-m3` | FlagEmbedding-based BGE reranking; preserve the wrapper’s length and normalization settings. |
| reranker | [`VoyageRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/voyageai.py) | `rerank-2` | Application-side Voyage reranking; the default is an older model identifier. |
| reranker | [`CrossEncoderRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/cross_encoder.py) | `not fixed / endpoint` | Generic text CrossEncoder pair scoring, not a guarantee for every custom architecture or argument. |
| reranker | [`JinaRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/jinaai.py) | `jina-reranker-v2-base-multilingual` | Application-side Jina reranking; new listwise model interfaces need their own check. |
| reranker | [`JevRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/jev.py) | `jev-latest` | TypeSafe Jev evidence scoring; the inspected wrapper uses a scientific-claim evidence template. |
| reranker | [`TEIRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/tei.py) | `not fixed / endpoint` | Application-side reranking through a configured TEI service. |

## Install and identify the right package

The current distribution name is pymilvus.model; the older milvus-model name has a different release history. PyMilvus exposes the model extra through a quoted pip requirement such as `pymilvus[model]`, but pin the PyMilvus version appropriate to the server. Inspect the installed distribution and import path instead of assuming an old notebook describes the current package.

## A wrapper is not a compatibility certificate

The inspected Voyage and Gemini code includes older model names and internal dimension metadata. Simply substituting a new provider model name can fail before inference or produce incompatible payload assumptions. Text-oriented wrappers do not prove support for image, video, audio, or custom multi-vector output. New WeMM, KaLM, R3, or visual-document checkpoints have no dedicated export here; use their verified native encoding route or a tested adapter.

The matrix establishes exported source interfaces and defaults, not successful calls to every remote model. This review did not download model weights, execute paid inference, or claim an end-to-end certification. Check query/document output dimensions, normalization, IDs, and the exact adapter/provider versions before inserting a full corpus.

## Example to test

Pin the package, instantiate the intended interface in a bounded integration test, and inspect output shape before bulk encoding. A provider wrapper's existence does not verify every newer model name, metadata lookup, or multimodal payload.

## From concept to implementation

- [Add observability to the workflow](https://milvus.io/docs/monitor_overview.md).
- [Find community support and contribution channels](https://milvus.io/community).

## Continue learning

- [How do client model wrappers, server Functions, and rank fusion differ?](/ai-quick-reference/milvus-model-functions)
- [Which dense, sparse, and compact embedding families should you compare?](/ai-quick-reference/dense-sparse-model-families)
- [How should you serve and version embedding and reranking models for Milvus?](/ai-quick-reference/model-inference-serving)
- [What do WeChat WeMM embeddings represent, and how can Milvus use them?](/ai-quick-reference/wemm-embedding-models)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)

## Implementation guides and sources

- [Released pymilvus.model 0.3.4](https://pypi.org/project/pymilvus.model/0.3.4/)
- [Version-pinned model source](https://github.com/milvus-io/milvus-model/tree/v0.3.4/src/pymilvus/model)
- [Release notes](https://github.com/milvus-io/milvus-model/releases/tag/v0.3.4)
- [Milvus embedding documentation](https://milvus.io/docs/embeddings.md)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
