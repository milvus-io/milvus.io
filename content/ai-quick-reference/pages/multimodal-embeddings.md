---
slug: "what-are-multimodal-embeddings"
title: "What are multimodal embeddings?"
topic: "foundations"
order: 7
---

Multimodal embeddings represent more than one kind of input, such as text and images. A model trained to align those inputs can support cross-modal retrieval: a text query finds an image, or an image finds a related description. The important property is learned alignment, not simply that both outputs are numeric arrays.

![Preserve page structure through multi-vector retrieval](/images/ai-reference/visual-page.svg)

## Distinguish shared and separate representations

Vectors from independent text and image models are not automatically comparable, even if their dimensions match. Use an aligned model for direct cross-modal similarity, or keep separate representations and combine their retrieval results through an evaluated strategy.

One source object can also have multiple useful representations. A video might have frame embeddings, transcript embeddings, and metadata for time and camera. Decide whether a result should identify a frame, clip, event, or entire video. Store the source and temporal location needed to reconstruct it.

## Design for the user's task

For product-image search, test descriptions with fine-grained attributes rather than only broad categories. For physical-AI data curation, include visually similar scenes with different events, viewpoints, or timing. A semantic match is not proof that two samples are interchangeable or safe to remove.

Milvus can store vector fields and scalar metadata used by these pipelines. The model, extraction process, and application still determine how modalities are aligned and how retrieved evidence is interpreted. Keep model revisions and preprocessing settings so results can be reproduced.

## Validate each direction

Evaluate text-to-image, image-to-image, or other supported directions separately. Check whether permissions and metadata filters are respected, whether the returned source location is correct, and whether query encoding dominates latency. Follow the tutorial that matches your intended direction; a successful image-to-image demo is not sufficient validation of a text-to-video product.

## Example to test

For text-to-image retrieval, verify that both encoders were trained for the same shared space. Store original media references alongside vectors. Matching vector lengths cannot establish compatibility between an arbitrary text model and image model.

## From concept to implementation

- [Check versioned embedding-list search](https://milvus.io/docs/basic-vector-search-with-structarray.md).
- [Connect media evidence to an application](https://milvus.io/docs/multimodal_rag_with_milvus.md).

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

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
