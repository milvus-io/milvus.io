---
slug: "what-is-a-semantic-cache"
title: "When is a semantic cache useful, and how do you prevent stale answers?"
topic: "rag-agents"
order: 79
---

A semantic cache uses similarity to propose previously computed responses or intermediate results for reuse. It can reduce repeated work when nearby requests genuinely have the same answer contract. It requires stricter applicability checks than ordinary document retrieval because a cache hit may bypass new computation.

Consider a support bot that cached the answer to "what's your refund window?" this morning, before a policy change took effect at noon. An afternoon user asks "how long do I have to return something?" — a paraphrase with high embedding similarity to the cached question. A similarity-only cache serves the stale pre-noon answer with high confidence, because nothing about the paraphrase signals that the underlying policy changed between the two requests. The cache key needs to carry the policy or content version, not just the question text, or a confident-looking paraphrase match will keep serving yesterday's answer.

## Define what is reusable

A cached embedding, retrieved candidate set, and final generated answer have different invalidation rules. A final answer can depend on tenant permissions, source snapshot, model revision, prompt, tool state, locale, and time. Include the dependencies that determine correctness in the cache key or eligibility metadata.

For example, two questions about the same product can require different answers for different contract terms or software versions. High vector similarity between their text is insufficient evidence that the same response is valid.

## Separate candidate lookup from acceptance

Use vector retrieval to locate candidates, then check exact dependency fields and the intended similarity threshold. Define expiry and a fallback to normal execution. A top-k result is only the nearest stored candidate, even when every candidate is unsuitable.

Calibrate the threshold on real equivalent and non-equivalent requests. Small changes in quantities, negation, identifiers, or effective dates can change the correct answer while preserving a very similar embedding. Include those hard negatives in testing.

## Evaluate saved work and wrong reuse

Measure accepted hit rate, computation saved, lookup overhead, end-to-end latency, and incorrect or stale reuse. The raw similarity hit rate is not the useful business metric. A more selective cache can be better if it preserves correctness while still removing expensive repeated calls.

Test source updates, permission changes, model upgrades, and delayed invalidation. Keep enough metadata to explain why a hit was accepted and which source state it represents. Consider caching a lower-level artifact with a clearer contract when final answers are too context-dependent. A reliable cache has a defensible reuse boundary and an observable path back to fresh computation.

## Example to test

Two users ask similar questions about accounts with different permissions. A semantic cache key must preserve the relevant scope and evidence version. Reusing a close answer without those checks can serve another user's or an obsolete result.

## From concept to implementation

- [Implement a scoped memory prototype](https://milvus.io/docs/basic_memory_with_milvus.md).
- [Inspect a source-backed memory implementation](https://github.com/zilliztech/memsearch).

## Continue learning

- [How do working, episodic, semantic, and procedural agent memory differ?](/ai-quick-reference/what-are-the-types-of-agent-memory)
- [How should an agent memory system handle corrections, expiry, and deletion?](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory)
- [When should you use range search instead of only top-k?](/ai-quick-reference/when-to-use-vector-range-search)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)

## Implementation guides and sources

- [Filter a similarity lookup](https://milvus.io/docs/filtered-search.md)
- [Score thresholds for candidate acceptance](https://milvus.io/docs/range-search.md)
- [Maintain indexed cache metadata](https://milvus.io/docs/upsert-entities.md)

