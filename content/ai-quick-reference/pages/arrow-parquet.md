---
slug: "how-arrow-and-parquet-fit-vector-data-pipelines"
title: "How do Arrow and Parquet fit into vector data pipelines?"
topic: "lake"
order: 44
---

Apache Arrow and Apache Parquet are complementary columnar formats. **Arrow** is an in-memory format: uncompressed, cache-aligned column buffers that let embedding models, dataframes, and databases hand data to each other without row-by-row conversion. **Parquet** is an on-disk format: compressed, statistics-rich files that store embeddings and metadata cheaply in object storage. In a vector pipeline, data typically lives in Parquet at rest, is decoded into Arrow to be processed, and is written back to Parquet or loaded into Milvus.

![Keep logical identity separate from file position](/images/ai-reference/format.svg)

## Arrow vs Parquet at a glance

| | Apache Arrow | Apache Parquet |
| --- | --- | --- |
| Lives in | Memory, or IPC streams between processes | Files on disk or object storage |
| Optimized for | Fast computation and zero-copy sharing | Small size and selective reads |
| Compression | None by default (buffers are used as-is) | Per-page encodings plus codecs such as Snappy or Zstd |
| Typical lifetime | The duration of a job or request | As long as the dataset is retained |
| Random access | Constant-time by offset | Read and decode a page or row group |
| Typical role | Batch passing between encoder, dataframe, and loader | Embedding datasets in a lake, bulk import files |

So the useful question is not which one to pick but where each boundary sits: Parquet where data rests, Arrow where data moves and is computed on.

## How do you represent an embedding in each?

**In Arrow**, the natural type for a fixed-dimension vector is `FixedSizeList<float32>[d]`. Because every vector has the same length, Arrow stores all values in one contiguous child buffer and finds vector `j` at offset `j * d`; there is no offsets buffer. A variable-length `List<float32>` works too, but it adds an offsets buffer and lets malformed rows (a 767-dimension vector in a 768-dimension column) slip through. Prefer the fixed-size type when your tools support it.

**In Parquet**, vectors are stored as a repeated (list) column. Parquet compresses floats poorly compared with text, so an embedding column is usually the largest part of the file. A 768-dimension `float32` vector is 3,072 bytes; 100 million of them are about 307 GB before any metadata.

Whichever you use, keep the vector next to the context that explains it: a stable source ID, the model name and revision, and any eligibility fields used for filtering. Avoid serializing vectors as strings such as `"[0.12, 0.98, ...]"` for convenience. Parsing is slow and invalid values become hard to detect.

## How should you lay out Parquet files for vectors?

A Parquet file is split into **row groups**, each holding one **column chunk** per column, divided into **pages**; the footer metadata records where everything is and carries min/max statistics. That layout drives a few practical choices:

- **Column pruning is your friend.** A job that only needs IDs and metadata reads none of the vector bytes. Keep vectors in their own column rather than nested inside a struct with other fields.
- **Row-group size is a trade-off.** Large row groups compress better and scan faster; small ones make it cheaper to fetch a subset of rows. For scan-heavy embedding jobs, larger is usually better.
- **File size matters on object storage.** Thousands of tiny files multiply request overhead. Compacting into fewer, larger files speeds up both batch jobs and lake-native readers.

If you need frequent random row lookups, consider whether a format designed for that, such as Lance or Vortex, fits better; see [how Lance, Iceberg, and Parquet differ](/ai-quick-reference/lance-iceberg-parquet-for-vector-data-lakes).

## Where do Arrow and Parquet show up in Milvus?

**Bulk import.** Milvus can import Parquet and JSON files. The [data preparation guide](https://milvus.io/docs/prepare-source-data.md) shows the `BulkWriter` utility producing either `BulkFileType.PARQUET` or `BulkFileType.JSON`. Float vectors are lists of floats (or NumPy arrays), binary vectors are lists of 0/1 integers, sparse vectors are `{index: value}` dictionaries, and dynamic fields are packed into the reserved `$meta` JSON field. If `auto_id` is enabled, leave the primary-key column out of the files. The default `segment_size` for `LocalBulkWriter` is 512 MB.

**Managed storage.** In Milvus 3.0 with Storage V3, collection data is written as Parquet by default, with Vortex as an option via `dataNode.storage.format` ([Storage V3](https://milvus.io/docs/storage-v3.md)).

**External collections.** Storage V3 can also index Parquet files that stay in your lake. Milvus reads their metadata and row groups and records them in a manifest; nothing is copied. See [when to use an external collection](/ai-quick-reference/when-to-use-milvus-external-collections).

**Spark.** The [Spark connector](https://milvus.io/docs/integrate_with_spark.md) moves DataFrames, which are Arrow-friendly in PySpark, into Milvus by insert or bulk insert, and can read Milvus binlogs as Parquet-based data for offline analysis.

## A worked pipeline

1. Read source documents from Parquet into Arrow record batches (PyArrow, Polars, or Spark).
2. Run the embedding model on each batch and append a `FixedSizeList<float32>[768]` column.
3. Validate: every vector has the expected dimension, no NaNs, IDs are unique.
4. Write the batch to Parquet with the ID, vector, model revision, and filter fields in separate columns.
5. Either bulk-import those files into a managed Milvus collection, or register the directory as an external collection and refresh.

Before scaling up, round-trip a small fixture containing ordinary vectors, nulls in optional fields, unusual IDs (long strings, Unicode), and nested metadata. Read it back with the consumer's library and compare values, dimensions, and null handling. A file that opens is not the same as a file whose meaning survived.

## Related reading

- [What is a vector data lake?](/ai-quick-reference/what-is-a-vector-data-lake)
- [How should you design a scalable embedding-generation pipeline?](/ai-quick-reference/how-to-build-distributed-embedding-pipelines)
- [What does the milvus-storage project provide?](/ai-quick-reference/what-is-milvus-storage)
- [How does ETL prepare data for vector search?](/ai-quick-reference/what-are-the-main-phases-of-an-etl-process)

## Sources

- [Arrow columnar memory format](https://arrow.apache.org/docs/format/Columnar.html)
- [Parquet file organization](https://parquet.apache.org/docs/file-format/)
- [Prepare data for Milvus import](https://milvus.io/docs/prepare-source-data.md)
- [Milvus Storage V3](https://milvus.io/docs/storage-v3.md)
- [Spark-Milvus connector](https://milvus.io/docs/integrate_with_spark.md)
- Load your first vectors with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md).
