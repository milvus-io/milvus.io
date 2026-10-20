---
slug: "haystack-with-milvus"
title: "How does Haystack build a retrieval pipeline with Milvus?"
topic: "frameworks"
order: 105
---

Haystack organizes AI applications as connected components. A document pipeline may convert files, clean content, split documents, generate embeddings, and write them to a document store. A query pipeline embeds a question, retrieves evidence, optionally reranks it, and passes the selected documents to generation.

## Use Milvus as the retrieval store

The Milvus integration supplies a document store and retrieval components. The Python integration example uses MilvusDocumentStore from milvus_haystack. Check the integration's package requirements rather than assuming every component ships with Haystack core. A document store interface and a database are different layers: inspect which fields and IDs the adapter persists.

For a support corpus, attach source URLs, product versions, and tenant metadata before writing documents. Verify the query pipeline forwards the required filters to the retriever. Save component outputs during evaluation so you can see where text disappeared or metadata changed.

## Compare pipeline variants

Start with dense retrieval, then evaluate sparse or hybrid retrieval and reranking if supported by your pinned integration. Keep parsing and chunking constant when comparing retrieval settings. Otherwise a perceived database improvement may simply come from a different input corpus.

## Plan maintenance as another pipeline

Use stable IDs to update and delete documents, and test partial failure during a batch ingestion. Track processed, failed, and indexed records separately. A pipeline that completes without raising an exception may still skip malformed documents. Check database counts and sampled source IDs before measuring answer quality or deploying a replacement pipeline.

## Example to test

Log the documents emitted by the retriever before a downstream ranker or generator runs. Check metadata round-trips and updates through the document store. A correct pipeline connection does not prove that the selected evidence is applicable.

## From concept to implementation

- [Use the topic-specific integration guide](https://milvus.io/docs/integrate_with_haystack.md).
- [Keep a direct-client verification baseline](https://milvus.io/docs/quickstart.md).

## Continue learning

- [How do you choose an AI framework for a Milvus application?](/ai-quick-reference/choose-ai-framework-for-milvus)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How does ETL prepare data for vector search?](/ai-quick-reference/what-are-the-main-phases-of-an-etl-process)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Haystack Milvus Document Store integration](https://github.com/deepset-ai/haystack-integrations/blob/main/integrations/milvus-document-store.md)
- [Milvus and Haystack guide](https://milvus.io/docs/integrate_with_haystack.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
