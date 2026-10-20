---
slug: "mmeb-multimodal-evaluation"
title: "How do MMEB versions evaluate multimodal embeddings?"
topic: "models"
order: 120
---

MMEB evaluates multimodal representations. MTEB and MMTEB primarily organize text embedding tasks, while MMEB asks whether a representation supports tasks involving images, video, visual documents, and, in newer settings, additional modalities and agent-oriented retrieval. A multimodal score is not a universal measure of all these tasks at once.

## What MMEB versions actually cover

MMEB has grown substantially across revisions, and the version number matters before any score does. The MMEB-V2 release covers 78 tasks spanning images, video, and visual documents. MMEB-V3 expands the setting to 190 tasks with additional text, audio, and agent-centric categories, plus diagnostic work on modality and instruction effects. A model evaluated under MMEB-V2 is not automatically comparable to one evaluated under MMEB-V3 — the task set, metrics, and supported-modality handling differ between versions, and dataset revisions can change results even within the same version label.

Within a single evaluation, per-category breakdowns (image, video, visual document, and in V3 additional categories) matter more than the overall average for most applications. A model strong on image retrieval is not thereby validated for video or audio retrieval — checking which categories a model was actually evaluated on, and which it reports as unsupported, is part of reading the benchmark correctly.

## Why a pinned snapshot goes stale fast

Multimodal embedding models are released frequently, and leaderboard submissions and scores shift accordingly. A table of exact ranks and scores frozen at one point in time will be outdated within a quarter, and worse, differently-named entries can quietly refer to updated checkpoints with different results than an older public-file row recorded under the same name. Rather than embedding a dated snapshot here, check the **[official MMEB leaderboard](https://huggingface.co/spaces/TIGER-Lab/MMEB-Leaderboard)** directly for current rankings, and consult the **[MMEB-V3 dataset](https://huggingface.co/datasets/VLM2Vec/MMEB-V3)** for the current task definitions.

## Choose tasks before choosing the winner

For visual legal documents, inspect page-level retrieval with tables and layouts. For physical-AI video, inspect clip and event retrieval, temporal boundaries, and metadata restrictions. For an audio task, include only models that actually accept audio and check the benchmark's handling of unsupported modalities — an image score is not evidence for spoken-audio retrieval.

Use the live leaderboard to form a candidate set filtered to your target modality and version, then preserve preprocessing, frames, prompts, source IDs, and model revisions in a local evaluation. Measure relevant-source retrieval, encoding cost, index size, and latency on your own data. These application measurements answer a different question than a leaderboard's average score, and they are what should drive the final decision.

## Example to test

Choose the tasks matching your intended modality and MMEB version, then save the benchmark revision, checkpoint, preprocessing, and missing-task handling alongside your results. Re-check the live leaderboard before finalizing a choice — a model absent from an older cached view may already have newer, better-evaluated competitors.

## From concept to implementation

- [Review embedding representation and integration paths](https://milvus.io/docs/embeddings.md).
- [Distinguish external inference from server orchestration](https://milvus.io/docs/embedding-function-overview.md).

## Continue learning

- [Which multimodal embedding families fit image, video, and audio retrieval?](/ai-quick-reference/multimodal-model-families)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)
- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)

## Implementation guides and sources

- [Official MMEB/VLM2Vec repository](https://github.com/TIGER-AI-Lab/VLM2Vec)
- [MMEB public leaderboard (live)](https://huggingface.co/spaces/TIGER-Lab/MMEB-Leaderboard)
- [MMEB-V3 dataset](https://huggingface.co/datasets/VLM2Vec/MMEB-V3)
