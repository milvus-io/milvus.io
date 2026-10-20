---
slug: "how-sparse-inverted-indexes-work"
title: "How does a sparse inverted index differ from dense ANN?"
topic: "retrieval"
order: 65
---

A sparse inverted index stores, for every dimension (usually a vocabulary term), a list of the documents that have a nonzero weight in that dimension. A query only reads the lists for its own nonzero dimensions and adds up `query weight × document weight` for each document it finds, so most of the corpus is never touched. Dense ANN indexes such as HNSW or IVF work differently: every vector has a value in every dimension, so they navigate a graph or probe clusters to find nearby points approximately. Sparse inverted indexes power BM25 full-text search and learned sparse models like SPLADE; in Milvus, both run on `SPARSE_INVERTED_INDEX`.

## What is a sparse vector?

A sparse vector has a huge number of possible dimensions, typically one per vocabulary term (tens of thousands or more), but only a handful are nonzero for any given text. It is stored as a list of `(dimension, weight)` pairs rather than a full array. For example:

```
"rotate the API key"  →  {1042: 0.81, 5530: 0.44, 18877: 1.20}
```

There are two common ways to produce these weights:

- **Statistical scoring** such as BM25 or TF-IDF, computed from term frequency, how rare the term is across the corpus, and document length. No model is needed.
- **Learned sparse models** such as SPLADE or the sparse output of BGE-M3. A transformer assigns weights to terms and can also *expand* a text with related terms it does not literally contain, so "rotate the API key" may also get weight on "credential" or "token." This narrows the vocabulary gap that plain keyword search suffers from.

For the broader comparison between the two representations, see [dense and sparse embeddings](/ai-quick-reference/what-are-dense-and-sparse-embeddings).

## How does the inverted index search work?

Building the index flips the data around. Instead of storing each document's term list, it stores each term's **posting list**: the IDs of documents containing that term, with their weights, usually sorted by document ID.

At query time, the engine reads only the posting lists for the query's nonzero dimensions. A three-term query against a ten-million-document corpus might touch a few hundred thousand postings instead of ten million vectors. The score of each document is the inner product restricted to shared dimensions; any dimension the query does not use contributes zero and is skipped entirely.

Two traversal styles exist. **Term-at-a-time (TAAT)** walks one posting list fully, accumulates partial scores, then moves to the next. **Document-at-a-time (DAAT)** walks all relevant lists in parallel by document ID and finishes each document's score before moving on, which makes early pruning possible.

### How do WAND and MaxScore skip work?

For top-k retrieval you only need to score documents that could beat the current k-th best score. WAND and MaxScore store an upper bound on each term's possible contribution. If a document's best possible total from the terms it contains cannot exceed the current threshold, it is skipped without being scored. Block-max variants store bounds per block of postings, so whole blocks can be skipped at once. These are *safe* optimizations: they return the same top-k as scoring everything, just faster. Learned sparse models are harder to prune than BM25, because expansion makes documents and queries longer, and their posting lists grow accordingly.

## Sparse inverted index vs dense ANN

| | Sparse inverted index | Dense ANN (HNSW, IVF, DISKANN) |
| --- | --- | --- |
| Data shape | Few nonzeros out of a vast vocabulary | Every one of a few hundred to a few thousand dimensions filled |
| Structure | Posting list per dimension | Proximity graph or centroid clusters |
| What a query touches | Only lists for the query's terms | A graph neighborhood or a set of clusters |
| Exactness | Can be exact; pruning with WAND/MaxScore stays exact | Approximate by design; tuned with `ef` or `nprobe` |
| Similarity | Inner product (or BM25) | Cosine, inner product, L2 |
| Strengths | Exact terms, rare identifiers, explainable term contributions | Paraphrase, semantic similarity, cross-lingual matching |
| Cost drivers | Query length, posting length, common terms | Dimension, vector count, graph degree |
| Interpretability | Each dimension is a term you can inspect | Dimensions have no individual meaning |

The two are complementary rather than competing, which is why hybrid search runs them side by side and merges the results; see [what is hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it).

## Using sparse inverted indexes in Milvus

Milvus stores sparse vectors in a `SPARSE_FLOAT_VECTOR` field (no `dim` is required) and accepts input as a list of `{dimension: weight}` dictionaries, SciPy sparse matrices, or lists of `(dimension, weight)` tuples. Index the field with `SPARSE_INVERTED_INDEX` and pick the metric for your source:

- `metric_type="BM25"` for vectors generated by Milvus's built-in BM25 function from a text field (full-text search). You query with raw text.
- `metric_type="IP"` for externally generated learned sparse vectors such as SPLADE. You query with a sparse vector.

```python
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="sparse_vector",
    index_type="SPARSE_INVERTED_INDEX",
    metric_type="IP",
    params={"inverted_index_algo": "DAAT_MAXSCORE"},
)

results = client.search(
    collection_name="docs",
    data=[{1042: 0.81, 5530: 0.44, 18877: 1.20}],
    anns_field="sparse_vector",
    limit=10,
    search_params={"params": {"drop_ratio_search": 0.2}},
)
```

**`inverted_index_algo`** selects the traversal. In Milvus 2.6 the options are `DAAT_MAXSCORE` (default; good for larger k or many query terms), `DAAT_WAND` (good for small k and short queries), and `TAAT_NAIVE` (a baseline that adapts to changing collection statistics such as average document length). The Milvus 3.0 documentation adds `BLOCK_MAX_MAXSCORE`, `BLOCK_MAX_WAND`, and `SINDI`, a SIMD-accelerated sparse index that becomes the default for `IP`, while `DAAT_MAXSCORE` stays the default for `BM25`.

**BM25 parameters** `bm25_k1` (default 1.2, recommended 1.2 to 2.0) and `bm25_b` (default 0.75) apply only when the metric is `BM25`; they control term-frequency saturation and length normalization.

**`drop_ratio_search`** (range 0 to <1) ignores the smallest fraction of query weights at search time. A value like 0.2 can speed up long learned-sparse queries by skipping low-impact terms, at some risk to recall.

Sparse inverted indexes can also be memory-mapped; `SPARSE_INVERTED_INDEX` is on the list of index types supported by `queryNode.mmap.vectorIndex`.

## Diagnosing sparse retrieval problems

Most sparse failures are representation problems, not index problems:

- **An exact code never matches.** Check the analyzer or tokenizer output first. If `E-1042` is split into `e` and `1042`, matching behaves differently than you expect.
- **A common term dominates.** For BM25, look at IDF and length normalization; for learned models, look at whether expansion is adding generic high-weight terms.
- **Queries are slow.** Long learned-sparse queries touch many long posting lists. Try `drop_ratio_search`, a different `inverted_index_algo`, or a sparser model.
- **Scores look inconsistent after a model change.** Document and query vectors must come from the same model and vocabulary. Two sparse vectors with integer dimension keys are not compatible just because the keys look similar; record the model or analyzer version with every ingestion.

Measure relevance and cost together: average nonzeros per document and per query, index size, build time, p50/p99 latency, and Recall@k or NDCG on judged queries that include rare terms, long queries, multilingual text, and filtered searches. Compare BM25, learned sparse, dense, and hybrid on the same data before committing. Filters behave the same way here as with dense search; see [how metadata filters interact with vector search](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance).

To build one, start Milvus with the [Quickstart](https://milvus.io/docs/quickstart.md) and follow the [full-text search guide](https://milvus.io/docs/full-text-search.md) for BM25, or the [sparse vector guide](https://milvus.io/docs/sparse_vector.md) for SPLADE-style embeddings. Related: [what is full-text search, and how does BM25 fit](/ai-quick-reference/what-is-fulltext-search).

## Sources and further reading

- [Milvus: SPARSE_INVERTED_INDEX](https://milvus.io/docs/sparse-inverted-index.md)
- [Milvus: sparse vectors](https://milvus.io/docs/sparse_vector.md)
- [Milvus: full-text search with BM25](https://milvus.io/docs/full-text-search.md)
- [Milvus: use mmap](https://milvus.io/docs/mmap.md)
- [Formal et al., SPLADE v2](https://arxiv.org/abs/2109.10086)
- [Li et al., SINDI: An Efficient Index for Sparse Vector Approximate Maximum Inner Product Search](https://arxiv.org/abs/2509.08395)
- [Okapi BM25 (Wikipedia)](https://en.wikipedia.org/wiki/Okapi_BM25)
