---
slug: "hnsw-sq-pq-prq-tradeoffs"
title: "How do HNSW_SQ, HNSW_PQ, and HNSW_PRQ change the trade-offs?"
topic: "retrieval"
order: 62
---

Compressed HNSW variants combine graph navigation with a lower-cost vector representation. The compression math itself — how SQ, PQ, and PRQ form their compact codes and what bytes they save — is the same math used everywhere else in Milvus; [the quantization guide](/ai-quick-reference/what-is-vector-quantization-in-embeddings) covers it once. What's specific to HNSW is what compression does *inside the graph*: the distances a traversal uses to decide which edge to follow next become approximate, and that changes navigation quality in ways that don't show up in a pure IVF or flat-index compression analysis.

![HNSW hierarchical graph navigation](/images/ai-reference/hnsw.svg)

## Why compression hits graph navigation differently

HNSW's search quality depends on making the right greedy choice at each hop: from the current node, move to whichever neighbor is closest to the query. If the distances used for that choice are computed from compressed vectors, a wrong local choice can route the traversal away from the region that actually contains the true neighbor — not just mis-rank a candidate that was already found, but steer the walk somewhere else entirely. That is different from compression's effect in IVF or FLAT, where the candidate *set* is fixed first (by cluster membership or by being the whole corpus) and compression only affects scoring within that set. In a graph, compression can affect which nodes get visited at all.

This is why `HNSW_SQ`, `HNSW_PQ`, and `HNSW_PRQ` often pair compression with a refinement step that re-scores a shortlist using higher-precision vectors: refinement can repair ranking mistakes among nodes the traversal actually reached, but it cannot undo a navigation decision that skipped the right neighborhood in the first place. Construction-time parameters (`M`, `efConstruction`) and the compression choice therefore interact — a sparser graph is less forgiving of per-hop distance error than a well-connected one, because there are fewer alternative paths to the same destination.

## Compare the full retrieval path

Hold the embedding model, vectors, metric, filters, and query set fixed. Compare ordinary HNSW and compressed variants at matched exact-neighbor recall, and isolate the two failure modes: increase search-time `ef` to see whether the compressed graph recovers recall purely from exploring more nodes (a coverage problem), versus whether recall stays low regardless of `ef` (a navigation-quality problem caused by the compressed distances misrouting the walk). Measure graph construction time, loaded memory, search latency, and throughput for each variant — HNSW still stores its neighbor links regardless of which quantization method compresses the vectors, so total index size is never just the code size.

## Include data distribution and updates

Inspect failures for rare domains, unusual vector norms, selective filters, and the tails of the query distribution. A quantizer trained or evaluated on an unrepresentative sample can produce a misleading average result. Include the workload's update and rebuild behavior in the experiment.

Select a configuration only after it meets the relevance and tail-latency requirements with enough memory headroom for normal operations. Document both the compact codes and the remaining structures in the estimate. The useful result is a quality-constrained capacity improvement, not a theoretical compression factor presented as a guaranteed reduction in total service cost.

## Example to test

Hold the graph and query workload as comparable as the supported index variants allow, then measure recall, memory, and build cost. If parameters differ, report them; a smaller index at a lower quality target is not an equal comparison.

## From concept to implementation

- [Read how SQ, PQ, and PRQ form their codes and what they save](https://milvus.io/ai-quick-reference/what-is-vector-quantization-in-embeddings).
- [Configure HNSW_SQ, HNSW_PQ, and HNSW_PRQ parameters](https://milvus.io/docs/hnsw-prq.md).

## Continue learning

- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)

## Implementation guides and sources

- [HNSW scalar quantization](https://milvus.io/docs/hnsw-sq.md)
- [HNSW product quantization](https://milvus.io/docs/hnsw-pq.md)
- [HNSW product residual quantization](https://milvus.io/docs/hnsw-prq.md)
- [Milvus index structures and compression](https://milvus.io/docs/index-explained.md)
