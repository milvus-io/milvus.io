---
slug: "when-to-use-vector-range-search"
title: "When should you use range search instead of only top-k?"
topic: "retrieval"
order: 68
---

Range search adds a distance or score interval to vector retrieval. It is useful when a workflow needs to distinguish plausible matches from weak neighbors, or explore a bounded similarity region. In Milvus, this still follows the documented search and result-limit semantics; it should not be assumed to enumerate every qualifying record without qualification.

## Understand score direction first

For a distance such as L2, smaller values indicate closer vectors. For similarity measures such as cosine or inner product, larger values can indicate a stronger match. The interval parameters therefore depend on the metric. Follow the guide's inequalities rather than copying a radius from a different metric.

A threshold also depends on the model, normalization, data distribution, and task. A value calibrated for one embedding revision does not automatically retain the same meaning after re-embedding. Store thresholds with the representation and evaluation that justified them.

## Combine thresholding with a result budget

Top-k controls how many candidates are requested or returned; a threshold controls which scores are acceptable under the configured search. If many records qualify, the application still needs a policy for limits and subsequent processing. For ANN-based execution, candidate coverage can affect which qualifying items are discovered.

For deduplication, use range retrieval as a candidate step, then validate the duplicate rule. A similarity interval does not prove that two documents are interchangeable. Small changes in numbers, permissions, or instructions can matter even when their vectors are very close.

## Calibrate on positive and negative cases

Build a labeled set of clear matches, hard negatives, and unsupported queries. Measure missed useful records and incorrectly accepted records as the threshold changes. Compare ANN and exact results on identical eligible data and queries to separate threshold choice from candidate loss. If using a smaller corpus, run both systems on that same subset and label the evaluation accordingly.

Test filters, empty results, boundary scores, and dense groups with more matches than the requested limit. Define the user experience when no acceptable match exists. Range search is valuable when it implements a measured task policy, rather than supplying an arbitrary number that merely makes a demonstration look selective.

## Example to test

Calibrate a similarity threshold on reviewed positive and negative pairs, then inspect results near the boundary. Top-k limits and threshold semantics still matter. A calibrated threshold from one model or metric should not be reused after migration.

## From concept to implementation

- [Configure Milvus range-search semantics](https://milvus.io/docs/range-search.md).
- [Check score direction for your chosen metric](https://milvus.io/docs/metric.md).

## Continue learning

- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [How does MINHASH_LSH help find near-duplicate text?](/ai-quick-reference/what-is-minhash-lsh)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Milvus range-search semantics](https://milvus.io/docs/range-search.md)
- [Score direction for each metric](https://milvus.io/docs/metric.md)
