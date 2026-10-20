---
slug: "agno-with-milvus"
title: "How does Agno connect agents to knowledge stored in Milvus?"
topic: "frameworks"
order: 108
---

Agno provides agent, model, tool, and knowledge abstractions. Its Milvus vector-database integration lets an agent retrieve indexed knowledge while performing a task. An agent's conversation history, workflow state, and indexed knowledge are different data products even when they share document references.

## Establish the knowledge path

Prepare source documents and metadata, choose an embedder, and configure the Milvus-backed knowledge component. The official example includes synchronous and asynchronous ingestion patterns. Verify which pattern and parameters your installed Agno version supports; asynchronous submission is not proof that all records are searchable immediately.

For a product assistant, keep product version and tenant identifiers with every document. Give the agent an explicit retrieval tool or knowledge search path. Preserve source IDs when forming answers so users and evaluators can locate the underlying evidence.

A minimal wiring looks like this:

```python
from agno.agent import Agent
from agno.knowledge.knowledge import Knowledge
from agno.vectordb.milvus import Milvus

knowledge = Knowledge(
    vector_db=Milvus(collection="product_docs", uri="http://localhost:19530"),
)
knowledge.add_content(path="docs/product_guide.pdf")

agent = Agent(knowledge=knowledge, search_knowledge=True)
agent.print_response("What does the refund policy cover?")
```

`Milvus(...)` from `agno.vectordb.milvus` is the connector; `Knowledge.add_content` drives ingestion, and `search_knowledge=True` gives the agent an explicit retrieval tool rather than implicit context injection. Confirm the constructor arguments against the installed Agno version before relying on this shape in production.

## Control ingestion and tool use

Use stable document identifiers and define how a changed document replaces its old chunks. Bound retrieval calls and choose what happens when the store is unavailable or returns no evidence. Do not allow a model-generated filter to broaden a mandatory application-side permission boundary.

## Measure the agent and retriever separately

Test an ordinary question, a cross-tenant question, and a question with no answer in the corpus. Inspect tool-call traces, returned IDs, and citations. Measure ingestion completeness and retrieval latency independently of final answer quality. Compare agent planning with a simpler retrieval application and adopt it when the measured quality or workflow benefit justifies its additional latency, calls, and operating complexity.

## Example to test

Give two agents different document access. Run the same question through each knowledge tool and inspect source IDs before answer generation. Separate an agent's ability to call the tool from the tool's authority to retrieve records.

## From concept to implementation

- [Use the topic-specific integration guide](https://docs.agno.com/knowledge/vector-stores/milvus/overview).
- [Keep a direct-client verification baseline](https://milvus.io/docs/quickstart.md).

## Continue learning

- [How do you choose an AI framework for a Milvus application?](/ai-quick-reference/choose-ai-framework-for-milvus)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)
- [How do metadata filters interact with vector search?](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance)

## Implementation guides and sources

- [Agno Milvus database example](https://docs.agno.com/knowledge/vector-stores/milvus/overview)
- [Agno knowledge and vector databases](https://docs.agno.com/knowledge/concepts/vector-db)

