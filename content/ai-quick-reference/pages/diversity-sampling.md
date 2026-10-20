---
slug: "how-to-sample-diverse-data-with-embeddings"
title: "How can embeddings improve dataset diversity sampling?"
topic: "data"
order: 85
---

Diversity sampling selects examples that cover useful variation in a dataset rather than repeatedly drawing from the densest region. An IVF index's centroids give a cheap, already-computed way to see that density structure: if a dataset is already indexed in Milvus with an IVF-family index, the centroid assignments are a sampling signal, not just a search-time optimization.

## Use centroid membership as a sampling stratum

An IVF index partitions vectors into clusters around trained centroids so search can skip low-relevance regions. For diversity sampling, invert that purpose: group source records by the centroid (cluster ID) their vector was assigned to, then sample a bounded number of records per centroid instead of a flat random sample over the whole collection. A corpus with one dominant topic produces a few oversized centroid clusters and several small ones; capping the per-centroid sample directly caps how much that dominant topic can crowd out the rest.

This requires surfacing centroid assignment as something inspectable, either by running the clustering step that trained the index and keeping cluster IDs as a scalar field on each record, or by using range search against a centroid vector to retrieve its member set. Treat the resulting cluster ID as metadata for sampling and filtering, separate from the IVF index's internal structure used purely for search-time pruning.

## Choose the dimensions of coverage before sampling

A text embedding may organize topics well while missing document permissions or numerical differences relevant to the task. Combine centroid-based exploration with metadata filters on language, geography, task family, or outcome where those properties matter, and define mandatory coverage targets before sampling: a rare but important domain should not be discarded merely because it maps to a small cluster, and an isolated point outside any dense cluster can be noise rather than a valuable novel example.

## Build a reviewable selection policy

Sample within clusters using quality, provenance, and task constraints, not just position. Consider both within-cluster variation and the weight assigned across clusters so the final mix does not simply mirror the most common source. Preserve source IDs, the centroid ID each record was sampled from, and inclusion reasons in a manifest rather than saving only the sampled file.

## Compare coverage with downstream behavior

Review sampled examples from dense, sparse, and boundary clusters. Measure label yield, duplicate rate, domain retention, and the quality of the trained or retrieval system; a more evenly spread sample across clusters is not itself a useful result. Keep a random-sampling baseline under the same budget, and revisit cluster assignments when the embedding model changes, since retraining centroids on a new model can reshuffle which records count as representative of which cluster.

## Example to test

If one frequent scene dominates a video corpus already indexed with IVF, cap the selected share per centroid and inspect rare-scene coverage in the smaller clusters. Compare diversity against useful content and source provenance; maximizing distance from the nearest centroid alone can favor corrupted or irrelevant samples.

## From concept to implementation

- [Use IVF centroid structure as a sampling stratum, not only a search accelerator](https://milvus.io/docs/ivf-flat.md).
- [Store sampled cluster IDs as metadata for filtering and audit](https://milvus.io/docs/enable-dynamic-field.md).

## Continue learning

- [How are embeddings used in document clustering?](/ai-quick-reference/how-are-embeddings-used-in-document-clustering)
- [What is data curation, and how can vector search help?](/ai-quick-reference/what-is-data-curation-for-vector-ai)
- [How should you select rollouts for an offline agent-training dataset?](/ai-quick-reference/how-to-select-rollouts-for-offline-training)
- [Can vector neighborhoods help discover anomalies and novel cases?](/ai-quick-reference/vector-search-for-anomaly-discovery)

## Implementation guides and sources

- [Embedding-based clustering](https://www.sbert.net/examples/sentence_transformer/applications/clustering/README.html)
- [IVF index family and centroid structure](https://milvus.io/docs/ivf-flat.md)
- [Separate quality assessment from similarity](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/quality-assessment)
