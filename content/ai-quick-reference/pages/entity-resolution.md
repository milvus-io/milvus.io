---
slug: "vector-search-for-entity-resolution"
title: "How can vector search help resolve duplicate or related entities?"
topic: "applications"
order: 98
---

Entity resolution determines whether records refer to the same real-world entity. Vector retrieval can generate candidate matches when names or descriptions vary. The identity decision needs additional evidence because similar descriptions can refer to distinct people, organizations, products, or locations.

## Candidate generation and blocking in Milvus

A workable schema stores a `name_embedding` (a `FLOAT_VECTOR` field built from a Sentence-Transformers encoding of the entity's normalized name/description) alongside scalar fields for `entity_type`, `source_system`, `country`, and the raw identifier fields used for exact matching. Build an `HNSW` or `IVF_FLAT` index on `name_embedding` for approximate nearest-neighbor candidate search, and a scalar `INVERTED` index on `entity_type` and `country` so blocking runs as a pre-filter rather than a post-filter — `search()` with an `expr` like `entity_type == "vendor" and country == "US"` restricts the ANN search to the same block before distance is computed, which is both faster and more correct than filtering a broader candidate list afterward.

For each new or updated record, run `search(data=[name_embedding], expr=block_filter, limit=50)` to pull the top-50 nearest names within the same block. That call is the entire "candidate generation" step; everything after it — comparing registration numbers, addresses, and known aliases — is a separate matching stage that does not touch the vector index.

## Separate retrieval from matching

Use embeddings to reduce the candidate space, then evaluate structured fields and source evidence. Exact identifiers, addresses, dates, and known relationships can be more decisive than semantic similarity. Preserve original values alongside normalized forms so reviewers can inspect what changed.

For example, two vendors can have nearly identical names but different registration identifiers. Conversely, one vendor can appear under several historical names. A candidate score should not silently become a merge decision without the appropriate identity policy.

## Constrain the search task

Apply meaningful scope such as entity type, source system, geography, or time where it is justified. Combine lexical retrieval for exact tokens with semantic retrieval for descriptions. Calibrate thresholds using reviewed positive and negative pairs from the target domain.

Keep candidate recall separate from final-match precision. A broad first stage can be valuable if a reliable second stage rejects false matches. A narrow first stage can permanently hide a true match even when the downstream matcher is accurate.

## Make merges explainable and reversible

Store source IDs, proposed canonical ID, evidence, model and policy revisions, reviewer status, and merge history. Inspect transitive effects: merging A with B and B with C can create a larger group that violates the intended identity rule.

Evaluate pair-level decisions and final entity groups, including false merges, missed duplicates, and recovery from a corrected decision. Preserve downstream references when canonical identity changes. Milvus can accelerate repeated candidate discovery, while the application owns the authoritative identity graph and the rules for combining or separating entities.

## Example to test

Two suppliers with similar names may be separate legal entities. Retrieve candidate pairs, then compare authoritative identifiers and supporting attributes. Keep uncertain pairs reversible; nearest-neighbor rank alone is not a merge decision.

## From concept to implementation

- [Filter candidates by block before scoring](https://milvus.io/docs/filtered-search.md).
- [Create indexes on scalar fields](https://milvus.io/docs/index-scalar-fields.md).

## Continue learning

- [How can Sentence Transformers deduplicate a large, overlapping set of text entries?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)
- [How does data quality affect vector retrieval?](/ai-quick-reference/how-does-etl-help-improve-data-quality)

## Implementation guides and sources

- [Retrieve candidates within score bounds](https://milvus.io/docs/range-search.md)
- [Lexical evidence for names and identifiers](https://milvus.io/docs/full-text-search.md)
- [Restrict candidate scope](https://milvus.io/docs/filtered-search.md)
