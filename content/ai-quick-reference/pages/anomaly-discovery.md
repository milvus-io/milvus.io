---
slug: "vector-search-for-anomaly-discovery"
title: "Can vector neighborhoods help discover anomalies and novel cases?"
topic: "applications"
order: 99
---

Vector neighborhoods can help analysts discover unusual or previously unseen cases. A record far from typical neighbors may deserve review, but distance alone is not a calibrated anomaly probability. Its meaning depends on the representation, reference population, and definition of an important event.

## A concrete workflow in Milvus

One workable pattern: store each record's embedding in a `FLOAT_VECTOR` field, partitioned or scalar-filtered by a `reference_group` field (camera type, operating region, time window) so neighbor search never compares a record against an irrelevant population. Run `search` with `radius`/`range_filter` (range search) instead of a plain top-k query, so you get back every record outside a chosen distance band from its nearest neighbors rather than a fixed-size candidate list. A record whose k-th nearest-neighbor distance exceeds a threshold calibrated on the reference population is a candidate for review, not a confirmed anomaly.

Pair that with a scalar index (e.g., an `INVERTED` index on a `source_system` or `sensor_id` field) so you can combine the distance signal with a hard filter — exclude known-bad sensors, or restrict the anomaly scan to one deployment at a time — without re-embedding anything. Recompute the k-th-nearest-neighbor distance distribution periodically (it is a cheap aggregate over existing vectors) so the threshold tracks genuine population drift instead of silently going stale as new data accumulates.

## Define the reference population

Compare records within a relevant domain, time window, operating condition, or entity class. A rare-language document can look unusual in a mostly English corpus without being defective. A driving clip can be novel because of an unimportant camera change rather than a useful scenario.

Record the embedding model, metric, normalization, and reference dataset revision. Changing any of these can change apparent novelty. Preserve source metadata so an analyst can distinguish data corruption, a real rare event, and a representation failure.

## Use retrieval as an investigation tool

Inspect nearest neighbors, cluster membership, and structured signals together. Candidate generation can prioritize review or labeling, while a task-specific classifier or human process decides what counts as an anomaly.

Include missing and malformed representations in a separate data-quality path. Otherwise a failed embedding can appear as an interesting outlier and consume review effort. Keep the reason a record was selected and the evidence supporting its final label.

## Measure useful discovery

Build reviewed examples of important rare cases and ordinary variations. Evaluate how many useful cases are found within a fixed review budget, including false alarms and missed events. Compare with a random or stratified baseline.

Test distribution shifts and changes in source equipment, language, or traffic. Update the reference population deliberately instead of allowing novelty scores to change invisibly as data accumulates. A vector database can make neighborhood inspection interactive and repeatable; the useful result is better discovery and labeled evidence, not an unvalidated claim that geometric distance detects every operational failure.

## Example to test

An unusual night-driving clip can be far from daytime examples without being defective. Compare it with a relevant night-time population and ask reviewers whether it reveals a useful new condition rather than deleting it as noise.

## From concept to implementation

- [Build an evidence-backed RAG pipeline](https://milvus.io/docs/build-rag-with-milvus.md).
- [Find a runnable application starting point](https://milvus.io/bootcamp).

## Continue learning

- [How can embeddings improve dataset diversity sampling?](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings)

## Implementation guides and sources

- [Range search](https://milvus.io/docs/range-search.md)
- [Scalar filtering and index types](https://milvus.io/docs/filtered-search.md)
- [Interpret vector similarity](https://milvus.io/docs/metric.md)
- [Explore embedding groups](https://www.sbert.net/examples/sentence_transformer/applications/clustering/README.html)
