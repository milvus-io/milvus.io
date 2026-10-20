---
slug: "exact-fuzzy-and-semantic-deduplication"
title: "How should you combine exact, fuzzy, and semantic deduplication?"
topic: "data"
order: 83
---

Exact, fuzzy, and semantic deduplication detect different relationships. Exact matching finds identical representations. Fuzzy matching captures substantial lexical overlap after a defined transformation. Semantic methods use learned representations to find related meaning. A useful workflow chooses the method for the unwanted repetition rather than applying one threshold to every case.

## Use a staged candidate pipeline

Start with deterministic normalization and exact hashes when identical copies are common. Add shingle-based or MinHash candidate discovery for edits and formatting changes. Use embeddings for paraphrases or other meaning-based repetition that the earlier stages miss.

Keep each transformation versioned. Aggressive normalization can make distinct source records look identical; an embedding can make different facts look similar. Record which stage proposed each duplicate pair so false removals can be diagnosed.

## Define what one retained item represents

A duplicate policy must decide whether to keep the most complete, best licensed, highest quality, or otherwise preferred record. Preserve the source relationships of removed copies when they matter for provenance.

Group construction deserves separate review. Similarity is not always transitive: a chain of pairwise matches can connect records that should not all be treated as interchangeable. Validate the grouping and representative policy rather than treating connected-component size as proof of duplication.

## Measure coverage and harm

Label pairs across documents with small factual changes, boilerplate, code, multilingual content, and rare domains. Measure candidate recall, false-pair rate, and the rate at which useful distinct records are removed. Evaluate the final retained distribution, not just the accuracy of an intermediate score.

Run initially in identification-only mode and save a decision manifest. Compare downstream retrieval or training behavior against the unmodified baseline. Keep the resource cost of each stage visible so expensive semantic analysis is focused where it adds value. A staged workflow is successful when it removes unwanted redundancy while retaining distinctions that the application or learner needs.

## Continue learning

- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [How does MINHASH_LSH help find near-duplicate text?](/ai-quick-reference/what-is-minhash-lsh)
- [What is data curation, and how can vector search help?](/ai-quick-reference/what-is-data-curation-for-vector-ai)
- [How can vector search help detect train-test contamination?](/ai-quick-reference/how-to-detect-train-test-contamination)

## Implementation guides and sources

- [Deduplication workflow choices](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/deduplication)
- [MinHash text signatures](https://milvus.io/docs/minhash-function.md)
- [Approximate overlap candidate search](https://milvus.io/docs/minhash-lsh.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
