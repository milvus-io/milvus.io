---
slug: "what-is-rag-retrievalaugmented-generation-in-nlp"
title: "What is retrieval-augmented generation (RAG)?"
topic: "rag-agents"
order: 18
---

Retrieval-augmented generation supplies a language model with information retrieved for the current request. A typical pipeline indexes source material, retrieves relevant passages, and asks the model to answer using that evidence. The retrieval store and generator have different roles: finding evidence is not the same as using it correctly.

## Follow the data through the system

Ingestion extracts text, preserves source metadata, splits documents into suitable units, generates embeddings, and writes searchable records. At query time, the application determines the eligible corpus, retrieves candidates, optionally reranks them, and constructs the model context. The final answer should retain links to the evidence the user can inspect.

Milvus serves the retrieval layer for vector and hybrid search. Document parsing, authorization, prompt construction, and answer verification remain application responsibilities. Adding a vector database alone does not establish that an answer is grounded or current.

## Design for evidence and abstention

Keep document ID, version, source location, and any eligibility metadata with every chunk. Apply permissions before evidence reaches the model. Decide how the system responds when no suitable source exists, when sources disagree, or when retrieved text contains instructions that conflict with the application's policy.

Retrieval can reduce reliance on a model's memorized knowledge, but it does not eliminate unsupported generation. An answer can cite a real document while making a claim the document does not support. Evaluate citation correctness and factual support separately from fluent wording.

## Build a small evaluation loop

Start with a bounded corpus and realistic questions. Check retrieval coverage first, then inspect whether the generator uses the returned evidence correctly. Track latency and cost across parsing, embedding, retrieval, reranking, and generation. Improve the weakest measured stage before adding more components. The linked tutorial provides a runnable starting point; production behavior needs the additional access, update, and evaluation decisions described here.

## Continue learning

- [How do you choose an AI framework for a Milvus application?](/ai-quick-reference/choose-ai-framework-for-milvus)
- [What does LangChain do, and how does it use Milvus?](/ai-quick-reference/langchain-with-milvus)
- [What does LlamaIndex do, and where does Milvus fit?](/ai-quick-reference/llamaindex-with-milvus)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How should you design vector retrieval for legal-document agents?](/ai-quick-reference/vector-search-for-legal-document-agents)
- [How do you choose chunk size for RAG?](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How should you structure agent memory in Milvus?](/ai-quick-reference/what-are-best-practices-for-structuring-agent-memory-in-milvus)

## Implementation guides and sources

- [Build RAG with Milvus](https://milvus.io/docs/build-rag-with-milvus.md)
- [RAG pipeline implementation guidance](https://milvus.io/docs/rag_pipeline.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
