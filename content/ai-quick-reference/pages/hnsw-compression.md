---
slug: "hnsw-sq-pq-prq-tradeoffs"
title: "How do HNSW_SQ, HNSW_PQ, and HNSW_PRQ change the trade-offs?"
topic: "retrieval"
order: 62
---

Compressed HNSW variants combine graph navigation with a lower-cost vector representation. They address memory and computation requirements that ordinary HNSW can make expensive at large scale. The trade-off includes representation error, graph overhead, index preparation, and any higher-precision refinement stage.

![Treat compression as another approximation](/images/ai-reference/quantization.svg)

## Understand what is compressed

Scalar quantization reduces the precision used for vector coordinates. Product quantization encodes subvectors through learned codebooks. Product residual quantization uses additional residual modeling as described by the supported implementation. These methods change distance approximation; the HNSW graph still has its own storage cost.

Milvus exposes variants through separate index types and documented parameters. Check which quantization and refinement choices the deployed release supports. A compression label is not enough to derive the loaded-memory footprint or valid parameter combinations.

## Compare the full retrieval path

Hold the embedding model, vectors, metric, filters, and query set fixed. Compare ordinary HNSW and compressed variants at matched exact-neighbor recall. Measure graph construction time, loaded memory, search latency, and throughput.

Where refinement is supported, account for the representation it reads and the extra candidate work. Higher-precision rescoring can improve ordering among candidates, but it cannot recover a useful record that the preceding search never selected. Increasing candidate breadth and improving representation precision solve related but different problems.

## Include data distribution and updates

Inspect failures for rare domains, unusual vector norms, selective filters, and the tails of the query distribution. A quantizer trained or evaluated on an unrepresentative sample can produce a misleading average result. Include the workload's update and rebuild behavior in the experiment.

Select a configuration only after it meets the relevance and tail-latency requirements with enough memory headroom for normal operations. Document both the compact codes and the remaining structures in the estimate. The useful result is a quality-constrained capacity improvement, not a theoretical compression factor presented as a guaranteed reduction in total service cost.

## Example to test

Hold the graph and query workload as comparable as the supported index variants allow, then measure recall, memory, and build cost. If parameters differ, report them; a smaller index at a lower quality target is not an equal comparison.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)

## Implementation guides and sources

- [HNSW scalar quantization](https://milvus.io/docs/hnsw-sq.md)
- [HNSW product quantization](https://milvus.io/docs/hnsw-pq.md)
- [HNSW product residual quantization](https://milvus.io/docs/hnsw-prq.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
