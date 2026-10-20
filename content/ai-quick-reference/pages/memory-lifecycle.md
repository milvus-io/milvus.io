---
slug: "how-to-correct-expire-and-delete-agent-memory"
title: "How should an agent memory system handle corrections, expiry, and deletion?"
topic: "rag-agents"
order: 74
---

A memory system needs a lifecycle beyond insertion and similarity search. Facts can be corrected, preferences can change, and records can expire or be deleted. Define which source is authoritative and how every derived representation follows those changes.

![Correct memory through its derived representations](/images/ai-reference/memory.svg)

## Record validity explicitly

Keep memory ID, owner, source, revision, creation time, validity status, and any expiry or supersession relationship. Distinguish event time from processing time: a late-arriving old observation should not silently replace a more recent confirmed correction.

For example, if a user changes a preferred deployment region, keep the correction relationship so retrieval can exclude the obsolete value. A high semantic score for the old region is not a reason to restore it to the current profile.

## Update the source and its derivatives

Commit the authoritative change, then update or remove indexed text and embeddings through the supported workflow. Caches, summaries, and copied context can require separate invalidation. Preserve stable IDs and enough progress information to retry a failed synchronization without generating unrelated duplicate records.

The memsearch design illustrates a source-of-truth record with a rebuildable retrieval index. Other systems can use a transactional record store. The important property is a reconciliation path from current authoritative records to searchable data.

## Define the observable completion point

Measure when a corrected or deleted memory stops influencing new agent requests. Database mutation acknowledgment, search visibility, and expiration of application caches are different boundaries. Decide what should happen to already running tasks that hold an earlier memory version.

Test correction followed by a delayed ingestion retry, deletion followed by a rebuild, conflicting updates, and expiry during an active session. Query through the same tenant and validity filters used in production. Keep removed-content retention and audit requirements explicit rather than hiding old values in an unrestricted history collection.

A reliable lifecycle makes the current state explainable and lets the system prove that an obsolete memory cannot win merely because it is highly similar to the present query.

## Example to test

Correct a fact, then ask a paraphrased question that would previously retrieve the old value. Check source records, vectors, summaries, and caches. Record the time until every permitted retrieval path reflects the correction.

## From concept to implementation

- [Implement a scoped memory prototype](https://milvus.io/docs/basic_memory_with_milvus.md).
- [Inspect a source-backed memory implementation](https://github.com/zilliztech/memsearch).

## Continue learning

- [How do working, episodic, semantic, and procedural agent memory differ?](/ai-quick-reference/what-are-the-types-of-agent-memory)
- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)
- [How should deletions propagate from a data lake to vector search?](/ai-quick-reference/how-to-propagate-lake-deletions-to-vector-search)
- [What does eventual consistency mean for vector search?](/ai-quick-reference/what-is-eventual-consistency)

## Implementation guides and sources

- [Authoritative memory and rebuildable indexes](https://github.com/zilliztech/memsearch/blob/main/docs/design-philosophy.md)
- [Update indexed records](https://milvus.io/docs/upsert-entities.md)
- [Remove records from retrieval](https://milvus.io/docs/delete-entities.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
