---
slug: "how-does-etl-help-improve-data-quality"
title: "How does data quality affect vector retrieval?"
topic: "data"
order: 24
---

Vector retrieval cannot reliably compensate for missing, stale, duplicated, or incorrectly parsed source material. A good embedding model can retrieve the wrong version of a well-written document with high confidence. Data quality therefore needs explicit checks before and after indexing.

## Check the source and extracted content

Validate that records have stable IDs, meaningful text, usable source locations, and the metadata required by the application. Inspect extraction from tables, scanned pages, code, and mixed-language documents. Empty text, navigation boilerplate, or broken character encoding can produce vectors that are technically valid but operationally useless.

Track authoritative versions and ownership. Decide whether a correction replaces an existing document or creates a distinct version that remains eligible for some queries. Metadata such as effective date or product version is only useful if the ingestion process populates it correctly and the query path uses it.

## Validate the representation

Check vector dimension, numeric validity, model version, and preprocessing consistency. Keep query and document encoders compatible. Detect repeated chunks and accidental ingestion of the same source through several connectors. Deduplication needs a retention policy so useful variants are not discarded merely for being similar.

## Make quality measurable

Monitor rejected records, extraction failures, ingestion lag, missing metadata, and stale indexed versions. Sample the content behind retrieved IDs rather than looking only at aggregate success counters. Maintain a small, representative set of queries whose expected evidence is known.

When relevance drops, trace a failed query through source content, parsing, chunking, embedding, filtering, and ranking. This makes it possible to fix the responsible stage. Increasing search effort or adding a reranker will not restore a passage that was never extracted or was incorrectly excluded by its metadata.

## Example to test

A PDF extraction can preserve every word but scramble a table's rows. Inspect the source around a retrieved numerical statement and record extraction quality separately from embedding quality. Re-embedding corrupted text will preserve the underlying mistake.

## From concept to implementation

- [Design a bounded batch-data workflow](https://milvus.io/docs/integrate_with_spark.md).
- [Validate the source-to-serving data contract](https://milvus.io/docs/prepare-source-data.md).

## Continue learning

- [What is data curation, and how can vector search help?](/ai-quick-reference/what-is-data-curation-for-vector-ai)
- [How should you design a quality score for data curation?](/ai-quick-reference/how-to-score-data-quality-for-curation)
- [How does ETL prepare data for vector search?](/ai-quick-reference/what-are-the-main-phases-of-an-etl-process)
- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [How do you choose chunk size for RAG?](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Prepare source data](https://milvus.io/docs/prepare-source-data.md)
- [Schema validation](https://milvus.io/docs/schema.md)
- [RAG data flow](https://milvus.io/docs/build-rag-with-milvus.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
