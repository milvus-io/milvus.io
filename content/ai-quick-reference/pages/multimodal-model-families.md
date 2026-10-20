---
slug: "multimodal-model-families"
title: "Which multimodal embedding families fit image, video, and audio retrieval?"
topic: "models"
order: 125
---

A multimodal embedding model aligns supported input types into a representation used for retrieval. Check which modalities are truly accepted, whether outputs are one vector or many, and which query-to-document directions were evaluated. A text/image model is not automatically an audio model, and a vision encoder is not a general document parser.

| Model | Representation | Purpose | Milvus Model route, not an end-to-end certification |
|---|---|---|---|
| [tencent/WeMM-Embedding-9B](https://huggingface.co/tencent/WeMM-Embedding-9B) | Text / image / video / visual document | WeChat visual-retrieval family; audio is unsupported in the checked release. | Native model processor → dense vectors |
| [Qwen/Qwen3-VL-Embedding-8B](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B) | Text / image / video | Shared-space visual/text representations; preserve document pages and frame/clip source IDs. | Native model processor → dense vectors |
| [Alibaba-NLP/gme-Qwen2-VL-7B-Instruct](https://huggingface.co/Alibaba-NLP/gme-Qwen2-VL-7B-Instruct) | Multimodal dense | An instruction-conditioned visual/text embedding family; match the target checkpoint and processor. | External encoding; no dedicated wrapper |
| [OpenSearch-AI/Ops-MM-embedding-v1-7B](https://huggingface.co/OpenSearch-AI/Ops-MM-embedding-v1-7B) | Multimodal dense | A model from Alibaba Cloud OpenSearch-AI, not proof of native support in the OpenSearch software or Milvus. | External encoding; no dedicated wrapper |
| [google/siglip2-base-patch16-224](https://huggingface.co/google/siglip2-base-patch16-224) | Aligned image / text | A vision-language encoder for image/text tasks; use its intended preprocessing and do not infer video or audio support. | External encoding; no dedicated wrapper |
| [nvidia/omni-embed-nemotron-3b](https://huggingface.co/nvidia/omni-embed-nemotron-3b) | Text / image / audio / video | An omni-modality research candidate; inspect the exact model terms and evaluate each modality separately. | External encoding; no dedicated wrapper |
| [Haon-Chen/e5-omni-7B](https://huggingface.co/Haon-Chen/e5-omni-7B) | Text / image / audio / video | An omni-modal candidate with a shared representation; compare supported cross-modal directions rather than only a global mean. | External encoding; no dedicated wrapper |
| [jinaai/jina-embeddings-v5-omni-small](https://huggingface.co/jinaai/jina-embeddings-v5-omni-small) | Text / image / audio / video | An omni embedding aligned with its documented text counterpart; text-wrapper availability does not validate multimedia inputs. | Native/hosted multimodal API; verify wrapper payload |

## Include the benchmark baselines deliberately

VLM2Vec and VLM2Vec-V2 are model/evaluation implementations associated with MMEB, not alternate names for the benchmark itself. The MMEB snapshot includes additional families such as RzenEmbed, Embed-RL, UME, and UniME. Some public submission rows do not provide a direct model-weight link. Retain that uncertainty rather than inventing an installation path.

## Design for source reconstruction

Represent images with object IDs and regions where relevant. Represent videos with clip boundaries and frame-sampling settings. Represent audio with time segments and the model's actual audio preprocessing. Keep source permissions as metadata filters and return enough location information for an agent or user to inspect the original evidence.

## Evaluate the direction you will ship

Compare text-to-image, image-to-image, text-to-video, or supported audio queries separately. Keep sampling and preprocessing constant and include visually similar but semantically different examples. For physical-AI curation, a nearby embedding may identify a useful candidate without proving that two trajectories or scenes are equivalent. Measure both relevance and the cost of generating and storing the representation.

## Example to test

Choose whether the retrieval object is an image, clip, page, or audio segment before selecting a model. Compare only supported inputs under a matched protocol. An image-capable family name does not establish video or audio support for every checkpoint.

## From concept to implementation

- [Check versioned embedding-list search](https://milvus.io/docs/basic-vector-search-with-structarray.md).
- [Connect media evidence to an application](https://milvus.io/docs/multimodal_rag_with_milvus.md).

## Continue learning

- [How do MMEB versions evaluate multimodal embeddings?](/ai-quick-reference/mmeb-multimodal-evaluation)
- [What do WeChat WeMM embeddings represent, and how can Milvus use them?](/ai-quick-reference/wemm-embedding-models)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)
- [How should you curate image and video data with vector retrieval?](/ai-quick-reference/how-to-curate-image-and-video-data)
- [How can vector search support physical-AI and autonomous-driving data discovery?](/ai-quick-reference/vector-search-for-physical-ai-data)

## Implementation guides and sources

- [Official model card: tencent/WeMM-Embedding-9B](https://huggingface.co/tencent/WeMM-Embedding-9B)
- [Official model card: Qwen/Qwen3-VL-Embedding-8B](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B)
- [Official model card: Alibaba-NLP/gme-Qwen2-VL-7B-Instruct](https://huggingface.co/Alibaba-NLP/gme-Qwen2-VL-7B-Instruct)
- [Official model card: OpenSearch-AI/Ops-MM-embedding-v1-7B](https://huggingface.co/OpenSearch-AI/Ops-MM-embedding-v1-7B)
- [Official model card: google/siglip2-base-patch16-224](https://huggingface.co/google/siglip2-base-patch16-224)
- [Official model card: nvidia/omni-embed-nemotron-3b](https://huggingface.co/nvidia/omni-embed-nemotron-3b)
- [Official model card: Haon-Chen/e5-omni-7B](https://huggingface.co/Haon-Chen/e5-omni-7B)
- [Official model card: jinaai/jina-embeddings-v5-omni-small](https://huggingface.co/jinaai/jina-embeddings-v5-omni-small)
- [VLM2Vec/MMEB model and evaluation code](https://github.com/TIGER-AI-Lab/VLM2Vec)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
