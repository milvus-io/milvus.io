---
slug: "what-is-a-vector-data-lake"
title: "What is a vector data lake?"
topic: "lake"
order: 37
---

A vector data lake is a data lake in which embeddings are first-class columns: vectors live in open formats on object storage next to the raw objects they describe (documents, images, clips) and the metadata that explains them (source IDs, model revisions, labels). Batch jobs, analytics engines, and a vector search engine all read the same governed dataset instead of each keeping its own private copy. The lake is the system of record; a retrieval engine such as Milvus provides the indexes that make that data searchable in milliseconds.

![Shared source data, explicit serving lifecycle](/images/ai-reference/lake.svg)

## Why did the idea appear?

The first generation of RAG and semantic-search systems treated the vector database as the place embeddings were born and died. An embedding job read documents, wrote vectors straight into a serving index, and nothing else in the company could see them. That worked for one application, but it broke down as soon as several teams wanted the same vectors:

- A curation team wanted to scan billions of embeddings to deduplicate or sample training data.
- An evaluation team wanted to recompute recall against an older model revision.
- An analytics team wanted to join vector-derived clusters with business tables in SQL.

Copying the serving index into every one of those systems multiplies storage, creates drift, and makes deletion requests hard to honor. Lakehouse table formats such as Apache Iceberg, and AI-oriented formats such as Lance, made it practical to keep vectors in the lake once and let many engines read them.

## How is it different from a data lake, a lakehouse, and a vector database?

| | Classic data lake | Lakehouse | Vector database | Vector data lake |
| --- | --- | --- | --- | --- |
| Primary data | Files of any shape | Tables with transactions and snapshots | Indexed vectors plus scalar fields | Tables that include vector columns and links to raw media |
| Typical query | Batch scan | SQL over tables | Top-k similarity with filters | Both batch scans and similarity search over the same data |
| Latency | Minutes | Seconds to minutes | Milliseconds | Depends on which engine serves the query |
| Who owns writes | Producers | Table writers through a catalog | The database's ingest path | Lake producers; serving engines adopt published versions |

The key distinction is ownership. In a vector data lake the source of truth is the lake table, and the search engine is a consumer that builds indexes over it. A plain vector database owns its own data and is the only place those vectors exist.

## What belongs in a vector data lake?

Storing a `float32[768]` column in Parquet is the easy part. What makes the lake useful is the context that travels with each vector. For a clip-level video dataset, a minimal contract looks like this:

| Field or record | Why it matters |
| --- | --- |
| Stable object ID and segment boundaries | Resolve a match to the intended source event |
| Source revision and location | Reproduce the bytes used by a consumer |
| Encoder and preprocessing revision | Explain which vector space the record belongs to |
| Quality and selection decisions | Reconstruct curation rather than only the final subset |
| Ownership and access metadata | Enforce eligibility rules at query time |
| Consumer snapshot or refresh record | Explain which state a search or training job observed |

Two of these rows deserve emphasis. The encoder revision matters because vectors from different models live in different spaces and must never be mixed in one index. The stable ID matters because files in a lake are rewritten by compaction all the time; see [how to keep stable identities between lake data and vector search](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search).

## Which formats does a vector data lake use?

There is no single "vector lake format." Most designs combine layers:

- **File formats** such as Parquet (ubiquitous, scan-friendly) or Vortex (newer, with encodings aimed at faster random access) store the bytes.
- **Table formats** such as Iceberg or Lance add snapshots, schema evolution, and transactional commits on top of those files.
- **In-memory formats** such as Apache Arrow move columns between engines without serializing them row by row.

The trade-offs are covered in [how Lance, Iceberg, and Parquet play different roles](/ai-quick-reference/lance-iceberg-parquet-for-vector-data-lakes) and [how Arrow and Parquet fit vector pipelines](/ai-quick-reference/how-arrow-and-parquet-fit-vector-data-pipelines).

## What a vector data lake does not give you by itself

Files on object storage do not answer a nearest-neighbor query in 10 ms. A lake can hold the vectors, but low-latency retrieval still needs an ANN index (HNSW, IVF, DiskANN and so on), a process that keeps hot parts of that index in memory or on local disk, and a filtering engine that combines scalar predicates with similarity. Permissions, freshness, and deletion propagation also remain your design problems. The lake removes redundant copies of source rows; it does not remove the cost of indexes and caches.

## How does Milvus connect to a vector data lake?

Milvus 3.0 introduced Storage V3, a manifest-based storage layer, and **external collections**, which let Milvus index and search data that stays in your lake. According to the [Storage V3 guide](https://milvus.io/docs/storage-v3.md), an external collection can read four source types: Parquet and Vortex file directories, Lance datasets, and Iceberg tables (a metadata JSON file plus a snapshot ID). External sources are read-only: Milvus writes its own manifest describing which source rows it has indexed and never modifies or copies the source files. When the lake publishes new data, you call a refresh to bring Milvus's view forward.

Storage V3 is disabled by default and is enabled with `common.storage.useLoonFFI: true`; downgrading after enabling it is not supported, so try it on a non-production cluster first.

This gives you two ways to serve lake data:

1. **External collection** — the lake stays the only copy of source rows; Milvus holds indexes and its manifest. Best when the data is produced by batch pipelines and shared by many consumers. See [when to use a Milvus external collection](/ai-quick-reference/when-to-use-milvus-external-collections).
2. **Managed collection** — you import or stream a serving subset into Milvus, which then owns inserts, upserts, and deletes. Best when the application writes frequently or needs its own retention policy.

Many teams use both: the full historical corpus as an external collection for discovery and curation, and a smaller managed collection for the latency-critical product path.

## A first project to try

Pick one dataset with stable IDs and an existing evaluation set. Write it to Parquet or Iceberg with the ID, vector, model revision, and two or three filter fields. Create an external collection over it, build an index, refresh, and run your evaluation queries. Then change a handful of rows in the lake, publish a new snapshot, refresh again, and confirm that search reflects exactly the new state. That exercise surfaces the real questions (ID stability, refresh lag, delete handling) faster than any architecture diagram.

## Related reading

- [What is Vector Lakebase?](/ai-quick-reference/what-is-vector-lakebase)
- [How can Milvus search an Apache Iceberg table?](/ai-quick-reference/how-can-milvus-search-iceberg-tables)
- [How can Milvus search data stored in Lance?](/ai-quick-reference/how-can-milvus-search-lance-data)
- [What is data curation, and how can vector search help?](/ai-quick-reference/what-is-data-curation-for-vector-ai)

## Sources and next steps

- [Milvus Storage V3 and external source formats](https://milvus.io/docs/storage-v3.md)
- [Create an external collection](https://milvus.io/docs/create-an-external-collection.md)
- [Announcing Milvus 3.0](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md)
- [Lance open format](https://lance.org/)
- [Iceberg schema and partition evolution](https://iceberg.apache.org/docs/latest/evolution/)
- New to Milvus? Start with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md).
