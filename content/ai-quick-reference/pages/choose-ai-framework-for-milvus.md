---
slug: "choose-ai-framework-for-milvus"
title: "How do you choose an AI framework for a Milvus application?"
topic: "frameworks"
order: 101
---

An AI application framework connects components such as models, documents, tools, and application state. Milvus provides the persistent retrieval layer. A framework or adapter may select a default embedding model, but that default is not evidence that the model fits your task. Record or override it explicitly. Framework selection also does not by itself establish access control or retrieval quality.

## Choose the layer you need

LangChain provides model, tool, and retrieval abstractions; LangGraph adds explicit stateful workflows. LlamaIndex emphasizes data ingestion and retrieval abstractions. Haystack organizes document-processing and retrieval pipelines. Dify is an application platform with a visual workflow, while DSPy focuses on optimizing language-model programs against an evaluation objective. Agno connects agents, tools, and knowledge. Sentence Transformers runs and trains retrieval models; it is a model library rather than an agent orchestrator.

These categories can overlap. Start with one end-to-end path rather than stacking frameworks because each appears in a popular architecture diagram. For a document assistant, first establish ingestion, filtered retrieval, citations, and an evaluation set. Add agent planning only if the task needs decisions or multiple retrieval steps.

## Keep a portable retrieval contract

Define stable document and chunk identifiers, metadata fields, model revision, embedding dimensions, and query filters outside framework defaults. Require the retriever to return original IDs and sources. This makes it possible to compare frameworks without losing your data model or tenant boundaries.

## Verify the actual integration

Check the connector for your language and pinned package versions. A framework listing a database does not establish support for every Milvus feature. Test insertion, metadata filtering, deletion, and one failure path. Compare the same queries against a direct MilvusClient baseline before attributing quality differences to the framework.

## Example to test

Implement the same small retrieval task directly and through one adapter. Keep the corpus, embeddings, and filters identical. Choose the framework for orchestration or developer workflow only after confirming that it preserves the retrieval contract.

## From concept to implementation

- [Use the topic-specific integration guide](https://docs.langchain.com/oss/python/learn).
- [Keep a direct-client verification baseline](https://milvus.io/docs/quickstart.md).

## Continue learning

- [What does LangChain do, and how does it use Milvus?](/ai-quick-reference/langchain-with-milvus)
- [What does LlamaIndex do, and where does Milvus fit?](/ai-quick-reference/llamaindex-with-milvus)
- [How do LangGraph state and Milvus retrieval work together?](/ai-quick-reference/langgraph-with-milvus)
- [How does Haystack build a retrieval pipeline with Milvus?](/ai-quick-reference/haystack-with-milvus)
- [What does Dify manage when Milvus stores application knowledge?](/ai-quick-reference/dify-with-milvus)
- [How can DSPy optimize a retrieval application backed by Milvus?](/ai-quick-reference/dspy-with-milvus)
- [How does Agno connect agents to knowledge stored in Milvus?](/ai-quick-reference/agno-with-milvus)
- [How do Sentence Transformers models feed a Milvus retrieval pipeline?](/ai-quick-reference/sentence-transformers-with-milvus)

## Implementation guides and sources

- [LangChain and LangGraph learning paths](https://docs.langchain.com/oss/python/learn)
- [LlamaIndex vector-store integrations](https://developers.llamaindex.ai/python/framework/community/integrations/vector_stores/)
- [Agno vector databases](https://docs.agno.com/knowledge/concepts/vector-db)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
