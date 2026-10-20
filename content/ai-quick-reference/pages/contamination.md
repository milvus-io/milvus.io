---
slug: "how-to-detect-train-test-contamination"
title: "How can vector search help detect train-test contamination?"
topic: "data"
order: 84
---

Train-test contamination occurs when evaluation evidence is present in learning or selection data in a way that compromises the intended independence of the test. Vector search can help discover paraphrased or otherwise related candidates, but a high similarity score alone does not prove leakage.

## Define the evaluation boundary

Identify what must remain independent: complete tasks, source documents, users, repositories, conversations, or time periods. Split related records together when one source can produce many chunks or trajectories. Randomly splitting rows can leave near-identical derivatives on both sides.

Keep a protected evaluation manifest with stable IDs and source revisions. Apply the boundary to prompt examples, retrieval memory, rollout archives, and curation labels as well as direct training files. An evaluation task can leak through a retrieved historical answer even when it is absent from the training export.

## Search in several representations

Use exact hashes and lexical overlap to find straightforward copies. Add semantic retrieval for paraphrases or changed formatting, then inspect the original sources. For code or structured tasks, preserve identifiers and test descriptions that a generic text embedding may underweight.

Calibrate the candidate threshold using confirmed matches and hard negatives. Two questions about the same topic can be legitimately independent, while a translated or lightly rewritten evaluation item can retain decisive overlap. Review the relationship that matters to the benchmark, not only its embedding distance.

## Publish an auditable decision

Record matched IDs, source revisions, detection method, score, review label, and exclusion action. Keep a version of the evaluation performed before remediation so metric changes can be interpreted.

Repeat checks after new data ingestion, memory expansion, or synthetic task generation. Report known residual risks and the scope searched without treating an absence of retrieved matches as proof of perfect independence. A useful contamination workflow combines reproducible candidate discovery with a clear split policy and review of the underlying evidence.

## Example to test

Compare held-out questions with training passages and retain candidate overlap pairs for review. A paraphrase can leak the answer without sharing many words, while two domain-related passages can be legitimate distinct examples.

## From concept to implementation

- [Design a bounded batch-data workflow](https://milvus.io/docs/integrate_with_spark.md).
- [Validate the source-to-serving data contract](https://milvus.io/docs/prepare-source-data.md).

## Continue learning

- [How can vector retrieval support pretraining data preparation?](/ai-quick-reference/how-vector-search-supports-pretraining-data-preparation)
- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)
- [How should you combine exact, fuzzy, and semantic deduplication?](/ai-quick-reference/exact-fuzzy-and-semantic-deduplication)
- [What lineage metadata should connect source data, embeddings, and training sets?](/ai-quick-reference/data-lineage-for-embeddings-and-training)

## Implementation guides and sources

- [Candidate duplicate identification](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/deduplication)
- [Dataset processing and splits](https://huggingface.co/docs/datasets/process)
- [Similarity-based candidate retrieval](https://milvus.io/docs/range-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
