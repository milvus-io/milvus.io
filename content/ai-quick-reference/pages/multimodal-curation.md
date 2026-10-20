---
slug: "how-to-curate-image-and-video-data"
title: "How should you curate image and video data with vector retrieval?"
topic: "data"
order: 88
---

Multimodal curation uses representations of images, video, text, or other signals to organize and select source material. The first design choice is the unit of data: a frame, clip, scene, caption, or synchronized sensor interval can lead to different retrieval and removal decisions.

## Preserve temporal and source identity

For video, retain recording ID, start and end times, frame sampling, and extraction revision. For images, preserve source object, crop or transformation, and any caption relationship. Several embeddings can describe one source object, so keep their roles explicit.

A visually similar frame does not prove that two clips contain the same event. Differences in motion, timing, viewpoint, or interaction can matter even when a static embedding is close. Use an aligned representation for cross-modal retrieval and test each intended direction separately.

## Build candidate workflows around a task

For duplicate detection, retrieve similar source units and validate the duplicate policy with the original media. For coverage discovery, combine text queries, metadata filters, and neighborhood exploration. For quality review, use explicit labels such as blur, occlusion, or missing context instead of expecting one similarity score to represent all defects.

NVIDIA's clip-level deduplication documentation illustrates a workflow over embeddings and stable IDs. Adapt its unit and selection policy to the dataset rather than applying a generic threshold to every modality or event type.

## Audit what selection removes

Review near-threshold pairs, rare classes, and clips that differ only in an important temporal detail. Track false removals and retained coverage, not only the number of deleted files. Keep decisions reversible through source references and a versioned selection manifest.

Measure embedding extraction, candidate generation, payload retrieval, and human review cost separately. Milvus can support repeated interactive retrieval, while large media transformations and offline pair processing may run in a dedicated curation pipeline. The connection is most useful when reviewers can move from a search result to the exact media evidence and then publish a reproducible dataset decision.

## Continue learning

- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [How can vector search support physical-AI and autonomous-driving data discovery?](/ai-quick-reference/vector-search-for-physical-ai-data)
- [How should you combine exact, fuzzy, and semantic deduplication?](/ai-quick-reference/exact-fuzzy-and-semantic-deduplication)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)

## Implementation guides and sources

- [Clip-level duplicate identification](https://docs.nvidia.com/nemo/curator/latest/curate-video/process-data/dedup)
- [Cross-modal retrieval example](https://milvus.io/docs/text_image_search.md)
- [Image duplicate-search example](https://milvus.io/docs/image_deduplication_system.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
