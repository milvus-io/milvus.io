---
slug: "what-is-vector-lakebase"
title: "What is Vector Lakebase, and how does it connect a lake to vector search?"
topic: "lake"
order: 38
---

Vector Lakebase is the name Zilliz and the Milvus project use for an architecture that combines lake-native storage with high-performance vector retrieval over a single source of truth. Instead of loading every dataset into a separate vector database, data stays in open formats on object storage, and the same vectors can serve a production query, an interactive discovery session, and a large batch pipeline. It is an architecture built from concrete Milvus 3.0 capabilities, not a new file format or a standard.

![Shared source data, explicit serving lifecycle](/images/ai-reference/lake.svg)

## Where does the term come from?

Zilliz introduced Vector Lakebase in 2026 alongside Milvus 3.0, which its [launch announcement](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md) describes as making Milvus "lake-native." The word combines two familiar ideas: a **lake** (cheap, open, shared storage that many engines read) and a **base** in the database sense (indexes, query planning, and low-latency serving). [Zilliz Cloud](https://zilliz.com/cloud) is positioned as the fully managed version of the same architecture.

If you are new to the underlying concept, read [what a vector data lake is](/ai-quick-reference/what-is-a-vector-data-lake) first. A vector data lake describes how the data is organized; Vector Lakebase describes a system that serves and processes that data with one engine.

## How does it differ from a vector database or a lakehouse?

| | Vector database | Lakehouse | Vector Lakebase |
| --- | --- | --- | --- |
| Where source data lives | Inside the database | Open tables on object storage | Open tables on object storage, or managed Milvus storage |
| Strength | Millisecond similarity search | SQL analytics and governance | Similarity search plus batch and discovery over the same data |
| How lake data is searched | Copy it in first | Usually by exporting to a separate search system | External collections index it in place |
| Cost model | Index and data in fast tiers | Cheap storage, elastic compute | Hot indexes for serving, cold storage for the rest |

The pitch is that teams stop running a parallel stack: one copy in the lake for analytics and training, another in a vector database for search, with a synchronization job in between that drifts.

## What are the building blocks in Milvus 3.0?

Each part of the architecture maps to a documented feature you can test today:

- **Storage V3.** A manifest-based, versioned storage layer that organizes fields into column groups on object storage. For managed collections it can write Parquet (the default) or Vortex files. It is disabled by default and enabled with `common.storage.useLoonFFI: true` ([Storage V3 guide](https://milvus.io/docs/storage-v3.md)).
- **External collections.** Read-only collections whose rows stay in Parquet, Vortex, Lance, or Iceberg sources. Milvus builds indexes and a manifest, and you refresh it when the source changes ([create an external collection](https://milvus.io/docs/create-an-external-collection.md)).
- **Snapshots.** Point-in-time, read-only views of a collection that reference existing data and index files rather than copying them, useful for rollback, versioned experiments, and offline jobs ([snapshots](https://milvus.io/docs/snapshots.md)).
- **Spark integration.** The 3.0 announcement describes Milvus as a Spark DataSource V2 so Spark, Databricks, and EMR jobs can read from and write to Milvus; the [Spark connector guide](https://milvus.io/docs/integrate_with_spark.md) covers the connector's formats and bulk-insert path.
- **Tiered storage.** QueryNodes load only metadata at first and fetch field and index chunks on demand, which keeps large, mostly cold collections affordable ([tiered storage](https://milvus.io/docs/tiered-storage-overview.md)).

None of these require you to adopt the whole architecture. A team can start with one external collection over an existing Iceberg table and keep everything else unchanged.

## What does a Vector Lakebase workflow look like?

Follow one improvement through the system. An autonomous-driving team notices that its embedding model retrieves night-time scenes poorly.

1. **Discover.** Engineers search the full multi-year clip corpus, exposed as an external collection, for night scenes similar to a few failure examples.
2. **Curate.** A Spark job pulls the matching IDs, joins them with labels in the lake, and writes a versioned training set.
3. **Retrain and re-embed.** A new encoder produces a replacement vector column, added to the lake table.
4. **Evaluate.** The team compares old and new vectors against labeled queries, pinning both runs to fixed dataset versions so the comparison is reproducible.
5. **Publish.** Once the new representation wins, the serving collection is refreshed or rebuilt, and a snapshot of the previous state is kept for rollback.

Every step reads the same governed data. Nothing is exported to a side system and later forgotten, which is what makes deletion requests and audits tractable.

## Who owns what?

The architecture works when ownership is explicit:

| Decision | External-source route | Managed serving collection |
| --- | --- | --- |
| Authoritative edits | The lake writer (Spark, Flink, a table service) | The application, through Milvus insert/upsert/delete |
| Freshness | Source commit, then Milvus refresh and indexing | Milvus ingestion and the chosen consistency level |
| Data movement | Source rows stay in place | An explicit import or sync policy |
| Recovery | Re-point to a known source snapshot and refresh | Restore a Milvus snapshot or backup |

Neither column is universally cheaper. External sources avoid a second copy of source rows, but indexes, manifests, caches, and object-store requests still cost money, and cold reads from object storage are slower than local reads. Benchmark both against your real latency target.

## When is Vector Lakebase the right choice?

It pays off when several workloads need the same large dataset — serving, curation, evaluation, training — and keeping them in sync has become real work. Typical fits are multimodal corpora (video, images, documents) measured in billions of vectors, agent trace stores, and training-data pipelines.

A small application with a few million vectors, written by one service, gains little; a managed collection, or [Zilliz Cloud](https://zilliz.com/cloud), is simpler. Version requirements also matter: the lake features above are documented for Milvus 3.0.x, so older clusters need an upgrade plan first.

## Related reading

- [When should you use a Milvus external collection?](/ai-quick-reference/when-to-use-milvus-external-collections)
- [How do you make vector-search and training experiments reproducible?](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments)
- [How should you separate hot vector serving from cold lake data?](/ai-quick-reference/how-to-design-hot-and-cold-vector-serving)
- [How does the Spark-Milvus connector fit into an AI data pipeline?](/ai-quick-reference/how-spark-integrates-with-milvus)
- [What is a vector database, and when do you need one?](/ai-quick-reference/what-is-a-vector-database-and-why-is-it-important)

## Sources and next steps

- [Announcing Milvus 3.0: lake-native vector search](https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md)
- [Milvus external collections](https://milvus.io/docs/create-an-external-collection.md)
- [Storage V3](https://milvus.io/docs/storage-v3.md)
- [Collection snapshots](https://milvus.io/docs/snapshots.md)
- [Spark integration](https://milvus.io/docs/integrate_with_spark.md)
- Try the managed version on [Zilliz Cloud](https://zilliz.com/cloud), or run Milvus yourself with the [Quickstart](https://milvus.io/docs/quickstart.md).
