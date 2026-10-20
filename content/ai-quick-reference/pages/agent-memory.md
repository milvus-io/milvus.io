---
slug: "what-are-best-practices-for-structuring-agent-memory-in-milvus"
title: "How should you structure agent memory in Milvus?"
topic: "rag-agents"
order: 21
---

Agent memory is a retrieval system for information that should remain useful across interactions. Its design needs an authoritative record, a searchable representation, and rules for scope, correction, retention, and deletion. Keeping every generated sentence forever is not a memory policy.

## Decide what a memory means

Distinguish observed facts, user-provided preferences, task state, and model-generated summaries. Store a stable memory ID, owner or tenant, source, timestamp, version, and the text used for embedding. Preserve the underlying evidence when a summary may need verification or regeneration.

The memsearch project demonstrates one approach: Markdown files are authoritative and Milvus provides the retrieval index. Other applications may use a transactional database or object store as the source of truth. The important property is that the search representation can be rebuilt from governed records.

## Retrieve within the right scope

Apply tenant and user eligibility constraints consistently. Consider recency, validity, and explicit corrections alongside semantic similarity. A highly similar obsolete memory should not override a newer authoritative fact. Retrieved text is data for the application, not permission to change its instructions or access controls.

Define what happens when a user corrects or deletes a memory. The source record, embedding, caches, and derived summaries may all require updates. Use stable IDs and version fields to make these transitions observable and testable.

## Evaluate behavior over time

Test recall of relevant memories, retrieval of outdated facts, cross-user leakage, and the usefulness of the final context. Include repeated corrections, conflicting sources, and queries after deletion. Measure the latency of memory retrieval separately from the agent's tool execution. Start with a narrow memory class that has a clear retention rule, then expand when its behavior is understood.

## Continue learning

- [How do working, episodic, semantic, and procedural agent memory differ?](/ai-quick-reference/what-are-the-types-of-agent-memory)
- [How should an agent memory system handle corrections, expiry, and deletion?](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory)
- [What is an agent trajectory, and how should you represent it for retrieval?](/ai-quick-reference/what-is-an-agent-trajectory)
- [What is retrieval-augmented generation (RAG)?](/ai-quick-reference/what-is-rag-retrievalaugmented-generation-in-nlp)
- [How do metadata filters interact with vector search?](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance)
- [How do you handle incremental updates in a vector database?](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)
- [What does eventual consistency mean for vector search?](/ai-quick-reference/what-is-eventual-consistency)

## Implementation guides and sources

- [memsearch design philosophy](https://github.com/zilliztech/memsearch/blob/main/docs/design-philosophy.md)
- [Agent memory with Milvus](https://milvus.io/docs/basic_memory_with_milvus.md)
- [Filter memory retrieval](https://milvus.io/docs/filtered-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
