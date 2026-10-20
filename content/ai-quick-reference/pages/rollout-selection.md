---
slug: "how-to-select-rollouts-for-offline-training"
title: "How should you select rollouts for an offline agent-training dataset?"
topic: "rag-agents"
order: 78
---

Selecting an offline rollout dataset is a data-curation problem with a learning objective. A useful set can include successful behavior, informative failures, and coverage of important task types. Taking only the highest-scoring or most similar episodes can produce a narrow and misleading training distribution.

## Define eligibility before ranking

Require usable source traces, valid task identity, known policy and environment revisions, and a reviewed outcome signal. Separate tool infrastructure failures from policy mistakes where the learning objective needs that distinction. Keep incomplete attempts explicitly labeled instead of silently interpreting them as low-quality behavior.

Exclude prohibited or evaluation-only tasks before candidate search. Group related attempts from one task and inspect near-duplicate episodes so repeated retries do not dominate the dataset. Preserve the original outcome labels even when a later reviewer adds another assessment.

## Use embeddings to discover coverage

Embed task descriptions, observation windows, or failure summaries to locate underrepresented regions and related behaviors. Combine similarity with structured filters for task family, tool version, and outcome. Inspect candidate clusters manually to confirm that the representation captures meaningful behavior rather than formatting or repeated boilerplate.

A selection manifest should record source trajectory IDs, inclusion reason, labels, weights if used, and the curation revision. This makes it possible to compare two selection policies on the same underlying experience store.

## Respect the optimization contract

An offline supervised or preference dataset and an on-policy reinforcement-learning batch have different requirements. Arbitrarily filtering online RL samples by a new vector score can alter the training distribution and break assumptions. Apply selection only through a workflow supported by the chosen algorithm and framework.

Evaluate selected data using held-out tasks, outcome coverage, and downstream model behavior. Keep contamination checks at task and near-duplicate levels. Retain a baseline dataset and change one selection policy at a time. The goal is a traceable improvement in learning or analysis, rather than an aesthetically tidy cluster of episodes with similar summaries.

## Continue learning

- [What is a rollout in agent training, and where can vector search help?](/ai-quick-reference/what-is-a-rollout-in-agent-training)
- [What is an agent trajectory, and how should you represent it for retrieval?](/ai-quick-reference/what-is-an-agent-trajectory)
- [How can vector search help detect train-test contamination?](/ai-quick-reference/how-to-detect-train-test-contamination)
- [How can embeddings improve dataset diversity sampling?](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings)

## Implementation guides and sources

- [Rollout and trajectory integration](https://github.com/microsoft/agent-lightning)
- [Algorithm-specific training data requirements](https://huggingface.co/docs/trl/grpo_trainer)
- [Group retrieved candidates by identity](https://milvus.io/docs/grouping-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
