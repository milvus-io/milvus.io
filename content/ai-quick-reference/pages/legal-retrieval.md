---
slug: "vector-search-for-legal-document-agents"
title: "How should you design vector retrieval for legal-document agents?"
topic: "applications"
order: 93
---

Two indemnification clauses can read almost identically — "Vendor shall indemnify Client against all claims arising from..." — while one caps liability at $1M and the other has no cap and excludes gross negligence. A legal-document agent that treats those as interchangeable because they embed close together will hand a reviewer the wrong exposure number. The retrieval design has to preserve the number and the exception, not just the topic.

![Eligibility is a rule, relevance is an ordering](/images/ai-reference/filtering.svg)

## Start from what breaks a clause comparison

Liability caps, carve-outs ("except in cases of gross negligence or willful misconduct"), defined terms referenced from elsewhere in the contract, and effective/superseded status are the details that change a clause's meaning without changing its wording much. Chunk at the clause or section boundary, not a fixed token count, and keep each chunk's defined terms and adjacent carve-outs attached — a liability clause separated from its exceptions reads as unconditional when it isn't. Store document ID, revision, section reference, and effective-status alongside the text so a stale or superseded version doesn't get served as current.

## Scope before you rank

Apply matter, client, and jurisdiction scope as a hard filter before any similarity scoring runs — an indemnification clause from an unrelated matter should never reach the candidate list regardless of how closely it matches in wording. Within that scope, combine lexical retrieval for citations and defined-term lookups with dense retrieval for "find clauses like this one" questions, and evaluate the fusion on real queries rather than assuming one signal dominates. Surface the original passage and its revision alongside every result; retrieved contract text is evidence for a reviewer, not an instruction the agent should ever treat as authoritative on its own behavior.

## Build the eval around the exception, not the topic

A query that returns a topically-correct clause but drops its dollar cap or its carve-out has failed, even if a cosine score looks strong. Build a reviewed set where paired clauses differ only in one numeric or conditional detail — cap amount, carve-out, effective date — and check whether the retrieved passage keeps that detail attached. Track how often an agentic loop re-queries without surfacing new evidence; that's a sign the corpus or chunking needs fixing, not the loop depth. None of this makes Milvus a source of legal reasoning — it retrieves passages; a lawyer or compliance reviewer still has to confirm what the passage means for the matter at hand.

## Example to test

Index the indemnification example above as two separate contracts: one with a $1M cap, one uncapped with a gross-negligence carve-out. Query "indemnification obligations for vendor claims" against both and confirm the returned passage includes the cap or carve-out language, not just the indemnification boilerplate they share.

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
