---
slug: "milvus-model-functions"
title: "What are your options for generating embeddings alongside Milvus?"
topic: "production"
order: 129
---

You have three practical ways to produce embeddings for Milvus. You can generate them in your own application (directly with a model SDK or through the `pymilvus[model]` wrappers) and insert vectors. You can let Milvus call an embedding provider for you through a server-side **Text Embedding Function**, so you insert and search with raw text. Or, for keyword relevance, you can use the built-in **BM25 Function**, which turns text into sparse vectors inside Milvus with no model at all. The same split applies to reranking: your own reranker, a server-side **Model Ranker**, or model-free fusion such as **RRF**. The right choice depends on who should own inference, credentials, and failure handling.

![Three places to generate a representation. A wrapper export is not proof of executed inference or universal compatibility.](/images/ai-reference/model-inference-ownership.svg)

## Which option fits your pipeline?

| | Client-side embeddings | Server-side Text Embedding Function | BM25 Function |
|---|---|---|---|
| Where inference runs | Your code, your GPUs or provider account | Milvus calls an external provider | Inside Milvus (tokenize and score, no model) |
| What you insert and search with | Vectors | Raw text in a `VARCHAR` field | Raw text in an analyzed text field |
| Model choice | Anything, including images, audio, fine-tuned or local models | Supported providers only | Not applicable |
| Credentials | Held by your application | Configured in Milvus (`milvus.yaml` or env vars) | None |
| Best for | Full control, multimodal, custom models, heavy batching | Text RAG with less plumbing, consistent query and document encoding | Keyword and exact-term recall, hybrid search |

Many production systems combine two of these: dense embeddings (client- or server-side) plus BM25 sparse vectors, fused at query time with [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it).

## Option 1: Generate embeddings in your application

This is the default and the most flexible path. You call a model (OpenAI, Cohere, a Sentence Transformers model on your own hardware, a [served inference endpoint](/ai-quick-reference/model-inference-serving)) and insert the vectors. You own batching, retries, rate limits, caching, and versioning, and you can inspect every vector before it is indexed.

The PyMilvus model library is a convenience layer for this path. Install it with `pip install "pymilvus[model]"` and you get a common `encode_documents()` / `encode_queries()` interface over dense providers (OpenAI, Sentence Transformers, Voyage, Jina, Cohere, Mistral AI, Nomic, Gemini, and others), sparse models such as SPLADE, and hybrid models such as BGE-M3. Each wrapper exposes `dim`, which you can use when creating the collection. `DefaultEmbeddingFunction()` downloads all-MiniLM-L6-v2 and produces 384-dimensional vectors, which is handy for tests. The wrappers run in your process; they do not change anything about the database. See [what the Milvus Model library supports](/ai-quick-reference/milvus-model-library-support) for version details.

Choose this path when you need images, video, audio, or [visual-document models such as ColPali](/ai-quick-reference/visual-document-models), when you use a fine-tuned or self-hosted model, or when you already run an inference platform.

## Option 2: Let Milvus call the embedding provider

Since Milvus 2.6, a collection schema can declare a Text Embedding Function that maps a `VARCHAR` input field to a vector output field. Milvus calls the configured provider on insert, and also embeds the query text at search time, so documents and queries are guaranteed to go through the same model.

```python
from pymilvus import Function, FunctionType

text_embedding_function = Function(
    name="openai_embedding",
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=["document"],   # VARCHAR
    output_field_names=["dense"],     # FLOAT_VECTOR or INT8_VECTOR
    params={
        "provider": "openai",
        "model_name": "text-embedding-3-small",
    },
)
schema.add_function(text_embedding_function)
```

Supported providers include OpenAI, Azure OpenAI, DashScope, Yandex Cloud, Bedrock, Vertex AI, Voyage AI, Cohere, SiliconFlow, Hugging Face TEI, and Hugging Face. Credentials live on the server, in a `credential:` section of `milvus.yaml` (API keys or access-key pairs) or in provider-specific environment variables, so application code never handles the key.

Know the constraints before you commit. The input must be `VARCHAR` and must always have a value (a null raises an error), outputs are `FLOAT_VECTOR` or `INT8_VECTOR`, and dynamic fields cannot be embedded. The model still runs at the provider, so provider latency, quotas, and outages now show up as Milvus insert and search errors. Test what happens when the endpoint is slow or rate-limited before you rely on it.

## Option 3: BM25 full-text search without a model

The BM25 Function is the model-free member of the family. Declare a text field with `enable_analyzer=True`, a `SPARSE_FLOAT_VECTOR` output field, and a function of type `FunctionType.BM25`, then index the sparse field with `SPARSE_INVERTED_INDEX` and `metric_type="BM25"`. You insert plain text and search with plain text; Milvus tokenizes and scores. It catches exact names, codes, and rare terms that dense embeddings blur, and it pairs naturally with a dense field. [What is full-text search, and how does BM25 fit?](/ai-quick-reference/what-is-fulltext-search) covers analyzers and tuning.

## What about reranking?

The same three-way choice applies after retrieval.

- **Model Ranker (server-side).** A `Function` with `function_type=FunctionType.RERANK` and `params={"reranker": "model", "provider": ..., "queries": [...], "endpoint": ...}` sends candidates to an external reranking service. Supported providers include vLLM, TEI, Cohere, Voyage AI, SiliconFlow, DashScope, and Hugging Face. It reranks on one `VARCHAR` field at a time and cannot be combined with grouping search, so it is a text tool; multimodal reranking stays in your application.
- **RRF and weighted fusion (no model).** RRF scores each document as the sum of `1 / (k + rank)` across search paths, with `k` defaulting to 60. Weighted fusion uses explicit weights per path instead. Both are cheap and deterministic, but they only reorder what the retrievers returned; they do not read the content.
- **Your own reranker.** Fetch candidates, call a cross-encoder or LLM reranker, and reorder. Choose this when you need a model the Model Ranker does not support. The [reranking model catalog](/ai-quick-reference/reranking-model-catalog) compares options.

No reranker can recover a document that first-stage retrieval missed, so measure candidate recall and reranking quality separately.

## How to decide

Start by asking where you want inference failures to surface and who should hold the provider key. If the answer is "my application," embed client-side. If you want the database schema to own the text-to-vector contract and you use a supported text provider, use a Text Embedding Function. Add BM25 whenever exact terms matter. Whichever you pick, record the model name, revision, and dimension with the collection, because changing the model means re-embedding every document.

If you would rather not run the embedding and reranking infrastructure yourself, [Zilliz Cloud](https://zilliz.com/cloud) packages managed model calls alongside managed Milvus. To try the server-side path, start from the [embedding function overview](https://milvus.io/docs/embedding-function-overview.md).

## Sources and further reading

- [Embedding Function overview](https://milvus.io/docs/embedding-function-overview.md)
- [Model Ranker overview](https://milvus.io/docs/model-ranker-overview.md)
- [RRF Ranker](https://milvus.io/docs/rrf-ranker.md)
- [Full text search with BM25](https://milvus.io/docs/full-text-search.md)
- [PyMilvus embedding models](https://milvus.io/docs/embeddings.md)
- [milvus-model source (client-side wrappers)](https://github.com/milvus-io/milvus-model/tree/v0.3.4/src/pymilvus/model)
- [Monitoring overview](https://milvus.io/docs/monitor_overview.md)
- [Milvus community](https://milvus.io/community)
