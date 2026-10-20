---
slug: "what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy"
title: "How do you choose an embedding model for retrieval?"
topic: "foundations"
order: 4
---

An embedding model turns text or other supported inputs into representations for retrieval and related tasks. Selecting one defines what information is preserved before Milvus indexes it. Choose a model by your task, languages, deployment route, and evaluation evidence; a benchmark average alone does not make that decision.

## Start from the actual evidence units

Decide whether a record represents a paragraph, code symbol, document page, image, or video segment. Preserve its source ID and metadata. Text models cannot automatically understand every visual detail in a PDF, while a multimodal model still needs an appropriate source-unit and preprocessing design.

Use the MTEB guide to form a benchmark shortlist and the current model catalog to inspect newer hosted and multimodal options. Read the exact revision, query instructions, supported languages, model terms, dimensions, pooling, and normalization. Higher-dimensional output increases storage; smaller output can change quality and needs its own test.

## Separate model quality from ANN behavior

Encode the same corpus separately for each candidate. Build a small relevance-labeled query set with realistic filters and difficult negatives. Evaluate exact search first. Then choose ANN settings against a matched recall target so index approximation does not obscure representation quality.

## Budget the full lifecycle

Measure document encoding, query encoding, storage, update throughput, and end-to-end latency. Reranking is a separate option on the first-stage candidates. Changing the embedding model generally requires re-encoding existing documents unless the provider explicitly guarantees compatible spaces.

Keep a migration plan with separate collections or fields, a replayable source corpus, acceptance checks, and a rollback boundary. Store model and preprocessing revisions with indexed data. This makes future model improvements a controlled application change rather than an unexplained shift in search results.

## Continue learning

- [How do you read MTEB and compare the current embedding shortlist?](/ai-quick-reference/mteb-embedding-leaderboards)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How do Sentence Transformers models feed a Milvus retrieval pipeline?](/ai-quick-reference/sentence-transformers-with-milvus)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)

## Implementation guides and sources

- [MTEB benchmark definitions and models](https://huggingface.co/spaces/mteb/leaderboard)
- [Encoding and model-evaluation interfaces](https://sbert.net/)
- [Milvus similarity metrics](https://milvus.io/docs/metric.md)

Sources checked: 2026-10-20. Model rankings are dated snapshots; use the guide for your deployed version.
