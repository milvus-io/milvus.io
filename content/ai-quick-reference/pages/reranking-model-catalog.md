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

## Additional reranking families and baselines

| Model | Representation | Purpose | Milvus Model route, not an end-to-end certification |
|---|---|---|---|
| [KaLM-Embedding/KaLM-Reranker-V1-Small-R2](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Small-R2) | Compressed-document reranking | Encoder-decoder relevance scoring with configurable passage compression; use its own implementation and cache/version contract. | Official implementation; no dedicated export |
| [tencent/R3-rerank-0.6b](https://huggingface.co/tencent/R3-rerank-0.6b) | Skill retrieval | Scores query/skill pairs for conditional agent-skill retrieval, not a general document benchmark winner. | Official implementation; no dedicated export |
| [mixedbread-ai/mxbai-rerank-large-v2](https://huggingface.co/mixedbread-ai/mxbai-rerank-large-v2) | Text reranking candidate | A released text relevance model; pin the official loader and evaluate against the same candidates. | Native or verified generic adapter |
| [Alibaba-NLP/gte-multilingual-reranker-base](https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base) | Multilingual text | An encoder-based multilingual relevance model; validate language slices and long-passage truncation. | Native or verified generic adapter |
| [ContextualAI/ctxl-rerank-v2-instruct-multilingual-2b](https://huggingface.co/ContextualAI/ctxl-rerank-v2-instruct-multilingual-2b) | Instruction-conditioned text | A model that accepts ranking instructions; test whether constraints are followed rather than trusting a generic relevance score. | Official API/runtime; verify instruction forwarding |
| [zeroentropy/zerank-2](https://huggingface.co/zeroentropy/zerank-2) | Instruction-following text | An instruction-following reranking candidate; evaluate thresholds and serialization on the target corpus. | Official API/runtime; no dedicated export |
| [maidalun1020/bce-reranker-base_v1](https://huggingface.co/maidalun1020/bce-reranker-base_v1) | Chinese/English baseline | An established bilingual reranker retained as a baseline, not labeled a new release. | Native or verified generic adapter |
| [cross-encoder/ms-marco-MiniLM-L6-v2](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L6-v2) | Compact English baseline | A small passage-ranking baseline for plumbing and cost comparisons; its training domain limits what can be inferred. | CrossEncoderRerankFunction; verify environment |

These entries extend the earlier shortlist; they do not create a shared ranking across different candidate pools or protocols. Jev also has an explicit Milvus Model wrapper; its evidence-oriented template is described in the support matrix.

## Continue learning

- [How does KaLM compressed-document reranking work?](/ai-quick-reference/kalm-reranker-models)
- [How do Tencent R3 embedding and reranking models retrieve agent skills?](/ai-quick-reference/tencent-r3-models)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
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
- [Official model card: KaLM-Embedding/KaLM-Reranker-V1-Small-R2](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Small-R2)
- [Official model card: tencent/R3-rerank-0.6b](https://huggingface.co/tencent/R3-rerank-0.6b)
- [Official model card: mixedbread-ai/mxbai-rerank-large-v2](https://huggingface.co/mixedbread-ai/mxbai-rerank-large-v2)
- [Official model card: Alibaba-NLP/gte-multilingual-reranker-base](https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base)
- [Official model card: ContextualAI/ctxl-rerank-v2-instruct-multilingual-2b](https://huggingface.co/ContextualAI/ctxl-rerank-v2-instruct-multilingual-2b)
- [Official model card: zeroentropy/zerank-2](https://huggingface.co/zeroentropy/zerank-2)
- [Official model card: maidalun1020/bce-reranker-base_v1](https://huggingface.co/maidalun1020/bce-reranker-base_v1)
- [Official model card: cross-encoder/ms-marco-MiniLM-L6-v2](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L6-v2)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
