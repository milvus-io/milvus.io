---
slug: "how-to-select-rollouts-for-offline-training"
title: "How should you select rollouts for an offline agent-training dataset?"
topic: "rag-agents"
order: 78
---

A rollout is one execution of an agent policy on a task: the model calls, tool interactions, and intermediate results collected before the episode reaches an outcome. Agent-training frameworks (GRPO-style trainers, async rollout/trainer pipelines) generate and score rollouts at scale, but that generation and scoring machinery is not where a vector database fits. Selecting an offline rollout dataset from that pool is a data-curation problem with a learning objective. A useful set can include successful behavior, informative failures, and coverage of important task types. Taking only the highest-scoring or most similar episodes can produce a narrow and misleading training distribution.

## Define eligibility before ranking

Require usable source traces, valid task identity, known policy and environment revisions, and a reviewed outcome signal. Separate tool infrastructure failures from policy mistakes where the learning objective needs that distinction. Keep incomplete attempts explicitly labeled instead of silently interpreting them as low-quality behavior.

Exclude prohibited or evaluation-only tasks before candidate search. Group related attempts from one task and inspect near-duplicate episodes so repeated retries do not dominate the dataset. Preserve the original outcome labels even when a later reviewer adds another assessment.

## Use embeddings to discover coverage

Embed task descriptions, observation windows, or failure summaries to locate underrepresented regions and related behaviors. Combine similarity with structured filters for task family, tool version, and outcome. Inspect candidate clusters manually to confirm that the representation captures meaningful behavior rather than formatting or repeated boilerplate.

A practical schema stores each rollout as one record: a vector field for the embedded task or trajectory summary, plus scalar fields for rollout ID, task ID, policy checkpoint or revision, outcome status, reward or score, and a near-duplicate or cluster ID. Diversity sampling then becomes a retrieval problem: run a similarity search against already-selected rollouts and reject or down-weight candidates above a similarity threshold, or cluster embeddings first and cap how many rollouts you draw from each cluster so one dominant task pattern cannot crowd out rarer ones. Deduplication works the same way, using a tighter threshold to catch near-identical retries rather than merely related tasks.

A selection manifest should record source trajectory IDs, inclusion reason, labels, weights if used, and the curation revision. This makes it possible to compare two selection policies on the same underlying experience store.

## Respect the optimization contract

An offline supervised or preference dataset and an on-policy reinforcement-learning batch have different requirements. Arbitrarily filtering online RL samples by a new vector score can alter the training distribution and break assumptions. Apply selection only through a workflow supported by the chosen algorithm and framework.

Evaluate selected data using held-out tasks, outcome coverage, and downstream model behavior. Keep contamination checks at task and near-duplicate levels. Retain a baseline dataset and change one selection policy at a time. The goal is a traceable improvement in learning or analysis, rather than an aesthetically tidy cluster of episodes with similar summaries.

## Example to test

Select successful and informative failed rollouts across task families, keeping outcome and selection reason. Exclude evaluation leakage and inaccessible evidence. A high reward from one verifier is not enough to establish a reusable training example.

## From concept to implementation

- [Build a bounded agent retrieval loop](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md).
- [Related application story: Read AI](https://zilliz.com/customers/read-ai).

## Continue learning

- [How can vector search retrieve useful agent trajectories?](/ai-quick-reference/how-to-retrieve-agent-trajectories)
- [How can embeddings improve dataset diversity sampling?](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings)

## Implementation guides and sources

- [Rollout and trajectory integration](https://github.com/microsoft/agent-lightning)
- [Algorithm-specific training data requirements](https://huggingface.co/docs/trl/grpo_trainer)
- [Group retrieved candidates by identity](https://milvus.io/docs/grouping-search.md)

