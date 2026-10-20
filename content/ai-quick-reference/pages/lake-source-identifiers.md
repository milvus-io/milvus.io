---
slug: "how-to-keep-stable-ids-between-lake-data-and-vector-search"
title: "How do you keep stable identities between lake data and vector search?"
topic: "lake"
order: 43
---

Give every source record a business key that never changes, derive every chunk and embedding ID deterministically from that key, and store the key as a field on every vector row. Never use a file path, row number, or fragment position as an identity, because lake maintenance rewrites those constantly. With deterministic IDs, a re-ingest becomes an upsert to the same keys, a deletion becomes a filter on the source key, and any search hit can be traced back to the exact source revision that produced it.

![Keep logical identity separate from file position](/images/ai-reference/format.svg)

## Why do identities break in a lake?

Lake tables are rewritten all the time. Compaction merges small files, clustering reorders rows, and delete-file rewrites produce new data files. Each of these changes where a row physically sits while leaving what it means untouched.

Consider a support-ticket corpus. Ticket `T-48213` is embedded and indexed while it sits at `file_017.parquet`, row 4821. Overnight, compaction rewrites it into `file_112.parquet`, row 93. If anything — a saved search result, a relevance label, a training manifest — recorded the file-and-row position, it now points at nothing, or worse, at another ticket. If everything recorded `T-48213`, nothing broke. The position was only ever where the bytes happened to be.

Table formats differ in how much they help:

- **Parquet directories** have no row identity beyond position inside a file.
- **Iceberg** tracks columns by unique IDs, so renaming a column does not break readers, and format v3 adds row lineage with a `_row_id` field. Your own business key is still the most portable identity across engines.
- **Lance** offers stable row IDs within a dataset, but those belong to one dataset; a re-created dataset or a copy in another format will not share them.

## Design a deterministic ID scheme

Build IDs from things you can always recompute from the source:

| Level | Example key | Derived from |
| --- | --- | --- |
| Source object | `doc:8812` | The system of record's primary key |
| Source revision | `doc:8812@r5` | A version counter or content hash |
| Chunk | `doc:8812@r5#c003` | Revision plus chunk index, or a hash of the chunk's text |
| Embedding row | `doc:8812@r5#c003/bge-m3-v1` | Chunk ID plus encoder revision |

Choose how much of that to put in the primary key and how much in separate fields. A common pattern is to use the chunk ID as the primary key and store `source_id`, `source_revision`, and `model_revision` as scalar fields you can filter on. If you hash, use a stable function and document it; a hash that changes between library versions silently re-keys your corpus.

Decide what happens when a document is re-chunked. Either retire the old chunk IDs explicitly (delete by `source_id` before inserting the new revision) or map old chunks to their replacements. Never let a new chunk reuse an old ID with different content.

## How do you model this in Milvus?

Milvus primary keys can be `INT64` or `VARCHAR`. The [primary field guide](https://milvus.io/docs/primary-field.md) recommends `VARCHAR` when identifiers come from external systems, with `max_length` sized for your longest key; primary-key values cannot be null. For lake-sourced data, turn `auto_id` off and supply your own keys: an auto-generated ID is unique, but it cannot be recomputed from the source, so it cannot support idempotent re-ingestion or deletion by lineage.

For **managed collections**, write with `upsert()` keyed by the deterministic chunk ID. Re-running a failed batch then overwrites rather than duplicates, and removing a document is one call:

```python
client.upsert(collection_name="tickets", data=rows)  # rows keyed by chunk_id
client.delete(collection_name="tickets", filter='source_id == "T-48213"')
```

For **external collections**, map the lake's key column into the Milvus schema with `external_field`, for example `schema.add_field(field_name="ticket_id", datatype=DataType.VARCHAR, max_length=64, external_field="ticket_id")`, as described in the [external collection guide](https://milvus.io/docs/create-an-external-collection.md). Because external collections are read-only and refreshed from the source, a stable key in the source table is what lets you match results across refreshes. Note that you cannot remap `external_field` later, so pick the key column carefully at creation time.

## Keep the lineage fields next to the vector

A search hit is only useful if you can explain it. Store at least these fields on every vector row:

- `source_id` and `source_revision` — to fetch and cite the exact source.
- Chunk offsets or time ranges — to highlight the passage or play the right video segment.
- `model_revision` — vectors from different encoders must never be compared.
- Tenant or access fields — to enforce eligibility in filters.

A legal assistant needs to cite the exact contract revision and clause; a curation pipeline needs to know which video segment was selected for training. Without the lineage fields, neither is possible.

## Test identity before you scale

Build a small fixture and run the operations that break identities in real life:

1. Compact the source table and refresh or re-ingest.
2. Replace one document with a new revision.
3. Retry a failed embedding batch.
4. Delete a source object.

After each step, check that saved results still resolve to the same source object, that no duplicate chunk IDs exist, and that obsolete chunks were retired. Count at three levels — source objects, chunks, and vector rows — separately. One document legitimately creates many vectors, so equal counts are the wrong invariant; key uniqueness and complete mapping are the right ones.

## Related reading

- [How do you handle incremental updates in a vector database?](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)
- [How should deletions propagate from a data lake to vector search?](/ai-quick-reference/how-to-propagate-lake-deletions-to-vector-search)
- [How do you choose chunk size for RAG?](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications)
- [How can Milvus search data stored in Lance?](/ai-quick-reference/how-can-milvus-search-lance-data)
- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)

## Sources

- [Milvus primary field and AutoID](https://milvus.io/docs/primary-field.md)
- [Map external fields into a collection schema](https://milvus.io/docs/create-an-external-collection.md)
- [Iceberg schema evolution and column IDs](https://iceberg.apache.org/docs/latest/evolution/)
- [Apache Iceberg specification](https://iceberg.apache.org/spec/)
- [Lance format overview](https://lance.org/)
- Try the pattern on a small dataset with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md).
