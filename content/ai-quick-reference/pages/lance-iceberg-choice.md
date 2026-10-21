---
slug: "lance-iceberg-parquet-for-vector-data-lakes"
title: "How do Lance, Iceberg, and Parquet play different roles in a vector lake?"
topic: "lake"
order: 48
---

Parquet, Apache Iceberg, and Lance are not three competitors for the same job. **Parquet** is a columnar *file* format optimized for compressed, scan-heavy analytics. **Iceberg** is a *table* format that turns many data files (usually Parquet) into one table with snapshots, schema evolution, and atomic commits. **Lance** is both a file and a table format designed for AI data, with fast random row access, built-in versioning, and room for embeddings and media blobs. A vector lake often uses more than one of them.

![File formats and table layers solve different jobs. Choose an integration against its documented version and capabilities.](/images/ai-reference/lake-format-roles.svg)

## Side-by-side comparison

| | Parquet | Apache Iceberg | Lance |
| --- | --- | --- | --- |
| Layer | File format | Table format over data files (Parquet, ORC, Avro) | File format and table format |
| Main strength | Compression and column-pruned scans | Governed tables: snapshots, ACID commits, schema and partition evolution | Random access, versioning, multimodal data |
| Random row lookup | Weak: read a page or row group to get one row | Inherits the data file format's behavior | Strong: designed for point reads and sampling |
| Updates and deletes | Rewrite files | Copy-on-write or merge-on-read with delete files | Versioned commits with deletion support |
| Schema change | New files | Metadata-only, tracked by column IDs | Add columns without rewriting existing data |
| Vector and blob data | Stored as lists or binary, no special handling | Same as underlying files | Embeddings, images, audio, and video as first-class columns |
| Ecosystem | Nearly every data tool | Spark, Flink, Trino, DuckDB, warehouses and catalogs | Python AI stack (Pandas, Polars, PyTorch, Ray), DuckDB, Spark |
| Typical role in a vector lake | Interchange and bulk export | System of record for governed tables | Training, curation, and AI-native datasets |

The summary many practitioners use is "Iceberg for BI, Lance for AI." It is a reasonable starting heuristic, but the real deciding factor is who reads and writes the data.

## Why does random access matter so much for AI?

Analytics queries read a few columns across many rows, which is exactly what Parquet's row groups and column chunks are built for. AI workloads often do the opposite: fetch the 50 rows that a vector search returned, shuffle a training set by reading rows in random order, or sample 1% of a corpus. In Parquet, fetching one row means reading and decoding at least a page and usually more, so random access is expensive. Lance was designed so that point lookups stay cheap without giving up scan speed, which is why it has become popular for training-data and multimodal stores.

## Why does a table format matter?

A directory of Parquet files is not a table. Nothing says which files belong to the current version, how to delete a row, or how to add a column safely while a job is reading. Iceberg answers those questions with a metadata tree: a metadata JSON file lists snapshots; each snapshot points to manifests that list exactly which data files and delete files are live. That gives you atomic commits, time travel by snapshot ID, and schema evolution without rewriting data. For a vector lake that many teams share, those guarantees are usually worth more than raw read speed.

Lance provides its own table layer — dataset versions made of fragments — so it does not need Iceberg to be versioned. Iceberg, in turn, does not depend on Lance.

## How should you choose?

Work through these questions in order:

1. **Is there already a governed lakehouse?** If the company's tables live in Iceberg with a catalog, access policies, and Spark or Flink writers, keep embeddings there too. Adding an embedding column to an existing Iceberg table is cheaper than introducing a new governance domain.
2. **Is the dataset mostly consumed by AI jobs?** If the main readers are training loops, curation notebooks, and sampling jobs that need random access and media blobs, Lance is the stronger fit.
3. **Do you just need to move data?** For handing a batch of vectors from one system to another, or bulk-loading into a database, plain Parquet is the most portable choice.
4. **Do you need both?** Many teams keep business metadata in Iceberg and embeddings plus media in Lance, joined by a stable ID. That works as long as the ID is consistent in both; see [stable identities between lake data and vector search](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search).

## Where does Milvus fit?

None of these formats is a low-latency, high-concurrency vector search service on its own. Milvus 3.0 adds that layer through **external collections**, which index lake data without copying it. According to the [Storage V3 guide](https://milvus.io/docs/storage-v3.md), an external collection can read:

| Source | Milvus input | Notable limit |
| --- | --- | --- |
| Parquet | A directory or object-storage prefix | Milvus reads file metadata and row groups |
| Vortex | A directory or prefix | A newer columnar format; also available as a Milvus managed-storage format |
| Lance | A Lance dataset directory | Fragments are mapped into the Milvus manifest |
| Iceberg | Metadata JSON file plus snapshot ID | Position deletes supported; equality deletes must be converted first; not available on Azure Blob Storage |

So the format choice does not lock you out of serving. Choose the format that fits your writers and governance, then layer Milvus on top. Format-specific setup is in [searching Iceberg tables with Milvus](/ai-quick-reference/how-can-milvus-search-iceberg-tables) and [searching Lance data with Milvus](/ai-quick-reference/how-can-milvus-search-lance-data).

## Run a quick bake-off

If you are undecided, write the same 1–10 million representative rows (IDs, a vector column, a few metadata fields, a payload) into each candidate. Measure full-column scan throughput, the latency of fetching 100 random rows, the cost of adding a new embedding column, and the steps needed to delete one record and prove it is gone. Then create a Milvus external collection over each and compare search latency when returning only IDs versus returning payloads. A day of measurement usually settles the question.

## Related reading

- [What is a vector data lake?](/ai-quick-reference/what-is-a-vector-data-lake)
- [How do Arrow and Parquet fit into vector data pipelines?](/ai-quick-reference/how-arrow-and-parquet-fit-vector-data-pipelines)
- [What does the milvus-storage project provide?](/ai-quick-reference/what-is-milvus-storage)
- [How should deletions propagate from a data lake to vector search?](/ai-quick-reference/how-to-propagate-lake-deletions-to-vector-search)

## Sources

- [Parquet file format](https://parquet.apache.org/docs/file-format/)
- [Apache Iceberg table specification](https://iceberg.apache.org/spec/)
- [Iceberg schema evolution](https://iceberg.apache.org/docs/latest/evolution/)
- [Lance format overview](https://lance.org/)
- [Milvus Storage V3 external-source formats](https://milvus.io/docs/storage-v3.md)
- [Create an external collection](https://milvus.io/docs/create-an-external-collection.md)
