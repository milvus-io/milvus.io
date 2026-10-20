---
slug: "how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved"
title: "How do you evaluate retrieval quality?"
topic: "rag-agents"
order: 20
---

Evaluate retrieval against a held-out set of representative queries and relevance judgments. Define which passages provide useful evidence for each query, then compare systems using a fixed corpus version, eligibility policy, and final top-k. A result that looks related is not necessarily sufficient to answer the question.

![Measure four different outcomes separately](/images/ai-reference/evaluation.svg)

## Use metrics with explicit meanings

Recall@k measures the fraction of known relevant records found in the first k results. Precision@k measures the fraction of the first k results judged relevant. NDCG@k accounts for ranking order and can use graded judgments. These metrics answer different questions; select them to reflect how the application uses retrieved evidence.

If two of four known relevant passages appear among five returned results, recall@5 is 2/4 and precision@5 is 2/5. Incomplete relevance labels can distort both figures. Inspect apparent false positives, define how duplicates are treated, and record the judgment process.

## Separate index approximation from relevance

ANN recall compares approximate results with exact vector neighbors, but exact neighbors are not automatically relevant to a user. Measure index recall to diagnose the search structure, and judged relevance to evaluate the model and retrieval pipeline. This distinction prevents unnecessary index tuning when the underlying representation is the problem.

## Analyze failure slices

Report results for exact identifiers, paraphrases, rare entities, long questions, language groups, and filtered queries where applicable. Include questions with no supporting evidence. Keep a validation set separate from the queries used to tune models, chunking, or fusion weights.

Finally, measure latency and cost at the same quality target. In RAG, evaluate the generator's evidence use and citation accuracy separately. A strong retrieval score can coexist with an unsupported answer, while fluent answers can conceal poor retrieval.

## Example to test

Keep exact-neighbor agreement, judged passage relevance, answer support, and business activation in separate columns. A parameter change can improve one while worsening another. Use a fixed query split to attribute changes.

## From concept to implementation

- [Build an evidence-backed RAG pipeline](https://milvus.io/docs/build-rag-with-milvus.md).
- [Find a runnable application starting point](https://milvus.io/bootcamp).

## Continue learning

- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)
- [What are hard negatives in retrieval training, and how can you mine them?](/ai-quick-reference/what-are-hard-negatives-in-retrieval)
- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)
- [How do you choose chunk size for RAG?](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications)
- [What is reranking, and when should you apply it?](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [BEIR retrieval metrics](https://github.com/beir-cellar/beir/wiki/Metrics-available)
- [Evaluate RAG with Ragas](https://milvus.io/docs/integrate_with_ragas.md)

