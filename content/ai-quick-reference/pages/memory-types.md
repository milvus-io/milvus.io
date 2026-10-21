---
slug: "what-are-the-types-of-agent-memory"
title: "How do working, episodic, semantic, and procedural agent memory differ?"
topic: "rag-agents"
order: 73
---

AI agents typically use four kinds of memory, a taxonomy borrowed from cognitive science and formalized for LLM agents in the CoALA framework. **Working memory** is what the agent is holding right now: the current task, recent turns, and pending tool results, usually in the context window. **Episodic memory** records specific past events ("last Tuesday the deployment failed on step 3"). **Semantic memory** stores general facts and knowledge independent of when they were learned ("the user prefers Python", "service A depends on service B"). **Procedural memory** holds how to do things: skills, workflows, and the agent's own instructions and code. They differ in lifetime, in who may change them, and in how they should be stored and retrieved.

![Agent memory has different jobs and owners. One vector collection does not replace every state or persistence mechanism.](/images/ai-reference/agent-memory-types.svg)

## The four types at a glance

| | Working | Episodic | Semantic | Procedural |
| --- | --- | --- | --- | --- |
| Human analogy | What you are thinking about now | Remembering a specific trip | Knowing Paris is in France | Knowing how to ride a bike |
| Agent example | Current plan, last 10 messages, a tool result | Transcript or summary of a past support case | "Customer is on the Enterprise plan"; product facts | A tested troubleshooting runbook; tool-use instructions; prompt templates |
| Time-stamped? | Ephemeral | Yes, it is about *when* something happened | No, it is about *what is true* | No, it is about *how* |
| Lifetime | One task or session | Weeks to months, decays | Until corrected or superseded | Until revised |
| Who updates it | The agent, constantly | Written automatically after events | Extracted, then reconciled with existing facts | Developers or a reviewed learning process |
| Typical storage | Context window, framework state, checkpoint store | Vector store plus a log of events | Vector store, key-value or relational store, knowledge graph | Code, prompt files, a library of retrievable skills |
| Typical retrieval | Already in context | Similarity + time + outcome filters | Similarity + key lookup + validity filters | By task type, or similarity to the current goal |

## Working memory

Working memory is the agent's scratchpad: the system prompt, the conversation so far, the current plan, and intermediate tool outputs. It lives inside the context window and in the orchestration framework's state (for example a LangGraph state object or a checkpointer). Its constraint is size, so frameworks trim, summarize, or offload older content. MemGPT made this explicit by treating the context window like RAM that is paged to and from external storage.

Exact current values belong here, not in a vector store. "The order ID we are working on" should be a state variable, not something re-found by similarity.

## Episodic memory

Episodic memories are records of specific experiences: a conversation, a task attempt, a tool sequence and its result. They answer "have I seen something like this before, and what happened?" Generative Agents (Park et al.) stored every observation in a time-ordered memory stream and retrieved by a mix of recency, importance, and relevance; it also periodically reflected over episodes to produce higher-level conclusions, which is how episodic memory feeds semantic memory.

Store episodes with a time stamp, an outcome (success or failure), and the context they applied to (product version, environment). Vector search finds similar situations; filters keep out episodes from other users or incompatible environments. Whole agent runs are a special, larger kind of episode, covered in [how to retrieve agent trajectories](/ai-quick-reference/how-to-retrieve-agent-trajectories).

## Semantic memory

Semantic memory holds facts the agent should treat as currently true: user preferences, profile details, domain knowledge, relationships between entities. Unlike episodes, facts must be kept consistent. If a user says "I moved to Berlin", the agent should not keep two conflicting "lives in" facts with equal weight. That makes semantic memory the type that most needs deduplication, supersession, and provenance (who said it, when, how confident).

Retrieval mixes similarity with exact lookup: "what do I know about this user's dietary restrictions?" is a similarity search scoped to the user, while "the user's timezone" may be a key-value read. Relationship-heavy facts can also be stored as entity-relation triples, as in [Graph RAG](/ai-quick-reference/how-does-milvus-enable-graph-rag-for-multihop-agent-reasoning). An organization-wide knowledge base used for RAG is semantic memory shared across users.

## Procedural memory

Procedural memory is knowing how: the agent's system prompt and tool definitions, reusable workflows, code snippets, and learned skills. Some agents grow a library of procedures and retrieve the relevant one by similarity to the current goal; others distill successful episodes into instructions (the ExpeL and Voyager line of work explores this). Because procedures drive actions, they need the strictest review. A procedure that worked once is evidence, not authorization: promote an episode to a procedure only after it has been checked, and version it so a bad change can be rolled back.

## Short-term vs long-term: how the types map

"Short-term memory" in most frameworks means working memory. "Long-term memory" means the other three, persisted across sessions. Some products add a mid-term tier (session summaries) between them. The labels vary between frameworks, so define the record contract your application needs rather than relying on names.

## How do the types map onto a vector database?

All three long-term types can share one Milvus collection with a `memory_type` field, or use one collection each when their schemas and lifetimes differ a lot. Common choices:

| Type | Milvus pattern |
| --- | --- |
| Episodic | Embedding of the episode summary; `user_id` partition key; `occurred_at`, `outcome`, `env_version` fields; a collection TTL or decay score for aging |
| Semantic | Embedding of the atomic fact; `status` and `supersedes` fields; filtered to `status == "active"` |
| Procedural | Embedding of the goal or task description the procedure solves; `version` and `approved` fields; retrieved only from approved versions |

The full schema, write path, and retrieval scoring are in [how to structure agent memory in Milvus](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus), and how each type expires or is corrected is in [memory corrections, expiry, and deletion](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory).

## Worked example: a travel-booking agent

- **Working:** the trip being booked right now, the flight options just returned, the step of checkout the user is on.
- **Episodic:** "In March the user rebooked after a missed connection in Frankfurt and was unhappy with a 45-minute layover."
- **Semantic:** "Prefers aisle seats", "Has Star Alliance Gold status", "Home airport: SFO".
- **Procedural:** "To rebook after a cancellation: check same-alliance options first, then refundable fares; confirm with the user before purchase."

When the user asks for a flight to Tokyo, the agent loads the semantic facts (seat, status, home airport), retrieves the Frankfurt episode because it is similar ("connections"), and so avoids short layovers, and follows the booking procedure. The checkout step stays in working memory and is discarded when the session ends; it should never be written as a lasting preference.

## How do you know each type is earning its keep?

Test them separately. For working memory, check that long sessions do not lose the current task. For episodic memory, check that relevant past cases improve outcomes and that failures from other contexts are not applied blindly. For semantic memory, test corrections and conflicts. For procedural memory, test that only approved versions are used. Remove a memory type if it adds tokens and confusion without measurable improvement.

To build one, start with the [Basic Memory with Milvus tutorial](https://milvus.io/docs/basic_memory_with_milvus.md) or explore [memsearch](https://github.com/zilliztech/memsearch), then run Milvus locally with the [Quickstart](https://milvus.io/docs/quickstart.md).

## Related reading

- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)
- [How should an agent memory system handle corrections, expiry, and deletion?](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory)
- [How can vector search retrieve useful agent trajectories?](/ai-quick-reference/how-to-retrieve-agent-trajectories)
- [How do LangGraph state and Milvus retrieval work together?](/ai-quick-reference/langgraph-with-milvus)
- [When is a semantic cache useful, and how do you prevent stale answers?](/ai-quick-reference/what-is-a-semantic-cache)

## Sources

- [Sumers et al., Cognitive Architectures for Language Agents (CoALA)](https://arxiv.org/abs/2309.02427)
- [Park et al., Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
- [Packer et al., MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Zhao et al., ExpeL: LLM Agents Are Experiential Learners](https://arxiv.org/abs/2308.10144)
- [A Milvus memory retrieval example](https://milvus.io/docs/basic_memory_with_milvus.md)
- [Governed source records and a derived retrieval index](https://github.com/zilliztech/memsearch/blob/main/docs/design-philosophy.md)
