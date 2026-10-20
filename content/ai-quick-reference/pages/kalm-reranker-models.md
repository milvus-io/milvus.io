---
slug: "kalm-reranker-models"
title: "How does KaLM compressed-document reranking work?"
topic: "models"
order: 123
---

KaLM-Reranker-V1 uses an encoder-decoder design called fast-but-not-late interaction. A passage encoder creates compressed document representations, while the decoder processes instructions and the query and uses cross-attention to assess relevance. The current R2 release retains that architecture and interface while changing the training recipe and compression behavior. Nano, Small, and Large are different deployment choices, not three descriptions of one model.

## Understand what is compressed

The compressed passage representation is an intermediate state for the reranker's own computation. It is not automatically a general-purpose vector suitable for a Milvus cosine index, nor is its compression ratio equivalent to scalar or product quantization of ANN vectors. Keep the first-stage embedding model and its candidate index as separate components.

For a document assistant, retrieve permitted document IDs and text, then call the selected KaLM model through its documented processor or service. If pre-encoding or caching document states is used, associate those states with the exact document text, model revision, and encoding configuration. A document update invalidates the corresponding cached representation.

## Keep performance claims reproducible

The model reports compare tasks and compression settings under specific protocols. Use the released final R2 checkpoint rather than silently substituting a training-stage checkpoint or an older V1 result. Compare multiple compression settings at fixed candidate recall, and measure reranking latency, cache size, and quality on your own data.

## Verify the wrapper boundary

There is no dedicated KaLM reranker export in Milvus Model 0.3.4. The presence of a generic CrossEncoder wrapper is not evidence that it forwards KaLM's specialized configuration. Validate the official loading path independently, then expose a bounded reranking service or adapter with stable output-ID mapping.

## Continue learning

- [How do the KaLM text embedding variants differ?](/ai-quick-reference/kalm-embedding-models)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How should you serve and version embedding and reranking models for Milvus?](/ai-quick-reference/model-inference-serving)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)

## Implementation guides and sources

- [Official model card: KaLM-Embedding/KaLM-Reranker-V1-Nano-R2](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Nano-R2)
- [Official model card: KaLM-Embedding/KaLM-Reranker-V1-Small-R2](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Small-R2)
- [Official model card: KaLM-Embedding/KaLM-Reranker-V1-Large-R2](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Large-R2)
- [KaLM-Reranker FBNL technical report](https://arxiv.org/abs/2606.22807)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
