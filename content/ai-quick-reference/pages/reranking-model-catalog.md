---
slug: "reranking-model-catalog"
title: "Which reranking models fit a Milvus retrieval pipeline?"
topic: "models"
order: 119
---

A reranker receives a query and a bounded list of candidates, then changes their order using a richer relevance model. Milvus supplies those candidates through dense, sparse, hybrid, or other supported search. Reranking cannot recover a relevant document excluded by the first-stage filter or candidate selection.

## Current families and useful baselines

Official model documentation was checked on 2026-10-20. This is not a shared leaderboard: pairwise cross-encoders, listwise models, and visual rerankers do not have one directly comparable MTEB score. Families with pro/fast or large/lite variants are grouped to avoid duplicate pages with the same reader task.

| Model / family | Type | Purpose and integration boundary |
|---|---|---|
| [rerank-3 / rerank-3-lite](https://docs.voyageai.com/docs/reranker) | Hosted text | Voyage’s current text rerankers; compare the quality-oriented and latency-oriented variants with identical candidates. Their query/document token limits still apply even when top-k output is small. |
| [rerank-v4.0-pro / rerank-v4.0-fast](https://docs.cohere.com/docs/rerank-overview) | Hosted multilingual text | Cohere’s current multilingual text and structured-document ranking family. Serialize fields consistently and compare pro/fast under the same latency target; a relevance score is not a calibrated probability of factual correctness. |
| [jinaai/jina-reranker-v3.5](https://huggingface.co/jinaai/jina-reranker-v3.5) | Listwise text | A 0.6B listwise model scoring a query and candidate set with shared context. Candidate count, ordering, and context allocation require evaluation. Its public weights are CC-BY-NC; verify a suitable production route separately. |
| [Qwen/Qwen3-Reranker-8B](https://huggingface.co/Qwen/Qwen3-Reranker-8B) | Open-weight text | A large text relevance model that jointly evaluates query and document. Use the documented instruction and scoring procedure. It returns relevance, not the document embeddings stored in the first-stage collection. |
| [Qwen/Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B) | Smaller open-weight text | The smaller Qwen3 text reranker for a constrained inference budget. Measure whether its quality satisfies the application threshold before selecting a larger model or increasing the candidate pool. |
| [Qwen/Qwen3-VL-Reranker-8B](https://huggingface.co/Qwen/Qwen3-VL-Reranker-8B) | Multimodal relevance | Evaluates query/document pairs containing supported text and visual inputs. Use original pages, images, or frame references rather than assuming a text-only excerpt preserves visual evidence. Test multimodal relevance separately. |
| [nvidia/llama-nemotron-rerank-vl-1b-v2](https://huggingface.co/nvidia/llama-nemotron-rerank-vl-1b-v2) | Visual-document reranking | A vision-language cross-encoder for document candidates. Preprocessing tiles and text/image context settings affect inputs and resource use. Follow the card’s modality-specific setup and current NVIDIA model terms. |
| [BAAI/bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3) | Established multilingual baseline | An established multilingual query/passage scorer. Keep it as an interpretable cost/quality baseline rather than describing it as a new release. Its scores are not interchangeable with another reranker’s thresholds. |

## Define the retrieval-to-reranking interface

Fetch candidates with stable IDs, original text or visual references, and required metadata. Preserve the database rank for comparison. Call the reranker on permitted candidates only, map its output positions back to source IDs, and pass the selected evidence to the application. Do not replace a primary key with a model-returned position in an array.

## Compare on the same candidate pool

Freeze the first-stage results for each test query. Measure NDCG or judged relevance before and after reranking, plus P50/P95 latency, failures, request size, and cost. Separately vary candidate count: improving recall may also increase context, latency, or truncation. Keep no-rerank as a legitimate baseline.

Record the model revision, serialization, truncation policy, and output mapping. A score threshold tuned for one model should be revalidated after changing models or input format. Treat product-embedded reranking and application-side inference as different deployment paths, and verify support before promising a native integration.

## Continue learning

- [What is reranking, and when should you apply it?](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)

## Implementation guides and sources

- [rerank-3 / rerank-3-lite official documentation](https://docs.voyageai.com/docs/reranker)
- [rerank-v4.0-pro / rerank-v4.0-fast official documentation](https://docs.cohere.com/docs/rerank-overview)
- [jinaai/jina-reranker-v3.5 official documentation](https://huggingface.co/jinaai/jina-reranker-v3.5)
- [Qwen/Qwen3-Reranker-8B official documentation](https://huggingface.co/Qwen/Qwen3-Reranker-8B)
- [Qwen/Qwen3-Reranker-0.6B official documentation](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B)
- [Qwen/Qwen3-VL-Reranker-8B official documentation](https://huggingface.co/Qwen/Qwen3-VL-Reranker-8B)
- [nvidia/llama-nemotron-rerank-vl-1b-v2 official documentation](https://huggingface.co/nvidia/llama-nemotron-rerank-vl-1b-v2)
- [BAAI/bge-reranker-v2-m3 official documentation](https://huggingface.co/BAAI/bge-reranker-v2-m3)

Sources checked: 2026-10-20. Model rankings are dated snapshots; use the guide for your deployed version.
