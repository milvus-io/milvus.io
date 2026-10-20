---
slug: "how-agents-choose-retrieval-tools"
title: "How should an agent choose between vector, keyword, and structured search?"
topic: "rag-agents"
order: 72
---

An agent's retrieval plan should match the kind of evidence the task requires. A similarity search can recover paraphrases, a keyword path can preserve exact terminology, and a structured query can enforce known conditions. Giving each tool a clear contract makes selection easier to evaluate.

## Map intent to evidence requirements

A request for a document with a known ID should use direct retrieval where supported. A query containing an exact error code can benefit from lexical search. A conceptual question phrased in unfamiliar language may need dense retrieval. A requirement such as tenant or effective date belongs in an explicit eligibility predicate.

For mixed intent, combine paths through the supported hybrid workflow. Keep the same access conditions across them and deduplicate by stable record identity. Do not let a permissive second retriever reintroduce records that the first path correctly excluded.

## Expose constrained tool arguments

Separate model-generated search text from application-controlled fields. Validate field names, operators, result limits, and allowed corpora before executing a structured request. Return source IDs, revisions, and enough diagnostic information to distinguish no eligible data from a failed tool call.

Give the agent a small set of meaningful choices rather than every database parameter. Index type and infrastructure tuning usually belong to the serving configuration, while the agent chooses task-level retrieval actions within that contract.

## Learn from plan-level failures

Create labeled tasks for exact lookup, paraphrase, filtered search, multi-step evidence, and unsupported questions. Compare the chosen tools with a fixed baseline and inspect cases where extra calls add no useful evidence.

Measure final task quality as well as candidate relevance and tool cost. A plan can retrieve a relevant document and still draw an unsupported conclusion; it can also fail before retrieval by selecting the wrong corpus. Keep a trace that connects each action to returned evidence so these causes remain visible. Expand the planner's options when a specific task class needs them and the resulting behavior can be verified.

## Continue learning

- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How does semantic search differ from keyword search?](/ai-quick-reference/what-is-semantic-search-and-how-does-it-differ-from-keyword-search)
- [How do metadata filters interact with vector search?](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance)
- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)

## Implementation guides and sources

- [A retrieval decision loop](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)
- [Combine retrieval paths](https://milvus.io/docs/multi-vector-search.md)
- [Structured query and ID retrieval](https://milvus.io/docs/get-and-scalar-query.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
