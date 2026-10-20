---
slug: "what-is-multi-vector-retrieval"
title: "What is multi-vector retrieval, and how do MaxSim and MUVERA work?"
topic: "foundations"
order: 131
---

Multi-vector retrieval represents one logical object with multiple vectors. The phrase covers several designs: independent title/body fields, multiple passages grouped under a parent document, or token/patch embedding lists scored jointly. State the retrieval unit and aggregation rule before choosing an index. These designs are not interchangeable, and none requires multiple input modalities.

## Separate fields, grouped chunks, and joint scoring

| Design | What a result means | How scores can be combined |
| --- | --- | --- |
| Separate vector fields | One entity described by title, body, image, or another view | Independent retrieval plus an evaluated rank/score fusion |
| Grouped chunk vectors | A document with independently searchable chunks | Retrieve chunks, then group or aggregate by parent ID |
| Joint token/patch list | One entity represented by a list produced for joint scoring | The model's list-to-list aggregation, such as ColBERT-style MaxSim |

Averaging token vectors creates a different representation; it is not an equivalent implementation of MaxSim. Likewise, rank fusion over title/body lists does not compute token-level interaction. Multi-vector storage is useful only when its corresponding query representation and scoring fit the task.

## MaxSim is a score, not an index

For query vectors Q and document vectors D, a common ColBERT-style score is:

`S(Q,D) = Σ_i max_j sim(q_i, d_j)`

For each query token, find its best document-token match; then sum these maxima. The inner `sim` must match the model, often an inner product between normalized vectors. Masking and aggregation conventions also matter. This is usually a directional similarity, not a symmetric mathematical distance. Do not confuse a MAX_SIM-style API name with an ordinary single-vector metric.

![MaxSim selects a best document match for each query vector](/images/ai-reference/maxsim.svg)

Consider unit query vectors q1=(1,0), q2=(0,1), and unit document vectors d1=(0.8,0.6), d2=(0.6,0.8), d3=(1,0). The pairwise inner-product matrix is `[[0.8,0.6,1.0],[0.6,0.8,0.0]]`. Row maxima sum to `1.0 + 0.8 = 1.8`. Reversing the roles gives `0.8 + 0.8 + 1.0 = 2.6`. These illustrative calculations show the aggregation and directionality, not measured relevance.

## Why candidate retrieval is a separate problem

Exhaustive scoring against all stored document vectors can be expensive. A practical system first finds candidate documents, then applies the intended list score to those candidates. Exact MaxSim within that candidate set does not make the whole search exact: a useful document omitted by candidate retrieval cannot be recovered by reranking.

Token-level ANN indexes the constituent vectors. Query vectors retrieve token neighbors, which are mapped back to parent documents for candidate aggregation. A vector index such as HNSW supplies a neighbor-search mechanism; candidate limits and aggregation affect which documents reach final scoring. Keeping the original vectors does not eliminate ANN approximation.

## Where MUVERA fits

MUVERA constructs fixed-dimensional encodings (FDEs) for vector sets so multi-vector candidate retrieval can use single-vector search machinery. It is an approximation mechanism built around the list-similarity objective, not a new text/image embedding model and not mean pooling. A system can retrieve with FDEs and then rerank original vector lists with the target score.

The construction uses randomized space partitions and distinct query/document aggregation to approximate the directional set score with an FDE inner product. For chosen encoding parameters, the output length does not grow with the number of tokens in one object; it need not equal the original token-vector dimension. Keep the prescribed query/document encoding and score conventions instead of silently treating the FDE as an ordinary semantic vector.

This exchanges token-index costs for encoding dimension and approximation costs. It does not promise the same speed or recall on every corpus. Measure candidate coverage, final relevance, index bytes, original-vector storage, encoding/build cost, and query latency together.

## Map the design to Milvus carefully

The checked Milvus 3.0 StructArray guides distinguish entity-level EmbeddingList search using a MAX_SIM-style score from element-level search using regular vector metrics. Separate vector fields and hybrid/rank fusion are another path. Choose the supported schema and result unit rather than assuming every array of vectors behaves alike.

The current strategy page describes TokenANN, MUVERA, and learned row compression, but also carries a publishing note requiring target-release verification. Treat this article as an algorithm and design explanation; confirm released Milvus/PyMilvus support and strategy/index/type combinations before using specific parameters. Documentation presence alone does not establish that an existing cluster exposes a feature.

## Example to test

Use identical documents, eligibility rules, query lists, model revision, and scoring conventions. Establish exhaustive list scores over the same corpus, or run every method on an explicitly identical subset. Compare a token-ANN candidate route with MUVERA candidates and final MaxSim. Report candidate Recall@N separately from final top-k quality; test long documents, filters, and parent deletion.

## From concept to implementation

- [Check EmbeddingList and element-level semantics](https://milvus.io/docs/basic-vector-search-with-structarray.md).
- [Verify available candidate strategies and release caveats](https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md).

## Continue learning

- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do cosine similarity, inner product, and L2 differ?](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings)

## Implementation guides and sources

- [ColBERT late interaction and MaxSim](https://arxiv.org/abs/2004.12832)
- [MUVERA fixed-dimensional encodings](https://arxiv.org/abs/2405.19504)
- [MUVERA design explanation](https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/)
- [EmbeddingList and element-level search](https://milvus.io/docs/basic-vector-search-with-structarray.md)
- [Indexing and metric contracts](https://milvus.io/docs/index-structarray-fields.md)
- [Candidate strategies and target-release caveats](https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md)

Sources checked: 2026-10-20. Algorithms and illustrative calculations are documentation-reviewed; model inference and target-release deployment were not run.
