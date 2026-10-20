---
slug: "what-is-ivf-rabitq"
title: "What is IVF_RABITQ, and how should you evaluate it?"
topic: "retrieval"
order: 63
---

IVF_RABITQ combines IVF centroid-based candidate selection with RaBitQ distance approximation. RaBitQ is a binary vector-quantization method: it normalizes vectors relative to a centroid, encodes each D-dimensional vector as a D-bit code using a randomized binary codebook, and uses a corrected estimator to approximate distances. Milvus may optionally keep higher-precision refinement data. It is neither ordinary sign-bit binarization nor simply a conventional 1-bit scalar quantizer.

![Treat compression as another approximation](/images/ai-reference/quantization.svg)

## What the RaBitQ code represents

The code uses one bit per dimension as its compact core, but its distance estimator also relies on normalization and correction information. The research method gives an error bound for its estimator; that property does not by itself guarantee a particular application Recall@k. `IVF_RABITQ` adds a separate IVF stage that first narrows the centroid cells, so missing a cell and estimating distances poorly are distinct failure sources. Optional refinement uses a higher-precision representation for a shortlist and therefore costs additional memory.

As a storage intuition, D binary code bits occupy D/8 bytes per vector, compared with 4D bytes for FP32 values: a 32x ratio for those payloads alone. Actual Milvus index memory also includes centroids, codes/metadata, auxiliary correction terms, and any retained refinement vectors; measure the loaded index rather than applying the payload ratio to total service memory.

## Separate three sources of error

The embedding model determines whether vector neighbors are relevant to the application. IVF candidate selection determines which regions are searched. Quantized distance estimation affects the ranking of vectors considered by that search. A quality failure can originate at any of these stages.

Build an exact-vector baseline before comparing index configurations. Then hold the model and eligible dataset fixed while varying IVF search effort and supported refinement. This makes it possible to identify whether a change helps candidate coverage, distance accuracy, or neither.

## Interpret compression claims carefully

Compact vector codes are only part of an index. Cluster structures, IDs, metadata, auxiliary values, caches, and retained higher-precision data can contribute to memory and storage. Refinement can improve recall at an additional resource cost.

Measure the loaded configuration the application will use. Do not multiply a vector-code compression ratio across the entire database, and do not treat a theoretical quantization property as a guarantee of application relevance. Check dimensions, metric support, and parameter constraints in the current Milvus guide.

## Evaluate important query slices

Include common queries, rare entities, selective filters, and the intended top-k. Sweep search settings and record recall, judged relevance, latency percentiles, throughput, memory, and preparation cost. Retain individual failures when an important query group deteriorates despite an acceptable aggregate score.

Compare IVF_RABITQ with IVF_FLAT, another compressed candidate, and a graph index at matched quality. Use the simplest configuration that meets capacity and latency requirements with operational headroom. Re-run the evaluation when the model or corpus distribution changes, because the previous operating point may no longer describe the new representation.

## Example to test

Evaluate the supported IVF_RABITQ configuration against IVF_FLAT on the same query and filter mix. Keep refinement settings visible. Attribute a recall change to the full configuration rather than claiming that a quantizer name guarantees equivalence.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [How do IVF indexes use centroids to search vectors?](/ai-quick-reference/how-do-inverted-file-ivf-indexes-work-in-vector-databases-and-what-role-do-clustering-centroids-play-in-the-search-process)
- [What is vector quantization, and what does it trade off?](/ai-quick-reference/what-is-vector-quantization-in-embeddings)
- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus IVF_RABITQ representation and refinement](https://milvus.io/docs/ivf-rabitq.md)
- [IVF candidate selection](https://milvus.io/docs/ivf-flat.md)
- [Supported similarity metrics](https://milvus.io/docs/metric.md)
- [RaBitQ original paper and estimator](https://arxiv.org/abs/2405.12497)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
