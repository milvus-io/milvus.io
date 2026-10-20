---
slug: "how-can-milvus-search-iceberg-tables"
title: "How can Milvus search an Apache Iceberg table?"
topic: "lake"
order: 40
---

Milvus 3.0 can use an Iceberg external source through Storage V3. The documented source contract includes an Iceberg metadata JSON file and a selected snapshot ID. Milvus resolves the snapshot's data files and builds its retrieval view while the source table remains externally managed.

![Shared source data, explicit serving lifecycle](/images/ai-reference/lake.svg)

## Begin with a committed table state

An Iceberg table is more than a directory of Parquet objects. Its metadata determines which files and deletions belong to a snapshot. Pointing a reader at an arbitrary object prefix can include removed files or omit changes that the table metadata would describe.

Select a committed snapshot containing the required identifiers, embedding column, and filter fields. Check compatible data types, vector dimensions, source credentials, and the Milvus release. Create the external collection and indexes according to the current guide, then refresh and monitor the resulting view. A catalog name alone is not a substitute for the documented source metadata.

## Check deletion compatibility before production

The current Storage V3 guide supports position-delete metadata and explicitly excludes equality deletes from the external integration. Equality deletes must be converted to a supported position-delete representation before refresh. This is a Milvus connector limitation; it should not be mistaken for a limitation of Iceberg itself.

For example, removing a customer by key in the source table is not sufficient evidence that every serving reader has removed that customer's rows. Verify the delete representation, the selected snapshot, refresh completion, and the application's observable results. Coordinate source-file retention with readers that still reference earlier states.

## Test the integration as a release pipeline

Use a small fixture with known IDs, an append, both relevant delete behaviors, and a schema addition. Compare source snapshot membership with Milvus results, including filtered searches and payload retrieval. Measure refresh-to-serving delay and cold storage reads alongside query latency.

Keep the table writer, metadata publication, Milvus refresh, and application rollout as separate observable steps. This allows a stale result to be traced to the correct boundary and provides a rollback route when a new table version or embedding representation fails evaluation.

## Example to test

Record the intended Iceberg source state, expose it through the supported external-source workflow, and verify sampled IDs after a source update. Table metadata and Milvus serving visibility have separate lifecycles; a source commit does not by itself prove the search view is current.

## From concept to implementation

- [Check the supported external-source workflow](https://milvus.io/docs/create-an-external-collection.md).
- [Connect retrieval with batch preparation](https://milvus.io/docs/integrate_with_spark.md).

## Continue learning

- [When should you use a Milvus external collection?](/ai-quick-reference/when-to-use-milvus-external-collections)
- [How should you refresh a Milvus external collection safely?](/ai-quick-reference/how-to-refresh-milvus-external-collections)
- [How should deletions propagate from a data lake to vector search?](/ai-quick-reference/how-to-propagate-lake-deletions-to-vector-search)
- [How do Lance, Iceberg, and Parquet play different roles in a vector lake?](/ai-quick-reference/lance-iceberg-parquet-for-vector-data-lakes)

## Implementation guides and sources

- [Iceberg support and delete limitations](https://milvus.io/docs/storage-v3.md)
- [External collection configuration](https://milvus.io/docs/create-an-external-collection.md)
- [Iceberg table and snapshot specification](https://iceberg.apache.org/spec/)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
