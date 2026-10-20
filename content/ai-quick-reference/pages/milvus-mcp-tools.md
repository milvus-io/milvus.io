---
slug: "milvus-mcp-tools"
title: "What does a Milvus MCP server expose to an AI agent?"
topic: "production"
order: 113
---

A Milvus MCP server exposes supported database operations as tools that an MCP client can discover and call. It connects an assistant or agent to retrieval and related data operations. It is not an embedding model and does not by itself decide which records a particular user is allowed to access.

## Start with a narrow task

For an internal support assistant, expose only the operations required to inspect an approved collection and search permitted documents. Check the server's current tool list and configuration. Some operations may read data, while others can create, modify, or delete it; do not infer their behavior from a tool name alone.

Configure the deployment endpoint and credentials outside prompts. Keep collection selection, tenant restrictions, and returned fields under application control. A free-form agent request should not be able to select an unrelated collection or broaden a mandatory filter.

## Define evidence returned by the tool

Return stable document IDs, source references, relevant text, and the filters applied. If embeddings are supplied by another component, record which model and dimension it uses. Decide whether the tool returns candidates or final reranked evidence, since those are different interfaces for the agent.

## Test failures and boundaries

Try a normal search, an unavailable collection, an unauthorized scope, and a request with no relevant result. Inspect logs without exposing credentials. Measure the tool's latency and result correctness separately from the assistant's final response. Add write-capable tools only when the application has an explicit need and a clear authorization and retry design.

## Continue learning

- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How should an agent choose between vector, keyword, and structured search?](/ai-quick-reference/how-agents-choose-retrieval-tools)
- [How do LangGraph state and Milvus retrieval work together?](/ai-quick-reference/langgraph-with-milvus)
- [How do authentication, RBAC, and tenant filters protect Milvus applications?](/ai-quick-reference/milvus-security-rbac)

## Implementation guides and sources

- [Milvus and MCP integration](https://milvus.io/docs/milvus_and_mcp.md)
- [Milvus MCP server implementation](https://github.com/zilliztech/mcp-server-milvus)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
