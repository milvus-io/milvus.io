---
slug: "how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance"
title: "How do metadata filters interact with vector search?"
topic: "retrieval"
order: 15
---

Metadata filtering restricts which records are eligible for vector search. Typical constraints include tenant, language, document version, timestamp, or product category. Similarity ranks eligible candidates; it does not decide whether a record is authorized or current.

![Eligibility is a rule, relevance is an ordering](/images/ai-reference/filtering.svg)

## Decide where the constraint must hold

Applying a mandatory condition during retrieval is different from fetching a global top-k and discarding disallowed hits afterward. Post-filtering can leave too few results and can miss eligible neighbors that never entered the candidate set. For access control, the application must enforce the policy consistently on every request, including reranking and source retrieval.

Milvus supports filtered search using scalar expressions. The deployed version and index configuration determine the available execution strategies. Use documented operators and field types rather than constructing unvalidated expressions from arbitrary user input.

## Understand the performance effect

Filter evaluation has a cost, and selectivity changes the candidate population. A highly selective filter may make a small exact search attractive; other combinations of filters and approximate indexes may require more work to find enough candidates. A filter does not universally make search faster or slower.

Scalar indexes, field layout, and tenant organization can influence this behavior. Benchmark the actual distributions: a filter matching half the corpus is not representative of one matching a few dozen records. Include skewed tenants and empty-result cases.

## Test correctness and quality together

Verify that every returned record satisfies the condition, that eligible relevant records are still found, and that fewer than k eligible records produces an appropriate response. Measure recall against the correctly filtered exact baseline. Keep the filter, corpus snapshot, and k fixed when comparing index configurations, otherwise an apparent quality improvement may simply reflect a different candidate set.

## How Milvus scalar indexes accelerate the filter side

Eligibility and relevance are two different jobs: a scalar index speeds up *which records are eligible*, while the vector index still handles *how eligible records are ranked*. Milvus builds scalar indexes on metadata fields such as tenant, product, timestamp, category, or document state, and the right structure depends on the predicate and the value distribution rather than being a one-size-fits-all choice. An inverted index suits equality and set-membership predicates on moderate-to-high-cardinality fields; a bitmap index suits low-cardinality fields with frequent conjunctions or disjunctions (a boolean flag or small enum); a sorted index suits range predicates on fields with a natural order, such as timestamps or numeric scores.

Cardinality and skew matter more than the raw index type. A field with millions of distinct values behaves differently from a boolean flag, and a single popular value can dominate traffic even when the field's overall cardinality looks modest — so measure the conjunctions and disjunctions the application actually submits, not just single-predicate selectivity in isolation. A fast scalar-predicate evaluation also does not guarantee a fast or high-recall downstream ANN stage: the selective filter still changes the eligible vector population the index has to search, so benchmark the combined filter-plus-vector-search path, not the scalar lookup alone.

Scalar indexes are a maintenance cost as well as a performance lever. Each one consumes build resources and storage and can slow ingestion or updates, so index the metadata fields that matter to serving or access control rather than every column by default, and keep correctness logic (who is allowed to see a record) independent of whether an index happens to exist — a missing scalar index should never become a reason to skip the filter itself.

## Example to test

Create two tenants with almost identical passages. Query as each tenant and inspect returned IDs under the mandatory server-side predicate. A perfect relevance score does not compensate for a result from the wrong tenant. Separately, vary predicate selectivity on a scalar-indexed field while holding vectors and queries fixed, to see whether a predicate that returns few rows is still costly because of its evaluation path.

## From concept to implementation

- [Implement eligible vector retrieval](https://milvus.io/docs/filtered-search.md).
- [Create indexes on scalar fields](https://milvus.io/docs/index-scalar-fields.md).

## Continue learning

- [How should an agent choose between vector, keyword, and structured search?](/ai-quick-reference/how-agents-choose-retrieval-tools)
- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [How should you design multi-tenancy for vector search?](/ai-quick-reference/what-is-the-role-of-multitenancy-in-scalability-considerations-for-vector-databases-and-how-might-resource-isolation-be-handled-when-multiple-applications-share-the-same-infrastructure)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How does a sparse inverted index differ from dense ANN?](/ai-quick-reference/how-sparse-inverted-indexes-work)

## Implementation guides and sources

- [Filtered search](https://milvus.io/docs/filtered-search.md)
- [Filter expression operators](https://milvus.io/docs/basic-operators.md)
- [Create indexes on scalar fields](https://milvus.io/docs/index-scalar-fields.md)
- [Inverted scalar indexes](https://milvus.io/docs/inverted.md)
- [Bitmap index behavior](https://milvus.io/docs/bitmap.md)
- [Sorted scalar indexes](https://milvus.io/docs/stl-sort.md)
