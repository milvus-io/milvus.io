---
slug: "dense-sparse-model-families"
title: "Which dense, sparse, and compact embedding families should you compare?"
topic: "models"
order: 124
---

A model shortlist should include different representation and inference choices, not just the largest text encoders. Dense vectors, learned sparse vectors, static sentence representations, and instruction-conditioned embeddings solve different parts of the retrieval problem. The following are current candidates or explicitly identified baselines, not a new shared ranking.

| Model | Representation | Purpose | Milvus Model route, not an end-to-end certification |
|---|---|---|---|
| [intfloat/multilingual-e5-large-instruct](https://huggingface.co/intfloat/multilingual-e5-large-instruct) | Multilingual dense | Instruction-based multilingual retrieval; follow this checkpoint’s query format and compare cross-language questions. | Generic text encoder; not a dedicated export |
| [Alibaba-NLP/gte-multilingual-base](https://huggingface.co/Alibaba-NLP/gte-multilingual-base) | Dense + sparse | A multilingual encoder with dense and sparse outputs; inspect each output and field instead of treating a dictionary as one vector. | MGTEEmbeddingFunction |
| [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) | Dense + sparse + token vectors | One family exposes several representations; choose the outputs required for hybrid or late-interaction search. | BGEM3EmbeddingFunction |
| [nomic-ai/nomic-embed-text-v1.5](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Task-prefixed dense | A task-prefixed text encoder; aligned vision models are a separately documented pairing, not arbitrary image-model compatibility. | NomicEmbeddingFunction |
| [nomic-ai/nomic-embed-text-v2-moe](https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe) | Multilingual MoE dense | A multilingual sparse-mixture-of-experts text model; sparse activation is not a sparse lexical vector output. | Generic or native Nomic route; verify model configuration |
| [minishlab/potion-base-8M](https://huggingface.co/minishlab/potion-base-8M) | Static dense | Model2Vec static representations offer a compact inference option; test difficult context-dependent queries against a contextual encoder. | Model2VecEmbeddingFunction |
| [Snowflake/snowflake-arctic-embed-l-v2.0](https://huggingface.co/Snowflake/snowflake-arctic-embed-l-v2.0) | Dense | A retrieval-oriented text candidate; test its intended prompt, normalization, languages, and dimension on the actual corpus. | Generic text encoder; not a dedicated export |
| [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) | Compact dense baseline | A compact sentence/paragraph baseline useful for integration checks; it is not the current default alias in Milvus Model 0.3.4. | SentenceTransformerEmbeddingFunction |
| [hkunlp/instructor-xl](https://huggingface.co/hkunlp/instructor-xl) | Instruction + text | Conditions embeddings on task instructions; its loader and instruction/text interface differ from plain-text concatenation assumptions. | InstructorEmbeddingFunction |
| [maidalun1020/bce-embedding-base_v1](https://huggingface.co/maidalun1020/bce-embedding-base_v1) | Bilingual baseline | An established Chinese/English retrieval baseline, retained for comparison rather than labeled a new release. | Generic/official BCE implementation |
| [naver/splade-cocondenser-ensembledistil](https://huggingface.co/naver/splade-cocondenser-ensembledistil) | Learned lexical sparse | Learns vocabulary-weighted sparse representations for passage retrieval; tokenizer vocabulary and model revision are part of the index contract. | SpladeEmbeddingFunction |
| [KaLM-Embedding/KaLM-embedding-multilingual-mini-instruct-v2.5](https://huggingface.co/KaLM-Embedding/KaLM-embedding-multilingual-mini-instruct-v2.5) | Compact instructed dense | A compact KaLM candidate; preserve mean pooling and query instructions instead of reusing another family’s encoding code. | Generic or official model implementation |

## Match output to a field and scoring method

Dense output needs a compatible dimension, normalization, and metric. Learned sparse output needs a stable vocabulary or feature-index contract and the appropriate sparse field and index. Token-level representations require a separate embedding-list design. Mixture-of-experts model activation does not imply that the returned embedding is sparse.

## Separate model support from a provider name

Milvus Model includes dedicated adapters for some families and generic text encoders for others. A generic adapter must still match the selected checkpoint's loader, prompts, model arguments, and output. The presence of a package dependency or class does not certify every model published by that provider.

## Make the comparison useful

For a multilingual product corpus, keep documents and query judgments fixed, and compare rare identifiers, synonyms, cross-language questions, and no-answer cases. Measure initial recall separately from reranking. Report encoding memory and throughput, vector storage, filtered retrieval latency, and source correctness. Keep older baselines only where they clarify a quality or resource trade-off, rather than presenting their original release claims as current superiority.

## Continue learning

- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)

## Implementation guides and sources

- [Official model card: intfloat/multilingual-e5-large-instruct](https://huggingface.co/intfloat/multilingual-e5-large-instruct)
- [Official model card: Alibaba-NLP/gte-multilingual-base](https://huggingface.co/Alibaba-NLP/gte-multilingual-base)
- [Official model card: BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3)
- [Official model card: nomic-ai/nomic-embed-text-v1.5](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5)
- [Official model card: nomic-ai/nomic-embed-text-v2-moe](https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe)
- [Official model card: minishlab/potion-base-8M](https://huggingface.co/minishlab/potion-base-8M)
- [Official model card: Snowflake/snowflake-arctic-embed-l-v2.0](https://huggingface.co/Snowflake/snowflake-arctic-embed-l-v2.0)
- [Official model card: sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [Official model card: hkunlp/instructor-xl](https://huggingface.co/hkunlp/instructor-xl)
- [Official model card: maidalun1020/bce-embedding-base_v1](https://huggingface.co/maidalun1020/bce-embedding-base_v1)
- [Official model card: naver/splade-cocondenser-ensembledistil](https://huggingface.co/naver/splade-cocondenser-ensembledistil)
- [Official model card: KaLM-Embedding/KaLM-embedding-multilingual-mini-instruct-v2.5](https://huggingface.co/KaLM-Embedding/KaLM-embedding-multilingual-mini-instruct-v2.5)
- [Released model-wrapper source](https://github.com/milvus-io/milvus-model/tree/v0.3.4/src/pymilvus/model)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
