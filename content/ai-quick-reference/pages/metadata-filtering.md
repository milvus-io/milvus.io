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

## Example to test

Create two tenants with almost identical passages. Query as each tenant and inspect returned IDs under the mandatory server-side predicate. A perfect relevance score does not compensate for a result from the wrong tenant.

## From concept to implementation

- [Implement eligible vector retrieval](https://milvus.io/docs/filtered-search.md).
- [Make the metadata contract explicit](https://milvus.io/docs/schema.md).

## Continue learning

- [How do scalar indexes support filtered vector search?](/ai-quick-reference/how-scalar-indexes-support-vector-search)
- [How should an agent choose between vector, keyword, and structured search?](/ai-quick-reference/how-agents-choose-retrieval-tools)
- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [How should you design multi-tenancy for vector search?](/ai-quick-reference/what-is-the-role-of-multitenancy-in-scalability-considerations-for-vector-databases-and-how-might-resource-isolation-be-handled-when-multiple-applications-share-the-same-infrastructure)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Filtered search](https://milvus.io/docs/filtered-search.md)
- [Filter expression operators](https://milvus.io/docs/basic-operators.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
