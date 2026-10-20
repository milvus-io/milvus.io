---
slug: "vector-search-for-legal-document-agents"
title: "How should you design vector retrieval for legal-document agents?"
topic: "applications"
order: 93
---

A legal-document agent needs to locate applicable evidence and preserve its provenance. Vector retrieval can bridge terminology differences, while keyword retrieval can preserve clause names, citations, and exact identifiers. The retrieval design must also respect document version, jurisdiction, matter, and access scope.

![Eligibility is a rule, relevance is an ordering](/images/ai-reference/filtering.svg)

## Model the evidence unit

Choose clauses, sections, or passages that retain enough context to interpret a result. Keep document ID, revision, section reference, page or offset, effective status, and source location. Preserve definitions and neighboring provisions when a small chunk depends on them.

For example, two contracts can contain nearly identical liability language with a different cap or exception. Treat numerical and conditional differences as important evaluation cases. An embedding score alone should not decide whether those clauses are equivalent.

## Combine eligibility and ranking

Apply authorized matter or tenant scope and relevant document-state filters before evidence reaches the agent. Use lexical retrieval for exact references and dense retrieval for conceptual questions, then evaluate fusion or reranking on the actual query mix.

Return the original passage and revision alongside the candidate ID. If documents conflict or no applicable source is found, the application needs an explicit response policy. Retrieved text remains evidence and should not be allowed to redefine the agent's permissions or tool instructions.

## Evaluate evidence quality separately

Build reviewed queries covering exact clause lookup, paraphrases, cross-document questions, outdated revisions, exceptions, and unsupported requests. Measure applicable-source retrieval, citation correctness, omitted qualifying language, and the final answer's support in the source.

Track latency and tool cost as well as quality. If an agentic loop adds repeated searches without better evidence, improve the corpus or retrieval tools before expanding the loop. This is an engineering pattern for evidence discovery, not a claim that Milvus supplies legal reasoning or that a retrieved passage establishes a legal conclusion. Validate the full workflow with the reviewers who define acceptable use.

## Review the evidence unit, not just the match

A retrieval fixture can record the expected source revision, applicable scope, quoted passage boundary, and a qualifying exception. Ask reviewers to mark which condition failed when a result looks plausible but is unusable. Keep this separate from evaluating a legal conclusion: the database supplies retrieval capabilities, while the application and domain reviewers define acceptable interpretation.

## Example to test

Build a test where two clauses differ only in an exception or effective revision. Require the returned passage to include the qualifying text and source version. Review applicability with domain owners instead of treating similarity as a legal conclusion.

## From concept to implementation

- [Implement the document evidence pipeline](https://milvus.io/docs/build-rag-with-milvus.md).
- [Related document-workflow story: Rexera](https://zilliz.com/customers/rexera).

## Continue learning

- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)
- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)

## Implementation guides and sources

- [A source-grounded RAG implementation](https://milvus.io/docs/build-rag-with-milvus.md)
- [Eligibility filters](https://milvus.io/docs/filtered-search.md)
- [Exact terminology through BM25](https://milvus.io/docs/full-text-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
