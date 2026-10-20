---
slug: "how-sparse-inverted-indexes-work"
title: "How does a sparse inverted index differ from dense ANN?"
topic: "retrieval"
order: 65
---

A sparse inverted index organizes records by the dimensions with nonzero values. A query combines contributions from overlapping dimensions. This is different from navigating a dense-vector graph or selecting dense-vector clusters, even though both can produce ranked retrieval results.

## Identify what the sparse dimensions mean

A BM25 pipeline derives its representation from text analysis and corpus statistics. An externally generated sparse embedding can use another learned representation. Milvus documents BM25 scoring for function-generated full-text fields and inner-product search for compatible externally generated sparse vectors.

Use the same representation contract for documents and queries. Two sparse vectors with integer dimension keys are not automatically compatible if they use different vocabularies or model revisions. Record the analyzer or model version with the ingestion and query pipeline.

## Diagnose sparse failures at the right layer

If an exact product code never matches, inspect tokenization or representation generation before increasing search effort. If a common term overwhelms results, investigate weighting and corpus behavior. A dense embedding path may help paraphrases, while a sparse path may preserve exact terminology that dense retrieval handles poorly.

Combine paths through a measured hybrid strategy. Scores from different retrievers can have different meanings and scales, so do not assume that a raw addition produces a sound ranking. Use the supported fusion or reranking method and evaluate it on labeled queries.

## Measure complete index behavior

Track nonzero dimensions per record, corpus size, ingestion, index preparation, memory, query latency, and relevance. Test rare terms, long queries, multilingual text, and metadata filters. Check the current Milvus guide for supported algorithms and parameters because implementation choices evolve.

Keep both candidate generation and the final user task in the evaluation. Sparse retrieval that returns many overlapping terms can still miss the intended document, and a dense path can still retrieve a plausible but incorrect one. The index is most useful when its representation and retrieval role are explicit within the complete pipeline.

## Example to test

Inspect which term dimensions contribute to an error-code query and compare them with a paraphrase query. BM25 and learned sparse encoders have different production paths; sharing a sparse field type does not make their scores interchangeable.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [What is full-text search, and how does BM25 fit?](/ai-quick-reference/what-is-fulltext-search)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do scalar indexes support filtered vector search?](/ai-quick-reference/how-scalar-indexes-support-vector-search)

## Implementation guides and sources

- [Milvus sparse inverted index](https://milvus.io/docs/sparse-inverted-index.md)
- [Sparse vector representation](https://milvus.io/docs/sparse_vector.md)
- [BM25-generated sparse fields](https://milvus.io/docs/full-text-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
