---
slug: "how-to-retrieve-agent-trajectories"
title: "How can vector search retrieve useful agent trajectories?"
topic: "rag-agents"
order: 76
---

Trajectory retrieval finds previous agent experiences that may help with a current task or investigation. Similarity is a candidate signal: an episode with similar wording can still use an incompatible tool version, belong to another tenant, or end in failure.

## Filter for applicability first

Include environment, tool or schema revision, tenant, task class, and outcome metadata as needed. Some constraints are strict eligibility rules; others can be ranking features. Keep this distinction explicit so a model cannot use an attractive but inapplicable historical example.

For a coding agent, repository revision and test environment may determine whether a previous fix applies. For a support agent, product and document versions may matter more. Build filters from the current application's trusted context rather than relying on a generated search string to express every restriction.

## Retrieve at the right level

Use episode summaries to find related tasks and step windows to inspect specific transitions. Return enough neighboring events to interpret the retrieved action. A tool call without its observation and result can be misleading.

Avoid letting one long episode fill the entire candidate list. Where supported, grouping or an application-level diversity rule can select results from distinct trajectories. Then rerank by applicability and evidence quality, not only similarity. Preserve stable references so the agent or reviewer can inspect the original sequence.

## Evaluate transfer rather than resemblance

Create tasks where useful prior experience is known, including similar-looking negative examples. Measure whether retrieved trajectories improve completion, reduce tool cost, or accelerate debugging. Check cases with failed attempts, obsolete procedures, and contradictory outcomes.

Treat returned actions as historical evidence, not automatic execution authority. If a trajectory contains a command that changed production data, retrieval alone should not authorize repeating it. Track how examples influence the current plan and verify resulting actions under the current tool contract. The best retrieval policy finds applicable experience while preserving the distinction between remembering an event and deciding what to do now.

## Continue learning

- [What is an agent trajectory, and how should you represent it for retrieval?](/ai-quick-reference/what-is-an-agent-trajectory)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How should you select rollouts for an offline agent-training dataset?](/ai-quick-reference/how-to-select-rollouts-for-offline-training)
- [How should an agent memory system handle corrections, expiry, and deletion?](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory)

## Implementation guides and sources

- [Constrain candidate retrieval](https://milvus.io/docs/filtered-search.md)
- [Diversify results by a grouping field](https://milvus.io/docs/grouping-search.md)
- [Refine candidate relevance](https://milvus.io/docs/rerankers-overview.md)
- [Agent execution data context](https://github.com/microsoft/agent-lightning)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
