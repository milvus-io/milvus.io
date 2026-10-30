---
slug: "what-is-agentic-search"
title: "What is agentic search, and where does a vector database fit?"
topic: "rag-agents"
order: 71
---

Agentic search is retrieval controlled by an LLM agent: instead of running one fixed search and answering, the agent decides whether to search, what to search for, which tool or corpus to use, reads the results, judges whether they are enough, and searches again with a better query until it can answer or hits a budget. A vector database is one of the tools inside that loop, the one that finds passages by meaning, usually alongside keyword search, structured queries, and sometimes web search.

![Bound the agent search loop by evidence gaps](/images/ai-reference/agent.svg)

## How does an agentic search loop work?

The pattern descends from ReAct (Yao et al., 2022), which interleaves reasoning steps with tool calls. A typical loop:

1. **Plan.** Read the question and decide whether retrieval is needed at all. Break a compound question into sub-questions ("compare the refund policy in the EU and US plans" becomes two lookups).
2. **Act.** Call a tool with explicit arguments: a vector search over product docs, a BM25 search for an error code, a SQL or scalar query for an account record.
3. **Observe.** Read the returned passages and their source IDs.
4. **Reflect.** Grade the evidence: is it relevant, sufficient, consistent? Identify what is still missing.
5. **Repeat or stop.** Rewrite the query, switch tools, or narrow filters if there is a specific gap; otherwise answer with citations, or abstain.

Milvus's [agentic RAG with LangGraph tutorial](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md) implements this as a small graph: a node decides whether to retrieve or respond, a retrieve node calls Milvus, a grading node checks relevance, and irrelevant results route to a rewrite node that loops back to try again.

## Agentic search vs classic RAG

| | Fixed retrieval pipeline | Agent-controlled retrieval loop |
| --- | --- | --- |
| Retrieval calls | Scheduled by application logic; may include several retrievers or query variants | Selected during execution, subject to a configured budget |
| Query | User text or application-defined rewriting and decomposition | Generated, decomposed, and revised by the agent |
| Sources | One or several sources configured by the application | One or several tools selected during the task |
| Multi-step questions | Requires an explicit sequence or parallel retrieval plan | Can choose follow-up lookups; success depends on the model, tools, and evidence |
| Latency | Depends on retrievers, reranking, models, and load | Also depends on the number of sequential model/tool turns |
| Cost | Depends on the configured model and retrieval stages | Adds the model and tool calls actually executed by the loop |
| Failure modes | Missed evidence | Loops, drift, over-searching, tool misuse |
| Debuggability | Linear pipeline | Needs traces of every step |

These are control-flow differences, not benchmark results. Fixed pipelines can also combine sources and answer multi-step questions. Evaluate whether adaptive follow-up calls improve evidence coverage on your tasks enough to justify their measured latency and cost; the architecture alone does not establish a winner.

## Where does a vector database fit?

Inside the loop, the vector database is the semantic-recall tool. Its job is to answer each tool call quickly and correctly so the agent spends its turns reasoning instead of waiting or recovering from bad results. That puts specific requirements on it:

- **A measured per-call latency budget.** Sequential searches add to the critical path. For an illustrative task with five sequential retrieval calls, 100 ms per call contributes 500 ms before model and tool overhead; this is arithmetic, not a Milvus performance claim. Measure tail latency under your expected concurrency.
- **Hybrid retrieval.** Agents generate a mix of conceptual queries and exact strings. Milvus can serve both from one collection: dense vectors for meaning, a BM25 full-text field (Milvus 2.5+) for exact terms, and `hybrid_search` to fuse them.
- **Filters the agent cannot bypass.** Tenant, permission, and document-status constraints should be added by the tool wrapper from trusted context, not chosen by the model. Milvus applies them in the same query as the vector search.
- **Stable IDs and metadata in results.** The agent needs source IDs, versions, and URLs to cite, deduplicate across iterations, and avoid re-reading the same passage.
- **Scale for many corpora.** Separate collections or partition keys let one deployment serve many knowledge bases or tenants.

How the agent should choose between those tools for a given query is covered in [how agents choose between vector, keyword, and structured search](/ai-quick-reference/how-agents-choose-retrieval-tools). For exposing Milvus to agents through the Model Context Protocol, see [what a Milvus MCP server exposes](/ai-quick-reference/milvus-mcp-tools).

## How do you keep the loop bounded?

Unbounded loops are the main operational risk. Practical guardrails:

- **Budgets.** Cap tool calls (for example 5-8 searches), total tokens, and wall-clock time per task.
- **A reason to continue.** Allow another search only when the agent names a specific missing piece of evidence or a contradiction, not "to be thorough".
- **Novelty checks.** Stop if a new search returns mostly IDs already seen.
- **Explicit abstention.** "The sources do not answer this" must be an acceptable final state.
- **Treat retrieved text as data.** Passages may contain instructions; they should never change tool permissions or filters.

## How do you evaluate agentic search?

Compare it with a fixed single-retrieval baseline on the same tasks. Measure evidence found (recall of labeled passages across all iterations), answer correctness and citation support, task completion, number of tool calls, latency, and total cost. Include questions with no answer and questions where the first plausible document is a trap. Keep a trace of each query, filters, returned IDs, and the stop reason; the trace shows whether a failure came from the tool, the data, or the control logic. Building such task sets is covered in [how to build an evaluation set](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets).

## Real implementations to start from

- The [LangGraph tutorial](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md) for a compact retrieve-grade-rewrite loop.
- [DeepSearcher](https://github.com/zilliztech/deep-searcher), an open-source deep-research agent that decomposes questions and iterates over private data in Milvus.
- [Read AI](https://zilliz.com/customers/read-ai), a production example of retrieval behind AI assistants.

Start with the tutorial against a corpus you know, compare it with one-shot RAG on twenty real questions, and keep the extra autonomy only where it pays for its latency. You can run the whole thing locally with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md).

## Related reading

- [What is retrieval-augmented generation (RAG)?](/ai-quick-reference/what-is-rag-retrievalaugmented-generation-in-nlp)
- [How do LangGraph state and Milvus retrieval work together?](/ai-quick-reference/langgraph-with-milvus)
- [What is Graph RAG, and where does Milvus fit?](/ai-quick-reference/how-does-milvus-enable-graph-rag-for-multihop-agent-reasoning)
- [How can vector search retrieve useful agent trajectories?](/ai-quick-reference/how-to-retrieve-agent-trajectories)
- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)

## Sources

- [Yao et al., ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Agentic RAG with Milvus and LangGraph](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)
- [DeepSearcher retrieval workflows](https://github.com/zilliztech/deep-searcher)
- [Full-text search in Milvus](https://milvus.io/docs/full-text-search.md)
- [Hybrid search in Milvus](https://milvus.io/docs/multi-vector-search.md)
