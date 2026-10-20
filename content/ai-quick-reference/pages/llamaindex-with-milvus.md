---
slug: "llamaindex-with-milvus"
title: "What does LlamaIndex do, and where does Milvus fit?"
topic: "frameworks"
order: 103
---

LlamaIndex helps applications ingest and retrieve their own data for language-model workflows. Documents are transformed into nodes with content, identifiers, relationships, and metadata. A MilvusVectorStore persists searchable representations; an index and retriever organize how the application asks for relevant nodes.

## Distinguish application indexes from vector indexes

LlamaIndex's VectorStoreIndex is an application abstraction. It is not the same object as a Milvus HNSW or IVF index. The framework controls ingestion and retrieval composition; the database controls storage, filtering, and its physical search indexes. Confusing these layers makes tuning and recovery difficult.

For a document assistant, preserve source-document and node IDs during ingestion. Store tenant, version, and citation metadata. Use the same embedding configuration when encoding indexed nodes and user questions. The Python Milvus adapter is distributed as llama-index-vector-stores-milvus; verify the current constructor and schema options in its reference.

## Evaluate ingestion decisions

Chunk boundaries, node relationships, and metadata extraction can change retrieval more than switching frameworks. Test questions that need a single paragraph and questions that need several related passages. Keep source text or an authoritative location available so answers can be traced back to the original evidence.

## Handle changes deliberately

Decide how replacing a source document removes its obsolete nodes. Confirm deletion and filtering through the adapter rather than assuming a framework-level refresh does everything. Record connector versions and collection ownership. Compare returned IDs, answer citations, and ingestion costs against your baseline before adopting more elaborate query engines.

## Example to test

Replace a source document that produced multiple nodes and verify the resulting node membership. Check source IDs and relationships in returned citations. Indexing a replacement copy does not remove the obsolete nodes on its own; deletion is a separate step.

## From concept to implementation

- [Use the topic-specific integration guide](https://milvus.io/docs/integrate_with_llamaindex.md).
- [Keep a direct-client verification baseline](https://milvus.io/docs/quickstart.md).

## Continue learning

- [How do you choose an AI framework for a Milvus application?](/ai-quick-reference/choose-ai-framework-for-milvus)
- [What does LangChain do, and how does it use Milvus?](/ai-quick-reference/langchain-with-milvus)
- [How do you choose chunk size for RAG?](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications)
- [How do metadata filters interact with vector search?](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance)
- [How do you handle incremental updates in a vector database?](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)

## Implementation guides and sources

- [LlamaIndex Milvus vector-store example](https://developers.llamaindex.ai/python/examples/vector_stores/milvusindexdemo/)
- [RAG with Milvus and LlamaIndex](https://milvus.io/docs/integrate_with_llamaindex.md)

