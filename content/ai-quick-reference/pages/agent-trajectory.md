---
slug: "what-is-an-agent-trajectory"
title: "What is an agent trajectory, and how should you represent it for retrieval?"
topic: "rag-agents"
order: 75
---

An agent trajectory is an ordered record of an agent interacting with a task and environment. It can include observations, tool calls, externally visible actions, results, and outcome labels. It is useful for debugging, evaluation, retrieving prior experience, and preparing eligible training data.

## Preserve the execution before summarizing it

Keep the authoritative event sequence in a store suited to replay and audit. Build searchable records that point to that sequence. A natural-language summary is useful for discovery, but it can omit a decisive tool error or misstate the relationship between an action and its outcome.

A practical application schema might include trajectory ID, step ID, parent or branch ID, task ID, policy revision, environment revision, tool name, timestamps, result references, and outcome status. These are suggested fields, not a prescribed Milvus or training-framework API.

## Choose the searchable unit

Whole-episode embeddings help locate broadly similar tasks. Step or short-window embeddings can recover a specific failure, observation, or recovery action. Keep both connected by stable IDs when the workload needs each level.

Index authorized task descriptions, observations, and action summaries that are useful for the intended retrieval. Avoid making raw secrets or irrelevant sensitive payloads part of the embedding text. Preserve exact tool arguments and evidence in the governed source when appropriate rather than expecting an embedding to reconstruct them.

## Keep branches and outcomes interpretable

Retries, parallel tool calls, and alternative attempts can make wall-clock ordering insufficient. Record causal relationships and attempt identity. Distinguish a successful tool execution from a successful overall task, and retain incomplete or failed outcomes with explicit labels.

Validate an example trajectory by reconstructing its sequence and linking every retrieved window back to the original evidence. Evaluate retrieval across successful and failed episodes. Milvus can help discover related records; the application and training framework still determine execution semantics, replay validity, rewards, and which records are fit for learning.

## Continue learning

- [How can vector search retrieve useful agent trajectories?](/ai-quick-reference/how-to-retrieve-agent-trajectories)
- [What is a rollout in agent training, and where can vector search help?](/ai-quick-reference/what-is-a-rollout-in-agent-training)
- [What lineage metadata should connect source data, embeddings, and training sets?](/ai-quick-reference/data-lineage-for-embeddings-and-training)
- [How do working, episodic, semantic, and procedural agent memory differ?](/ai-quick-reference/what-are-the-types-of-agent-memory)

## Implementation guides and sources

- [Agent execution, events, and training integration](https://github.com/microsoft/agent-lightning)
- [Define fields for searchable records](https://milvus.io/docs/schema.md)
- [Represent related elements in StructArray](https://milvus.io/docs/array-of-structs.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
