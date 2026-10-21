---
slug: "what-is-data-curation-for-vector-ai"
title: "What is data curation, and how can vector search help?"
topic: "data"
order: 81
---

Data curation is the work of turning raw collected data into a dataset fit for a specific purpose: deciding what to keep, cleaning and labeling it, removing duplicates and low-quality items, balancing coverage, and recording where everything came from so the result can be trusted and reproduced. For AI, the purpose is usually training a model or serving retrieval, and the scale is too large for item-by-item human review. Vector search helps because most curation questions are similarity questions: *what else looks like this bad example, which items are near-copies, which regions of the data are over- or under-represented, and what in the pool resembles the cases we are missing?* A vector database such as Milvus answers those questions over millions of items and stores the resulting decisions next to the data.

![Candidate discovery is not a deletion decision](/images/ai-reference/curation.svg)

## What does data curation involve?

Most curation pipelines, whether for LLM pre-training text, image-text pairs, driving video, or a RAG knowledge base, combine the same activities:

| Activity | Question it answers | Typical method |
|---|---|---|
| Eligibility and governance | May we use this item at all? | License, consent, PII and tenant rules on metadata |
| Quality filtering | Is it well-formed and useful? | Heuristics, quality classifiers, perplexity or aesthetic scores |
| Deduplication | Is it a copy of something we already have? | Hashing, MinHash, embedding similarity |
| Coverage and balance | Does the set represent what the model must handle? | Clustering, stratified or diversity sampling |
| Gap filling | What important cases are missing or rare? | Similarity search from seed examples |
| Labeling and enrichment | What is it, and what is the right answer? | Human annotation, model-assisted labeling |
| Provenance and versioning | Where did it come from, and which dataset version includes it? | IDs, source references, manifests |

Research on large training sets keeps showing that the curated subset beats the raw pool. SemDeDup, for example, removed about half of a web-scale image-text dataset as semantic duplicates with minimal loss in model quality. The common lesson is that curation is a compute-saving step, not just a hygiene step.

## Where does vector search fit in curation?

Four of the activities above are fundamentally neighborhood queries over embeddings:

- **Deduplication.** Items whose embeddings fall within a tight similarity band are candidate duplicates. See [embedding-based deduplication](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping).
- **Find more like this.** One confirmed bad item (a spam template, a corrupted frame, a mislabeled image) is a query: search for its neighbors and review them together instead of one at a time.
- **Coverage analysis.** Clusters of embeddings show which themes dominate and which are thin, which drives [diversity sampling](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings) and [document clustering](/ai-quick-reference/how-are-embeddings-used-in-document-clustering).
- **Gap filling.** A few examples of a rare case (night-time rain, a minority language, an edge-case API error) become queries that mine similar items from a large unlabeled pool.

Vector search does not replace quality classifiers, license checks, or human judgment. It makes those steps cheaper by grouping similar items so one decision can be applied, after review, to many.

## How to run a curation workflow in Milvus

### Store curation state on the record

Put curation fields on the same collection as the vectors, rather than in a side table that drifts out of sync:

```python
schema.add_field("curation_status", DataType.VARCHAR, max_length=16, default_value="pending")
schema.add_field("curation_reason", DataType.VARCHAR, max_length=256, nullable=True)
schema.add_field("curated_at", DataType.INT64, nullable=True)
schema.add_field("source_id", DataType.VARCHAR, max_length=128)
```

Values such as `pending`, `approved`, `excluded`, and `needs_review` make curation a queryable property of the live data. Add a scalar index (for example `INVERTED`) on `curation_status` so filtering stays fast as the collection grows.

### Find candidates near a known example

Use a filtered vector search to pull unreviewed items similar to a confirmed problem:

```python
client.search(
    collection_name="docs",
    data=[reference_vector],
    filter='curation_status == "pending"',
    limit=50,
    output_fields=["source_id", "curation_status"],
)
```

For "everything within this similarity" rather than "the top 50," use [range search](/ai-quick-reference/when-to-use-vector-range-search) with `radius` and `range_filter`. When many hits come from one source and a reviewer only needs one per source, a [grouping search](https://milvus.io/docs/grouping-search.md) with `group_by_field="source_id"` returns a representative per group. To fetch the current review queue directly, call `query(filter='curation_status == "needs_review"')`.

### Write decisions back with upsert

When a reviewer or an automated rule decides, upsert the decision keyed on the record's primary key instead of deleting the row. On Milvus 2.6.2 and later, `partial_update=True` merges the fields you send into the existing record and leaves the vector and every other field untouched:

```python
client.upsert(
    collection_name="docs",
    data=[{"id": 8812, "curation_status": "excluded",
           "curation_reason": "near-duplicate of 8790", "curated_at": 1760918400}],
    partial_update=True,
)
```

Without `partial_update=True` (or on an older release), upsert runs in override mode: it replaces the whole entity, so you must send the complete record, vector included. Omitted nullable fields are reset to null, and required fields make the request fail. Fetch the record with `query()` first if you need to rewrite it in full.

Serving and export queries then filter on `curation_status == "approved"`, while excluded rows stay in place and the decision can be reversed. An upsert overwrites the previous value, though, so the collection only holds each record's *current* status. If you need to know who changed what and when, append each decision to a separate log (a decisions table in your warehouse, or an append-only Milvus collection keyed by decision ID) rather than relying on the record itself. True removals, such as a license takedown or an erasure request, are a separate `delete` by primary key and must also reach any derived copies.

### Export a versioned dataset

A curated dataset is a selection plus its reasons. Export approved IDs with a query iterator, write them to a manifest along with the embedding model, thresholds, and rule versions used, and keep that manifest with the training run. [Reproducible vector-search and training experiments](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments) covers this versioning.

## How do you keep automated curation honest?

Similarity is evidence, not a verdict. Two contract versions can differ in a single clause, and two frames can look the same yet capture different events. Keep these habits:

- **Calibrate thresholds on labeled pairs** from your own data, not on defaults.
- **Review a sample of every bulk decision,** especially near the threshold.
- **Measure what removal costs:** track coverage of rare classes and downstream metrics, not just rows removed.
- **Keep a random baseline** of the same size to prove that curation helped.
- **Re-run when the embedding model changes,** since neighborhoods and thresholds shift with it.

For image and video data, where frames, clips, and captions each need their own vectors, see [curating image and video data](/ai-quick-reference/how-to-curate-image-and-video-data). For the upstream checks that keep bad data out of the pool, see [how data quality affects vector retrieval](/ai-quick-reference/how-does-etl-help-improve-data-quality).

## Next step

Add the curation fields to a test collection, load a sample with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), and try the find-similar-then-upsert loop on a known bad example. For curation at hundreds of millions of items, [Zilliz Cloud](https://zilliz.com/cloud) runs the same APIs as a managed service.

## Sources and further reading

- [Data curation (Wikipedia)](https://en.wikipedia.org/wiki/Data_curation)
- [Abbas et al., SemDeDup: Data-efficient learning at web-scale through semantic deduplication (arXiv)](https://arxiv.org/abs/2303.09540)
- [NeMo Curator: quality assessment approaches](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/quality-assessment)
- [NeMo Curator: exact, fuzzy, and semantic deduplication](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/deduplication)
- [Milvus: upsert entities](https://milvus.io/docs/upsert-entities.md)
- [Milvus: grouping search](https://milvus.io/docs/grouping-search.md)
- [Milvus: collection schema](https://milvus.io/docs/schema.md)
