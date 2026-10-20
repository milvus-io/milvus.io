---
slug: "what-are-multimodal-embeddings"
title: "What are multimodal embeddings?"
topic: "foundations"
order: 7
---

Multimodal embeddings represent supported input types such as text and images in a form useful for a particular task. Cross-modal retrieval requires compatible representations: a text query must be comparable with the indexed image representation. Two vectors with matching dimensions can still live in unrelated spaces — alignment is a property of how the model was trained, not of the array shapes.

![Paired text and image encoders learn compatible representations](/images/ai-reference/clip-alignment.svg)

## CLIP: separate encoders, a jointly learned space

CLIP is a useful concrete example. It trains an image encoder and a text encoder on image-caption pairs with a contrastive objective. Matching pairs should receive higher similarity than mismatched pairs in the training batch. The jointly trained encoders can then produce image and text features that can be compared in their learned space.

For text-to-image search, encode the image collection once with the image encoder and preprocessing. Encode a text query with the corresponding text encoder and tokenizer. Follow the checkpoint's normalization and score conventions, search compatible image features, and resolve returned IDs to source images. The reverse direction uses an image query against compatible text representations and needs its own evaluation.

## Alignment has a scope

Alignment is learned correspondence, not proof that a model understands every cross-modal relation. Domain shift, small text in images, spatial relationships, counting, preprocessing, or unsupported languages can affect the intended task. Compare difficult positive and negative examples; a broad category match does not establish exact detail matching.

A general multimodal language model that accepts images is a generation model, not a retrieval encoder, unless it explicitly exposes an embedding output with a defined preprocessing and query/document contract. Arbitrary hidden states pulled from an unrelated encoder are not a shared retrieval space; use the representation the model was trained and documented to produce.

## Keep three representation designs separate

| Design | Example | Search contract |
| --- | --- | --- |
| Aligned single vectors | One CLIP-style image vector and one compatible text vector | Compare in their shared learned space |
| Fused item representation | Description and image jointly contribute to one item vector | Use the fusion model's task-specific encoding and score |
| Token or patch lists | A visual page represented by many patch vectors | Use the corresponding multi-vector aggregation, such as a supported MaxSim path |

A text-only ColBERT model can be multi-vector without being multimodal. A CLIP-style model can be multimodal while using one vector per input. See [multi-vector retrieval](/ai-quick-reference/what-is-multi-vector-retrieval) and [late interaction](/ai-quick-reference/what-is-late-interaction-retrieval) for those separate mechanisms.

## What Milvus stores and what the model decides

Use a dense field for a compatible single-vector representation, separately specified fields for independent representations, or a supported embedding-list schema for multi-vector output. Retain model/processor revisions, media IDs, access metadata, and page or clip boundaries. Milvus stores and retrieves configured representations; the model and training objective determine which comparisons mean something.

These representations can support media search, evidence retrieval, or curation when evaluated for that task. Image-text alignment captures what an image and a caption have in common, not what one particular user prefers; personalized recommendation needs its own objective and its own evidence, built on top of (not substituted by) a shared retrieval space.

## Example to test

Search images with a text query describing an object, then vary an attribute, relation, or count while keeping the category constant. Include visually similar wrong answers. Record the supported direction, checkpoint, preprocessing, and relevance labels rather than treating one attractive result as validation of all multimodal tasks.

## From concept to implementation

- [Build aligned text-to-image retrieval](https://milvus.io/docs/text_image_search.md).
- [Connect retrieved media evidence to RAG](https://milvus.io/docs/multimodal_rag_with_milvus.md).

## Continue learning

- [What is multi-vector retrieval, and how do MaxSim and MUVERA work?](/ai-quick-reference/what-is-multi-vector-retrieval)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [Which multimodal embedding families fit image, video, and audio retrieval?](/ai-quick-reference/multimodal-model-families)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)

## Implementation guides and sources

- [Multimodal RAG tutorial](https://milvus.io/docs/multimodal_rag_with_milvus.md)
- [Text-to-image search tutorial](https://milvus.io/docs/text_image_search.md)
- [CLIP image-text contrastive learning](https://arxiv.org/abs/2103.00020)
- [CLIP encoders, preprocessing, and comparison](https://github.com/openai/CLIP)
