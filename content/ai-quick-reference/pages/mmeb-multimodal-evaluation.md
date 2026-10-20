---
slug: "mmeb-multimodal-evaluation"
title: "How do MMEB versions evaluate multimodal embeddings?"
topic: "models"
order: 120
---

MMEB evaluates multimodal representations. MTEB and MMTEB primarily organize text embedding tasks, while MMEB asks whether a representation supports tasks involving images, video, visual documents, and, in newer settings, additional modalities and agent-oriented retrieval. A multimodal score is not a universal measure of all these tasks.

## Keep benchmark versions separate

These are literal values from a pinned historical score file. Without matching per-task reporting, a zero alone does not establish whether a task was measured poorly, unsupported, or not reported. Compare task coverage and reporting rules before comparing aggregate scores; this table is not a current global ranking.

The official MMEB-V2 release has 78 tasks spanning images, video, and visual documents. MMEB-V3 expands the setting to 190 tasks with additional text, audio, and agent-centric categories. It also includes diagnostic work on modality and instruction effects. Metrics, task composition, supported-modality handling, and dataset revisions must be checked before comparing results.

## A pinned public-file snapshot

The following 45 entries were read on 2026-10-20 from the official public score file, pinned to the Space revision shown in the linked source. We retain its ranks, labels, dates, and score columns without substituting newer paper numbers. This file is a public submission snapshot, not proof that every recently released checkpoint has been evaluated there.

| File rank | Exact entry | Overall | Image | Video | Visual document | Entry date |
|---:|---|---:|---:|---:|---:|---|
| 1 | [Qwen3-VL-Embedding-8B](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B) | 77.82 | 80.12 | 67.15 | 82.36 | 2026-01-06 |
| 2 | [seed1.6-embedding-1215](https://console.volcengine.com/ark/region:ark+cn-beijing/model/detail?Id=doubao-embedding-vision) | 75.08 | 77.99 | 67.74 | 76.23 | 2025-12-18 |
| 3 | WeMM-Embedding-8B | 73.90 | 78.09 | 63.24 | 75.62 | 2025-12-16 |
| 4 | [Qwen3-VL-Embedding-2B](https://huggingface.co/Qwen/Qwen3-VL-Embedding-2B) | 73.25 | 74.96 | 61.87 | 79.22 | 2026-01-06 |
| 5 | [IFM-TTE-7B](https://interestfm-tte.github.io/) | 73.06 | 77.90 | 59.19 | 76.21 | 2025-10-11 |
| 6 | WeMM-Embedding-2B | 71.17 | 76.08 | 58.67 | 73.20 | 2025-12-16 |
| 7 | [RzenEmbed-v2-7B](https://github.com/360CVGroup/RzenEmbed) | 71.12 | 75.92 | 55.73 | 75.45 | 2025-09-20 |
| 8 | [seed-1.6-embedding](https://seed1-6-embedding.github.io) | 70.78 | 77.78 | 55.34 | 71.84 | 2025-06-17 |
| 9 | RzenEmbed-v1-7B | 68.37 | 73.60 | 48.87 | 75.16 | 2025-07-30 |
| 10 | [Embed-RL-4B](https://github.com/ZoengHN/Embed-RL) | 67.94 | 70.81 | 53.19 | 74.69 | 2026-01-23 |
| 11 | [Ops-MM-embedding-v1-7B](https://huggingface.co/OpenSearch-AI/Ops-MM-embedding-v1-7B) | 67.12 | 72.72 | 53.76 | 68.74 | 2025-07-02 |
| 12 | [Embed-RL-2B](https://github.com/ZoengHN/Embed-RL) | 66.54 | 68.86 | 51.69 | 74.19 | 2026-01-23 |
| 13 | [e5-omni-7B](https://huggingface.co/Haon-Chen/e5-omni-7B) | 65.85 | 71.23 | 43.54 | 74.52 | 2026-01-09 |
| 14 | [UME-R1-7B](https://huggingface.co/zhibinlan/UME-R1-7B) | 64.07 | 71.25 | 47.50 | 65.73 | 2025-10-20 |
| 15 | RzenEmbed-v1-2B | 63.86 | 68.53 | 42.62 | 72.78 | 2025-07-16 |
| 16 | [e5-omni-3B](https://huggingface.co/Haon-Chen/e5-omni-3B) | 63.08 | 67.59 | 40.63 | 73.16 | 2026-01-09 |
| 17 | [Ops-MM-embedding-v1-2B](https://huggingface.co/OpenSearch-AI/Ops-MM-embedding-v1-2B) | 63.00 | 69.03 | 47.56 | 65.53 | 2025-07-02 |
| 18 | [interestFM-UIR-CAFe-7B](https://arxiv.org/abs/2503.19900) | 60.17 | 67.56 | 42.40 | 62.42 | 2025-07-06 |
| 19 | [UME-R1-2B](https://huggingface.co/zhibinlan/UME-R1-2B) | 59.69 | 66.56 | 42.23 | 62.48 | 2025-10-20 |
| 20 | [UniME-V2-LLaVA-OneVision-7B](https://github.com/GaryGuTC/UniME-v2) | 59.12 | 71.77 | 39.01 | 55.22 | 2025-10-15 |
| 21 | [VLM2Vec-V2.0-Qwen2VL-2B](https://huggingface.co/VLM2Vec/VLM2Vec-V2.0) | 57.49 | 64.92 | 34.67 | 63.47 | 2025-12-29 |
| 22 | [gme-Qwen2-VL-7B-Instruct](https://huggingface.co/Alibaba-NLP/gme-Qwen2-VL-7B-Instruct) | 57.32 | 55.93 | 38.43 | 73.58 | 2025-12-29 |
| 23 | [gme-Qwen2-VL-2B-Instruct](https://huggingface.co/Alibaba-NLP/gme-Qwen2-VL-2B-Instruct) | 53.65 | 51.87 | 33.59 | 71.35 | 2025-12-29 |
| 24 | [interestFM-UIR-CAFe-0.5B](https://arxiv.org/abs/2503.19900) | 49.33 | 55.43 | 35.87 | 50.26 | 2025-07-06 |
| 25 | [VLM2Vec-V1-Qwen2VL-7B](https://huggingface.co/TIGER-Lab/VLM2Vec-Qwen2VL-7B) | 47.00 | 65.37 | 33.79 | 29.34 | 2025-12-29 |
| 26 | [LamRA-Ret-Qwen2.5VL-7b](https://huggingface.co/code-kunkun/LamRA-Ret-Qwen2.5VL-7b) | 46.82 | 52.54 | 33.83 | 47.99 | 2025-06-28 |
| 27 | [colpali-v1.3](https://huggingface.co/vidore/colpali-v1.3) | 44.20 | 34.89 | 28.23 | 70.14 | 2025-12-29 |
| 28 | [VLM2Vec-V1-Qwen2VL-2B](https://huggingface.co/TIGER-Lab/VLM2Vec-Qwen2VL-2B) | 42.69 | 59.73 | 28.55 | 27.74 | 2025-12-29 |
| 29 | [LamRA-Ret](https://huggingface.co/code-kunkun/LamRA-Ret) | 41.60 | 54.13 | 35.21 | 27.61 | 2025-12-29 |
| 30 | QQMM-embed-v3 | 36.10 | 78.21 | 0.00 | 0.00 | 2025-12-30 |
| 31 | [QQMM-embed-v2](https://github.com/QQ-MM/QQMM-embed) | 34.74 | 75.28 | 0.00 | 0.00 | 2025-09-15 |
| 32 | UniVec-CoT-7B | 34.20 | 74.11 | 0.00 | 0.00 | unknown |
| 33 | OEmbedding-v1-7B | 34.18 | 74.05 | 0.00 | 0.00 | 2025-10-14 |
| 34 | ReCo-7B | 34.09 | 73.87 | 0.00 | 0.00 | 2025-08-15 |
| 35 | UniVec-7B | 34.06 | 73.79 | 0.00 | 0.00 | unknown |
| 36 | [ReMatch-7B](https://arxiv.org/abs/2511.19278) | 34.01 | 73.70 | 0.00 | 0.00 | 2025-11-24 |
| 37 | dp-embedding-v3-lite | 33.87 | 73.38 | 0.00 | 0.00 | 2025-12-15 |
| 38 | TCE-v1 | 33.39 | 72.36 | 0.00 | 0.00 | 2025-10-31 |
| 39 | [ReMatch-3B](https://arxiv.org/abs/2511.19278) | 32.40 | 70.20 | 0.00 | 0.00 | 2025-11-24 |
| 40 | [ReMatch-2B](https://arxiv.org/abs/2511.19278) | 31.94 | 69.21 | 0.00 | 0.00 | 2025-11-24 |
| 41 | [Ops-Colqwen3-4B](https://huggingface.co/OpenSearch-AI/Ops-Colqwen3-4B) | 25.88 | 0.00 | 0.00 | 84.12 | 2026-01-27 |
| 42 | Taichu-UniRetriever-8B | 25.62 | 0.00 | 0.00 | 83.25 | 2026-01-15 |
| 43 | Taichu-UniRetriever-2B | 25.02 | 0.00 | 0.00 | 81.31 | 2026-01-15 |
| 44 | [GVE-7B](https://huggingface.co/Alibaba-NLP/GVE-7B) | 11.67 | 0.00 | 50.57 | 0.00 | unknown |
| 45 | TCR | 0.00 | 0.00 | 0.00 | 0.00 | 2026-01-15 |

## An instructive mismatch: WeMM

The public file contains WeMM entries labeled 8B and 2B with December 2025 entry dates. The newer WeMM release documents 2B, 4B, and 9B checkpoints and different reported results. Their names and numbers must remain separate unless the exact weights and evaluation protocol are matched. A new model-card result does not silently replace an old public-file row.

## Choose tasks before choosing the winner

For visual legal documents, inspect page-level retrieval with tables and layouts. For physical-AI video, inspect clip and event retrieval, temporal boundaries, and metadata restrictions. For an audio task, include models that actually accept audio and retain the benchmark's handling of unsupported modalities. Do not interpret an image score as evidence for spoken-audio retrieval.

Use the benchmark to form a candidate set, then preserve preprocessing, frames, prompts, source IDs, and model revisions in a local evaluation. Measure relevant-source retrieval, encoding cost, index size, and latency. These application measurements answer a different question from a paper's average score.

## Example to test

Choose the tasks matching the intended modality, then save the benchmark revision, checkpoint, preprocessing, and missing-task handling. A newer paper score must not replace a differently named public-file row without matching its evaluation contract.

## From concept to implementation

- [Review embedding representation and integration paths](https://milvus.io/docs/embeddings.md).
- [Distinguish external inference from server orchestration](https://milvus.io/docs/embedding-function-overview.md).

## Continue learning

- [Which multimodal embedding families fit image, video, and audio retrieval?](/ai-quick-reference/multimodal-model-families)
- [What do WeChat WeMM embeddings represent, and how can Milvus use them?](/ai-quick-reference/wemm-embedding-models)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)
- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)

## Implementation guides and sources

- [Official MMEB/VLM2Vec repository](https://github.com/TIGER-AI-Lab/VLM2Vec)
- [Pinned official MMEB public score file](https://huggingface.co/spaces/TIGER-Lab/MMEB-Leaderboard/raw/6051f646dc453f0b31318b949f66bccaaf5e608c/rankings/mmeb_ranking.jsonl)
- [MMEB public leaderboard](https://huggingface.co/spaces/TIGER-Lab/MMEB-Leaderboard)
- [MMEB-V3 dataset](https://huggingface.co/datasets/VLM2Vec/MMEB-V3)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
