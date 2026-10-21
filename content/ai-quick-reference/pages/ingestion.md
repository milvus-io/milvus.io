---
slug: "what-are-the-main-phases-of-an-etl-process"
title: "How does ETL prepare data for vector search?"
topic: "data"
order: 23
---

ETL has three phases: **extract** data from its sources, **transform** it into the shape the destination needs, and **load** it into that destination. For vector search the same three phases apply, but the transform phase does much more work: it parses documents into clean text, splits them into chunks, attaches metadata, and runs an embedding model to turn each chunk into a vector. The load phase then writes those vectors and their metadata into a vector database such as Milvus, where they are indexed for similarity search. A good vector ETL pipeline also keeps running after the first load, applying updates and deletions so search results stay current.

![Version the representation before indexing it](/images/ai-reference/encoding.svg)

## Traditional ETL vs ETL for vector search

| | Traditional ETL (warehouse) | ETL for vector search |
|---|---|---|
| Typical sources | Databases, SaaS apps, event logs | Documents, web pages, tickets, images, plus database rows |
| Transform focus | Clean, join, aggregate, conform types | Parse, chunk, enrich with metadata, embed |
| Output unit | A row in a table | A chunk with a vector and scalar fields |
| Load target | Data warehouse or lake | Vector database collection with indexes |
| Main cost | Compute for joins and aggregations | Model inference for embeddings |
| What breaks quality | Bad joins, wrong types | Bad parsing, poor chunking, mixed embedding models |

The phases are familiar, but the failure modes are new. A warehouse load fails loudly when a type is wrong; a vector load succeeds happily with vectors computed from garbled text, and the damage only shows up as poor search results.

## Phase 1: Extract

Extraction pulls raw content from where it lives: object storage, file shares, wikis, CRMs, databases, and APIs. For vector search, capture identity and context at this point, because they cannot be reconstructed later:

- a stable `source_id` and a version or content hash
- the source location (URL, path, page number) for citations
- access-control attributes (owner, tenant, group) that queries will filter on
- timestamps for freshness filters

Record extraction failures instead of skipping them. An unreadable scanned PDF that silently disappears looks, from the search side, exactly like a topic the corpus never covered.

## Phase 2: Transform

### Parse and clean

Convert each format to text (or to images for visual models) while keeping structure such as headings, tables, and code blocks. Strip navigation chrome, cookie banners, and repeated headers and footers, which otherwise end up in every chunk and make unrelated chunks look similar. Remove exact duplicates here with a content hash; near-duplicates are covered in [embedding-based deduplication](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping).

### Chunk

Split documents into retrieval units sized for the embedding model and the downstream task, typically a few hundred tokens, with structure-aware boundaries (sections, paragraphs) and modest overlap. Give each chunk a deterministic ID such as `source_id#chunk_index` so reruns overwrite rather than duplicate. [How to choose chunk size for RAG](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications) goes deeper.

### Enrich

Attach the metadata the application will filter or group on: document type, product, language, date, tenant. In Milvus these become scalar fields with their own indexes, so they need to be correct and consistently typed now.

### Embed

Run the embedding model over each chunk in batches and record the model name and revision on every row. Query-time and ingest-time encoders must match exactly. You can run the model in your pipeline (GPU workers, an inference service) or, on Milvus 2.6 and later, declare a `TEXTEMBEDDING` function in the collection schema so Milvus calls the embedding provider during insert and search. For hybrid keyword and semantic search, Milvus can also derive BM25 sparse vectors from a text field with a built-in function, which removes another transform step. At large volumes the embed step dominates cost and time; [scalable embedding pipelines](/ai-quick-reference/how-to-build-distributed-embedding-pipelines) covers batching and parallelism.

## Phase 3: Load

### Design the schema first

The collection schema is the load contract. A typical RAG collection has:

```python
schema = client.create_schema(auto_id=False)
schema.add_field("chunk_id", DataType.VARCHAR, is_primary=True, max_length=128)
schema.add_field("source_id", DataType.VARCHAR, max_length=128)
schema.add_field("text", DataType.VARCHAR, max_length=8192)
schema.add_field("doc_type", DataType.VARCHAR, max_length=32)
schema.add_field("updated_at", DataType.INT64)
schema.add_field("embedding", DataType.FLOAT_VECTOR, dim=768)
```

Then create a vector index on `embedding` (HNSW, an IVF variant, or AUTOINDEX) with the metric the model was trained for, usually `COSINE`, and scalar indexes such as `INVERTED` on fields you filter on. [Choosing a vector index](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload) covers the index choice.

### Choose bulk import or streaming writes

| Load path | How | Use when |
|---|---|---|
| Bulk import | Write Parquet or JSON files (PyMilvus `BulkWriter` formats them), place them in the Milvus object-storage bucket, call `bulk_import` | Initial loads, backfills, re-embedding; up to 16 GB per file and 1,024 files per request |
| `insert` | Batched client writes | Append-only feeds where every key is new |
| `upsert` | Insert or replace by primary key | Incremental updates and retries |
| Spark connector | `df.write.format("milvus")` | Pipelines that already run on Spark |

Remember that `insert` does not check for existing primary keys, so a retried insert creates duplicates. For anything that can be re-run, prefer `upsert` with deterministic IDs.

### Verify the load

A completed import job means files were read, not that the data is correct. After loading, compare row counts with what the pipeline produced, fetch a sample of chunks by ID and check text and metadata, and run a handful of known queries to confirm the expected chunks come back. Remember that newly written data becomes visible according to the [consistency level](/ai-quick-reference/what-is-eventual-consistency) of the read: Bounded staleness by default, Session or Strong when a test must see its own writes immediately.

## Keeping the pipeline running: updates and deletes

Most sources change. After the first load, the pipeline becomes a sync job:

1. Detect changed sources by hash, timestamp watermark, or change-data-capture.
2. Re-chunk and re-embed only what changed.
3. Upsert the new chunks, then delete chunks for that `source_id` whose version is older (for example `client.delete(collection_name="kb", filter='source_id == "a1" and version < 4')`).
4. Delete all chunks for sources that disappeared.
5. Reconcile periodically: compare the source inventory with indexed `source_id`s and versions.

[Incremental updates in a vector database](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database) walks through this in detail. If the data already lives in a lakehouse table, a Milvus [external collection](/ai-quick-reference/when-to-use-milvus-external-collections) can skip parts of the copy step.

## What to monitor

Track parse failures, empty or tiny chunks, embedding errors, rows rejected at import, ingestion lag (source change to searchable), stale versions still indexed, and a small fixed set of canary queries. These separate "the evidence does not exist" from "the evidence has not arrived yet," which is the most common question when a RAG answer is wrong. Quality checks are covered in [how data quality affects vector retrieval](/ai-quick-reference/how-does-etl-help-improve-data-quality).

## Next step

Build the pipeline end to end on a small corpus first: the [Milvus Quickstart](https://milvus.io/docs/quickstart.md) and the [RAG tutorial](https://milvus.io/docs/build-rag-with-milvus.md) show extract, chunk, embed, and load in one notebook, and the [Milvus Bootcamp](https://milvus.io/bootcamp) has larger examples. When volumes grow, move the load step to bulk import.

## Sources and further reading

- [Milvus: collection schema](https://milvus.io/docs/schema.md)
- [Milvus: prepare source data](https://milvus.io/docs/prepare-source-data.md)
- [Milvus: import data](https://milvus.io/docs/import-data.md)
- [Milvus: insert entities](https://milvus.io/docs/insert-update-delete.md)
- [Milvus: embedding function overview](https://milvus.io/docs/embedding-function-overview.md)
- [Milvus: Spark connector](https://milvus.io/docs/integrate_with_spark.md)
- [Extract, transform, load (Wikipedia)](https://en.wikipedia.org/wiki/Extract,_transform,_load)
