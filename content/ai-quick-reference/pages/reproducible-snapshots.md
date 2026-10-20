---
slug: "how-to-reproduce-vector-search-and-training-experiments"
title: "How do you make vector-search and training experiments reproducible?"
topic: "lake"
order: 45
---

A reproducible retrieval or training experiment needs an identifiable dataset state and the configuration that interprets it. A timestamp in a notebook is insufficient when source documents, embeddings, filters, or evaluation labels can change independently.

## Capture the experiment boundary

Record the source dataset version, collection or external-source state, schema, embedding model revision, preprocessing, index configuration, and query set. Preserve evaluation judgments and the code that computes metrics. If payloads live outside the vector database, include their versioned locations as well.

Milvus snapshots capture point-in-time collection state through metadata and referenced files, with release-specific support and lifecycle rules. A snapshot should be treated according to that contract. It is not automatically an independently stored disaster-recovery backup, and it does not freeze an external document service that the application queries separately.

## Keep comparison variables separate

When evaluating a new embedding model, hold source documents and relevance judgments fixed first. When evaluating source-data improvements, keep the model fixed. Otherwise a better score cannot be attributed to the intended change. For index tuning, compare against an exact baseline over the same eligible records.

A training pipeline also needs a stable selection manifest: source IDs, revisions, split assignments, and any inclusion weights. If the dataset is regenerated after source compaction, verify that logical membership remains identical even when file locations differ.

## Make retention part of the experiment plan

Lake engines can expire snapshots and remove unreferenced files. Coordinate that maintenance with experiments, serving views, and rollback requirements that still rely on earlier data. Retain the needed source state using supported mechanisms rather than assuming that a saved metadata path keeps every referenced object alive indefinitely.

Re-run a small experiment from its recorded artifacts after the original environment has been removed. Compare membership, selected payloads, retrieval results, and computed metrics. This restoration exercise reveals missing dependencies more effectively than checking that a manifest file exists. The goal is an experiment that another engineer can reconstruct and explain, including its data and model boundaries.

## Example to test

Save source snapshot identity, embedding revision, eligibility rules, and index settings with each evaluation. Replay after a refresh and explain intentional membership changes. A timestamp in a report alone does not freeze all upstream systems.

## From concept to implementation

- [Check the supported external-source workflow](https://milvus.io/docs/create-an-external-collection.md).
- [Connect retrieval with batch preparation](https://milvus.io/docs/integrate_with_spark.md).

## Continue learning

- [What lineage metadata should connect source data, embeddings, and training sets?](/ai-quick-reference/data-lineage-for-embeddings-and-training)
- [How should you refresh a Milvus external collection safely?](/ai-quick-reference/how-to-refresh-milvus-external-collections)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)
- [How can vector search help detect train-test contamination?](/ai-quick-reference/how-to-detect-train-test-contamination)

## Implementation guides and sources

- [Milvus snapshot model](https://milvus.io/docs/snapshots.md)
- [Snapshot lifecycle](https://milvus.io/docs/manage-snapshots.md)
- [Retain and expire table snapshots](https://iceberg.apache.org/docs/latest/maintenance/)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
