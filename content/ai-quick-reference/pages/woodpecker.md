---
slug: "what-is-woodpecker"
title: "What is Woodpecker's role in the Milvus write path?"
topic: "ecosystem"
order: 51
---

Woodpecker provides ordered, durable write-ahead logs for databases and stateful applications. In Milvus, the WAL is part of the ingestion and recovery path: it records changes that the streaming system can process and replay. It serves a different responsibility from the vector index that answers similarity queries.

## Match the deployment mode to the contract

The current Woodpecker project documents a dedicated service mode and an embedded Go-library mode. Service mode uses LogStore nodes with quorum-based replication and local staging before completed segments move to object storage. Embedded mode runs the engine in the application with its configured backend and dependencies.

Use the release and integration requirements for the deployed Milvus version. The existence of multiple modes does not mean their acknowledgment timing, resource footprint, or failure behavior is interchangeable. Avoid selecting a mode from a throughput number without examining its durability and latency contract.

## Keep write acceptance separate from search freshness

A durable log acknowledgment says something about the recorded write under the configured contract. The application's ability to retrieve that record also depends on subsequent processing and the chosen consistency behavior. Measure source-to-search visibility separately from append latency.

Similarly, a log is not an independently usable historical database backup. Recovery depends on retained log positions, persistent database state, metadata, and the supported replay procedure. Establish which failures the deployment is designed to survive and exercise them.

## Test realistic failure and retention behavior

Run representative batches and concurrent writes, then interrupt a writer or a LogStore node. Check acknowledged records after recovery, duplicate handling after client retries, reader progress, and the effect of object-store delays. Include the backlog and resource costs of catching up.

Monitor append latency, errors, replay lag, retention, and storage traffic alongside application freshness. Keep the write path's configuration with every benchmark result. Woodpecker can reduce or reorganize WAL infrastructure dependencies, but its value should be assessed through the complete ingestion-and-recovery workflow rather than through an isolated storage benchmark.

## Continue learning

- [What does the Milvus Streaming Node do?](/ai-quick-reference/what-is-milvus-streaming-node)
- [How does the Milvus architecture separate ingestion, storage, and search?](/ai-quick-reference/how-milvus-separates-ingestion-storage-and-search)
- [What does eventual consistency mean for vector search?](/ai-quick-reference/what-is-eventual-consistency)
- [What is Talon, and when can object-store caching help vector workloads?](/ai-quick-reference/what-is-talon)

## Implementation guides and sources

- [Woodpecker modes and current release guidance](https://github.com/zilliztech/woodpecker)
- [Woodpecker in Milvus](https://milvus.io/docs/woodpecker_architecture.md)
- [Milvus streaming and recovery](https://milvus.io/docs/streaming_service.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
