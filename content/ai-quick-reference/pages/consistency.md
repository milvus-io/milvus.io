---
slug: "what-is-eventual-consistency"
title: "What does eventual consistency mean for vector search?"
topic: "production"
order: 28
---

Eventual consistency is a guarantee that if writes stop, every copy of the data will converge to the same latest value, but a read issued in the meantime may return an older state. In vector search, that means a document you just inserted, updated, or deleted might not be reflected in the very next search. Milvus lets you choose how much staleness to accept per collection or per request through four consistency levels: Strong, Bounded, Session, and Eventually.

![Durable write is not yet a visible search result](/images/ai-reference/write-path.svg)

## Eventual vs. strong consistency

The [term](https://en.wikipedia.org/wiki/Eventual_consistency) comes from distributed databases, popularized by Werner Vogels' work on Amazon's storage systems, and it sits on the availability side of the trade-off described by the CAP theorem. Strong consistency makes the opposite promise: once a write is acknowledged, every later read sees it.

| | Strong consistency | Eventual consistency |
| --- | --- | --- |
| Guarantee | Every read sees all writes acknowledged before it | Reads converge to the latest state once updates propagate |
| Read latency | Can wait for replicas or log replay to catch up | Answers immediately with whatever is available |
| Typical use | Read-after-write UX, permission revocation, correctness checks | Recommendations, analytics, large offline jobs |
| Failure mode | Slower or blocked reads under heavy writes | Users briefly see missing, outdated, or deleted results |

Between the two extremes sit useful middle grounds. **Bounded staleness** limits how far behind a read can be. **Read-your-writes** (also called session consistency) guarantees that a client sees its own writes, without forcing every other client to wait for them. Milvus implements both.

## Why do vector databases relax consistency?

A vector database splits work between components that ingest writes and components that serve searches. In Milvus, writes enter a log, and query nodes consume that log to keep their in-memory view of growing segments current. Serving a search from the query node's current view is fast; making the search wait until the query node has applied every write up to "now" costs time, and that cost grows with write volume.

For most retrieval workloads, a few hundred milliseconds of staleness are invisible to users, while the latency of waiting on every read is not. That is why Milvus defaults to Bounded rather than Strong.

## What are the four consistency levels in Milvus?

Milvus attaches a timestamp to every request called the guarantee timestamp (GuaranteeTs). Each query node tracks a ServiceTime, the point up to which it has applied all data. A query node runs a search only once its ServiceTime has reached the request's GuaranteeTs. The consistency level simply chooses which GuaranteeTs to send:

| Level | GuaranteeTs set to | What a read sees | Cost |
| --- | --- | --- | --- |
| Strong | The newest system timestamp | Every write acknowledged before the search | Highest wait under concurrent writes |
| Bounded (default) | Slightly earlier than the newest timestamp | Everything except, possibly, the most recent moments of writes | Small, bounded staleness, little waiting |
| Session | The timestamp of the client's own latest write | All of this client's own writes; other clients' recent writes may lag | Waits only for your own writes |
| Eventually | A minimal value, skipping the check | Whatever the query node has applied so far | No wait, lowest latency |

The [consistency guide](https://milvus.io/docs/consistency.md) defines these levels, and the [tuning guide](https://milvus.io/docs/v2.6.x/tune_consistency.md) shows how to set them.

## How do you set the consistency level?

Set a default when you create the collection, then override it per request where a particular call needs something different:

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="http://localhost:19530")

# Collection default
client.create_collection(
    collection_name="docs",
    schema=schema,
    consistency_level="Bounded",
)

# A read-after-write path: the user just uploaded a document
res = client.search(
    collection_name="docs",
    data=[query_vector],
    limit=5,
    consistency_level="Strong",
)

# A background job that can tolerate staleness
rows = client.query(
    collection_name="docs",
    filter='source == "crawler"',
    output_fields=["doc_id"],
    limit=100,
    consistency_level="Eventually",
)
```

Valid values are `"Strong"`, `"Bounded"`, `"Session"`, and `"Eventually"`, accepted on create, search, hybrid search, and query.

## Which level should you choose?

Start from the user-facing promise, not from the database setting:

- **"I uploaded a file, now answer questions about it."** Use Strong on that request, or Session if the same client instance did the write. Do not make every search in the app Strong just for this path.
- **Chat or agent memory**, where a turn must see the previous turn: Session works when the same client writes and reads; use Strong when writes come from a different service. See [structuring agent memory in Milvus](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus).
- **Access revocation or legal takedown**, where a deleted record must stop appearing: Strong on reads that enforce the rule, together with a filter on an eligibility field so revocation does not depend only on delete propagation. The [correction and deletion guide](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory) goes deeper.
- **Product search, RAG over a slowly changing corpus, recommendations**: Bounded, the default.
- **Batch scoring, evaluation runs, deduplication over a static snapshot**: Eventually.

## What else makes search results stale?

The consistency level covers only the gap between a write reaching Milvus and query nodes applying it. Other layers add their own delay:

- **Bulk import.** Rows added with `bulk_import()` stay invisible to search until the import job reports Completed, and a loaded collection then needs its load refreshed. No consistency level changes that.
- **Upstream pipelines.** Queues, batch embedding jobs, and ETL schedules decide when a change reaches Milvus at all. See [incremental updates](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database).
- **Application caches**, including a [semantic cache](/ai-quick-reference/what-is-a-semantic-cache) in front of the database, can serve an old answer even after the index is current.
- **Model drift.** A vector from an old embedding model can be perfectly visible and still wrong for today's query encoder.

## How do you test freshness?

Write a uniquely identifiable record, then search for it repeatedly and record when it first appears, under each level you plan to use. Repeat for an update and a delete. Run the test with a second client as well as the writing client, since Session only covers the writer, and run it while a realistic ingest load is flowing, because Strong's latency cost only shows up under concurrent writes. Report the measured latency of each level next to its staleness, then pick per request.

## Related reading

- [How does the Milvus architecture separate ingestion, storage, and search?](/ai-quick-reference/how-milvus-separates-ingestion-storage-and-search)
- [How do batching, latency, and throughput interact in vector search?](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search)
- [How do sharding and replication differ in a vector database?](/ai-quick-reference/how-do-distributed-vector-databases-handle-sharding-and-replication)
- [How do bulk migration, backup, and Milvus CDC differ?](/ai-quick-reference/milvus-cdc-and-migration)

Try the levels yourself with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), and watch read latency under write load with [Milvus monitoring](https://milvus.io/docs/monitor_overview.md). [Zilliz Cloud](https://zilliz.com/cloud) exposes the same consistency levels on managed Milvus.

## Sources

- [Milvus consistency levels](https://milvus.io/docs/consistency.md)
- [Tuning consistency in Milvus](https://milvus.io/docs/v2.6.x/tune_consistency.md)
- [Milvus data import](https://milvus.io/docs/import-data.md)
- [Eventual consistency (Wikipedia)](https://en.wikipedia.org/wiki/Eventual_consistency)
