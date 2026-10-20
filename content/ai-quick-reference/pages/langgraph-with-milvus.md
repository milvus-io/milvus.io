---
slug: "langgraph-with-milvus"
title: "How do LangGraph state and Milvus retrieval work together?"
topic: "frameworks"
order: 104
---

LangGraph represents an agent workflow as state, nodes, and transitions. Nodes may plan a query, call a retrieval tool, inspect evidence, or generate an answer. Milvus is useful inside a retrieval node or as a searchable knowledge and memory store; it does not replace the workflow's checkpoint mechanism.

![Bound the agent search loop by evidence gaps](/images/ai-reference/agent.svg)

## Separate execution state from searchable memory

Execution state includes which step is running, pending actions, and intermediate results. A checkpoint supports resuming that workflow. Searchable memory contains selected information intended to be retrieved in future tasks. Store references between these systems, but do not treat a vector search result as a reliable reconstruction of an interrupted execution.

For an agent answering support questions, route an ambiguous question to clarification, retrieve permitted product documents, inspect whether evidence is sufficient, and either answer or perform a bounded second search. Give the retrieval tool explicit tenant, product, and version arguments rather than trusting the model to remember restrictions.

## Bound the workflow

Set limits on retrieval iterations and tool timeouts. Make document ingestion and external side effects idempotent where retries are possible. Log the query, filters, returned document IDs, and transition decisions so a poor answer can be traced to planning, retrieval, or generation.

## Test recovery and quality separately

Pause and resume a test workflow to verify checkpoint recovery. Independently evaluate retrieval quality and memory deletion. An agent that resumes correctly can still retrieve the wrong document, and accurate retrieval says nothing about retry safety for unrelated tools, so test each separately. Add complexity only after the state transitions solve a concrete task.

## Example to test

Persist a paused workflow, resume it, and check that retrieval uses the intended document and permission state. A graph checkpoint preserves workflow state; it does not freeze an external collection or grant access to its contents.

## From concept to implementation

- [Use the topic-specific integration guide](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md).
- [Related application story: Read AI](https://zilliz.com/customers/read-ai).

## Continue learning

- [What does LangChain do, and how does it use Milvus?](/ai-quick-reference/langchain-with-milvus)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)
- [How should an agent memory system handle corrections, expiry, and deletion?](/ai-quick-reference/how-to-correct-expire-and-delete-agent-memory)
- [What does a Milvus MCP server expose to an AI agent?](/ai-quick-reference/milvus-mcp-tools)

## Implementation guides and sources

- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [Agentic RAG with Milvus and LangGraph](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)

