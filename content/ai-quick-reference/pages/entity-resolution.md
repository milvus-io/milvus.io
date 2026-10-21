---
slug: "vector-search-for-entity-resolution"
title: "How can vector search help resolve duplicate or related entities?"
topic: "applications"
order: 98
---

Entity resolution (also called record linkage or deduplication) is the job of deciding which records, within one dataset or across several, refer to the same real-world person, company, product, or place. Vector search helps at the most expensive step: instead of comparing every record with every other record, you embed each record and use approximate nearest-neighbor (ANN) search to pull a short list of likely matches. A separate matcher then decides which of those candidates are true duplicates, and a clustering step turns pairwise decisions into resolved entities.

The split matters. Embeddings are good at noticing that "Intl Business Machines Corp." and "IBM" are close, but similar text is not the same as identical identity. Two branches of a franchise can have near-identical descriptions and still be separate legal entities. Vector search finds the candidates; your evidence and policy decide the merge.

![Similarity proposes a duplicate; rules decide. Approximate similarity is candidate generation, not proof of identity.](/images/ai-reference/dedup-verify.svg)

## What does an entity resolution pipeline look like?

Most production systems, whether rule-based or ML-based, follow the same five stages:

| Stage | Purpose | Where vector search fits |
| --- | --- | --- |
| 1. Normalize | Clean names, addresses, phone numbers, and dates into consistent forms; keep the raw values too | Produces the text that gets embedded |
| 2. Block / generate candidates | Avoid the O(n²) all-pairs comparison | ANN top-k or range search, scoped by scalar filters |
| 3. Match | Score each candidate pair as match, non-match, or uncertain | Similarity score is one feature among many |
| 4. Cluster | Turn matched pairs into groups, one group per real entity | Not involved |
| 5. Merge and review | Build a canonical ("golden") record, route uncertain cases to people | Not involved |

The reason blocking exists is arithmetic. One million records produce roughly 500 billion possible pairs. Traditional blocking groups records by a cheap key (same postcode, same first three letters of the surname, same Soundex code) and only compares records inside a block. That cuts comparisons by orders of magnitude, but it has a silent failure mode: if two duplicates disagree on the blocking key because of a typo or a missing value, they are never compared, and no downstream model can recover them. Embedding-based blocking is more forgiving because spelling variants, abbreviations, transliterations, and reordered tokens still land near each other in vector space. Research systems such as DeepBlocker, and the benchmark of pre-trained language models for ER by Zeakis et al., report that dense embeddings indexed for ANN make strong blockers on noisy, multi-source data.

## How do you generate candidates with Milvus?

Store one row per source record. A practical schema contains:

- `record_id` (primary key) and `source_system`, so every vector traces back to its origin.
- `name_embedding`, a `FLOAT_VECTOR` built from the normalized name plus a few descriptive attributes (for example "Acme Tooling GmbH, industrial fasteners, Stuttgart").
- Scalar fields used for scoping, such as `entity_type`, `country`, and raw identifiers like a tax ID or DUNS number for exact comparison later.

Index the vector field with `HNSW` (or `IVF_FLAT` for very large, batch-oriented collections) and add `INVERTED` indexes on the scalar fields you filter on. Milvus applies the filter before the ANN search, so the scope expression restricts the search to the right block instead of discarding results afterward. This is the vector equivalent of a blocking key, but a much looser one: you only need records to share the coarse attributes you trust (type, country), not an exact spelling.

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="http://localhost:19530")

candidates = client.search(
    collection_name="vendors",
    data=[embed("Acme Tooling GmbH, industrial fasteners, Stuttgart")],
    anns_field="name_embedding",
    filter='entity_type == "vendor" and country == "DE"',
    limit=50,
    output_fields=["record_id", "source_system", "tax_id", "address"],
)
```

That call is the entire candidate-generation step for one incoming record. A few refinements are worth knowing:

- **Similarity floor instead of fixed k.** Common names produce many near neighbors and rare names produce few. [Range search](/ai-quick-reference/when-to-use-vector-range-search) with `radius` and `range_filter` in `search_params` keeps only candidates inside a similarity band, so a rare name returns few candidates instead of k weak ones. It still returns at most `limit` results and only what the ANN index visits, so set `limit` above the largest block you expect; if a query comes back full, treat the candidate list as truncated and raise `limit` or tighten the block filter rather than assuming you saw every match.
- **Lexical plus semantic evidence.** Identifiers, product codes, and rare surnames are exact tokens that embeddings can blur. Milvus [full-text search](https://milvus.io/docs/full-text-search.md) produces BM25 sparse vectors, and `hybrid_search()` can fuse a dense request and a sparse request with an RRF or weighted ranker. See [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it) for when this pays off.
- **Partition key for hard scopes.** If you never match across tenants or regions, declaring that field with `is_partition_key=True` lets Milvus prune partitions using the filter value. More detail on scoping trade-offs is in [how metadata filters interact with vector search](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance).
- **Batch and incremental modes.** For an initial backfill, run the search for every record in batches. For ongoing resolution, search each new or updated record on arrival and resolve it against existing entities, which keeps cost proportional to the change rate.

## How do you decide whether two candidates are the same entity?

Matching works on pairs and uses much richer evidence than the embedding score. Typical features include exact agreement on identifiers, string similarity on names (Jaro-Winkler, token overlap), address and geography distance, date consistency, shared relationships (same parent company, same phone), and the vector similarity itself.

There are three common ways to turn features into a decision:

1. **Deterministic rules.** "Same tax ID and same country means match." Fast and auditable, but brittle when identifiers are missing.
2. **Probabilistic scoring.** The classic Fellegi-Sunter model weights each field by how often it agrees among true matches versus random pairs, so agreeing on a rare surname counts for more than agreeing on "Smith". Tools like Splink implement this approach.
3. **Learned classifiers.** A gradient-boosted model, a cross-encoder, or an LLM prompted with both records, trained or calibrated on labeled pairs. A [reranking model](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it) is a natural fit here because it reads both records together rather than comparing two independent vectors.

Whatever the matcher, use **two thresholds** rather than one. Pairs above the upper threshold auto-merge, pairs below the lower threshold are rejected, and pairs in between go to human review. Set the thresholds from reviewed positive and negative pairs in your own domain, then move them deliberately: raising the upper bound trades missed duplicates for fewer false merges, which is usually the right trade when a wrong merge mixes two customers' data.

## How do pairwise matches become entities?

Treat records as nodes and accepted matches as edges, then take connected components; each component is one resolved entity. This is where transitivity bites. If A matches B at 0.91 and B matches C at 0.90, A and C land in the same entity even if they would never have matched directly. One noisy record can chain two large groups together. Guard against this by checking cluster size and internal consistency (for example, no cluster may contain two different valid tax IDs), splitting clusters whose weakest link falls under a stricter threshold, or using correlation clustering instead of plain connected components.

From each cluster, build a canonical record by choosing attribute values with explicit survivorship rules (most trusted source, most recent, most complete). Keep the full lineage: source IDs, the canonical ID, the evidence and scores behind each edge, model and policy versions, reviewer decisions, and merge history. That makes merges explainable and, just as important, reversible. When a reviewer splits a bad cluster, downstream systems that referenced the old canonical ID need a mapping to the new ones; [stable identifiers between your lake and vector store](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search) make this tractable. Milvus accelerates repeated candidate discovery, while the application owns the authoritative identity graph.

## How do you evaluate an entity resolution system?

Measure each stage separately, because a failure in blocking looks like a failure in matching unless you separate them.

| Metric | Stage | Definition |
| --- | --- | --- |
| Pair completeness (blocking recall) | Candidates | True matching pairs found in the candidate set ÷ all true matching pairs |
| Reduction ratio | Candidates | 1 − candidate pairs ÷ all possible pairs |
| Pairs quality | Candidates | True matches in the candidate set ÷ candidate pairs |
| Precision, recall, F1 | Matching | Computed over pair decisions against a labeled sample |
| Cluster metrics (e.g. B-cubed, false-merge and missed-merge counts) | Entities | Compare final groups with ground-truth entities |

Pair completeness is the number to protect. A broad candidate stage with a reliable matcher works well; a narrow candidate stage permanently hides true matches no matter how accurate the matcher is. In Milvus terms, check whether raising `limit`, widening the range-search band, loosening the filter, or tuning HNSW `ef` brings in more true matches, and stop when the gain flattens. The general approach to building labeled samples and computing recall at k is covered in [evaluating retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved).

A small worked example: two supplier records, "Northwind Traders Ltd" (UK) and "North Wind Trading Limited" (UK), come back as nearest neighbors with cosine similarity 0.93. Their company registration numbers differ and their addresses are in different cities. Rules reject the merge despite the high vector score. A third record, "Northwind Traders" with no registration number but the same phone and address as the first, falls into the review band and gets confirmed by a person. The vector index found all three; the evidence decided the outcome.

## Where is this used?

Customer data platforms unify profiles across CRM, billing, and support systems. Procurement and finance teams deduplicate vendor masters. Marketplaces merge product listings from many sellers. Compliance teams screen names against watchlists, where transliterated and abbreviated names are the norm. Real estate and title workflows match property and party records across documents. Closely related tasks include [text deduplication with Sentence Transformers](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping) and [embedding-based clustering](/ai-quick-reference/how-are-embeddings-used-in-document-clustering).

## Get started

Load a sample of your records into Milvus with the [Quickstart](https://milvus.io/docs/quickstart.md), add a filtered ANN search as your blocker, and measure pair completeness on a few hundred labeled pairs before you build the matcher. For a managed deployment, [Zilliz Cloud](https://zilliz.com/cloud) runs the same APIs.

## Sources and further reading

- [Milvus: Filtered search](https://milvus.io/docs/filtered-search.md)
- [Milvus: Range search](https://milvus.io/docs/range-search.md)
- [Milvus: Full text search](https://milvus.io/docs/full-text-search.md)
- [Milvus: Multi-vector hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Milvus: Use partition key](https://milvus.io/docs/use-partition-key.md)
- [Milvus: Index scalar fields](https://milvus.io/docs/index-scalar-fields.md)
- [Record linkage (Wikipedia)](https://en.wikipedia.org/wiki/Record_linkage)
- [Zeakis et al., Pre-trained Embeddings for Entity Resolution: An Experimental Analysis](https://arxiv.org/abs/2304.12329)
- [Papadakis et al., A Survey of Blocking and Filtering Techniques for Entity Resolution](https://arxiv.org/abs/1905.06167)
