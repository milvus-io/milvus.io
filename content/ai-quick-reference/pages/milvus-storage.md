---
slug: "what-is-milvus-storage"
title: "What does the milvus-storage project provide?"
topic: "ecosystem"
order: 54
---

milvus-storage is a columnar storage-engine project used for vector and analytical workloads. Its public architecture includes readers and writers, manifest-based data organization, and language bindings. It supplies a storage layer; Milvus integrates storage with indexing, distributed execution, and database APIs.

![Keep logical identity separate from file position](/images/ai-reference/format.svg)

## Distinguish a library capability from a database feature

The storage project can expose scan, projection, and row-access interfaces to its consumers. Whether an application can use a particular behavior through Milvus depends on the database release, configuration, and supported API. A new reader implementation in the library is not a release guarantee for every deployed Milvus cluster.

Milvus Storage V3 documents how managed and external data use a versioned layout. Follow that product-level guide for enabling features and understanding compatibility. Avoid changing internal storage flags or replacing native libraries based solely on a library example.

## Design around different reads

An offline embedding job may scan several columns over many records. A retrieval request may fetch a handful of source rows after ANN selects their IDs. Those patterns reward different file layouts, caching, and read aggregation.

Keep vector fields and large payload fields distinguishable in measurements. Projection can save work when unused columns are skipped, while scattered payload fetches can still incur many object-store reads. A storage format that compresses a full scan well may have a different random-access cost.

## Validate format and version transitions

Use fixtures covering identifiers, dimensions, nulls, nested fields, deletions, and schema revisions. Compare values through the supported reader paths. When changing formats, include existing files, newly written files, and maintenance output rather than testing only a new empty collection.

Benchmark scans and selected-row reads separately, then measure the full retrieval pipeline. Record the storage-engine revision, database version, file layout, cache state, and backend. This helps distinguish an encoding improvement from a cache effect or a change in how much data was returned. Evaluate storage changes through correctness and lifecycle behavior as well as throughput.

## Example to test

Compare a projected batch scan with fetching a few scattered source rows. Keep file layout and cache state recorded. These two access patterns exercise different costs, so one scan-throughput number cannot describe every retrieval workload.

## From concept to implementation

- [Add observability to the workflow](https://milvus.io/docs/monitor_overview.md).
- [Find community support and contribution channels](https://milvus.io/community).

## Continue learning

- [How do Arrow and Parquet fit into vector data pipelines?](/ai-quick-reference/how-arrow-and-parquet-fit-vector-data-pipelines)
- [When should you use a Milvus external collection?](/ai-quick-reference/when-to-use-milvus-external-collections)
- [How should you separate hot vector serving from cold lake data?](/ai-quick-reference/how-to-design-hot-and-cold-vector-serving)
- [What is Knowhere, and how does Milvus use it?](/ai-quick-reference/what-is-knowhere)

## Implementation guides and sources

- [Storage engine architecture and supported bindings](https://github.com/milvus-io/milvus-storage)
- [Storage V3 as exposed by Milvus](https://milvus.io/docs/storage-v3.md)
- [Arrow columnar representation](https://arrow.apache.org/docs/format/Columnar.html)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
