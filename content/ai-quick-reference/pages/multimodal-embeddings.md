---
slug: "what-are-multimodal-embeddings"
title: "What are multimodal embeddings?"
topic: "foundations"
order: 7
---

Multimodal embedding models produce representations from supported inputs such as text, images, video, or audio. Their training defines which inputs can be compared and what the comparison means. The label alone does not imply one universal embedding space, multiple vectors per item, or a representation of a particular user's preferences.

![Aligned content representations are not preference predictions](/images/ai-reference/multimodal.svg)

## Separate three representation designs

| Design | What is represented | Retrieval implication |
| --- | --- | --- |
| Aligned single-vector encoders | Text and an image can each produce a vector in a jointly trained space | Direct cross-modal similarity is meaningful only for compatible encoders and supported directions |
| Joint or fused item representation | Several inputs, such as an item's description and picture, contribute to its representation | The fusion method and task objective determine what information survives |
| Token or patch representations | A query or document has a list of vectors | Requires the model's aggregation or late-interaction score, not ordinary single-vector search |

An image-text contrastive model such as CLIP learns image-caption correspondence. It does not thereby learn an individual user's preference or predict a purchase. Separate text and image vectors from unrelated models do not become comparable just because their dimensions match.

## What this can contribute to recommendation

Content embeddings can supply item features or content-similarity candidates, including for new items with little interaction history. Personalized recommendation additionally needs a way to relate users or sessions to items, such as a retrieval model trained on suitable interaction data or an explicitly evaluated content-based policy. A text-to-image alignment objective is not a user-preference objective.

More modalities do not guarantee better recommendation relevance, click-through rate, conversion, or serving latency. Irrelevant images, missing modalities, noisy captions, and additional inference can make a system worse. Compare text-only, image-only, and combined variants on the same temporal data split; distinguish recommendation-quality metrics from indexing throughput and query latency. Validate business effects through a suitable online experiment rather than inferring them from a richer input representation.

## Choose the database path from the output

For a single dense vector, use the corresponding dense field, dimension, and metric. For separate representations, use separately defined fields and a tested fusion policy. For token or patch lists, check a supported EmbeddingList/late-interaction route and its version requirements. Multimodal input does not inherently require multi-vector storage.

Keep object IDs, page or clip boundaries, source revisions, model/processor revisions, and required access metadata. A returned ID must resolve to the intended source evidence. The model handles representation; Milvus stores and retrieves the configured representations; the application implements preference logic and final decisions.

## Test the actual retrieval direction

A product pilot can include visually similar items with different specifications, textually similar items with different pictures, and new items with no observed interactions. Define whether each test asks for a matching image, a similar item, or a personalized recommendation; those are different objectives. Evaluate supported query directions separately and keep no-answer cases. A successful image-to-image demonstration does not validate text-to-video retrieval or a recommendation uplift.

## Example to test

For text-to-image retrieval, use compatible encoders from the same aligned model. Contrast matching visual content with a separate personalized recommendation task; success at one does not validate the other.

## From concept to implementation

- [Start with aligned text-to-image encoders and a dense vector field](https://milvus.io/docs/text_image_search.md).
- [Build a multimodal evidence pipeline](https://milvus.io/docs/multimodal_rag_with_milvus.md).

## Continue learning

- [What do WeChat WeMM embeddings represent, and how can Milvus use them?](/ai-quick-reference/wemm-embedding-models)
- [Which multimodal embedding families fit image, video, and audio retrieval?](/ai-quick-reference/multimodal-model-families)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [How should you curate image and video data with vector retrieval?](/ai-quick-reference/how-to-curate-image-and-video-data)
- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)

## Implementation guides and sources

- [Multimodal RAG tutorial](https://milvus.io/docs/multimodal_rag_with_milvus.md)
- [Text-to-image search tutorial](https://milvus.io/docs/text_image_search.md)
- [CLIP: the image-text training objective](https://arxiv.org/abs/2103.00020)
- [Recommendation candidate generation and ranking](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
