---
slug: "how-to-build-search-and-agent-evaluation-datasets"
title: "How do you build an evaluation set for agentic and vector search?"
topic: "rag-agents"
order: 80
---

A search evaluation set should represent the decisions the application needs to make. It contains queries or tasks, the eligible data state, relevance or outcome judgments, and enough metadata to understand where the system succeeds or fails. A list of easy demonstration questions is not an adequate replacement.

## Sample the real intent mix

Include exact identifiers, paraphrases, multi-part questions, rare-domain queries, selective filters, and requests with no supported answer. Preserve the tenant, product version, language, and time context needed to determine eligibility. Use consented production examples where available and reviewed synthetic cases for gaps.

For document retrieval, judge which source records provide useful evidence. For an agentic task, also define an acceptable final outcome and tool constraints. A plan can retrieve relevant text while taking unnecessary or invalid actions, so evidence quality and task behavior need separate assessment.

## Keep data states reproducible

Record the corpus snapshot, source revisions, model versions, and evaluation policy. Avoid allowing training data, prompt examples, or trajectory retrieval to contain protected evaluation tasks or near-duplicates. Split related documents and episodes consistently to limit leakage.

Create a development set for iteration and a held-out set for decisions. If relevance judgments change, version them and explain the reason. An updated rubric should not silently change the apparent trend of an unchanged system.

## Report failures by useful slices

Measure candidate coverage and ranking metrics alongside grounded answer quality, task completion, latency, errors, and tool cost. Review query groups rather than relying entirely on one average score. Important exact-term or minority-language failures can be hidden by a large easy slice.

Keep qualitative examples with source evidence for each material regression. Use them to decide whether to change data, representation, indexing, or agent control. A compact, maintained evaluation set gives the team a repeatable release criterion and makes later performance or architecture experiments easier to interpret.

## Continue learning

- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How can vector search help detect train-test contamination?](/ai-quick-reference/how-to-detect-train-test-contamination)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [RAG evaluation integration](https://milvus.io/docs/integrate_with_ragas.md)
- [Retrieval metric definitions](https://github.com/beir-cellar/beir/wiki/Metrics-available)
- [Agentic retrieval reference workflow](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
