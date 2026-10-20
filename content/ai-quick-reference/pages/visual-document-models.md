---
slug: "visual-document-models"
title: "How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?"
topic: "models"
order: 126
---

Visual-document models encode rendered pages or image patches so retrieval can retain information lost by plain text extraction. ColPali, ColQwen2.5, ColSmol, and Nemotron ColEmbed are useful families to inspect. They produce token/patch-level representations for late interaction rather than an ordinary single dense embedding for the whole page.

## Choose a model and implementation pair

ColPali offers a PaliGemma-derived page-retrieval approach; ColQwen2.5 uses a Qwen2.5-VL backbone; ColSmol targets a smaller model footprint. Nemotron ColEmbed is another visual-document late-interaction candidate with its own requirements and model terms. Check the exact checkpoint's engine: a Transformers-format model and a colpali-engine checkpoint can require different loading paths.

## Use the correct Milvus representation

Milvus 3.0 documentation describes StructArray vector subfields, EmbeddingList query objects, and MAX_SIM-family document-level scoring. This differs from storing independent title/body vectors and applying rank fusion. Match the deployed server/client version, schema, metric, and supported index path before importing page embeddings.

For a legal-document collection, store document ID, page number, rendered-image location, version, and permission metadata. Keep the patch/token mapping needed to trace a returned page. Define maximum page complexity and truncation so a large page does not silently lose decisive evidence.

## Evaluate candidate search and final scoring

The documented search strategies include tokenann, muvera, and lemur. They change approximate candidate retrieval; final MaxSim scoring is a separate step when enabled. Compare candidate recall and final ranking independently, along with index size and page-encoding latency. An exact second-stage score cannot repair a page absent from the candidate set. Test table-heavy pages, multi-column layouts, and near-duplicate versions on the corpus you intend to serve.

## Continue learning

- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [Which multimodal embedding families fit image, video, and audio retrieval?](/ai-quick-reference/multimodal-model-families)
- [How do MMEB versions evaluate multimodal embeddings?](/ai-quick-reference/mmeb-multimodal-evaluation)
- [How should you design vector retrieval for legal-document agents?](/ai-quick-reference/vector-search-for-legal-document-agents)
- [How should you design evidence retrieval for healthcare agents?](/ai-quick-reference/vector-search-for-healthcare-evidence)

## Implementation guides and sources

- [Official model card: vidore/colpali-v1.3-hf](https://huggingface.co/vidore/colpali-v1.3-hf)
- [Official model card: vidore/colqwen2.5-v0.2](https://huggingface.co/vidore/colqwen2.5-v0.2)
- [Official model card: vidore/colSmol-500M](https://huggingface.co/vidore/colSmol-500M)
- [Official model card: nvidia/nemotron-colembed-vl-8b-v2](https://huggingface.co/nvidia/nemotron-colembed-vl-8b-v2)
- [EmbeddingList search and StructArray](https://milvus.io/docs/basic-vector-search-with-structarray.md)
- [EmbeddingList search strategies](https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
