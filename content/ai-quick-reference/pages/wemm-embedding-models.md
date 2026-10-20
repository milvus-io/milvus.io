---
slug: "wemm-embedding-models"
title: "What do WeChat WeMM embeddings represent, and how can Milvus use them?"
topic: "models"
order: 121
---

WeMM-Embedding is a multimodal embedding family released by Tencent's WeChat Vision team. The published model set contains 2B, 4B, and 9B variants for text, images, videos, visual documents, and interleaved supported inputs. The release does not currently support audio. It produces a normalized representation for shared-space retrieval rather than a generated answer.

![Content alignment does not learn personal preference](/images/ai-reference/multimodal.svg)

## Choose the object the vector describes

For a driving-data collection, define whether each record represents a frame, a fixed-duration clip, or an event. Save the object URI, time boundaries, camera, source revision, and preprocessing configuration. A query such as a pedestrian entering a junction should return a verifiable clip reference, not just a nearest-vector ID.

## Preserve the encoding contract

Use the exact checkpoint's official inference path. The 2B, 4B, and 9B variants have different full output dimensions, and the released Matryoshka options are checkpoint-specific. When truncating to a supported dimension, follow the documented normalization procedure. Do not mix variants merely because both were truncated to the same length.

The published examples include Sentence Transformers, Transformers, and serving routes. That does not establish that the text-oriented Milvus Model wrapper accepts the same image/video payload. Use the model's own processor to produce verified vectors, then insert them with matching metadata and dimension. No dedicated WeMM export exists in the inspected Milvus Model 0.3.4 package. The checked public model zoo lists embedding checkpoints; this review did not verify a separately released WeMM reranker. A training-time scoring component is not automatically a downloadable reranking model.

## Validate the intended modality

Build image, clip, and visual-document query sets separately. Match frame sampling and source granularity across candidates. Compare current checkpoint results with their own protocol rather than joining the older MMEB public-file entries to new report numbers. For curation or deduplication, manually inspect false matches before treating a shared-space similarity as evidence that two samples can be removed interchangeably.

## Example to test

Define whether a record represents a frame, clip, or page, then use that checkpoint's processor consistently for ingestion and queries. Save the sampling policy and source boundaries. Similar shared-space outputs do not erase modality-specific preprocessing requirements.

## From concept to implementation

- [Check versioned embedding-list search](https://milvus.io/docs/basic-vector-search-with-structarray.md).
- [Connect media evidence to an application](https://milvus.io/docs/multimodal_rag_with_milvus.md).

## Continue learning

- [How do MMEB versions evaluate multimodal embeddings?](/ai-quick-reference/mmeb-multimodal-evaluation)
- [Which multimodal embedding families fit image, video, and audio retrieval?](/ai-quick-reference/multimodal-model-families)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
- [How can vector search support physical-AI and autonomous-driving data discovery?](/ai-quick-reference/vector-search-for-physical-ai-data)
- [How should you curate image and video data with vector retrieval?](/ai-quick-reference/how-to-curate-image-and-video-data)

## Implementation guides and sources

- [Official model card: tencent/WeMM-Embedding-2B](https://huggingface.co/tencent/WeMM-Embedding-2B)
- [Official model card: tencent/WeMM-Embedding-4B](https://huggingface.co/tencent/WeMM-Embedding-4B)
- [Official model card: tencent/WeMM-Embedding-9B](https://huggingface.co/tencent/WeMM-Embedding-9B)
- [WeChat Vision team implementation](https://github.com/Tencent/WeMM-Embedding)
- [WeMM technical report](https://arxiv.org/abs/2608.24053)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
