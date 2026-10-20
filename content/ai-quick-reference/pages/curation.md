---
slug: "what-is-data-curation-for-vector-ai"
title: "What is data curation, and how can vector search help?"
topic: "data"
order: 81
---

Data curation turns a collected dataset into a versioned selection suited to a particular use. It includes eligibility, quality assessment, deduplication, coverage, labeling, and provenance. Vector search helps inspect similar examples and coverage within the indexed collection, while the curation policy determines what should be retained. A missing hit alone cannot establish which real-world examples are absent from the dataset.

![Candidate discovery is not a deletion decision](/images/ai-reference/curation.svg)

## Track curation status in the collection itself

A practical starting point is a scalar field on the collection schema, for example `curation_status` (`VARCHAR`, values like `pending`, `approved`, `excluded`, `needs_review`) plus a `curation_reason` field and a `curated_at` timestamp. Add these alongside the vector field rather than maintaining a separate side table disconnected from the records they describe:

```python
schema.add_field("curation_status", DataType.VARCHAR, max_length=16, default_value="pending")
schema.add_field("curation_reason", DataType.VARCHAR, max_length=256, nullable=True)
schema.add_field("curated_at", DataType.INT64, nullable=True)
```

Create a scalar index on `curation_status` so filtering by curation state stays cheap as the collection grows. This turns curation from an external manifest you hope stays in sync into a queryable property of the live collection.

## Query for curation candidates, not just nearest neighbors

Use a filtered vector search to find candidates in a particular curation state near a known-good or known-bad example. For instance, to find unreviewed records similar to a confirmed low-quality document:

```python
client.search(
    collection_name="docs",
    data=[reference_vector],
    filter='curation_status == "pending"',
    limit=50,
    output_fields=["source_id", "curation_status"],
)
```

Combine this with `query()` on `curation_status == "needs_review"` to pull the current review queue directly from the collection, and with grouping search when many hits come from the same source document and only one representative per source should reach a reviewer.

## Write curation decisions back as upserts

Once a reviewer or automated check makes a decision, apply it with an upsert keyed on the stable primary key, updating `curation_status`, `curation_reason`, and `curated_at` rather than deleting the row outright. This keeps a record of why something was excluded and lets `curation_status == "excluded"` rows be filtered out of serving queries without destroying the evidence needed to audit the decision later. A true removal (for example, a licensing takedown) is a separate delete operation against that same primary key, not something to infer from the status field.

## Example to test

For a technical-document corpus, add the `curation_status` field, run a filtered search against a known duplicate to surface its unreviewed neighbors, and upsert a decision with a reason string. Confirm that a query filtered on `curation_status == "approved"` matches what the serving collection actually returns.

## From concept to implementation

- [Add and index a scalar curation-status field on the collection schema](https://milvus.io/docs/schema.md).
- [Use upsert to record curation decisions without losing the prior record](https://milvus.io/docs/upsert-entities.md).

## Continue learning

- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [How can embeddings improve dataset diversity sampling?](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings)
- [How does data quality affect vector retrieval?](/ai-quick-reference/how-does-etl-help-improve-data-quality)
- [How do you handle incremental updates in a vector database?](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)

## Implementation guides and sources

- [Quality assessment approaches](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/quality-assessment)
- [Exact, fuzzy, and semantic deduplication](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/deduplication)
- [Retrieve grouped candidates](https://milvus.io/docs/grouping-search.md)
