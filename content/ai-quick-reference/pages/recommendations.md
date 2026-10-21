---
slug: "vector-search-for-recommendations"
title: "How do vector databases support recommendation candidate retrieval?"
topic: "applications"
order: 97
---

A vector database supports recommendations by handling **candidate retrieval**: it stores an embedding for every recommendable item and, given an embedding of a user, a session, or a seed item, returns the few hundred nearest items in milliseconds. Those candidates then go to a ranking model and business rules that decide what the user actually sees. The vector database replaces a slow scan over the whole catalog with an approximate nearest-neighbor (ANN) lookup, and it applies eligibility filters such as stock, region, and already-seen items in the same query.

![Candidate retrieval is one stage of recommendation](/images/ai-reference/recommendation.svg)

## Where does vector search sit in a recommendation system?

Most large recommenders are built as a funnel, a pattern popularized by the [YouTube deep neural network recommender paper](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/) and still standard today:

| Stage | Input size | Job | Typical tool |
|---|---|---|---|
| Candidate generation | Millions to billions of items | Recall a few hundred plausible items cheaply | Embedding model + vector database, plus other sources (popular, trending, follow graph) |
| Ranking | Hundreds of candidates | Score each candidate precisely with rich features | Gradient-boosted trees or a deep ranking model |
| Re-ranking / policy | Tens of items | Diversity, freshness, fairness, ads, de-duplication | Application logic |

The split exists because a precise ranking model is too expensive to run on every item. Retrieval has to be fast and recall-oriented: if a good item is not among the candidates, no ranker can recover it. That is the stage a vector database owns. Most production systems run several retrievers in parallel (embedding-based, collaborative, rule-based) and merge their outputs before ranking, so the vector index is usually one important source rather than the only one.

## Where do the vectors come from?

The query vector and the item vectors must live in the same space, which means they come from a compatible pair of encoders. Three families cover most systems:

- **Two-tower (dual-encoder) models.** A user tower encodes profile and recent behavior; an item tower encodes item ID, text, image, and attributes. Training pushes a user's embedding close to the items they engaged with, usually scored by dot product. Because the towers are independent, item embeddings can be computed offline and indexed, and only the user embedding is computed at request time. A [survey of retrieval algorithms in ad and content recommendation](https://arxiv.org/abs/2407.01712) covers this family and its variants.
- **Behavioral item embeddings.** Item2vec-style models learn from co-occurrence in sessions or baskets ("people who viewed A also viewed B"). They power item-to-item features well and need no user tower.
- **Content embeddings.** Text, image, or multimodal encoders describe what an item *is*. They are the main tool for cold-start items that have no interaction history, and for "more like this" features.

Content similarity and personal preference are different signals. A model that knows two jackets look alike says nothing about whether this user wants a jacket today. Averaging a user's past item embeddings is a reasonable baseline, but a learned user tower usually beats it once there is enough interaction data. Treat each choice as something to measure.

## What queries does a recommender send to Milvus?

The same item collection can serve several request types:

1. **User-to-item ("For you").** Encode the user's long-term profile with the user tower and search the item vectors.
2. **Session-to-item ("Because you just viewed...").** Encode the last few interactions so recommendations react within the session.
3. **Item-to-item ("Similar items").** Use the item's own vector as the query, and exclude the item itself.

A typical item collection stores an `item_id` primary key, one or more vector fields (for example a two-tower embedding and a content embedding), and scalar fields used for eligibility and diversity: `in_stock`, `region`, `category`, `brand`, `price`, `published_at`. Choose the metric the model was trained with; two-tower models trained on dot product should use `IP`, while normalized content embeddings work with `COSINE`.

```python
results = client.search(
    collection_name="items",
    data=[user_vector],
    anns_field="two_tower_vec",
    filter='in_stock == true and region == "EU" and item_id not in [1012, 3391, 7755]',
    limit=300,
    output_fields=["item_id", "category", "brand"],
)
```

[Filtered search](https://milvus.io/docs/filtered-search.md) applies the `filter` expression during the ANN search, so every returned candidate is eligible and the list does not come back half-empty after post-filtering. For large "already seen" sets, keep a short recent exclusion list in the filter and remove older history in the ranking stage, rather than sending thousands of IDs with every query. [How metadata filters interact with vector search](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance) explains the performance side of this choice.

## How do you keep candidates diverse?

Nearest-neighbor lists often fill up with near-duplicates: five colorways of one shoe, or ten episodes of one series. [Grouping search](https://milvus.io/docs/grouping-search.md) addresses this inside the query. Setting `group_by_field="brand"` (or a product-family ID) with `group_size=2` returns the best hits per group, and `limit` then counts groups rather than rows. That gives the ranker a broader pool without a separate de-duplication pass. Grouping works with common indexes including HNSW, IVF variants, and DISKANN. Whether it improves the user's experience is still an empirical question, so test it against the ungrouped list.

When you want to blend signals, such as a two-tower embedding for preference and a content embedding for similarity, [hybrid search](https://milvus.io/docs/multi-vector-search.md) runs one `AnnSearchRequest` per vector field and fuses the results with `RRFRanker` or `WeightedRanker`. Fusion in the database is convenient for a few retrievers; complex blending usually belongs in the ranking model.

## How fresh does the index need to be?

Freshness has two separate parts. **Catalog freshness**: new and changed items need vectors and correct metadata quickly. Milvus accepts streaming `insert`, `upsert`, and `delete`, so a price change or stock-out can be applied as a scalar update without re-embedding. **Behavioral freshness**: the user vector should reflect what the user just did. That is a feature-pipeline and model problem, because the query vector is computed at request time. A perfectly fresh index cannot help if the user tower ignores recent clicks.

When the item tower is retrained, every item vector changes and old and new vectors are not comparable. Write the new embeddings to a new collection (or a new vector field), backfill, validate, and then switch traffic. Do not mix model versions in one field. [Incremental updates in a vector database](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database) covers the mechanics.

## What about cold start?

New items have no interaction history, so a pure ID-embedding tower places them poorly. Give the item tower content features (title, image, category) so a new item lands near similar existing items on day one, or retrieve new items through a content-embedding field and reserve some candidate slots for them. New users have no history either: start from context (region, device, entry page, the first item they view) and switch to the user tower as events accumulate. Report cold-start users and items separately in evaluation, because averages hide them.

## How do you evaluate the retrieval stage?

Evaluate retrieval for what it is supposed to do: recall. Common offline metrics are Recall@K and hit rate@K, which ask whether the item the user later engaged with appears in the top K candidates. Use a time-based split, building queries only from behavior before the cutoff and labels from behavior after it, to avoid leaking the future into the past.

Then measure the full funnel. A retriever change that raises Recall@300 can still lose online if the ranker cannot use the new candidates or if diversity drops. Online, clicks are biased by position and exposure, so rely on A/B tests rather than raw click-through from logs. Watch serving signals too: p99 latency, empty or short candidate lists after filtering, repeated items, and how stable recommendations look from one visit to the next. [Evaluating retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved) and [batching, latency, and throughput](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search) go deeper on both sides.

## A reference architecture

1. **Offline:** train the two-tower model on interaction logs; batch-encode every item; bulk-load vectors and metadata into a Milvus collection with an HNSW or IVF index, choosing the metric the model was trained with.
2. **Streaming:** pipe catalog changes (new items, stock, price) into Milvus with `upsert` and `delete`; pipe user events into the feature store.
3. **Online:** at request time compute the user or session vector, run a filtered (optionally grouped) search for a few hundred candidates, merge with other candidate sources, rank, apply policy, and log impressions for the next training round.
4. **Model refresh:** re-embed the catalog into a new collection, validate recall against the old one, then cut over.

E-commerce teams apply the same retrieval machinery across search and discovery; [Tokopedia's story](https://zilliz.com/customers/tokopedia) describes how the Indonesian marketplace used Milvus to improve product search, which shares the catalog embeddings, eligibility filters, and freshness requirements described above.

## Related reading

- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [How can hybrid and multimodal search improve product discovery?](/ai-quick-reference/hybrid-multimodal-product-search)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)

## Sources and next steps

To build it, start with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), then follow the [recommendation-system tutorial](https://milvus.io/docs/recommendation_system.md), which encodes MovieLens users and movies into a shared vector space and serves recommendations from Milvus. More end-to-end examples are in the [Milvus Bootcamp](https://milvus.io/bootcamp).

- [Recommendation-system example](https://milvus.io/docs/recommendation_system.md)
- [Filtered search](https://milvus.io/docs/filtered-search.md)
- [Grouping search](https://milvus.io/docs/grouping-search.md)
- [Hybrid (multi-vector) search](https://milvus.io/docs/multi-vector-search.md)
- [Covington, Adams, Sargin: Deep Neural Networks for YouTube Recommendations](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/)
- [Zhao and Liu: A Survey of Retrieval Algorithms in Ad and Content Recommendation Systems (arXiv 2407.01712)](https://arxiv.org/abs/2407.01712)
