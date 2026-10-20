---
slug: "when-to-use-vector-range-search"
title: "When should you use range search instead of only top-k?"
topic: "retrieval"
order: 68
---

Use range search when what matters is *how similar* a result is, not just *how many* results you get back. A plain top-k search always returns k neighbors, even when the nearest one is a poor match; range search (also called radius or threshold search) only returns vectors whose distance or similarity score falls inside a bound you set. That makes it the right tool for deduplication, "no good answer" detection in RAG, match/no-match decisions such as image or face matching, and any workflow that needs a similarity floor. In Milvus you add `radius` and, optionally, `range_filter` to an ordinary search, and `limit` still caps the number of results.

## Top-k vs range search

| | Top-k search | Range search |
| --- | --- | --- |
| Question it answers | "What are the k most similar items?" | "Which items are at least this similar?" |
| Result count | Always k (if the collection has k eligible items) | Anywhere from zero to `limit` |
| Weak matches | Returned anyway when nothing better exists | Excluded by the threshold |
| Main parameter | `limit` | `radius` (plus optional `range_filter`) and `limit` |
| Needs calibration | Rarely | Yes, per model and metric |
| Typical uses | Search results pages, RAG context, recommendations | Dedup, match decisions, similarity floors, "nothing relevant" detection |

The two are often combined: fetch the top k, but only among results above a similarity floor.

## How does range search work in Milvus?

Milvus runs a normal ANN search with the collection's index and metric, keeps only results whose score falls in the band defined by `radius` and `range_filter`, and returns up to `limit` of them, best first. Think of two concentric circles around the query: `radius` is the outer boundary (how far is still acceptable), and `range_filter` is an optional inner boundary that excludes results that are *too* close, such as exact copies of the query.

The direction of the inequalities depends on whether the metric is a distance (smaller is closer) or a similarity (larger is closer):

| Metric | Closer means | Condition on returned results |
| --- | --- | --- |
| `L2` | Smaller distance | `range_filter <= distance < radius` |
| `IP` | Larger score | `radius < score <= range_filter` |
| `COSINE` | Larger score | `radius < score <= range_filter` |
| `JACCARD` | Smaller distance | `range_filter <= distance < radius` |
| `HAMMING` | Smaller distance | `range_filter <= distance < radius` |

So with `COSINE`, `radius` is the *lower* similarity bound and `range_filter` the upper one; with `L2`, `radius` is the *upper* distance bound. Copying a threshold from one metric to another silently inverts its meaning. See [cosine, inner product, and L2](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings) for how the metrics relate.

```python
results = client.search(
    collection_name="articles",
    data=[query_vector],
    anns_field="embedding",
    limit=50,
    search_params={
        "metric_type": "COSINE",
        "params": {
            "radius": 0.80,        # keep results with cosine > 0.80
            "range_filter": 0.995  # drop near-identical copies above 0.995
        },
    },
    output_fields=["title"],
)
```

Three behaviors are worth remembering:

- **`limit` still applies.** If 5,000 items clear the threshold and `limit` is 50, you get 50. A single search request caps topK at 16,384; for larger result sets, the Milvus docs recommend a SearchIterator.
- **It is approximate.** Range search sits on top of the ANN index, so an item inside the range can be missed if the index never visits it, just as in top-k search. Search effort parameters such as `ef` or `nprobe` still matter.
- **Filters combine normally.** Add a `filter` expression to restrict eligibility (tenant, language, date) and the threshold applies to what remains.

## When is range search the better choice?

**Near-duplicate detection.** For each new item, ask for everything above a high similarity threshold. Items that return nothing are novel; items that return matches go to a review or merge step. A similarity score does not prove two documents are interchangeable (a changed number, version, or permission can matter even when vectors are almost identical), so treat hits as candidates. For text, [MinHash LSH](/ai-quick-reference/what-is-minhash-lsh) is a complementary path that targets literal overlap.

**Guarding RAG against irrelevant context.** Top-k always fills the prompt, even with off-topic passages when the knowledge base has nothing relevant. A similarity floor lets the application say "no relevant documents found" or route the question elsewhere instead of feeding weak context to the model.

**Match / no-match decisions.** Image matching, face verification, and entity resolution often need a binary answer. Szilvasy, Mazaré, and Douze argue these workloads should be evaluated with range-search metrics rather than top-k recall, because the decision depends on the distance, not the rank.

**Recommendations with a quality bar.** Return "more like this" only when items are genuinely close, and fall back to popular items otherwise.

**Excluding the query itself.** When searching with an item that is already in the collection, `range_filter` can drop the item and its exact copies while keeping close neighbors.

Top-k alone is fine when every query is expected to have useful neighbors and the consumer just needs a ranked list, as on a typical search results page.

## How do you choose the threshold?

There is no universal number. A cosine of 0.8 means different things for different models: some embedding models spread unrelated texts around 0.1, others cluster everything above 0.6. Thresholds also shift with normalization, domain, text length, and model version. Calibrate them:

1. **Collect labeled pairs.** Gather clear matches, clear non-matches, and hard negatives (similar-looking but different, such as two product variants or two versions of a policy).
2. **Score them** with the exact model and metric you will deploy.
3. **Sweep the threshold** and plot precision (accepted pairs that are real matches) against recall (real matches that are accepted).
4. **Pick the operating point** your application can live with. Deduplication that deletes data needs high precision; a RAG relevance floor can tolerate more false positives.
5. **Separate threshold error from ANN error.** Run the same queries on a `FLAT` index and compare. If `FLAT` finds an in-range item that the ANN index misses, increase search effort; if both accept a bad pair, the threshold or model is the problem. The [FLAT baseline guide](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline) covers this setup.

Store the threshold next to the model name and version that produced it, and recalibrate after re-embedding. Also test the edges: queries with zero results, dense clusters where more items qualify than `limit` allows, and scores sitting right at the boundary. Decide in advance what the user sees when nothing qualifies.

## Common mistakes

- Reusing an `L2` radius with `COSINE` (or the reverse) and getting the inequality backwards.
- Using `IP` with unnormalized vectors and expecting scores in a fixed range.
- Assuming range search returns *every* qualifying item, when `limit` and ANN approximation both cap it.
- Picking a threshold from a demo instead of from labeled data, then never revisiting it after a model upgrade.

For measuring the result, see [how to evaluate retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved) and [how embeddings help with deduplication](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping).

To try it, load sample data with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), then add `radius` and `range_filter` to a search as shown in the [range search guide](https://milvus.io/docs/range-search.md).

## Sources and further reading

- [Milvus: range search](https://milvus.io/docs/range-search.md)
- [Milvus: metric types](https://milvus.io/docs/metric.md)
- [Milvus: search iterators](https://milvus.io/docs/with-iterators.md)
- [Szilvasy, Mazaré, and Douze, Vector search with small radiuses](https://arxiv.org/abs/2403.10746)
