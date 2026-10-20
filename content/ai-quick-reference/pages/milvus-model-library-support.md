---
slug: "milvus-model-library-support"
title: "What does the released Milvus Model library actually support?"
topic: "ecosystem"
order: 128
---

Milvus Model (the `pymilvus.model` package) is a Python library that wraps embedding and reranking APIs so you can call them with a consistent interface before writing vectors into Milvus. It runs in your application process, not inside the Milvus database — picking a model here means picking which encoder produces the vectors you insert and search with. As of pymilvus.model 0.3.4, the library exports twelve dense embedding functions, two sparse, two hybrid, and seven rerankers. `DefaultEmbeddingFunction` is an alias for `OnnxEmbeddingFunction`.

The question most readers actually have is "which embedding function should I use?" If you already use a provider for other work — OpenAI, Cohere, Voyage, Jina, Mistral, Gemini — the matching wrapper is usually the fastest path, since it just calls that provider's API. If you want to run inference locally, `SentenceTransformerEmbeddingFunction` covers general-purpose text models, `Model2VecEmbeddingFunction` gives a lightweight static-embedding option, and `OnnxEmbeddingFunction` loads a bundled ONNX checkpoint. For keyword-style retrieval or hybrid search, `BM25EmbeddingFunction` and `SpladeEmbeddingFunction` cover sparse representations, and `BGEM3EmbeddingFunction`/`MGTEEmbeddingFunction` produce dense and sparse output together. For reranking a shortlist after an initial vector search, pick based on where you want that compute to run: hosted (Cohere, Voyage, Jina) or local (`CrossEncoderRerankFunction`).

## The full catalog

| Category | Export | Default model (pin your own, don't rely on this) | Purpose and boundary |
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
| sparse | [`BM25EmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/sparse/bm25/bm25.py) | `No model checkpoint; fit or load corpus statistics` | Client-side BM25 with analyzer and corpus statistics; not an inference endpoint and separate from the server BM25 Function. |
| hybrid | [`BGEM3EmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/hybrid/bge_m3.py) | `BAAI/bge-m3` | BGE-M3 dense/sparse and optional ColBERT output, which require separate field/scoring choices. |
| hybrid | [`MGTEEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/hybrid/mgte.py) | `Alibaba-NLP/gte-multilingual-base` | Multilingual GTE dense/sparse outputs; inspect the returned representation dictionary. |
| reranker | [`CohereRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/cohere.py) | `rerank-english-v3.0` | Application-side Cohere query/document reranking. |
| reranker | [`BGERerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/bgereranker.py) | `BAAI/bge-reranker-v2-m3` | FlagEmbedding-based BGE reranking; preserve the wrapper’s length and normalization settings. |
| reranker | [`VoyageRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/voyageai.py) | `rerank-2` | Application-side Voyage reranking; the default is an older model identifier. |
| reranker | [`CrossEncoderRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/cross_encoder.py) | `model_name=""; provide a valid model explicitly` | Local Sentence Transformers CrossEncoder scoring; not a remote endpoint and not a guarantee for every custom architecture or argument. |
| reranker | [`JinaRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/jinaai.py) | `jina-reranker-v2-base-multilingual` | Application-side Jina reranking; new listwise model interfaces need their own check. |
| reranker | [`JevRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/jev.py) | `jev-latest` | TypeSafe Jev evidence scoring; the inspected wrapper uses a scientific-claim evidence template. |
| reranker | [`TEIRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/tei.py) | `not fixed / endpoint` | Application-side reranking through a configured TEI service. |

## Install the right package

The current distribution is `pymilvus.model`; the older `milvus-model` name has a different release history. Install it through PyMilvus's model extra (`pymilvus[model]`), matched to the PyMilvus version your server expects, rather than copying an import path from an old notebook.

## Picking a model is still your call

A wrapper existing here means the interface is supported, not that every model name you can type into it will work. The Voyage and Gemini wrappers in 0.3.4, for instance, predate their providers' newest model generations (Voyage 4, Gemini Embedding 2) — if you want one of those, pass the model name explicitly and verify the output shape rather than trusting the wrapper's bundled defaults. These wrappers are also text-first: they don't give you image, video, audio, or custom multi-vector output, and newer checkpoints like WeMM, KaLM, or R3 don't have a dedicated export here — use the provider's native SDK or a tested adapter for those.

Before encoding a full corpus, instantiate the function you picked, run it against a handful of real inputs, and check the output dimension, normalization, and ID handling match what your collection schema expects.

## From concept to implementation

- [Review Milvus embedding documentation](https://milvus.io/docs/embeddings.md).
- [Check PyMilvus installation and compatibility](https://milvus.io/docs/install-pymilvus.md).

## Continue learning

- [How do client model wrappers, server Functions, and rank fusion differ?](/ai-quick-reference/milvus-model-functions)
- [Which dense, sparse, and compact embedding families should you compare?](/ai-quick-reference/dense-sparse-model-families)
- [How should you serve and version embedding and reranking models for Milvus?](/ai-quick-reference/model-inference-serving)
- [What multimodal model families does Milvus work with?](/ai-quick-reference/multimodal-model-families)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)

## Implementation guides and sources

- [Released pymilvus.model 0.3.4](https://pypi.org/project/pymilvus.model/0.3.4/)
- [Version-pinned model source](https://github.com/milvus-io/milvus-model/tree/v0.3.4/src/pymilvus/model)
- [Release notes](https://github.com/milvus-io/milvus-model/releases/tag/v0.3.4)
- [Milvus embedding documentation](https://milvus.io/docs/embeddings.md)
