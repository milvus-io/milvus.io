---
slug: "what-is-milvus-storage"
title: "What does the milvus-storage project provide?"
topic: "ecosystem"
order: 54
---

milvus-storage is an open-source columnar storage engine, built on Apache Arrow, that defines how Milvus lays out and versions data on object storage. It provides readers and writers, a manifest-based transaction layer, support for Parquet, Vortex, and (read-only) Lance files, and bindings for C++, Python, Java/Scala, and Rust. Inside Milvus it is the implementation of the storage engine called **Loon**, which Milvus 3.0 exposes as **Storage V3**.

In short: Knowhere is how Milvus searches vectors, and milvus-storage is how Milvus stores the rows behind them. The rest of this page explains what problem it solves, how its design works, and what changes when you turn Storage V3 on.

![Storage readers follow a committed manifest. milvus-storage is a storage layer; Knowhere serves vector-index algorithms.](/images/ai-reference/storage-manifest.svg)

## Why did Milvus need a new storage engine?

Earlier Milvus releases stored each sealed segment as per-field binlog files on object storage. That works well for append-and-search, but AI datasets keep changing shape in ways that layout handles poorly:

- **Adding a column is expensive.** Re-embedding a corpus with a new model, or adding a sparse BM25 field, should not require rewriting every existing scalar and text column. With row-oriented or whole-segment layouts it often does.
- **Two access patterns fight each other.** Analytics and training jobs want wide, compressed scans across millions of rows. Vector search wants the opposite: after ANN picks a few hundred IDs, fetch exactly those rows' payloads as cheaply as possible. A single file layout tuned for one penalizes the other.
- **Data gets copied everywhere.** Spark, Ray, and evaluation pipelines tend to export their own copies, so the "source of truth" fragments across systems.

milvus-storage is the answer to all three: separate physical layout from logical identity, record every dataset version explicitly, and let different columns use different file formats.

## How does milvus-storage work?

The design has three ideas that build on each other.

**Column groups.** A dataset's fields are split into physically separate groups, each written in the format that suits its access pattern. Scalar fields that are filtered and scanned can live in Parquet; vector and other point-read-heavy fields can live in Vortex, a format with adaptive encodings designed for fast random access. The column-group policy can be a single group, one group per schema-defined set, or size-based.

**Stable row identity.** Every column group is aligned on the same row IDs. That shared coordinate system is what makes it possible to add a new vector column without touching existing groups, and to read only the groups a query needs.

**Manifests and transactions.** Each version of a dataset is described by an immutable manifest that lists its column groups, delete logs, statistics, indexes, and references to external objects. Writers commit by producing a new manifest, with versioning and conflict resolution handled by the transaction layer, so readers always see a consistent snapshot. Versioned manifests are also what make cheap point-in-time snapshots possible.

Underneath sits a filesystem layer with built-in support for S3 and S3-compatible stores, Google Cloud Storage, Azure Blob Storage, Aliyun OSS, Tencent COS, and Huawei Cloud OBS, plus predicate pushdown and buffer management in the column-group reader.

## What does Storage V3 change in Milvus?

Storage V3 is milvus-storage integrated into Milvus 3.0. It is what enables several 3.0 features:

| Capability | What Storage V3 contributes |
|---|---|
| [External collections](/ai-quick-reference/when-to-use-milvus-external-collections) | The manifest can reference data that Milvus does not own, so you can search Parquet, Vortex, Lance, or Iceberg data in place |
| Function-generated fields | Add a BM25 or MinHash field to an existing collection and backfill it asynchronously, without rewriting other columns |
| TEXT fields | Store long text without a fixed-length limit |
| Snapshots | Point-in-time, read-only collection views that reference existing segments instead of copying them |

Storage V3 is **off by default** in Milvus 3.0. You enable it with `common.storage.useLoonFFI: true`; collections with function-generated vector fields also need `dataCoord.compaction.bumpSchemaVersion.enabled` and `dataCoord.compaction.storageVersion.enabled` set to `true`. Once enabled, new writes and compaction output use the V3 layout, while existing data stays as it is until background compaction rewrites it, and Milvus can read both layouts during that transition.

The one rule to remember before flipping the switch: **after V3 data has been written, downgrading to a Milvus version that cannot read it is not supported**, and turning the setting off again does not make a downgrade safe. Treat enabling it as a one-way upgrade step, tested on a staging cluster first. The [version upgrade guide](/ai-quick-reference/milvus-version-upgrades) covers how to plan that.

## How much faster is it?

The Loon design post reports local benchmarks comparing Vortex with Parquet (1 MB row groups): fetching 1,000 random rows took about 5.8 ms versus 144 ms, roughly 25x faster, and a full vector-column scan was about 6.8x faster. Treat those as directional. Real numbers depend heavily on object-storage latency, network, and cache state, and the gain matters most for the "fetch payloads after ANN" step rather than for the vector search itself.

When you measure on your own data, benchmark the two access patterns separately:

- **Projected batch scans**, such as an offline job reading IDs, one vector field, and a few labels across the whole collection.
- **Scattered row fetches**, such as returning `output_fields` for the top 100 hits of a search.

Record the Milvus version, storage setting, file layout, cache state, and object-storage backend with every result. Otherwise it is easy to mistake a warm cache for an encoding improvement.

## Can you use milvus-storage outside Milvus?

Yes, as a library. The repository is Apache-2.0 and builds with CMake 3.20+, a C++20 compiler, and Conan 2, and the Python, Java/Scala (JNI), and Rust (with DataFusion integration) bindings let Spark jobs or analytics tools read and write the same format. That is what makes it possible for a lake pipeline and a Milvus collection to share data rather than export copies; see [Arrow and Parquet in vector pipelines](/ai-quick-reference/how-arrow-and-parquet-fit-vector-data-pipelines) and [Lance, Iceberg, and Parquet in a vector lake](/ai-quick-reference/lance-iceberg-parquet-for-vector-data-lakes).

Keep one distinction clear: a capability in the library is not automatically a capability of your Milvus cluster. Which formats, readers, and features you can use through Milvus depends on the Milvus release and configuration, so follow the [Storage V3 guide](https://milvus.io/docs/storage-v3.md) for your version rather than enabling behavior from a library example.

## Related reading

- [How does the Milvus architecture separate ingestion, storage, and search?](/ai-quick-reference/how-milvus-separates-ingestion-storage-and-search)
- [What is Knowhere, and how does Milvus use it?](/ai-quick-reference/what-is-knowhere)
- [When should you use a Milvus external collection?](/ai-quick-reference/when-to-use-milvus-external-collections)
- [How should you separate hot vector serving from cold lake data?](/ai-quick-reference/how-to-design-hot-and-cold-vector-serving)
- [What is Vector Lakebase, and how does it connect a lake to vector search?](/ai-quick-reference/what-is-vector-lakebase)

To try it, read [Storage V3 in the Milvus docs](https://milvus.io/docs/storage-v3.md), enable it on a test deployment, and run through the [Milvus Quickstart](https://milvus.io/docs/quickstart.md) against it.

## Sources

- [milvus-storage repository: architecture, formats, and bindings](https://github.com/milvus-io/milvus-storage)
- [Storage V3 in Milvus](https://milvus.io/docs/storage-v3.md)
- [Why we built Loon, a storage engine for AI data](https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md)
- [Milvus release notes](https://milvus.io/docs/release_notes.md)
- [Apache Arrow columnar format](https://arrow.apache.org/docs/format/Columnar.html)
