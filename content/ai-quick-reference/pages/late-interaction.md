---
slug: "what-is-late-interaction-retrieval"
title: "What is late-interaction retrieval, and how can embedding lists help?"
topic: "retrieval"
order: 69
---

Late-interaction retrieval encodes the query and each document separately into a *list* of vectors (one per token, or one per image patch) and only compares them at search time, using a cheap token-level score called MaxSim. It sits between two familiar designs: a bi-encoder that squeezes each text into one vector, and a cross-encoder that reads query and document together. ColBERT introduced the idea in 2020, and ColPali later applied it to page images. In Milvus, late interaction is implemented with **embedding lists** stored in StructArray vector subfields and searched with `MAX_SIM*` metrics.

![MaxSim compares each query token with its best-matching document token](/images/ai-reference/maxsim.svg)

## Early, late, and no interaction: where ColBERT fits

"Interaction" means the point at which the model lets query and document information meet.

| Design | How query and document meet | Precompute documents? | Typical role |
| --- | --- | --- | --- |
| Bi-encoder (single vector) | Never; one vector each, compared with cosine or dot product | Yes | Fast first-stage retrieval |
| Cross-encoder | Early; both texts go through the transformer together with full attention | No | Reranking a few dozen to a few hundred candidates |
| Late interaction (ColBERT) | After encoding; every query token vector is compared with every document token vector | Yes | Retrieval or reranking with token-level precision |

A single-vector model must summarize a whole passage into one point, so a decisive phrase buried in a long document can get averaged away. A cross-encoder sees everything but must run the full model for every query-document pair, which is too slow for a large corpus. Late interaction keeps per-token detail and still lets you encode documents once, offline. The ColBERT paper reported query processing roughly two orders of magnitude faster than BERT cross-encoder rerankers, with four orders of magnitude fewer FLOPs per query, while staying competitive in quality.

## How does MaxSim scoring work?

Given query token vectors `q₁ … qₙ` and document token vectors `d₁ … dₘ`, the late-interaction score is:

```
score(q, d) = Σᵢ  maxⱼ  sim(qᵢ, dⱼ)
```

For each query token, find the single most similar document token, then add those best matches together. Take the query "machine learning" against a document whose tokens include "neural", "network", "python", and "tutorial". The vector for "machine" might match "neural" best, and "learning" might match "tutorial" best; the document's score is the sum of those two maxima. A document that contains a strong match for every query term scores high even if most of its other tokens are unrelated.

Three properties are worth knowing:

- **It is directional.** The sum runs over query tokens, so `score(q, d)` is not the same as `score(d, q)`.
- **It is not averaging.** Mean-pooling all token vectors and comparing once gives a different, usually weaker, signal.
- **Scores can exceed 1.** With cosine similarity each term lies in [-1, 1], but the sum over query tokens does not. Milvus's `MAX_SIM_COSINE` scores behave this way, so do not reuse thresholds from single-vector search.

ColBERT projects each token to a small dimension (128 in the original paper) to keep storage manageable, and the model is trained end to end with this scoring function. Splitting a document into many vectors and applying MaxSim to an ordinary single-vector model does not reproduce what a trained late-interaction model learns. The [multi-vector retrieval article](/ai-quick-reference/what-is-multi-vector-retrieval) works through a full score matrix.

## What does late interaction cost?

Storage is the main price. One million passages of about 100 tokens each, at 128 dimensions in FP16, is about 25.6 GB of token vectors, versus about 3 GB for one 768-dimensional FP32 vector per passage. Visual models like ColPali store roughly a thousand patch vectors per page, which multiplies this further. Exact MaxSim is also expensive at scale, because every candidate's full list must be compared with every query vector.

Production systems therefore split the work: an approximate first stage finds candidate documents cheaply, and exact MaxSim reranks only those candidates. The candidate stage is where recall is won or lost; MaxSim cannot rescue a document the first stage never returned. Compression helps too (ColBERTv2 introduced residual compression for token vectors), and the same quantization trade-offs described in [the vector quantization guide](/ai-quick-reference/what-is-vector-quantization-in-embeddings) apply.

## How do you run late interaction in Milvus?

Milvus models a late-interaction document as one entity whose **StructArray** field holds a list of elements, each with a vector subfield. Searching that subfield as an **EmbeddingList** with a `MAX_SIM*` metric returns entity-level results ranked by MaxSim.

**1. Index the vector subfield with a MaxSim metric.** Supported metrics are `MAX_SIM`, `MAX_SIM_COSINE`, `MAX_SIM_IP`, and `MAX_SIM_L2`. For `FLOAT_VECTOR`, `FLOAT16_VECTOR`, and `BFLOAT16_VECTOR` subfields, the documented index types include `HNSW`, `HNSW_SQ`, `HNSW_PQ`, `HNSW_PRQ`, `IVF_FLAT`, and `DISKANN`.

```python
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="chunks[emb_list_vector]",
    index_type="HNSW",
    metric_type="MAX_SIM_COSINE",
    params={"M": 16, "efConstruction": 200},
)
client.create_index("tech_articles", index_params)
```

**2. Search with an embedding list as the query.**

```python
from pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
for token_vec in query_token_vectors:   # from the same ColBERT-style encoder
    query.add(token_vec)

results = client.search(
    collection_name="tech_articles",
    data=[query],
    anns_field="chunks[emb_list_vector]",
    limit=10,
    output_fields=["doc_id", "title"],
)
```

**3. Choose a candidate strategy.** The `emb_list_strategy` build parameter decides how the first stage finds candidates before MaxSim reranking:

| Strategy | First-stage unit | When to use it |
| --- | --- | --- |
| `tokenann` (default) | Every token vector is indexed; hits are aggregated back to documents | Quality-first, short to medium lists |
| `muvera` | One fixed-dimensional encoding per document via random projections, no training | Long documents where TokenANN is too heavy |
| `lemur` | One learned compressed vector per document | Large visual or multimodal lists; needs training and validation |

At search time, `retrieval_ann_ratio` (default `3.0`) controls how many first-stage candidates are pulled relative to `limit`, and `emb_list_rerank` (default `true`) applies exact MaxSim to them. Raise the ratio if candidate recall is low. Support for these strategies and some StructArray features is version-gated, so check the StructArray limits page for your release.

A vector subfield takes only one index. If you also want **element-level** search (returning the single best chunk or patch with its `offset`, using a regular metric like `COSINE`), store the vectors in a second subfield and index it separately.

## When is late interaction worth it?

Late interaction tends to pay off when relevance depends on a few specific terms inside long or heterogeneous documents, on out-of-domain queries where single-vector models generalize poorly, and on visually rich documents (slides, scanned forms, charts) where ColPali-style models skip OCR entirely. See [how ColPali and ColQwen use embedding lists](/ai-quick-reference/visual-document-models) for the visual case.

It is less compelling when single-vector retrieval plus a cross-encoder reranker already meets your quality bar, because that pipeline is simpler and stores far less. A fair evaluation compares the two at a similar latency and memory budget:

- Measure candidate recall separately from final ranking: is the right document in the first-stage pool at all?
- Track index size, build time, p99 latency, and memory alongside NDCG or Recall@k.
- Include long documents, rare terms, metadata filters, and deletions in the test set.
- Keep source mappings so a returned document can still show which tokens or patches drove the match.

For the reranking alternative, see [what is reranking](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it), and for combining dense and keyword signals, see [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it).

To build a working pipeline, follow the Milvus tutorial on [EmbeddingList search with ColBERT and ColPali](https://milvus.io/docs/search-with-embedding-lists.md), or start from the [Milvus Quickstart](https://milvus.io/docs/quickstart.md).

## Sources and further reading

- [Khattab and Zaharia, ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT (SIGIR 2020)](https://arxiv.org/abs/2004.12832)
- [Milvus: Basic vector search with StructArray (EmbeddingList and element-level modes)](https://milvus.io/docs/basic-vector-search-with-structarray.md)
- [Milvus: Index StructArray fields (MAX_SIM metrics and index types)](https://milvus.io/docs/index-structarray-fields.md)
- [Milvus: StructArray data model](https://milvus.io/docs/array-of-structs.md)
- [Milvus: Choose an EmbeddingList search strategy](https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md)
- [Milvus: Search with EmbeddingLists (ColBERT and ColPali)](https://milvus.io/docs/search-with-embedding-lists.md)
- [Milvus: Multimodal RAG](https://milvus.io/docs/multimodal_rag_with_milvus.md)
