---
slug: "mteb-embedding-leaderboards"
title: "How do you read MTEB and compare the current embedding shortlist?"
topic: "models"
order: 117
---

MTEB is a suite of embedding evaluations, not an embedding model. It measures tasks including retrieval, classification, clustering, and similarity. The task mix and languages matter: a broad average is not a direct estimate of performance on your legal, medical, code, or multimodal corpus.

## A dated and reproducible top-20 view

This snapshot was checked on 2026-10-20 using the official backend for MTEB(Multilingual, v2). It contains 471 result rows. We retained 88 rows with scores for all 131 tasks, sorted them by Mean Task descending, and selected the first twenty. No open-weights filter was applied. Values below are scores multiplied by 100.

**The local order below is not the backend's rank field, the UI's default ranking, or a commercial recommendation.** Different aggregation methods can produce different orders. Retrieval is shown separately to avoid treating every component of the overall score as search quality. The snapshot does not rank cross-encoder rerankers, and text-task scores do not establish multimodal performance.

| Local order | Model | Mean Task | Retrieval | Dimensions | Purpose and decision boundary |
|---|---|---:|---:|---:|---|
| 1 | [microsoft/harrier-oss-v1-27b](https://huggingface.co/microsoft/harrier-oss-v1-27b) | 74.27 | 78.27 | 5,376 | A large multilingual text encoder for a quality-oriented candidate evaluation; 27B parameters and 5,376 dimensions carry substantial serving and storage costs. |
| 2 | [tencent/KaLM-Embedding-Gemma3-12B-2511](https://huggingface.co/tencent/KaLM-Embedding-Gemma3-12B-2511) | 72.32 | 75.66 | 3,840 | A Gemma 3-derived multilingual encoder for retrieval and related tasks; review its custom model terms rather than treating accessible weights as unrestricted. |
| 3 | [Qwen/Qwen3-Embedding-8B](https://huggingface.co/Qwen/Qwen3-Embedding-8B) | 70.58 | 70.88 | 4,096 | A large multilingual text model with query instructions, suitable for evaluating retrieval and code-search tasks; its release-time ranking is historical. |
| 4 | [Bytedance/Seed1.6-embedding-1215](https://leaderboard.mteb.org/models/Bytedance/Seed1.6-embedding-1215) | 70.26 | 66.05 | 2,048 | A provider-hosted model registered under this exact benchmark revision; do not silently equate it with a differently named public API endpoint. |
| 5 | [nvidia/llama-embed-nemotron-8b](https://huggingface.co/nvidia/llama-embed-nemotron-8b) | 69.46 | 68.69 | 4,096 | A multilingual text-retrieval research model whose current model card restricts it to non-commercial/research use; not a default production recommendation. |
| 6 | [Qwen/Qwen3-Embedding-4B](https://huggingface.co/Qwen/Qwen3-Embedding-4B) | 69.45 | 69.60 | 2,560 | The intermediate Qwen3 text size, useful for a matched quality, throughput, and encoding-cost comparison against 8B and 0.6B. |
| 7 | [microsoft/harrier-oss-v1-0.6b](https://huggingface.co/microsoft/harrier-oss-v1-0.6b) | 69.01 | 70.75 | 1,024 | A smaller multilingual text encoder to test under a constrained inference budget, preserving its query-prompt and normalization contract. |
| 8 | [codefuse-ai/F2LLM-v2-14B](https://huggingface.co/codefuse-ai/F2LLM-v2-14B) | 68.74 | 66.50 | 5,120 | A general multilingual embedding model, not a code-generation model; evaluate multilingual retrieval and clustering with an explicit 14B inference budget. |
| 9 | [google/gemini-embedding-001](https://leaderboard.mteb.org/models/google/gemini-embedding-001) | 68.37 | 67.71 | 3,072 | A benchmarked hosted text encoder; its embedding space is incompatible with Gemini Embedding 2, so migration requires re-embedding. |
| 10 | [codefuse-ai/F2LLM-v2-8B](https://huggingface.co/codefuse-ai/F2LLM-v2-8B) | 68.09 | 66.15 | 4,096 | The 8B general multilingual F2LLM variant, to compare against smaller variants using your real languages and resource constraints. |
| 11 | [Octen/Octen-Embedding-8B](https://huggingface.co/Octen/Octen-Embedding-8B) | 67.84 | 71.61 | 4,096 | A Qwen3-derived text encoder whose card discusses professional-domain retrieval; domain suitability still needs a held-out corpus-specific evaluation. |
| 12 | [codefuse-ai/F2LLM-v2-4B](https://huggingface.co/codefuse-ai/F2LLM-v2-4B) | 67.06 | 64.84 | 2,560 | A midsize F2LLM option for testing whether a smaller model satisfies the same quality target under a matched corpus and configuration. |
| 13 | [jinaai/jina-embeddings-v5-omni-small](https://huggingface.co/jinaai/jina-embeddings-v5-omni-small) | 67.00 | 64.88 | 1,024 | An encoder for a shared text, image, audio, and video space; this table measures text tasks only, and the weights carry a CC-BY-NC license. |
| 14 | [microsoft/harrier-oss-v1-270m](https://huggingface.co/microsoft/harrier-oss-v1-270m) | 66.55 | 66.38 | 640 | A lightweight multilingual text encoder with 640-dimensional output, worth evaluating for smaller inference and vector-storage budgets without assuming CPU latency. |
| 15 | [ai-sage/Giga-Embeddings-instruct-10B-A1.8B-0826](https://huggingface.co/ai-sage/Giga-Embeddings-instruct-10B-A1.8B-0826) | 65.64 | 64.08 | 1,536 | An instruction-based text encoder with Russian/English-oriented use cases; active parameters and total parameters have different deployment implications. |
| 16 | [jinaai/jina-embeddings-v5-omni-nano](https://huggingface.co/jinaai/jina-embeddings-v5-omni-nano) | 65.52 | 63.26 | 768 | A lighter omni-modal option; compare cross-modal tasks separately, and do not infer visual leadership from a text score. Weights are CC-BY-NC. |
| 17 | [jinaai/jina-embeddings-v5-text-nano](https://huggingface.co/jinaai/jina-embeddings-v5-text-nano) | 65.52 | 63.26 | 768 | A lightweight text-specific variant, distinct from omni-nano; test its documented languages and resource profile. Weights are CC-BY-NC. |
| 18 | [codefuse-ai/F2LLM-v2-1.7B](https://huggingface.co/codefuse-ai/F2LLM-v2-1.7B) | 65.21 | 61.97 | 2,048 | A smaller multilingual F2LLM variant for measuring the quality and cost consequences of downsizing under the same query set. |
| 19 | [Qwen/Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) | 64.34 | 64.65 | 1,024 | The lightweight Qwen3 text encoder, useful in a first-round prototype or constrained inference evaluation with correct instructions and normalization. |
| 20 | [ai-sage/Giga-Embeddings-instruct-3B-0826](https://huggingface.co/ai-sage/Giga-Embeddings-instruct-3B-0826) | 63.89 | 60.82 | 2,048 | A bidirectional text encoder for Russian/English retrieval, classification, and clustering evaluation; preserve its mean-pooling contract. |

## What the numbers leave out

Complete task coverage is not the same as zero-shot testing: some training data can overlap benchmark tasks. Inspect the recorded zero-shot information and model reports. Missing aggregate scores remain missing; we do not fill them with zero. Hardware, encoding throughput, API pricing, regional availability, and production latency are not measured by this table.

Several listed models are related variants. Their presence is useful for a model-size comparison but does not provide twenty independent architectural approaches. Some weights have non-commercial or custom terms. Check the exact model card and deployment route before selecting a production candidate.

## Turn the benchmark into an application decision

Choose a small set covering your languages, inference budget, and deployment constraints. Pin model revisions, query instructions, dimension, pooling, and normalization. Encode the same source documents for each model into separate collections. Evaluate exact-search retrieval first, then introduce ANN indexes at a matched recall target.

Keep a held-out query set with relevance judgments and report Recall@k, NDCG, latency, storage, and encoding cost. New models absent from this complete-coverage subset remain candidates; absence does not imply worse quality. Use the model catalog for newer hosted and multimodal options, and the reranker guide for a separate second-stage evaluation.

## Continue learning

- [How do MMEB versions evaluate multimodal embeddings?](/ai-quick-reference/mmeb-multimodal-evaluation)
- [How do the KaLM text embedding variants differ?](/ai-quick-reference/kalm-embedding-models)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do Sentence Transformers models feed a Milvus retrieval pipeline?](/ai-quick-reference/sentence-transformers-with-milvus)

## Implementation guides and sources

- [Official MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
- [Official backend: Multilingual v2 score snapshot](https://mteb-leaderboard-backend.hf.space/v1/benchmarks/MTEB%28Multilingual%2C%20v2%29/scores)
- [MTEB evaluation documentation](https://embeddings-benchmark.github.io/mteb/)
- [Official model card: microsoft/harrier-oss-v1-27b](https://huggingface.co/microsoft/harrier-oss-v1-27b)
- [Official model card: tencent/KaLM-Embedding-Gemma3-12B-2511](https://huggingface.co/tencent/KaLM-Embedding-Gemma3-12B-2511)
- [Official model card: Qwen/Qwen3-Embedding-8B](https://huggingface.co/Qwen/Qwen3-Embedding-8B)
- [MTEB model record: Bytedance/Seed1.6-embedding-1215](https://leaderboard.mteb.org/models/Bytedance/Seed1.6-embedding-1215)
- [Official model card: nvidia/llama-embed-nemotron-8b](https://huggingface.co/nvidia/llama-embed-nemotron-8b)
- [Official model card: Qwen/Qwen3-Embedding-4B](https://huggingface.co/Qwen/Qwen3-Embedding-4B)
- [Official model card: microsoft/harrier-oss-v1-0.6b](https://huggingface.co/microsoft/harrier-oss-v1-0.6b)
- [Official model card: codefuse-ai/F2LLM-v2-14B](https://huggingface.co/codefuse-ai/F2LLM-v2-14B)
- [MTEB model record: google/gemini-embedding-001](https://leaderboard.mteb.org/models/google/gemini-embedding-001)
- [Official model card: codefuse-ai/F2LLM-v2-8B](https://huggingface.co/codefuse-ai/F2LLM-v2-8B)
- [Official model card: Octen/Octen-Embedding-8B](https://huggingface.co/Octen/Octen-Embedding-8B)
- [Official model card: codefuse-ai/F2LLM-v2-4B](https://huggingface.co/codefuse-ai/F2LLM-v2-4B)
- [Official model card: jinaai/jina-embeddings-v5-omni-small](https://huggingface.co/jinaai/jina-embeddings-v5-omni-small)
- [Official model card: microsoft/harrier-oss-v1-270m](https://huggingface.co/microsoft/harrier-oss-v1-270m)
- [Official model card: ai-sage/Giga-Embeddings-instruct-10B-A1.8B-0826](https://huggingface.co/ai-sage/Giga-Embeddings-instruct-10B-A1.8B-0826)
- [Official model card: jinaai/jina-embeddings-v5-omni-nano](https://huggingface.co/jinaai/jina-embeddings-v5-omni-nano)
- [Official model card: jinaai/jina-embeddings-v5-text-nano](https://huggingface.co/jinaai/jina-embeddings-v5-text-nano)
- [Official model card: codefuse-ai/F2LLM-v2-1.7B](https://huggingface.co/codefuse-ai/F2LLM-v2-1.7B)
- [Official model card: Qwen/Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)
- [Official model card: ai-sage/Giga-Embeddings-instruct-3B-0826](https://huggingface.co/ai-sage/Giga-Embeddings-instruct-3B-0826)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
