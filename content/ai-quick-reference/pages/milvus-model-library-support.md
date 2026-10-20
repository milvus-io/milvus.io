---
slug: "milvus-model-library-support"
title: "What does the released Milvus Model library actually support?"
topic: "ecosystem"
order: 128
---

Milvus Model (the `pymilvus.model` package) is a Python library that gives embedding and reranking models one shared interface, so you can turn text into vectors and re-score search results without writing a separate adapter for each provider. You install it with `pip install "pymilvus[model]"`. It runs in your application process, not inside the Milvus server: the model you pick here decides which vectors you insert and which vectors you search with. The latest release, 0.3.4, exports twelve dense embedding functions, two sparse, two hybrid (dense plus sparse), and seven rerankers.

Every embedding function follows the same pattern: `encode_documents()` for the corpus, `encode_queries()` for search input, and a `dim` property that tells you how large to make the vector field. Every reranker is a callable that takes a query, a list of documents, and `top_k`. Swapping OpenAI for a local Sentence Transformers model is therefore a one-line change, as long as you re-embed the collection.

![Three places to generate a representation. A wrapper export is not proof of executed inference or universal compatibility.](/images/ai-reference/model-inference-ownership.svg)

## How do you use a Milvus Model embedding function?

Install the extra and encode a few documents:

```bash
pip install "pymilvus[model]"
```

```python
from pymilvus import model

ef = model.DefaultEmbeddingFunction()   # alias for OnnxEmbeddingFunction

docs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
]
doc_vectors = ef.encode_documents(docs)        # list of numpy arrays
query_vectors = ef.encode_queries(["Who started AI research?"])

print(ef.dim, doc_vectors[0].shape)            # use ef.dim for the FLOAT_VECTOR field
```

Read `ef.dim` before you create the collection and set the vector field's `dim` to that value. The output vectors are ready for `MilvusClient.insert()` and `MilvusClient.search()`. Some wrappers treat queries and documents differently (Cohere, Voyage, and Jina pass a task or input type to the provider; BM25 and SPLADE weight them differently), so always use `encode_queries` at search time instead of reusing the document method.

Sparse functions return SciPy `csr_array` rows that go into a `SPARSE_FLOAT_VECTOR` field. Client-side BM25 needs corpus statistics before it can encode anything:

```python
from pymilvus.model.sparse import BM25EmbeddingFunction
from pymilvus.model.sparse.bm25 import build_default_analyzer

bm25 = BM25EmbeddingFunction(build_default_analyzer(language="en"))
bm25.fit(docs)                 # compute IDF over your corpus
bm25.save("bm25_params.json")  # reload the same statistics at query time
sparse_docs = bm25.encode_documents(docs)
```

Hybrid functions such as `BGEM3EmbeddingFunction` return a dictionary with `"dense"` and `"sparse"` keys (and optional ColBERT vectors), and their `dim` is a dictionary too. Each output needs its own field in the schema, which pairs naturally with [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it).

## Which embedding function should you use?

Start from where you want inference to run and what kind of retrieval you need:

| If you want… | Use | Notes |
|---|---|---|
| A hosted API you already pay for | `OpenAIEmbeddingFunction`, `CohereEmbeddingFunction`, `VoyageEmbeddingFunction`, `JinaEmbeddingFunction`, `MistralAIEmbeddingFunction`, `GeminiEmbeddingFunction`, `NomicEmbeddingFunction` | Fastest path; pass an explicit `model_name` and API key |
| Local inference with an open model | `SentenceTransformerEmbeddingFunction` | Covers most Hugging Face sentence-embedding checkpoints |
| A small CPU-friendly baseline | `Model2VecEmbeddingFunction` or `DefaultEmbeddingFunction` | Good for tests and prototypes, weaker on quality |
| Your own inference server | `TEIEmbeddingFunction` | Points at a Hugging Face Text Embeddings Inference endpoint |
| Keyword-style sparse retrieval | `BM25EmbeddingFunction`, `SpladeEmbeddingFunction` | BM25 needs `fit()`; SPLADE is a learned sparse model |
| Dense and sparse from one model | `BGEM3EmbeddingFunction`, `MGTEEmbeddingFunction` | One encode call, two vector fields |
| Better ordering of a shortlist | `CohereRerankFunction`, `VoyageRerankFunction`, `JinaRerankFunction` (hosted) or `BGERerankFunction`, `CrossEncoderRerankFunction` (local) | Run after the initial vector search |

Model quality matters more than the wrapper. Use [MTEB](/ai-quick-reference/mteb-embedding-leaderboards) and an evaluation set from your own data to pick the model, then pick the wrapper that runs it.

## The full catalog in 0.3.4

The defaults below are what the wrapper uses if you pass no `model_name`. Several are older model generations, so pin the model you actually evaluated.

| Category | Export | Default model | What it does |
|---|---|---|---|
| dense | [`OpenAIEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/openai.py) | `text-embedding-ada-002` | Hosted OpenAI text embeddings |
| dense | [`SentenceTransformerEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/sentence_transformer.py) | `all-MiniLM-L6-v2` | Local Sentence Transformers models |
| dense | [`VoyageEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/voyageai.py) | `voyage-3-large` | Hosted Voyage embeddings; its dimension table predates Voyage 4 |
| dense | [`JinaEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/jinaai.py) | `jina-embeddings-v3` | Jina text API with task and dimension options |
| dense | [`TEIEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/tei.py) | set by the endpoint | Calls a Text Embeddings Inference server |
| dense | [`OnnxEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/onnx.py) | `GPTCache/paraphrase-albert-onnx` | Bundled ONNX model; also exported as `DefaultEmbeddingFunction`. Not a general ONNX loader |
| dense | [`CohereEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/cohere.py) | `embed-english-light-v3.0` | Hosted Cohere embeddings with query/document input types |
| dense | [`MistralAIEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/mistralai.py) | `mistral-embed` | Hosted Mistral text embeddings |
| dense | [`NomicEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/nomic.py) | `nomic-embed-text-v1.5` | Nomic SDK text embeddings |
| dense | [`InstructorEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/instructor.py) | `hkunlp/instructor-xl` | Instruction-conditioned embeddings |
| dense | [`Model2VecEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/model2vec_embed.py) | `minishlab/potion-base-8M` | Static, very fast Model2Vec embeddings |
| dense | [`GeminiEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/dense/gemini.py) | `gemini-embedding-exp-03-07` | Gemini text embeddings; predates Gemini Embedding 2 |
| sparse | [`SpladeEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/sparse/splade.py) | `naver/splade-cocondenser-ensembledistil` | Learned sparse (lexical) vectors |
| sparse | [`BM25EmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/sparse/bm25/bm25.py) | none; fit on your corpus | Client-side BM25 with an analyzer, `k1=1.5`, `b=0.75` |
| hybrid | [`BGEM3EmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/hybrid/bge_m3.py) | `BAAI/bge-m3` | Dense, sparse, and optional ColBERT output |
| hybrid | [`MGTEEmbeddingFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/hybrid/mgte.py) | `Alibaba-NLP/gte-multilingual-base` | Multilingual dense and sparse output |
| reranker | [`CohereRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/cohere.py) | `rerank-english-v3.0` | Hosted Cohere reranking |
| reranker | [`BGERerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/bgereranker.py) | `BAAI/bge-reranker-v2-m3` | Local BGE reranker via FlagEmbedding |
| reranker | [`VoyageRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/voyageai.py) | `rerank-2` | Hosted Voyage reranking (older default) |
| reranker | [`CrossEncoderRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/cross_encoder.py) | none; pass `model_name` | Local Sentence Transformers CrossEncoder |
| reranker | [`JinaRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/jinaai.py) | `jina-reranker-v2-base-multilingual` | Hosted Jina reranking |
| reranker | [`JevRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/jev.py) | `jev-latest` | TypeSafe Jev evidence scoring with a scientific-claim template |
| reranker | [`TEIRerankFunction`](https://github.com/milvus-io/milvus-model/blob/v0.3.4/src/pymilvus/model/reranker/tei.py) | set by the endpoint | Reranking through a TEI server |

## What the library does not cover

The wrappers are text-first. They do not produce image, video, or audio embeddings, and they have no dedicated export for newer checkpoints such as WeMM, KaLM, or R3. For those, call the provider's SDK or a [multimodal model](/ai-quick-reference/multimodal-model-families) directly and insert the vectors yourself. A wrapper also does not guarantee that every model name you pass will work: Voyage 4 or Gemini Embedding 2 can be requested explicitly, but verify the returned dimension and normalization before encoding a full corpus.

The package name has history worth knowing. The current distribution is `pymilvus.model` on PyPI, which `pymilvus[model]` installs for you; the older `milvus-model` name has a separate release history, so don't copy an import path from an old notebook without checking it.

## Client-side model library or server-side Function?

Milvus can also generate embeddings itself. Since Milvus 2.6, you can declare a `TEXTEMBEDDING` Function in the collection schema (providers include OpenAI, Azure OpenAI, Cohere, Voyage AI, Gemini, AWS Bedrock, Vertex AI, and TEI), and a `BM25` Function computes full-text sparse vectors on the server. Then you insert raw text and search with raw text.

Use `pymilvus.model` when you want to run open models locally, control batching and GPUs yourself, or reuse the same vectors outside Milvus. Use server-side Functions when you want the database to own the text-to-vector step so every client stays consistent. Note that client-side `BM25EmbeddingFunction` and the server `BM25` Function keep different corpus statistics, so pick one per collection. The trade-offs are covered in [client model wrappers vs. server Functions](/ai-quick-reference/milvus-model-functions).

## Related reading

- [How do client model wrappers, server Functions, and rank fusion differ?](/ai-quick-reference/milvus-model-functions)
- [Which dense, sparse, and compact embedding families should you compare?](/ai-quick-reference/dense-sparse-model-families)
- [How should you serve and version embedding and reranking models for Milvus?](/ai-quick-reference/model-inference-serving)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How should you build a reproducible application workflow with PyMilvus?](/ai-quick-reference/how-to-build-applications-with-pymilvus-milvusclient)

To put an embedding function to work, follow the [Milvus Quickstart](https://milvus.io/docs/quickstart.md) and swap in the function you chose, or see the [embedding overview](https://milvus.io/docs/embeddings.md) for more examples.

## Sources

- [Released pymilvus.model 0.3.4 on PyPI](https://pypi.org/project/pymilvus.model/0.3.4/)
- [Version-pinned model source](https://github.com/milvus-io/milvus-model/tree/v0.3.4/src/pymilvus/model)
- [Release notes for 0.3.4](https://github.com/milvus-io/milvus-model/releases/tag/v0.3.4)
- [Milvus embedding overview](https://milvus.io/docs/embeddings.md)
- [Server-side embedding Function overview](https://milvus.io/docs/embedding-function-overview.md)
- [Introducing PyMilvus integration with embedding models](https://milvus.io/blog/introducing-pymilvus-integrations-with-embedding-models.md)
- [PyMilvus installation and compatibility](https://milvus.io/docs/install-pymilvus.md)
