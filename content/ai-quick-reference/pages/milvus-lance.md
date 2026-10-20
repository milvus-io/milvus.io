---
slug: "how-can-milvus-search-lance-data"
title: "How can Milvus search data stored in Lance?"
topic: "lake"
order: 39
---

Milvus 3.0 documents a Lance external-source path through Storage V3. The source is a Lance dataset directory: Milvus reads dataset metadata, maps fragments into its manifest, and supplies indexing and search through an external collection. This connects Lance-formatted data to Milvus serving without first importing every source row into a managed collection.

![Shared source data, explicit serving lifecycle](/images/ai-reference/lake.svg)

## Keep the format and the serving system distinct

Lance is an open format and ecosystem for AI datasets. A product that uses Lance, including LanceDB, can add its own APIs, catalog, indexing, and service behavior. Compatibility with a Lance dataset is not a claim that Milvus can attach to every LanceDB deployment or share its internal indexes and transactions.

Begin with the dataset location and access contract. Confirm that the deployed Milvus release supports the source format and storage backend. Map the intended source fields into a Milvus schema, verify vector dimensions and metadata types, then use the documented external-collection workflow to prepare indexes and refresh the view.

## Preserve useful identities

For an image collection, keep an application-owned image ID, object URI, embedding revision, and any crop or frame coordinates. A fragment identifier or physical row position may change when a dataset is rewritten. It should not become the only durable identifier in bookmarks, labels, or training manifests.

The external source is read-only from this Milvus workflow. Perform dataset edits through its owning system, then refresh Milvus deliberately. Do not route ordinary application inserts or deletes to an external collection as though it were the source-of-truth writer.

## Validate a real update cycle

Test an append, a replacement, a deletion, and a dataset maintenance operation. Check returned IDs, source payloads, eligibility filters, and search quality after refresh. Measure the time until the application can use the new state, including any required index work and loading.

Compare this arrangement with copying a bounded serving subset into a managed collection. The external path is attractive when shared lake data and reduced synchronization are important; a separate serving copy can be easier when online writes, isolation, or a different retention policy dominate the workload.

## Example to test

Use application-owned IDs to resolve Lance-backed search hits before and after a source-file rewrite. Verify the exact format and release support. Reading a Lance dataset does not imply sharing another product's indexes, transactions, or service API.

## From concept to implementation

- [Create an external collection over a Lance source](https://milvus.io/docs/create-an-external-collection.md).
- [Check Lance support in Storage V3](https://milvus.io/docs/storage-v3.md).

## Continue learning

- [What is a vector data lake?](/ai-quick-reference/what-is-a-vector-data-lake)
- [How should you refresh a Milvus external collection safely?](/ai-quick-reference/how-to-refresh-milvus-external-collections)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)
- [How do Lance, Iceberg, and Parquet play different roles in a vector lake?](/ai-quick-reference/lance-iceberg-parquet-for-vector-data-lakes)

## Implementation guides and sources

- [Lance support in Storage V3](https://milvus.io/docs/storage-v3.md)
- [External collection setup and refresh](https://milvus.io/docs/create-an-external-collection.md)
- [Lance format and ecosystem](https://lance.org/)
