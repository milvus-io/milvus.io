---
slug: "embedding-reranking-model-catalog"
title: "Which current embedding models should you evaluate for Milvus?"
topic: "models"
order: 118
---

An embedding model converts an input into a representation used for candidate retrieval, similarity, clustering, or classification. A reranker instead evaluates already retrieved candidates against a query. Milvus manages the searchable data and indexes; it does not make every model's output or licensing interchangeable.

## Current candidates beyond one benchmark

The following official model documentation was checked on 2026-10-20. This is a use-case shortlist, not an invented unified ranking. The separate MTEB article provides an explicitly filtered top-20 snapshot. New hosted and multimodal models may not have complete results in that subset.

| Model / family | Type | Purpose and integration boundary |
|---|---|---|
| [voyage-4-large / voyage-4 / voyage-4-lite](https://docs.voyageai.com/docs/embeddings) | Hosted text | A hosted multilingual text family with documented compatible spaces across its 4-series variants. Evaluate large versus lite against your quality and latency targets; the documented compatibility is specific to this family, not a property of arbitrary equal-dimensional vectors. |
| [voyage-code-4](https://docs.voyageai.com/docs/embeddings) | Hosted code | A code-oriented embedding option for repository and coding-agent retrieval. Preserve file path, symbol, revision, and language metadata, and include identifier-heavy queries in evaluation rather than testing only natural-language paragraphs. |
| [embed-v5.0-pro / embed-v5.0-fast](https://docs.cohere.com/docs/cohere-embed) | Hosted text and images | Cohere’s current text/image embedding family, including mixed document inputs. Pro and fast expose a quality/latency choice. Treat long-context support as an input capability, not evidence that embedding an entire document is better than selecting sensible units. |
| [gemini-embedding-2](https://ai.google.dev/gemini-api/docs/embeddings) | Hosted multimodal | Maps text, images, audio, video, and documents into a shared space. The documented space is incompatible with gemini-embedding-001. Account for input aggregation semantics and re-embed the corpus when migrating rather than mixing old and new vectors. |
| [nvidia/Nemotron-3-Embed-1B-BF16](https://huggingface.co/nvidia/Nemotron-3-Embed-1B-BF16) | Open-weight text | A newer text encoder producing a 2,048-dimensional representation with documented shorter-output options. It supports a self-operated encoding pipeline; test your hardware, pooling, and normalization instead of inferring throughput from the parameter-count label. |
| [Qwen/Qwen3-VL-Embedding-8B](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B) | Open-weight multimodal | Produces shared representations for text, images, screenshots, and video. A document assistant can retain page images or a video application can retain frame/clip IDs. Evaluate the target modality separately from a text-only benchmark. |
| [nvidia/nemotron-colembed-vl-8b-v2](https://huggingface.co/nvidia/nemotron-colembed-vl-8b-v2) | Multi-vector visual documents | A late-interaction visual-document encoder that returns token-level vectors. It needs an appropriate multi-vector storage/scoring design, with a separate dense first-stage option if needed. The current model card marks the weights CC-BY-NC; do not present it as an ordinary commercial single-vector default. |
| [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) | Established baseline | An established multilingual baseline with dense, sparse, and multi-vector outputs. It remains relevant to observed search demand, but is not a new release or an automatic top-20 member under the snapshot above. Each output mode requires its own retrieval implementation. |

## Build the Milvus data contract

Keep source ID, text or object reference, tenant, model ID, model revision, preprocessing revision, and vector-field definition. For each dense model, inspect output dimension and normalization before choosing the field and metric. Keep different spaces in separate fields or collections unless the provider explicitly guarantees compatibility.

For image, video, and PDF retrieval, also retain page, frame, timestamp, and object location. A visually similar result without its source location is difficult to use in an agent or audit. A multi-vector representation is a distinct retrieval design, not a larger ordinary dense field.

## Evaluate before committing the whole corpus

Choose a small candidate set covering deployment constraints and the actual languages and modalities. Encode identical source units, use held-out questions, and compare relevance, missed evidence, encoding cost, query latency, and storage. Add a fixed candidate-pool reranking comparison afterwards. Pin the selected configuration so future model updates do not silently change the meaning of stored vectors.

## Continue learning

- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [What does LangChain do, and how does it use Milvus?](/ai-quick-reference/langchain-with-milvus)

## Implementation guides and sources

- [voyage-4-large / voyage-4 / voyage-4-lite official documentation](https://docs.voyageai.com/docs/embeddings)
- [voyage-code-4 official documentation](https://docs.voyageai.com/docs/embeddings)
- [embed-v5.0-pro / embed-v5.0-fast official documentation](https://docs.cohere.com/docs/cohere-embed)
- [gemini-embedding-2 official documentation](https://ai.google.dev/gemini-api/docs/embeddings)
- [nvidia/Nemotron-3-Embed-1B-BF16 official documentation](https://huggingface.co/nvidia/Nemotron-3-Embed-1B-BF16)
- [Qwen/Qwen3-VL-Embedding-8B official documentation](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B)
- [nvidia/nemotron-colembed-vl-8b-v2 official documentation](https://huggingface.co/nvidia/nemotron-colembed-vl-8b-v2)
- [BAAI/bge-m3 official documentation](https://huggingface.co/BAAI/bge-m3)

Sources checked: 2026-10-20. Model rankings are dated snapshots; use the guide for your deployed version.
