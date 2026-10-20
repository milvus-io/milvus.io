---
slug: "embedding-reranking-model-catalog"
title: "Which current embedding models should you evaluate for Milvus?"
topic: "models"
order: 118
---

An embedding model converts an input into a representation used for candidate retrieval, similarity, clustering, or classification. A reranker instead evaluates already retrieved candidates against a query. Milvus manages the searchable data and indexes; it does not make every model's output or licensing interchangeable.

## Current candidates beyond one benchmark

The following official model documentation was checked on 2026-10-20. This is a use-case shortlist, not an invented unified ranking. Hosted providers revise their exact model version identifiers over time, so treat the family and capability description below as the durable part, and check the provider's live model-card page for the current version string before integrating. The separate MTEB article points to the live leaderboard rather than a dated snapshot. New hosted and multimodal models may not have complete results there yet.

| Model family | Type | Purpose and integration boundary |
|---|---|---|
| [Voyage text embeddings](https://docs.voyageai.com/docs/embeddings) (large/standard/lite tiers) | Hosted text | A hosted multilingual text family whose generation typically ships compatible spaces across its size tiers. Evaluate the larger versus lighter tier against your quality and latency targets; check Voyage's own documentation for which current versions share a compatible space — that compatibility is specific to the family, not a property of arbitrary equal-dimensional vectors. |
| [Voyage code embeddings](https://docs.voyageai.com/docs/embeddings) | Hosted code | A code-oriented embedding option for repository and coding-agent retrieval. Preserve file path, symbol, revision, and language metadata, and include identifier-heavy queries in evaluation rather than testing only natural-language paragraphs. |
| [Cohere Embed](https://docs.cohere.com/docs/cohere-embed) (pro/fast tiers) | Hosted text and images | Cohere's text/image embedding family, including mixed document inputs. The pro/fast split exposes a quality/latency choice. Treat long-context support as an input capability, not evidence that embedding an entire document is better than selecting sensible units. |
| [Gemini embeddings](https://ai.google.dev/gemini-api/docs/embeddings) | Hosted multimodal | Maps text, images, audio, video, and documents into a shared space. Different Gemini embedding generations have shipped incompatible spaces with each other. Check the current documentation for which generation you're integrating, account for input aggregation semantics, and re-embed the corpus when migrating rather than mixing vectors from different generations. |
| [nvidia/Nemotron-3-Embed-1B-BF16](https://huggingface.co/nvidia/Nemotron-3-Embed-1B-BF16) | Open-weight text | A newer text encoder producing a 2,048-dimensional representation with documented shorter-output options. It supports a self-operated encoding pipeline; test your hardware, pooling, and normalization instead of inferring throughput from the parameter-count label. |
| [Qwen/Qwen3-VL-Embedding-8B](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B) | Open-weight multimodal | Produces shared representations for text, images, screenshots, and video. A document assistant can retain page images or a video application can retain frame/clip IDs. Evaluate the target modality separately from a text-only benchmark. |
| [nvidia/nemotron-colembed-vl-8b-v2](https://huggingface.co/nvidia/nemotron-colembed-vl-8b-v2) | Multi-vector visual documents | A late-interaction visual-document encoder that returns token-level vectors. It needs an appropriate multi-vector storage/scoring design, with a separate dense first-stage option if needed. The current model card marks the weights CC-BY-NC; do not present it as an ordinary commercial single-vector default. |
| [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) | Established baseline | An established multilingual baseline with dense, sparse, and multi-vector outputs. It remains relevant to observed search demand, but is not a new release or an automatic top-20 member under the snapshot above. Each output mode requires its own retrieval implementation. |
| [KaLM-Embedding family](https://huggingface.co/KaLM-Embedding) | Open-weight text | A text embedding family spanning a compact multilingual-instruct checkpoint and a larger Gemma3-derived variant. It is not one interchangeable checkpoint: preserve each variant's documented pooling, instructions, and dimension, and re-embed when switching between sizes. |

## Build the Milvus data contract

Keep source ID, text or object reference, tenant, model ID, model revision, preprocessing revision, and vector-field definition. For each dense model, inspect output dimension and normalization before choosing the field and metric. Keep different spaces in separate fields or collections unless the provider explicitly guarantees compatibility.

For image, video, and PDF retrieval, also retain page, frame, timestamp, and object location. A visually similar result without its source location is difficult to use in an agent or audit. A multi-vector representation is a distinct retrieval design, not a larger ordinary dense field.

## Evaluate before committing the whole corpus

Choose a small candidate set covering deployment constraints and the actual languages and modalities. Encode identical source units, use held-out questions, and compare relevance, missed evidence, encoding cost, query latency, and storage. Add a fixed candidate-pool reranking comparison afterwards. Pin the selected configuration so future model updates do not silently change the meaning of stored vectors.

## Example to test

Start with candidates that fit the required language, modality, hosting, and license. Run a bounded pilot before adopting the highest-ranked large model. Include ingestion time and re-embedding cost, not just query latency.

## From concept to implementation

- [Review embedding representation and integration paths](https://milvus.io/docs/embeddings.md).
- [Distinguish external inference from server orchestration](https://milvus.io/docs/embedding-function-overview.md).

## Continue learning

- [How do MMEB versions evaluate multimodal embeddings?](/ai-quick-reference/mmeb-multimodal-evaluation)
- [Which multimodal embedding families fit image, video, and audio retrieval?](/ai-quick-reference/multimodal-model-families)
- [Which dense, sparse, and compact embedding families should you compare?](/ai-quick-reference/dense-sparse-model-families)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [What does LangChain do, and how does it use Milvus?](/ai-quick-reference/langchain-with-milvus)

## Implementation guides and sources

- [Voyage text embeddings official documentation](https://docs.voyageai.com/docs/embeddings)
- [Voyage code embeddings official documentation](https://docs.voyageai.com/docs/embeddings)
- [Cohere Embed official documentation](https://docs.cohere.com/docs/cohere-embed)
- [Gemini embeddings official documentation](https://ai.google.dev/gemini-api/docs/embeddings)
- [nvidia/Nemotron-3-Embed-1B-BF16 official documentation](https://huggingface.co/nvidia/Nemotron-3-Embed-1B-BF16)
- [Qwen/Qwen3-VL-Embedding-8B official documentation](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B)
- [nvidia/nemotron-colembed-vl-8b-v2 official documentation](https://huggingface.co/nvidia/nemotron-colembed-vl-8b-v2)
- [BAAI/bge-m3 official documentation](https://huggingface.co/BAAI/bge-m3)
- [KaLM-Embedding model cards](https://huggingface.co/KaLM-Embedding)
