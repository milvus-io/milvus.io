---
slug: "how-to-refresh-milvus-external-collections"
title: "How should you refresh a Milvus external collection safely?"
topic: "lake"
order: 42
---

Refreshing an external collection advances Milvus's view of externally managed data. It is a publication boundary between a source dataset and a searchable serving state. Treating refresh as an unobserved background command makes stale or incomplete search results difficult to diagnose.

## Separate the stages of readiness

A producer first commits a valid source state. Milvus then processes source metadata through the documented refresh operation, whose progress is monitored asynchronously. Search also depends on the relevant data and indexes being ready for the intended queries. Do not equate an accepted job request with application readiness.

Record the source dataset version or snapshot, target collection, refresh job identifier, start and completion times, schema revision, and validation outcome. A user-visible freshness metric should measure the interval from source publication to successful retrieval of that source state, rather than just the duration of the metadata call.

## Publish only coherent source updates

Finish data-file writes and commit the table metadata before initiating refresh. If the embedding job writes some files successfully and fails on others, a directory listing may not represent an intended dataset release. Use the source system's supported publication contract and preserve enough history to retry safely.

When a new column is needed, confirm its compatibility and follow the external-schema workflow. When rows are removed, check the source format's supported delete semantics. The current guide also documents a denial for a refresh that would remove all active metadata without insertions; explicitly test an empty-source transition instead of assuming it succeeds.

## Verify before exposing the result

Maintain canary IDs covering new, unchanged, corrected, and deleted records. Run direct lookups or queries and representative filtered searches after refresh. Confirm the expected model revision and source payload, not only an approximate row count.

Serialize or otherwise coordinate refresh triggers for one dataset so that a delayed retry cannot silently publish an unintended state. Retain source files while supported readers still need them, and define how to return to a known-good view. The objective is a traceable release of data into retrieval, with failures that are visible and recoverable.

## Example to test

Prepare a source update containing an append, replacement, and deletion. Record the source state, refresh operation, and query-visible state. A source commit and a serving refresh are separate checkpoints in the application's freshness budget.

## From concept to implementation

- [Check the supported external-source workflow](https://milvus.io/docs/create-an-external-collection.md).
- [Connect retrieval with batch preparation](https://milvus.io/docs/integrate_with_spark.md).

## Continue learning

- [When should you use a Milvus external collection?](/ai-quick-reference/when-to-use-milvus-external-collections)
- [How should deletions propagate from a data lake to vector search?](/ai-quick-reference/how-to-propagate-lake-deletions-to-vector-search)
- [How do you make vector-search and training experiments reproducible?](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)

## Implementation guides and sources

- [Asynchronous refresh and progress](https://milvus.io/docs/create-an-external-collection.md)
- [Schema changes and refresh](https://milvus.io/docs/alter-external-collection-schema.md)
- [Source snapshot retention and maintenance](https://iceberg.apache.org/docs/latest/maintenance/)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
