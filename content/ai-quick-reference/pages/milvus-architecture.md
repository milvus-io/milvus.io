---
slug: "how-milvus-separates-ingestion-storage-and-search"
title: "How does the Milvus architecture separate ingestion, storage, and search?"
topic: "ecosystem"
order: 49
---

Milvus separates database responsibilities so ingestion, durable storage, indexing, and search can be managed as distinct parts of a retrieval system. This separation is useful for understanding both scaling and failures: an accepted write, an indexed segment, and a successful query represent different stages of work.

![Durable write is not yet a visible search result](/images/ai-reference/write-path.svg)

## Follow a record from write to result

An application sends data through the service's request path. The streaming write path records and processes changes, while data processing prepares persistent segments and indexes. Query execution searches the relevant growing and historical data and combines results for the client. Metadata and coordination determine which resources own the work.

The precise roles and deployment topology vary by Milvus release and deployment mode. Use the architecture guide for the running version. A logical component diagram does not necessarily imply that each role runs as an independent process in every installation.

## What runs inside the write path

Three internal components carry out the write-path stages described above. The Streaming Node processes incoming changes, maintains growing (not-yet-indexed) data, and recovers that state after a restart, so a record is often queryable through growing-segment search before it is fully indexed into a historical segment. Woodpecker is the write-ahead log underneath the streaming system: it durably orders and replays changes, either as a dedicated quorum-replicated service or as an embedded library, and its acknowledgment only guarantees the write was recorded, not that it is yet search-visible. Talon is an object-store caching layer that keeps frequently read bytes — index data, vectors, result payloads — on worker storage close to compute, which reduces cold reads during data processing and search without changing where the data is durably owned. None of the three determines query correctness on their own; they determine how quickly and reliably a write becomes a visible, servable result.

## Scale the stage that limits the workload

High ingestion volume can constrain the write path or index preparation before query CPU becomes busy. Search can be limited by index traversal, filtering, payload retrieval, or storage reads. Adding query capacity will not necessarily fix delayed source-to-search visibility if the constrained stage is elsewhere.

For a mixed workload, measure ingestion acknowledgment, data freshness, index backlog, search latency, and errors separately. Include the embedding service and client network when measuring the application's full response time. Those dependencies are outside the database execution path but can dominate the user's experience.

## Diagnose with a concrete trace

Choose one source record and follow its stable ID through ingestion, visibility, index readiness, and retrieval. Then choose one slow query and separate client waiting, server execution, and payload transfer. Correlate observations using the same time window and deployment configuration.

Test ordinary operations such as node replacement, index build, and data growth while queries continue. Record how each event changes latency and freshness. Architecture becomes useful when it identifies ownership and observable boundaries, rather than simply supplying more boxes in a diagram. This is also the basis for choosing a managed service: compare who operates each responsibility and how the required service behavior is verified.

## Example to test

Trace one inserted record from acknowledgment to query visibility and later recovery. Attach metrics to each boundary. This distinguishes a write backlog, indexing delay, and query bottleneck instead of calling every symptom slow search.

## From concept to implementation

- [Read the Milvus architecture overview](https://milvus.io/docs/architecture_overview.md).
- [Review component responsibilities](https://milvus.io/docs/main_components.md).

## Continue learning

- [How do you locate a bottleneck across Milvus components?](/ai-quick-reference/how-to-find-milvus-performance-bottlenecks)
- [What is Knowhere, and how does Milvus use it?](/ai-quick-reference/what-is-knowhere)
- [What does the milvus-storage project provide?](/ai-quick-reference/what-is-milvus-storage)
- [How can Attu help you inspect and manage Milvus?](/ai-quick-reference/what-is-attu)

## Implementation guides and sources

- [Milvus architecture overview](https://milvus.io/docs/architecture_overview.md)
- [Component responsibilities](https://milvus.io/docs/main_components.md)
- [Streaming service and WAL](https://milvus.io/docs/streaming_service.md)
