---
slug: "what-is-semantic-search-and-how-does-it-differ-from-keyword-search"
title: "How does semantic search differ from keyword search?"
topic: "retrieval"
order: 8
---

Keyword search finds documents through terms and their lexical relationships. Semantic search uses a learned representation to retrieve by meaning. They solve overlapping problems, but their failure modes differ. A support query containing an exact error code and a conversational description may benefit from both.

![Two retrieval signals, one inspected candidate pool](/images/ai-reference/hybrid.svg)

## Where each signal helps

Keyword retrieval is valuable for exact identifiers, names, rare terms, and wording that must appear in a result. Tokenization and analyzers determine how text becomes searchable terms, so punctuation, language, and domain-specific tokens deserve testing.

Semantic retrieval can bridge vocabulary differences, such as a question about “broken delivery” and a document about “damaged shipments.” It can also return a plausible but wrong match when two passages discuss similar topics. It does not enforce exact phrases, document status, or access rights by itself.

## Avoid an all-or-nothing migration

Measure the existing search system before replacing it. Build query groups for exact terms, paraphrases, mixed intent, and unsupported questions. Add semantic retrieval as another candidate path, then compare dense-only, keyword-only, and hybrid results against the same relevance judgments.

Separate retrieval from filtering. A request restricted to one customer's documents or one software version should keep those constraints regardless of which ranking signal is used. Product metadata and authorization rules are not substitutes for relevance, and relevance is not a substitute for authorization.

## Implement and iterate

Milvus supports full-text retrieval with BM25 and vector retrieval that can be combined with hybrid search. Start with the documented implementations and inspect why each path contributes a candidate. Track changes in relevance and latency, not just whether more documents are returned. Retain the combination that solves your actual query mix with an acceptable operating cost.

## Example to test

Compare an exact error-code query with a natural-language description of the same fault. Inspect lexical and dense failures separately. The choice is often a routing or fusion decision rather than replacing every exact-match query with embeddings.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How can vector search improve codebase retrieval for coding agents?](/ai-quick-reference/vector-search-for-coding-agents)
- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [What is full-text search, and how does BM25 fit?](/ai-quick-reference/what-is-fulltext-search)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)

## Implementation guides and sources

- [Full-text search](https://milvus.io/docs/full-text-search.md)
- [Hybrid search](https://milvus.io/docs/multi-vector-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
