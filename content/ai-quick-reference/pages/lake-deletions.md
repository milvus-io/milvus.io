---
slug: "how-to-propagate-lake-deletions-to-vector-search"
title: "How should deletions propagate from a data lake to vector search?"
topic: "lake"
order: 46
---

Deleting an object from a source dataset and removing it from every retrieval result are separate observable events. A lake-to-search design needs an explicit deletion contract covering the source table, serving view, caches, and derived datasets.

## Identify every representation

One document can produce chunks, summaries, embeddings, reranker caches, training examples, and snapshots. Keep source-to-derived mappings so a correction or deletion can be applied to each relevant representation. An ANN result disappearing does not prove that its source payload or a previously exported dataset has been removed.

For a managed Milvus collection, use the supported delete workflow and verify visibility under the application's consistency requirements. For an external collection, the source owner performs the change and Milvus adopts a supported source state through refresh. These paths have different owners and should not share an assumed write contract.

## Check format-specific behavior

The current Milvus Storage V3 guide supports position deletes for Iceberg external sources and requires equality deletes to be converted before refresh. Test the actual table writer and delete representation. A successful source SQL command alone cannot establish serving compatibility.

Coordinate physical file cleanup with readers that still reference earlier table states. Premature removal can break a legitimate snapshot, while indefinite retention can conflict with an intended data-removal policy. Use the source system's retention mechanisms and document how exceptional removals affect reproducibility.

## Measure deletion completion end to end

Maintain canaries for a complete document, one chunk, one tenant, and one corrected record. Check direct queries, semantic searches, keyword retrieval, payload fetches, and application caches after the change. Include delayed jobs and retries that could accidentally reintroduce obsolete data.

Track the oldest unprocessed deletion and the time until serving and downstream exports satisfy the required policy. For strict removal requirements, explicitly address retained snapshots and training artifacts instead of promising that one live-index mutation covers them. A reliable design makes both the effective serving state and the remaining retained copies visible to their owners.

## Example to test

Delete a source object with several indexed chunks and cached answers. Verify that every derived representation stops serving it under the chosen visibility policy. File cleanup alone does not establish logical deletion in all consumers.

## From concept to implementation

- [Delete entities from a managed collection](https://milvus.io/docs/delete-entities.md).
- [Check external-source deletion compatibility in Storage V3](https://milvus.io/docs/storage-v3.md).

## Continue learning

- [How should you refresh a Milvus external collection safely?](/ai-quick-reference/how-to-refresh-milvus-external-collections)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)
- [How should an agent memory system handle corrections, expiry, and deletion?](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory)
- [How do you reproduce a vector search or training experiment later?](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments)

## Implementation guides and sources

- [External-source deletion compatibility](https://milvus.io/docs/storage-v3.md)
- [Refresh the external view](https://milvus.io/docs/create-an-external-collection.md)
- [Delete from managed collections](https://milvus.io/docs/delete-entities.md)
- [Iceberg deletion semantics](https://iceberg.apache.org/spec/)
