---
slug: "what-are-hard-negatives-in-retrieval"
title: "What are hard negatives in retrieval training, and how can you mine them?"
topic: "data"
order: 86
---

A hard negative is a candidate that looks competitive to a retriever but is not relevant under the training task's definition. Such examples can help distinguish subtle differences that easy unrelated documents do not expose. Their value depends on correct labels: a mislabeled relevant result teaches the wrong boundary.

## Mine from the system's real errors

Use the current retriever to obtain high-ranking candidates for queries with known positives. Apply the task's eligibility rules and remove known positives, exact duplicates, and other accepted relevant sources. Preserve candidate scores and the model revision used for mining.

An error-code query can yield a document about a neighboring but different code. A policy question can retrieve an obsolete revision. These can be informative negatives when the task clearly labels them as ineligible or nonresponsive. A second document that validly answers the question is an additional positive, not a negative merely because it was absent from the first label set.

## Review the uncertainty

Use human review or a calibrated assessment workflow to check ambiguous candidates. Keep adjudication evidence and avoid treating a reranker's score as unquestionable ground truth. Inspect labels across languages, long documents, and examples where relevance depends on metadata.

Balance difficult examples with the broader query distribution. An exclusively adversarial set can overemphasize narrow distinctions and damage ordinary retrieval. Keep the ratio, selection thresholds, and sampling policy versioned.

## Evaluate the retrained representation

Compare on held-out queries and source records, with contamination checks for near-duplicate tasks. Measure exact-term, paraphrase, and domain-specific slices alongside overall ranking metrics. Include an unmodified baseline and record whether improvements transfer beyond the mined examples.

Refresh mining after meaningful model or corpus changes. Previously hard candidates can become easy, and new failure patterns can appear. Milvus can make repeated candidate discovery efficient, while the training and labeling pipeline determines the learning objective and the quality of each negative.

## Continue learning

- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How can vector search help detect train-test contamination?](/ai-quick-reference/how-to-detect-train-test-contamination)
- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)

## Implementation guides and sources

- [Sentence Transformers retrieval and hard-negative utilities](https://www.sbert.net/docs/package_reference/util/index.html)
- [Constrain candidate mining](https://milvus.io/docs/filtered-search.md)
- [Assess candidate relevance](https://milvus.io/docs/rerankers-overview.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
