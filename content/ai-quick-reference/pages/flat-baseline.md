---
slug: "why-use-flat-search-as-an-ann-baseline"
title: "Why use a FLAT baseline when tuning an ANN index?"
topic: "retrieval"
order: 67
---

A FLAT search evaluates the vector comparisons over the eligible dataset rather than relying on an approximate candidate structure. It is useful as an exact-neighbor reference for evaluating ANN behavior. It also provides a simple serving option when the eligible dataset and workload make exhaustive comparison affordable.

![Control the workload before comparing performance](/images/ai-reference/benchmark.svg)

## Keep the baseline equivalent

Use identical stored vectors, query vectors, metric, normalization, top-k, and metadata filters. Ensure both runs see the same data state. A result difference caused by a changed corpus or omitted filter is not ANN approximation error.

For a large corpus, use a representative bounded evaluation where exact computation is feasible. Preserve the query slices and explain sampling limits. A tiny, easy sample can overstate the quality of an index intended for a heterogeneous production collection.

## Handle ties and result identity

If several records have equal or nearly equal distances around the top-k boundary, different valid orderings can affect a naive ID-overlap score. Define tie handling and numerical tolerances appropriate to the evaluation. Inspect whether duplicate source items create an artificially easy or unstable benchmark.

Exact vector neighbors are still a geometric reference, not a relevance judgment. If a poor embedding places the wrong documents nearest to the query, FLAT will reproduce that ordering accurately. Use judged application relevance alongside exact-neighbor recall to avoid tuning an index around an unsuitable representation.

## Use the result to choose the next fix

When FLAT finds the right evidence but an ANN index misses it, investigate candidate search effort, construction, quantization, and filters. When both retrieve the wrong evidence, inspect the model, chunking, source data, and query formulation first.

Record the baseline computation and resulting reference IDs with the benchmark artifacts. Recompute them when the representation or eligible corpus changes. This small discipline makes index experiments interpretable and prevents a faster configuration from being credited for a quality change caused by an unrelated dataset or metric difference.

## Example to test

Build exact ground truth after applying the same tenant and time eligibility rules as the ANN test. An unfiltered global top-k is not a valid ground truth for a filtered query, even if both searches use identical vectors.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)
- [When should you use range search instead of only top-k?](/ai-quick-reference/when-to-use-vector-range-search)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Milvus FLAT search](https://milvus.io/docs/flat.md)
- [Vector distance and score definitions](https://milvus.io/docs/metric.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
