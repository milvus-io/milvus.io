---
slug: "milvus-cdc-and-migration"
title: "How do bulk migration, backup, and Milvus CDC differ?"
topic: "production"
order: 114
---

Bulk migration moves an existing dataset, backup and restore preserve a recoverable copy, and change data capture follows supported ongoing changes. These mechanisms solve related but different problems. Select a supported path for the source and destination versions, data types, and deployment modes before designing a cutover.

![Verify the dataset before switching traffic](/images/ai-reference/migration.svg)

## Establish the starting point

Record the source collections, schemas, primary keys, indexes, and a consistent baseline. Verify what the chosen tool includes: data, schema changes, collection operations, and deletes may have different support. A replica used for query serving is not automatically a backup or an independent cross-cluster migration target.

For a live application, define how the initial copy and later changes meet. Writes occurring during the copy must either be captured and replayed through a supported process or controlled during a maintenance window. Do not assume that running an import and starting a CDC process in any order produces a gap-free history.

## Validate before switching clients

Compare counts, sampled primary keys, field values, and known query results. Include inserts, updates, and deletes in a controlled test. Inspect synchronization lag and the tool's failure behavior, and verify which schema or operational changes require separate handling.

## Make cutover reviewable

Specify a final write boundary, catch-up condition, endpoint switch, and rollback plan. Keep the original source and recovery copy until acceptance criteria pass. Test retry and restart behavior without conflating successful request submission with completed replication. A migration is complete when the destination serves the intended data and the application can operate and recover there.

## Example to test

Migrate a bounded source set, apply a later update and deletion, then compare logical membership before cutover. Count matching rows and inspect sampled values; a connected CDC pipeline does not prove that the target is ready for traffic.

## From concept to implementation

- [Plan a supported backup and restore test](https://milvus.io/docs/milvus_backup_overview.md).
- [Distinguish ongoing synchronization from backup](https://milvus.io/docs/milvus-cdc-overview.md).

## Continue learning

- [How do you handle incremental updates in a vector database?](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)
- [How should you plan backup and recovery for a vector database?](/ai-quick-reference/how-do-vector-databases-handle-backup-and-restore-or-replication-for-very-large-datasets-and-what-impact-does-that-have-on-system-design-in-terms-of-time-and-storage-overhead)
- [What does eventual consistency mean for vector search?](/ai-quick-reference/what-is-eventual-consistency)
- [How do you choose and validate a Milvus version upgrade?](/ai-quick-reference/milvus-version-upgrades)

## Implementation guides and sources

- [Milvus CDC overview](https://milvus.io/docs/milvus-cdc-overview.md)
- [Milvus Backup overview](https://milvus.io/docs/milvus_backup_overview.md)
- [Milvus data import](https://milvus.io/docs/import-data.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
