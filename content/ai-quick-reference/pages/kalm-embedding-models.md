---
slug: "kalm-embedding-models"
title: "How do the KaLM text embedding variants differ?"
topic: "models"
order: 122
---

KaLM refers to a text embedding family, not one interchangeable checkpoint. The lightweight multilingual mini instruct v2.5 card describes a roughly 0.5B model with 896-dimensional full output, bidirectional attention, and mean pooling. The Gemma3 12B variant is a larger model with its own representation, requirements, and model terms. A hosted service identifier is a further deployment artifact and must not be equated with either checkpoint by name alone.

## Match the task and model size

For a bilingual knowledge base, compare the compact model with a larger candidate using identical documents and queries. Preserve query instructions and the model's documented normalization. Evaluate rare product identifiers and cross-language queries rather than assuming a multilingual label means every language pair performs equally well.

The lightweight checkpoint's mean-pooling procedure must not be replaced by last-token pooling copied from another decoder-derived model. Its supported shortened dimensions need their own quality check. Changing between compact and Gemma-based variants requires separate indexed vectors unless compatibility is explicitly documented.

## Connect to Milvus deliberately

The inspected Milvus Model package has a general Sentence Transformer wrapper, but no dedicated KaLM class. Use the checkpoint's intended loader, prompt format, and output validation; a generic text wrapper is an integration candidate, not proof that every custom architecture or option is forwarded correctly. Keep encoding in a separate service if its dependencies conflict with the application environment.

## Compare embedding and reranking separately

KaLM's embedding vectors support first-stage candidate selection. KaLM-Reranker-V1 and its R2 checkpoints score relevance using a different architecture. They should not share a single benchmark rank or vector-field definition. First assess candidate recall, then compare reranking on the same permitted candidate set with latency and storage costs included.

## Continue learning

- [How does KaLM compressed-document reranking work?](/ai-quick-reference/kalm-reranker-models)
- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [Which dense, sparse, and compact embedding families should you compare?](/ai-quick-reference/dense-sparse-model-families)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)

## Implementation guides and sources

- [Official model card: KaLM-Embedding/KaLM-embedding-multilingual-mini-instruct-v2.5](https://huggingface.co/KaLM-Embedding/KaLM-embedding-multilingual-mini-instruct-v2.5)
- [Official model card: tencent/KaLM-Embedding-Gemma3-12B-2511](https://huggingface.co/tencent/KaLM-Embedding-Gemma3-12B-2511)
- [KaLM training and evaluation implementation](https://github.com/HITsz-TMG/KaLM-Embedding)
- [Tencent service model identifiers](https://intl.cloud.tencent.com/zh/document/product/845/82238)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
