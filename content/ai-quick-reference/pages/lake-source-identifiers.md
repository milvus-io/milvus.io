---
slug: "how-to-keep-stable-ids-between-lake-data-and-vector-search"
title: "How do you keep stable identities between lake data and vector search?"
topic: "lake"
order: 43
---

A stable source identifier connects an ANN result to the object that users, labels, and downstream jobs actually mean. This relationship becomes especially important when a lake table is compacted, embeddings are replaced, or one document produces many searchable chunks.

## Separate logical identity from physical location

For a document corpus, keep a document ID, document revision, chunk ID, and chunk offsets. For video, retain the recording ID and time interval. A physical row number, file path, or Lance fragment position can change during maintenance, so use it as a location within a known dataset version rather than as the only business identifier.

A useful derived-record key can combine source ID, source revision, representation revision, and chunk position. Define the encoding and collision behavior in the producer. If the document is re-chunked, decide whether old derived IDs are retired or mapped to replacements instead of silently reusing them with different meanings.

## Preserve the source-to-search mapping

Milvus schema configuration determines which source fields become available to queries. Confirm primary-field behavior and supported types for the chosen managed or external path. Keep model and preprocessing revisions as explicit metadata so a returned vector can be traced to the job that created it.

For example, a legal clause result should recover the exact contract revision and section, while a training example should recover the exact media segment that was selected. An embedding match without a recoverable source is difficult to cite, label, or audit.

## Test maintenance and retry behavior

Build an identity fixture before scaling ingestion. Rewrite a source file, compact a table, replace one document, retry a failed embedding batch, and delete a source object. Verify that stable logical IDs continue to resolve and that obsolete derived IDs are handled according to policy.

Track counts at the source-object, derived-record, and searchable-record levels separately. A document can legitimately create several vector rows, so equality between those counts is usually the wrong invariant. Instead, verify uniqueness of the intended key and completeness of the mapping. This makes lake-to-serving reconciliation possible even when physical layouts and representations change independently.

## Continue learning

- [How can Milvus search data stored in Lance?](/ai-quick-reference/how-can-milvus-search-lance-data)
- [How can Milvus search an Apache Iceberg table?](/ai-quick-reference/how-can-milvus-search-iceberg-tables)
- [What lineage metadata should connect source data, embeddings, and training sets?](/ai-quick-reference/data-lineage-for-embeddings-and-training)
- [How do you handle incremental updates in a vector database?](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)

## Implementation guides and sources

- [Map external fields into a collection](https://milvus.io/docs/create-an-external-collection.md)
- [Primary-field behavior](https://milvus.io/docs/primary-field.md)
- [Table schema evolution](https://iceberg.apache.org/docs/latest/evolution/)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
