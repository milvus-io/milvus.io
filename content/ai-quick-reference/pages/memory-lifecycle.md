---
slug: "how-to-correct-expire-and-delete-agent-memory"
title: "How should an agent memory system handle corrections, expiry, and deletion?"
topic: "rag-agents"
order: 74
---

Give every memory record an explicit lifecycle instead of letting it live forever. **Corrections** should create a new record that supersedes the old one, with the old record marked inactive rather than left to compete on similarity. **Expiry** should be set per memory type: task state ends with the task, episodes age out on a TTL or decay, and confirmed facts last until something replaces them. **Deletion** must remove a memory everywhere it was copied: the source record, the vector index, caches, and any summaries derived from it. Milvus supports each step with upserts, filtered deletes, collection-level TTL, and (in Milvus 3.0) per-entity TTL.

## The lifecycle of one memory

A memory moves through a small set of states, and making them explicit is what keeps retrieval honest:

| State | Meaning | Visible to retrieval? |
| --- | --- | --- |
| `active` | Current and usable | Yes |
| `superseded` | Replaced by a newer record (link kept in `superseded_by`) | No, except for audit or history questions |
| `expired` | Past its TTL or decayed below a threshold | No |
| `consolidated` | Merged into a summary record | No; the summary is active |
| `deleted` | Erased on request | Must not exist in any store |

Store `status`, `created_at`, `last_accessed_at`, `expires_at` (if any), `supersedes` / `superseded_by`, and `source` on every record, and filter on `status == "active"` in every read. The base schema is described in [how to structure agent memory in Milvus](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus).

## How should corrections work?

When a user says "Actually, I moved to Berlin," the old "lives in Munich" memory is still a strong semantic match for questions about where they live. Recency weighting alone can lose to that similarity, so corrections need an explicit link.

1. **Detect the conflict.** At write time, search the user's active memories for high-similarity records of the same type and ask whether the new fact contradicts, refines, or duplicates them.
2. **Write the new fact** as a new record with `supersedes = <old_id>` and provenance pointing at the user's message.
3. **Retire the old fact** by setting its status to `superseded` and `superseded_by = <new_id>`. In Milvus, `upsert` on the old primary key rewrites the record with the new status.
4. **Invalidate dependents.** Summaries, cached answers, and profile documents built from the old fact should be regenerated or flagged.

Keep superseded records for a while if your product needs history ("where did I live before?") or audit; otherwise delete them after a grace period. Decide which source wins in a conflict: an explicit user statement should outrank a model's inference, and a verified system-of-record value should outrank both.

## How should memories expire?

Choose expiry per memory type, not one rule for everything:

| Memory type | Sensible default |
| --- | --- |
| Working state (pending tool result, current step) | Discard at the end of the task or session |
| Episodic (past conversations, task attempts) | TTL of weeks to months, extended when the memory is used again; or decay in ranking |
| Semantic facts (preferences, profile) | No TTL; changes only by correction or deletion; optionally a periodic "still true?" review |
| Procedural (approved workflows) | Versioned; old versions retired when a new one is approved |
| Cached answers derived from memory | Short TTL, plus invalidation on change |

**Hard expiry with Milvus TTL.** Setting the `collection.ttl.seconds` property makes each entity expire at its insert time plus the TTL. Expired entities stop appearing in search and query results immediately, and are physically removed during a later compaction. This suits a dedicated episodic or cache collection:

```python
client.alter_collection_properties(
    collection_name="episodic_memory",
    properties={"collection.ttl.seconds": 90 * 24 * 3600},   # 90 days
)
```

Milvus 3.0 adds entity-level TTL: designate a nullable `TIMESTAMPTZ` field (for example `expire_at`) through the `ttl_field` collection property, and each record expires at its own time; a null value means it never expires, and an upsert with a later timestamp extends it. Collection-level and entity-level TTL cannot be used on the same collection. Entity-level TTL is the better fit when one collection mixes memories with different lifetimes.

**Soft expiry with decay.** Many systems prefer memories to fade before they disappear. Multiply similarity by a recency factor such as `0.995 ^ hours_since_last_access` (the form used by Generative Agents), so unused memories sink in ranking, and run a periodic job that marks records `expired` once their decayed score stays below a threshold. Decay is reversible; deletion is not, so decaying first gives you time to notice mistakes.

## How do you consolidate instead of accumulating duplicates?

Long-running agents write many near-identical episodes ("user asked about export formats" twenty times). Periodically:

1. Group a user's active episodic memories by similarity (for example, a similarity search per record with a high threshold, or clustering).
2. Summarize each group into one record that keeps the important specifics and the date range.
3. Write the summary with `source` listing the original IDs, and mark the originals `consolidated`.

This keeps retrieval from returning five copies of the same event, reduces storage, and is how episodic memory gradually turns into semantic memory. The deduplication techniques are the same as in [embedding-based deduplication](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping).

## How do you delete a memory properly?

User deletion requests, including privacy regulations such as the GDPR right to erasure, require the data to be gone, not just hidden. Plan the full path:

1. **Source of truth.** Delete the governed record (database row, Markdown file, event log entry).
2. **Vector index.** Delete by ID or by filter in Milvus:

   ```python
   client.delete(collection_name="agent_memory", ids=["mem_8812"])
   client.delete(collection_name="agent_memory",
                 filter='user_id == "u_42" and memory_type == "episodic"')
   ```

   For "forget everything about me," a single filter on the partition-key field removes the user's records. Once the delete is visible at the read's consistency level, those entities are no longer returned; storage is reclaimed later by compaction.
3. **Derived data.** Regenerate or delete summaries, consolidated records, semantic-cache entries, and profile documents whose `source` includes the deleted ID. Storing provenance is what makes this tractable.
4. **Copies.** Account for backups, exports, analytics tables, and training datasets according to your retention policy.
5. **Verify.** Run the queries that used to retrieve the memory and confirm nothing comes back, including through summaries.

Deletion in an upstream lake or warehouse should flow through to the vector index the same way; see [propagating lake deletions to vector search](/ai-quick-reference/how-to-propagate-lake-deletions-to-vector-search).

## Mind consistency after writes

A correction written a moment ago must be visible to the next turn. Milvus defaults to Bounded staleness, which can briefly lag recent writes, and lets you set `consistency_level` per search or query. For memory reads right after a write from the same client, use `Session` (read-your-own-writes) or `Strong`, or keep the latest correction in working memory until it is searchable. See [eventual consistency in vector search](/ai-quick-reference/what-is-eventual-consistency).

## Tests worth automating

- Correct a fact, then ask about it in a new session: the new value wins.
- Correct it twice: only the latest is active.
- Let an episode pass its TTL: it no longer appears in search.
- Consolidate a cluster: one summary returns instead of many originals, and it cites them.
- Delete a user: no search, query, cache, or summary returns their data.

Start with the [Basic Memory with Milvus tutorial](https://milvus.io/docs/basic_memory_with_milvus.md) or [memsearch](https://github.com/zilliztech/memsearch), add the status and TTL fields above, and run these tests against a local Milvus from the [Quickstart](https://milvus.io/docs/quickstart.md).

## Related reading

- [How do working, episodic, semantic, and procedural agent memory differ?](/ai-quick-reference/what-are-the-types-of-agent-memory)
- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)
- [When is a semantic cache useful, and how do you prevent stale answers?](/ai-quick-reference/what-is-a-semantic-cache)
- [How do you handle incremental updates in a vector database?](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)
- [What does eventual consistency mean for vector search?](/ai-quick-reference/what-is-eventual-consistency)

## Sources

- [Set collection and entity TTL in Milvus](https://milvus.io/docs/set-collection-ttl.md)
- [Update indexed records with upsert](https://milvus.io/docs/upsert-entities.md)
- [Remove records from retrieval](https://milvus.io/docs/delete-entities.md)
- [Partition key in Milvus](https://milvus.io/docs/use-partition-key.md)
- [Consistency levels in Milvus](https://milvus.io/docs/consistency.md)
- [Authoritative memory and rebuildable indexes (memsearch)](https://github.com/zilliztech/memsearch/blob/main/docs/design-philosophy.md)
- [Park et al., Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
