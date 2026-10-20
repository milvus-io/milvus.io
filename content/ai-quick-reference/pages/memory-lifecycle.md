---
slug: "how-to-correct-expire-and-delete-agent-memory"
title: "How should an agent memory system handle corrections, expiry, and deletion?"
topic: "rag-agents"
order: 74
---

A memory record is not permanent by default. It has a lifetime shaped by how it was created, how often it is reinforced, and whether something newer has superseded it. Define that lifetime explicitly — TTL, decay, consolidation, and retirement rules — rather than letting every record persist until storage pressure forces a cleanup.

## Decide how a memory expires

Assign an expiry policy by memory class, not uniformly. A working-state record (a pending tool result) should expire when the task ends. An episodic record (a past support case) might expire on a fixed TTL unless referenced again. A semantic fact (a confirmed user preference) may have no TTL at all, only an explicit supersession event. Store creation time, last-referenced time, and an explicit expiry or review timestamp on every record so the policy is enforceable, not just documented.

## Decay relevance before deleting the record

Many systems want memories to fade gradually rather than disappear at a hard cutoff. A recency- or access-weighted score — multiplying similarity by a decay function of age or time since last retrieval — demotes stale records in ranking before they are ever deleted. This buys time to confirm a record is truly obsolete, and it separates "ranks lower now" from "removed from the store," which is a safer default than irreversible deletion on a timer.

## Consolidate instead of accumulating duplicates

Repeated episodes and incrementally refined facts tend to accumulate near-duplicate records over time. Periodic consolidation — merging a cluster of similar episodic records into one summary, or folding a corrected preference into the record it supersedes — keeps the store from growing indefinitely and keeps retrieval from surfacing five near-identical memories for one event. Preserve a link from the consolidated record back to the originals so the merge is auditable and reversible.

## Retire superseded memories explicitly

When a newer record replaces an older one, mark the old record's status rather than relying on recency alone to suppress it in ranking. A record that is superseded six months ago can still have a higher raw similarity score than yesterday's correction; status and supersession links are what make retrieval prefer the current fact over the stale one. Keep the retired record addressable for audit rather than hard-deleting it immediately, unless a deletion request requires otherwise.

## Example to test

Age a batch of episodic memories without new activity, run consolidation, then issue a query that used to match several of the originals. Confirm it now returns the consolidated record, and confirm an explicitly retired preference ranks below its replacement even when it remains the more similar embedding.

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
