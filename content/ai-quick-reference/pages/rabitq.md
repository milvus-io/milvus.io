---
slug: "what-is-ivf-rabitq"
title: "What is IVF_RABITQ, and how should you evaluate it?"
topic: "retrieval"
order: 63
---

IVF_RABITQ combines IVF centroid-based candidate selection with RaBitQ distance approximation. For the general quantization math shared across Milvus's compression methods — how SQ, PQ, and PRQ form their codes and what bytes they save — see [the quantization guide](/ai-quick-reference/what-is-vector-quantization-in-embeddings). This page focuses on what's specific to RaBitQ: a 1-bit-per-dimension code paired with an asymmetric distance estimator carrying a provable error bound, which is a different mechanism from classic PQ's learned-codebook approach.

![Treat compression as another approximation](/images/ai-reference/quantization.svg)

## What makes RaBitQ different from PQ

Product quantization learns a codebook of centroids per subvector and stores the ID of the nearest centroid — compression quality depends on how well the training sample's distribution matches production data, and distance estimates come from codebook lookup tables. RaBitQ instead normalizes each vector relative to its IVF centroid and encodes it as a *randomized* binary code: one bit per dimension, derived from a random rotation rather than a learned codebook. There is no training step that can overfit or drift from production data the way a PQ codebook can.

The other structural difference is in how the two methods estimate distances at query time. PQ reconstructs an approximate distance from codebook-ID lookups — effectively symmetric, since both the stored code and the query go through a similar quantized comparison. RaBitQ uses an *asymmetric* estimator: the query vector stays at full precision, and only the stored vector's binary code is compressed, with a correction term derived from the random projection recovering an estimate that has a provable bound on its error. That asymmetry is why RaBitQ's accuracy-per-bit is often better than naive 1-bit scalar quantization (plain sign-bit binarization) — RaBitQ's estimator corrects for information the sign bit alone throws away.

`IVF_RABITQ` layers this on top of IVF's centroid narrowing, so a quality problem can come from either stage: missing the right coarse cell (IVF's job) or estimating distance poorly from the binary code (RaBitQ's job) — build an exact-vector baseline and vary IVF search effort and refinement separately to tell which one is responsible. As a storage intuition, D binary code bits occupy D/8 bytes per vector versus 4D bytes for FP32 values — a 32x ratio for that payload alone — but actual Milvus index memory also includes centroids, codes/metadata, auxiliary correction terms, and any retained refinement vectors, so measure the loaded index rather than applying the payload ratio to total service memory.

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

- [Read the general SQ/PQ/PRQ/RaBitQ quantization math](/ai-quick-reference/what-is-vector-quantization-in-embeddings).
- [Configure IVF_RABITQ and its refinement options](https://milvus.io/docs/ivf-rabitq.md).

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
