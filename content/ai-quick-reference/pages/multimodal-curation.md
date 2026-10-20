---
slug: "how-to-curate-image-and-video-data"
title: "How should you curate image and video data with vector retrieval?"
topic: "data"
order: 88
---

Multimodal curation uses representations of images, video, text, or other signals to organize and select source material. In Milvus this starts with a schema decision: a collection can hold multiple vector fields on the same row (for example an image embedding and a caption-text embedding), and the curation unit — frame, clip, scene, or caption — determines what goes in one row versus what becomes a separate linked record.

![Candidate discovery is not a deletion decision](/images/ai-reference/curation.svg)

## Model multimodal fields for the curation unit, not just search

Define separate vector fields for each modality you curate against rather than collapsing them into one representation. A clip row might carry a `visual_embedding` field (from frame sampling), a `caption_embedding` field (from the transcript or caption text), plus scalar fields for `recording_id`, `start_ts`, `end_ts`, and `extraction_revision`. Keeping the modalities as distinct fields on a shared row lets curation queries combine them explicitly instead of hoping one fused embedding captures everything a reviewer needs to check.

A visually similar frame does not prove two clips contain the same event: motion, timing, viewpoint, and interaction can differ even when the stored `visual_embedding` vectors are close. Treat each vector field's similarity as evidence about that one modality, not a verdict about the clip.

## Run cross-modal dedup as two queries, not one threshold

Candidate duplicate detection across modalities means searching each field against its own kind of query, then requiring agreement before treating a pair as a true duplicate: search `visual_embedding` for near-identical frames, search `caption_embedding` for near-identical captions, and flag a pair as a likely duplicate only when both signals agree, or route it to review when they disagree. Milvus's hybrid search can combine both fields in one request with reranking across the two score lists, which is the same mechanism used for retrieval but repurposed here to produce a single duplicate-candidate ranking instead of a relevance ranking.

Searching only the visual field will catch re-encoded or re-cropped copies of the same clip but miss a captioned clip that reuses stock footage under a different caption; searching only the caption field misses the reverse case. Running both and comparing is cheap once both fields already exist on the collection.

## Audit what selection removes

Review near-threshold pairs, rare classes, and clips that differ only in an important temporal detail. Track false removals and retained coverage, not only the number of deleted rows. Keep decisions reversible: write a `curation_status` scalar field and apply exclusions through upsert rather than deleting the row outright, so a reviewer can revisit a decision without losing the source reference.

## Example to test

Keep video clip boundaries, frame sampling, and source revisions with every selected example. Run the visual and caption fields as two separate dedup searches over the same candidate pool and compare agreement before merging. Removing redundant frames must not erase the rare action the dataset needs.

## From concept to implementation

- [Define multiple vector fields per row for cross-modal curation](https://milvus.io/docs/multi-vector-search.md).
- [Combine per-field scores into one dedup-candidate ranking](https://milvus.io/docs/reranking.md).

## Continue learning

- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)

## Implementation guides and sources

- [Clip-level duplicate identification](https://docs.nvidia.com/nemo/curator/latest/curate-video/process-data/dedup)
- [Multi-vector fields and hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Image duplicate-search example](https://milvus.io/docs/image_deduplication_system.md)
