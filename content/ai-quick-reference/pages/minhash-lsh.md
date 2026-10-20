---
slug: "what-is-minhash-lsh"
title: "How does MINHASH_LSH help find near-duplicate text?"
topic: "retrieval"
order: 66
---

MinHash estimates similarity between sets, often sets of text shingles. Locality-sensitive hashing uses signatures to find candidate pairs without comparing every document with every other document. Milvus exposes a MINHASH_LSH index and a documented MinHash function workflow for supported releases.

## Define the text transformation

Decide how documents are normalized and divided into shingles before generating signatures. Case handling, punctuation, boilerplate removal, and shingle length change what overlap means. Preserve this configuration as part of the representation revision.

MinHash targets set-overlap similarity. Dense embeddings target a learned notion of similarity. A document with small wording changes can be a good MinHash candidate, while a paraphrase with different words may require semantic retrieval. Choose according to the duplicates the application wants to detect.

## Treat retrieved pairs as candidates

An approximate candidate stage can miss pairs or include pairs that fail the final duplicate policy. Validate candidates using the intended overlap calculation or a reviewed classifier. Avoid deleting all semantically similar documents when small factual or instructional differences matter.

Keep stable document IDs and a reason for each proposed removal. If candidate pairs are grouped into connected components, inspect chain effects: A can match B and B can match C without A and C satisfying the same threshold. A grouping algorithm needs a policy beyond simply accepting every retrieved edge.

## Calibrate before removing data

Label a sample covering exact copies, formatting changes, boilerplate-heavy text, translations, and genuinely different content. Measure candidate coverage and false removals separately. Sweep supported signature and index parameters, then measure resource use on a realistic corpus.

Start in identification-only mode and export a reviewable decision manifest. Compare downstream training or retrieval quality after applying the policy, including rare-domain retention. The successful outcome is an explainable reduction of unwanted repetition, with enough source and configuration information to reproduce or reverse the decision.

## Example to test

Compare lightly edited text and a meaning-preserving paraphrase. MinHash similarity reflects the chosen token or shingle representation; semantic retrieval can supply another candidate path. Inspect both before choosing a deletion policy.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [How should you combine exact, fuzzy, and semantic deduplication?](/ai-quick-reference/exact-fuzzy-and-semantic-deduplication)
- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [What is data curation, and how can vector search help?](/ai-quick-reference/what-is-data-curation-for-vector-ai)
- [When should you use range search instead of only top-k?](/ai-quick-reference/when-to-use-vector-range-search)

## Implementation guides and sources

- [Milvus MINHASH_LSH index](https://milvus.io/docs/minhash-lsh.md)
- [Generate MinHash signatures from text](https://milvus.io/docs/minhash-function.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
