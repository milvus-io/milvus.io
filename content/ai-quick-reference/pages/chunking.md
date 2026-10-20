---
slug: "what-is-the-optimal-chunk-size-for-rag-applications"
title: "How do you choose chunk size for RAG?"
topic: "rag-agents"
order: 19
---

Choose chunk boundaries so a retrieved unit contains useful evidence without burying it in unrelated text. There is no universal best number of tokens. Document structure, query intent, embedding-model limits, source citations, and the generator's context budget all influence the decision.

## Preserve meaning and provenance

Begin with structural boundaries such as sections, paragraphs, clauses, or table groups. Keep the document ID, version, heading, and source offset with each unit. When a table or code block needs surrounding explanation, splitting it mechanically can make an apparently relevant match unusable.

Small chunks can improve targeting but lose context. Large chunks can preserve context but dilute a short relevant passage and consume more model input. Overlap may help boundary cases, while also increasing index size and repeated text in the final context. Treat these as separate variables to test.

## Compare configurations fairly

Use one held-out question set and several explicitly recorded chunking configurations. Measure whether the evidence needed for each answer appears in the retrieved results. Inspect cases that require adjacent passages or multiple documents. Track duplicate context, embedding work, tokens sent to the generator, and end-to-end latency.

A configuration that wins on an FAQ corpus may fail on long contracts or technical manuals. Include the document types and failure cases that the real product serves. Avoid selecting a setting solely from average retrieval scores when one important document class regresses.

## Manage updates

Changing chunking changes record boundaries and usually requires rebuilding affected embeddings. Keep stable source identifiers so obsolete chunks can be removed and citations can be resolved to the correct document version. Test a full document replacement, partial correction, and deletion. Use the tutorial's splitting method as an example implementation, then choose production boundaries from your own measurements.

## Example to test

A contract clause continues onto the next page. Compare a fixed-size split with a section-aware split that preserves the exception. Judge whether the returned evidence includes the qualification, not just whether the main clause appears.

## From concept to implementation

- [Build an evidence-backed RAG pipeline](https://milvus.io/docs/build-rag-with-milvus.md).
- [Find a runnable application starting point](https://milvus.io/bootcamp).

## Continue learning

- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [How can vector search improve codebase retrieval for coding agents?](/ai-quick-reference/vector-search-for-coding-agents)
- [What is retrieval-augmented generation (RAG)?](/ai-quick-reference/what-is-rag-retrievalaugmented-generation-in-nlp)
- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [RAG tutorial](https://milvus.io/docs/build-rag-with-milvus.md)
- [Ingestion and chunking guidance](https://milvus.io/docs/rag_pipeline.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
