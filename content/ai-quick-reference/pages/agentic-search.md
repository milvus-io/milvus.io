---
slug: "what-is-agentic-search"
title: "What is agentic search, and where does a vector database fit?"
topic: "rag-agents"
order: 71
---

Agentic search lets an application choose and revise retrieval actions during a task. An agent might decompose a question, select a corpus, issue keyword and vector searches, inspect evidence, and stop or reformulate. A vector database supplies one retrieval tool inside that control loop.

![Bound the agent search loop by evidence gaps](/images/ai-reference/agent.svg)

## Define the decisions the agent may make

Start with a bounded question class. For a technical support assistant, the useful decisions might be whether to search product documentation, inspect a specific error code, or retrieve a known issue. Expose a small tool interface with explicit arguments, result IDs, source metadata, and error behavior.

Keep eligibility outside the model's discretion. Tenant, document status, and access constraints should be enforced by the tool and application. A model-selected query or retrieved passage must not be able to relax those conditions.

## Make iteration purposeful

Give the loop a reason to continue: missing evidence, conflicting sources, or a specific unanswered subquestion. Define tool-call, token, time, and result budgets. Repeating a slightly different search indefinitely can increase cost without improving the answer.

The Milvus LangGraph tutorial demonstrates an agentic retrieval pattern, and DeepSearcher provides another reference implementation. Adapt their control flow to the workload. Their existence does not establish that an autonomous loop will outperform a simpler retrieve-and-answer pipeline on your questions.

## Evaluate both evidence and actions

Compare a fixed retrieval baseline with the agentic workflow on the same tasks. Measure useful evidence found, source-grounded answer quality, task completion, tool calls, latency, and total operating cost. Include questions with no answer and cases where an early plausible document is wrong.

Retain a trace of queries, selected filters, returned source IDs, and the reason the application stopped. Use those observations to identify whether improvement requires better tools, better data, or better control logic. Adopt additional autonomy only when it solves a measured failure class within an acceptable budget and permission boundary.

## Example to test

A support agent first retrieves a general error explanation, then narrows to a product version. Permit another search only when a specific evidence gap remains. Compare resolved questions and unsupported answers with a single-search baseline.

## From concept to implementation

- [Build a bounded agent retrieval loop](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md).
- [Related application story: Read AI](https://zilliz.com/customers/read-ai).

## Continue learning

- [How do LangGraph state and Milvus retrieval work together?](/ai-quick-reference/langgraph-with-milvus)
- [How does Agno connect agents to knowledge stored in Milvus?](/ai-quick-reference/agno-with-milvus)
- [What does a Milvus MCP server expose to an AI agent?](/ai-quick-reference/milvus-mcp-tools)
- [How should an agent choose between vector, keyword, and structured search?](/ai-quick-reference/how-agents-choose-retrieval-tools)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [What is an agent trajectory, and how should you represent it for retrieval?](/ai-quick-reference/what-is-an-agent-trajectory)
- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)
- [What is Graph RAG, and where does Milvus fit?](/ai-quick-reference/how-does-milvus-enable-graph-rag-for-multihop-agent-reasoning)

## Implementation guides and sources

- [Agentic RAG with Milvus and LangGraph](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)
- [DeepSearcher retrieval workflows](https://github.com/zilliztech/deep-searcher)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
