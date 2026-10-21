---
slug: "how-to-select-rollouts-for-offline-training"
title: "How should you select rollouts for an offline agent-training dataset?"
topic: "rag-agents"
order: 78
---

To build an offline training set from agent rollouts, filter first, then select for quality and coverage. Keep only rollouts with a trustworthy outcome signal and known task, policy, and environment versions; remove evaluation tasks and near-duplicates; then choose examples so that every important task family is represented, using reward or verifier results for quality and embeddings for diversity. What you keep depends on the training method: successful trajectories for supervised fine-tuning (rejection sampling), matched success and failure pairs on the same task for preference methods such as DPO. Record why each rollout was selected so the dataset can be reproduced and compared.

![A training example needs an explicit selection rule. Reward is a quality signal; embeddings help with similarity and coverage.](/images/ai-reference/rollout-selection-flow.svg)

## What is a rollout, and why select at all?

A rollout is one execution of an agent policy on a task: the prompts and model outputs, tool calls and their results, intermediate observations, and the final outcome with its score. Training frameworks generate rollouts in large numbers, often many attempts per task, and most of them are redundant, broken, or uninformative. Training on all of them wastes compute and can teach the wrong lessons: repeated easy tasks dominate, infrastructure errors look like policy mistakes, and lucky successes look like skill.

Selection for an offline dataset is a data-curation problem. It is different from the on-policy batching inside a reinforcement-learning trainer such as GRPO, where the algorithm itself defines how samples are generated and weighted; filtering those batches with new criteria can break the algorithm's assumptions, so apply selection through the workflow your trainer supports.

## Which rollouts are eligible?

Apply hard filters before any ranking:

- **Complete and parseable.** The trace has every step, and tool calls and results line up.
- **Known provenance.** Task ID, policy checkpoint, prompt template, tool and environment versions are recorded.
- **Trustworthy outcome.** The reward comes from a verifier, test suite, or reviewed judgment you trust. Separate *infrastructure failures* (timeouts, sandbox crashes, rate limits) from *policy failures*; the first kind teaches nothing about the policy.
- **No leakage.** Tasks in the evaluation set, and near-duplicates of them, are excluded.
- **Allowed content.** Traces containing secrets, personal data, or prohibited actions are removed or redacted.

## What should you select for each training method?

| Method | What to keep | Typical selection rule |
| --- | --- | --- |
| SFT via rejection sampling | Successful trajectories | Reward above threshold; among successes for the same task, prefer the shortest or cheapest; cap per task |
| Preference optimization (DPO and similar) | Pairs on the same task: a better and a worse trajectory | Clear quality gap; both complete; avoid pairs where the only difference is noise |
| Failure analysis / negative examples | Informative failures | Frequent or diverse error types, labeled with the failure cause |
| Offline RL | Full distribution with rewards | Keep the behavior distribution intact; select by coverage, not just by reward |

The rejection-sampling idea goes back to work such as STaR (Zelikman et al.), which fine-tuned only on reasoning traces that reached correct answers. Preference methods like DPO (Rafailov et al.) need contrast, which means you must deliberately keep some failures.

## How do embeddings help with coverage and deduplication?

Reward tells you which rollouts are good. It does not tell you whether the dataset covers the space of tasks. Embeddings do.

1. **Embed a representation of each rollout.** Usually the task description plus a summary of the approach and outcome; for finer control, embed failure summaries or short step windows separately.
2. **Deduplicate near-identical rollouts.** Search each candidate against rollouts already selected for the same task and drop it if similarity is above a tight threshold (for example 0.95 cosine, tuned by inspecting pairs). Retries that differ only in timestamps or formatting disappear.
3. **Cap per cluster.** Cluster rollout embeddings (or use the task-family field) and limit how many examples each cluster contributes, so one dominant pattern cannot crowd out rare tasks.
4. **Find gaps.** Clusters with many attempts but no successes show where the policy is weak; clusters with no rollouts show tasks to generate more of.
5. **Inspect samples.** Look at a few rollouts per cluster to confirm the embedding groups behavior, not boilerplate like identical system prompts.

These are the same techniques used for [diversity sampling](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings) and [deduplication](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping) in other datasets, applied to agent behavior.

## Storing a rollout pool in Milvus

A rollout pool can live in one Milvus collection, with the full traces kept in object storage or a trace store and referenced by ID:

| Field | Purpose |
| --- | --- |
| `rollout_id` (primary key), `task_id`, `task_family` | Identity and grouping |
| `policy_version`, `env_version`, `tool_version` | Provenance and eligibility |
| `outcome` (`success`, `policy_fail`, `infra_fail`), `reward` | Quality filters |
| `num_steps`, `cost_tokens` | Efficiency preferences |
| `summary_embedding` | Similarity, deduplication, coverage |
| `trace_uri` | Pointer to the full trace |
| `split`, `selected_in` | Leakage control and manifest tracking |

Two Milvus features make the selection queries short. Scalar filters express eligibility in the same call as the similarity search (`outcome == "success" and env_version == "v7" and split != "eval"`). **Grouping search** with `group_by_field="task_id"` and a small `group_size` returns the top matches from many distinct tasks instead of many attempts at one task:

```python
res = client.search(
    collection_name="rollouts",
    data=[embed("multi-file refactor with failing tests")],
    anns_field="summary_embedding",
    filter='outcome == "success" and env_version == "v7" and split != "eval"',
    group_by_field="task_id", group_size=2, limit=50,
    output_fields=["rollout_id", "task_id", "reward", "num_steps"],
)
```

Here `limit` is the number of groups (tasks), so this returns up to 100 rollouts across up to 50 tasks.

## Keep a selection manifest

Every training dataset should come with a manifest: the source rollout IDs, the reason each was included (rule name, cluster, pair partner), labels and weights, the filter and threshold values, the policy version that produced the pool, and the date. With a manifest you can rebuild the dataset, compare two selection policies on the same pool, and remove examples later if a verifier bug is discovered. See [reproducible vector-search and training experiments](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments).

## Pitfalls

- **Reward hacking in the data.** A rollout can pass a weak verifier without solving the task. Spot-check high-reward examples, especially unusually short ones.
- **Selecting only the easiest successes.** Prefer successes on hard tasks and cap easy-task contributions.
- **Hiding failures.** A dataset of only successes cannot teach recovery and gives preference methods nothing to contrast.
- **Distribution shift.** Rollouts from an old policy may show behavior the current policy no longer exhibits; weight recent policy versions or filter by version.
- **Changing many things at once.** Keep a baseline dataset and change one selection rule per experiment, judged on held-out tasks.

To reuse past rollouts at runtime rather than for training, as few-shot examples or debugging evidence, see [how to retrieve agent trajectories](/ai-quick-reference/how-to-retrieve-agent-trajectories). To try the storage side, create a collection with the fields above using the [Milvus Quickstart](https://milvus.io/docs/quickstart.md) and the [grouping search guide](https://milvus.io/docs/grouping-search.md).

## Related reading

- [How can vector search retrieve useful agent trajectories?](/ai-quick-reference/how-to-retrieve-agent-trajectories)
- [How can embeddings improve dataset diversity sampling?](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings)
- [What is data curation, and how can vector search help?](/ai-quick-reference/what-is-data-curation-for-vector-ai)
- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)
- [Build a bounded agent retrieval loop with Milvus and LangGraph](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)
- [Related application story: Read AI](https://zilliz.com/customers/read-ai)

## Sources

- [Zelikman et al., STaR: Bootstrapping Reasoning With Reasoning](https://arxiv.org/abs/2203.14465)
- [Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Algorithm-specific training data requirements (TRL GRPO trainer)](https://huggingface.co/docs/trl/grpo_trainer)
- [Rollout and trajectory integration (Agent Lightning)](https://github.com/microsoft/agent-lightning)
- [Group retrieved candidates by identity](https://milvus.io/docs/grouping-search.md)
- [Filtered search in Milvus](https://milvus.io/docs/filtered-search.md)
