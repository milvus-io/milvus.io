---
slug: "what-is-multi-vector-retrieval"
title: "What is multi-vector retrieval, and how do MaxSim and MUVERA work?"
topic: "foundations"
order: 131
---

Multi-vector retrieval represents one searchable object, such as a passage, a PDF page, or a product, with several vectors instead of one, and scores a match by comparing those vectors at a finer grain. The best-known form is late interaction: a model like ColBERT keeps one vector per token, and the relevance score, called MaxSim, sums how well each query token is matched by its best document token. MUVERA is a technique for making that kind of search fast by compressing each set of vectors into one fixed-length vector that ordinary ANN indexes can handle.

The rest of this page explains why a single vector is sometimes not enough, the three different designs that people call "multi-vector", how MaxSim is computed, what it costs, how MUVERA and similar methods cut that cost, and how each design maps onto Milvus.

## Why isn't one vector per document enough?

A standard bi-encoder runs the whole passage through a transformer and pools the token outputs into a single embedding. That is cheap to store and fast to search, but pooling is lossy. A 3,000-word contract and a two-line summary of it can land near each other because the averaged meaning is similar, while the one clause a user is actually asking about gets diluted by everything around it. Rare terms, names, part numbers, and small visual details on a page suffer most.

Cross-encoders avoid the problem by reading the query and document together, but they must run the full model for every query-document pair, so they can only rerank a short candidate list. Late interaction sits between the two. Document token vectors are computed once at indexing time, like a bi-encoder, and the query and document only "meet" in a cheap vector comparison at search time. The ColBERT paper reported roughly two orders of magnitude lower latency and four orders of magnitude fewer FLOPs per query than BERT-based cross-encoder ranking, while keeping competitive quality.

## Three designs that all get called "multi-vector"

The term is used loosely, and the designs answer different questions. Decide which one you mean before choosing a schema or index.

| Design | What one result represents | How scores are combined | Typical use |
| --- | --- | --- | --- |
| Separate vector fields | One entity seen from different views (title, body, image, sparse terms) | Independent ANN searches merged by rank or score fusion | Hybrid and multimodal product or document search |
| Grouped chunk vectors | A document split into independently searchable chunks | Retrieve chunks, then group or aggregate by parent ID | RAG over long documents |
| Joint token or patch list | One entity encoded as a list of vectors produced for joint scoring | The model's list-to-list rule, such as ColBERT-style MaxSim | Late-interaction text retrieval, ColPali-style page retrieval |

These are not interchangeable. Averaging token vectors produces a new single vector; it is not a cheaper implementation of MaxSim. Fusing a title ranking with a body ranking does not compute token-level interaction. And none of the three requires more than one modality: a text-only ColBERT model is multi-vector, while a CLIP-style model can be multimodal with one vector per input (see [multimodal embeddings](/ai-quick-reference/what-are-multimodal-embeddings)).

## How does MaxSim scoring work?

For a query represented by vectors q₁…qₙ and a document represented by d₁…dₘ, the ColBERT-style score is:

`S(Q, D) = Σ_i max_j sim(q_i, d_j)`

Each query token looks across every document token, keeps only its single best match, and the per-token maxima are added up. The inner `sim` is whatever the model was trained with, usually the inner product of L2-normalized vectors, which equals cosine similarity. Query padding, special-token masking, and whether scores are normalized by query length are model conventions you should copy exactly from the model card.

![MaxSim selects a best document match for each query vector](/images/ai-reference/maxsim.svg)

A small worked example makes the mechanics concrete. Take unit query vectors q1=(1,0) and q2=(0,1), and unit document vectors d1=(0.8,0.6), d2=(0.6,0.8), d3=(1,0). The inner-product matrix is `[[0.8, 0.6, 1.0], [0.6, 0.8, 0.0]]`. The row maxima are 1.0 for q1 and 0.8 for q2, so S(Q, D) = 1.8. Swap the roles and each document vector picks its best query vector: 0.8 + 0.8 + 1.0 = 2.6. That asymmetry is why MaxSim is a directional similarity rather than a distance, and why it is a scoring rule rather than an index.

The appeal is interpretability as much as accuracy. Because every query token is matched to a specific document token or image patch, you can inspect which words or regions drove a result, which is useful when debugging retrieval for [late-interaction models](/ai-quick-reference/what-is-late-interaction-retrieval).

## What does multi-vector storage cost?

The price of that precision is size. A rough calculation: a 200-token passage encoded as 128-dimensional token vectors in float16 takes 200 × 128 × 2 bytes ≈ 51 KB, while a single 1,024-dimensional float32 embedding takes about 4 KB, so the token list is more than ten times larger, and longer passages scale linearly. Visual document models are heavier still, because a page image is split into hundreds to roughly a thousand patch vectors.

Scoring cost grows the same way. Exhaustive MaxSim over a corpus compares every query token with every stored token, which is fine for reranking a few hundred candidates and far too slow as a first-stage search over millions of documents. Production systems therefore split the job in two:

1. **Candidate retrieval** finds a few hundred promising documents cheaply.
2. **Exact MaxSim reranking** scores those candidates with the original vector lists.

Exact scoring in step 2 does not make the whole pipeline exact. A relevant document that step 1 misses can never be recovered by reranking, so candidate recall is the number to watch.

ColBERTv2 attacked the storage side with residual compression of token vectors, and the PLAID engine used centroid-based pruning to speed candidate generation. The two approaches below attack the candidate-retrieval side.

## Token-level ANN

The most direct candidate strategy indexes every token vector with a regular ANN index such as [HNSW](/ai-quick-reference/what-is-hnsw). Each query token retrieves its nearest stored tokens, the hits are mapped back to their parent documents, and the union of parents becomes the candidate set for MaxSim reranking. It preserves quality well for short and medium lists, but the index holds every token, so memory and build cost grow with total token count rather than document count.

## How does MUVERA work?

MUVERA (Multi-Vector Retrieval via Fixed Dimensional Encodings, Google Research, 2024) turns the multi-vector problem into a single-vector one. It builds a fixed dimensional encoding (FDE) for each vector set, designed so that the inner product of a query FDE and a document FDE approximates the multi-vector similarity. The construction, in outline:

- Randomly partition the embedding space, for example with SimHash-style random hyperplanes, so each token vector falls into a bucket.
- Aggregate the vectors in each bucket, using different rules for queries and documents, which is how the encoding captures MaxSim's asymmetry.
- Optionally apply random projection to shrink each bucket, then concatenate buckets across several independent repetitions.

The result has the same length no matter how many tokens the object has, so it can be stored in one dense vector and searched with any maximum inner product index. Retrieved candidates are then reranked with true MaxSim on the original lists. On BEIR, the authors reported about 10% higher recall with 90% lower latency than PLAID, and needing 2 to 5 times fewer candidates than single-vector heuristics for the same recall.

MUVERA is not a new embedding model and not mean pooling. It keeps the original model's vectors and approximates their scoring function. It also has costs: the FDE is often large, the encoding parameters trade dimension against fidelity, and approximation quality varies by corpus. A learned alternative, LEMUR, trains a small network to produce the fixed-length representation instead of using random projections, at the price of a training step that depends on the corpus distribution.

## How do you do multi-vector retrieval in Milvus?

Milvus supports all three designs, each with its own schema.

**Joint token or patch lists** live in a StructArray field: an `ARRAY` field whose elements are `STRUCT`s that can hold vector subfields (`FLOAT_VECTOR`, `FLOAT16_VECTOR`, `BFLOAT16_VECTOR`, `INT8_VECTOR`, or `BINARY_VECTOR`; sparse subfields are not supported). Each element can carry scalar data next to its vector, such as the token or patch position.

```python
chunk_schema = client.create_struct_field_schema()
chunk_schema.add_field(field_name="emb_list_vector", datatype=DataType.FLOAT_VECTOR, dim=128)

schema.add_field(
    field_name="chunks",
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=chunk_schema,
    max_capacity=1000,
)

index_params.add_index(
    field_name="chunks[emb_list_vector]",
    index_type="HNSW",
    metric_type="MAX_SIM_COSINE",
)
```

A query is an `EmbeddingList`, and the search returns whole entities ranked by the MaxSim-family metric:

```python
from pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
for vec in query_token_vectors:
    query.add(vec)

results = client.search(
    collection_name="docs",
    data=[query],
    anns_field="chunks[emb_list_vector]",
    limit=10,
)
```

The EmbeddingList metrics are `MAX_SIM`, `MAX_SIM_COSINE`, `MAX_SIM_IP`, and `MAX_SIM_L2`, with index types including `HNSW` and its quantized variants, `IVF_FLAT`, and `DISKANN`. A separate vector subfield indexed with a regular metric (`COSINE`, `IP`, `L2`) supports element-level search, which returns individual struct elements with their offset. Each vector subfield takes exactly one index, so use two subfields if you need both modes.

Milvus's EmbeddingList guide describes three candidate strategies that match the ideas above: TokenANN (the default, indexing every vector), MUVERA (random-projection FDEs, with build parameters such as `muvera_num_projections` and `muvera_num_repeats`), and LEMUR (learned compression). Search-time settings such as `retrieval_ann_ratio` and `emb_list_rerank` control how many candidates are pulled and whether they are reranked with exact MaxSim. The guide notes that MUVERA and LEMUR currently work on fp32 data and that DISKANN supports EmbeddingList only with TokenANN, and it asks readers to confirm parameter availability for their target release, so check the docs for your version before tuning.

**Separate vector fields** use ordinary dense or sparse vector fields in one collection and `hybrid_search()`: one `AnnSearchRequest` per field, merged by `RRFRanker` or `WeightedRanker`. This is the natural route for title plus body, or text plus image, and is covered in the [hybrid search guide](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it).

**Grouped chunks** store each chunk as its own entity with a parent document ID, and grouping search (`group_by_field`, with optional `group_size`) returns the best chunks per document instead of five near-identical hits from one file.

## When should you use multi-vector retrieval?

Late interaction tends to pay off when queries hinge on specific terms or details, when documents are long or heterogeneous, when you are retrieving visually rich pages with models like ColPali, and when your single-vector model has to generalize to a domain it was not tuned on. It is harder to justify when single-vector recall is already high on your evaluation set, when storage budget is tight, or when latency requirements leave no room for a reranking stage. A sensible middle path is single-vector or hybrid first-stage retrieval followed by a [reranker](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it).

To decide with evidence, build a judged query set and compare: exhaustive MaxSim on a subset as ground truth, then TokenANN and MUVERA candidate routes. Report candidate recall@N separately from final top-k quality, and track index size, original-vector storage, build time, and p95 latency alongside them. Include long documents, filtered queries, and deletes, since those are where candidate strategies usually differ.

## Related reading

- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)
- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [How do cosine similarity, inner product, and L2 differ?](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings)
- [How do you choose chunk size for RAG?](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications)

Ready to try it? Start with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), then follow the [EmbeddingList search guide](https://milvus.io/docs/basic-vector-search-with-structarray.md) to load token vectors from a late-interaction model.

## Sources and further reading

- [ColBERT: efficient passage search via late interaction (Khattab and Zaharia, 2020)](https://arxiv.org/abs/2004.12832)
- [MUVERA: multi-vector retrieval via fixed dimensional encodings (2024)](https://arxiv.org/abs/2405.19504)
- [MUVERA design explanation, Google Research](https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/)
- [LEMUR: learned multi-vector retrieval](https://arxiv.org/abs/2601.21853)
- [Milvus: create a StructArray field](https://milvus.io/docs/create-structarray-field.md)
- [Milvus: EmbeddingList and element-level search](https://milvus.io/docs/basic-vector-search-with-structarray.md)
- [Milvus: index StructArray fields](https://milvus.io/docs/index-structarray-fields.md)
- [Milvus: choose an EmbeddingList search strategy](https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md)
- [Milvus: multi-vector hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Milvus: grouping search](https://milvus.io/docs/grouping-search.md)
