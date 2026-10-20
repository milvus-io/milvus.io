---
slug: "how-scalar-indexes-support-vector-search"
title: "How do scalar indexes support filtered vector search?"
topic: "retrieval"
order: 64
---

Scalar indexes accelerate conditions on metadata such as tenant, product, timestamp, category, or document state. They complement the vector index by helping identify eligible records. They do not encode semantic similarity, and their performance depends on the predicates and value distribution.

## Choose by predicate and cardinality

Equality on a repeated category, membership in a set of IDs, and a time-range predicate are different workloads. Inverted, bitmap, and sorted index structures organize values differently. Use the current Milvus guide to check supported data types and index choices instead of applying one index family to every field.

Measure cardinality and skew. A field with millions of distinct values behaves differently from a boolean flag; one popular value can dominate traffic even when the field's overall cardinality looks modest. Include conjunctions and disjunctions that the application actually submits.

## Evaluate the vector interaction

A selective filter changes the eligible vector population and can change how much useful ANN work is required. Run filtered searches with realistic selectivities and query distributions. Fast evaluation of a metadata predicate does not guarantee that the remaining nearest-neighbor stage is fast or has the required recall.

Keep correctness separate from acceleration. Authorization and application eligibility must be expressed and validated whether or not a scalar index exists. A missing index should not become permission to omit a filter from a request.

## Account for maintenance cost

Additional indexes consume build resources and storage and can affect ingestion or update work. Select fields that are important to serving or management rather than indexing every available metadata column by default. Compare the complete read/write workload before retaining another index.

Use a fixture with allowed and disallowed records, then a larger performance dataset. Record scalar predicates, vector index settings, eligible-set sizes, latency percentiles, and quality. Revisit the decision when metadata distributions change. The useful optimization is less work at preserved eligibility and retrieval quality, not a faster query that silently changes which records are allowed to appear.

## Continue learning

- [How do metadata filters interact with vector search?](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance)
- [How does a sparse inverted index differ from dense ANN?](/ai-quick-reference/how-sparse-inverted-indexes-work)
- [How should you design multi-tenancy for vector search?](/ai-quick-reference/what-is-the-role-of-multitenancy-in-scalability-considerations-for-vector-databases-and-how-might-resource-isolation-be-handled-when-multiple-applications-share-the-same-infrastructure)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Create indexes on scalar fields](https://milvus.io/docs/index-scalar-fields.md)
- [Inverted scalar indexes](https://milvus.io/docs/inverted.md)
- [Bitmap index behavior](https://milvus.io/docs/bitmap.md)
- [Sorted scalar indexes](https://milvus.io/docs/stl-sort.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
