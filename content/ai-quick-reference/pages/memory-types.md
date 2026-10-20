---
slug: "what-are-the-types-of-agent-memory"
title: "How do working, episodic, semantic, and procedural agent memory differ?"
topic: "rag-agents"
order: 73
---

Agent memory is easier to govern when each record has a defined purpose. A useful design taxonomy separates immediate task state, past episodes, reusable facts, and procedures. These categories can share retrieval infrastructure while requiring different authority and update rules.

## Choose a record contract for each class

| Memory class | Example | Main design question |
| --- | --- | --- |
| Working state | Current task, pending tool result | What belongs in this execution's context? |
| Episodic memory | A previous support investigation | Which past event is relevant now? |
| Semantic memory | A confirmed user preference or domain fact | Which source and revision make it authoritative? |
| Procedural memory | An approved troubleshooting workflow | Who can revise or authorize the procedure? |

This is an application design taxonomy, not a fixed Milvus schema or a guarantee that every framework uses the same names. Define the metadata and lifecycle your application needs.

## Use retrieval selectively

Working state often belongs in the execution or checkpoint store because exact current values matter. Longer-term records can use vector and keyword retrieval to locate relevant evidence. Keep a stable source ID so the application can fetch the authoritative content and verify its revision.

A past successful action is evidence about one episode. It does not automatically become an instruction that the agent may execute again. Similarly, a model-generated summary of a preference should remain distinguishable from the user's explicit correction.

## Evaluate authority and usefulness

Test situations with a recent correction, an outdated successful procedure, conflicting facts, and similar episodes from another user. Enforce scope filters before content enters the agent's context. Include source revision, validity, and explicit status in selection rather than ranking only by embedding similarity.

Measure whether each memory class improves task completion and reduces repeated work. Remove classes that accumulate cost or confusion without useful behavior. The goal is a small set of inspectable memory contracts, with retrieval acting as a discovery mechanism inside those contracts.

## Continue learning

- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)
- [How should an agent memory system handle corrections, expiry, and deletion?](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory)
- [What is an agent trajectory, and how should you represent it for retrieval?](/ai-quick-reference/what-is-an-agent-trajectory)
- [When is a semantic cache useful, and how do you prevent stale answers?](/ai-quick-reference/what-is-a-semantic-cache)

## Implementation guides and sources

- [A Milvus memory retrieval example](https://milvus.io/docs/basic_memory_with_milvus.md)
- [Governed source records and a derived retrieval index](https://github.com/zilliztech/memsearch/blob/main/docs/design-philosophy.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
