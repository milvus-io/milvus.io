---
slug: "what-are-hard-negatives-in-retrieval"
title: "What are hard negatives in retrieval training, and how can you mine them?"
topic: "data"
order: 86
---

A hard negative is a document that a retrieval model scores as highly similar to a query but that is not actually relevant to it. Training an embedding model with these near-misses, alongside the true positive, teaches it the fine distinctions that random negatives never exercise: the wrong product version, the neighboring error code, the passage that mentions the right entity but answers a different question. You mine hard negatives by running retrieval over your corpus, which is exactly what a vector database like Milvus does, then filtering out anything that might secretly be relevant.

![Mine difficult non-matches, then verify. A highly ranked unlabeled document is not automatically a negative.](/images/ai-reference/hard-negative-mining.svg)

## Easy, hard, and false negatives

Dense retrievers are usually trained contrastively: pull the query embedding toward a positive passage and push it away from negatives. What the model learns depends on which negatives it sees.

| Negative type | Where it comes from | What it teaches | Risk |
|---|---|---|---|
| Random / easy | Any other document in the corpus | Coarse topic separation | Quickly becomes trivial; little signal after early training |
| In-batch | Other queries' positives in the same batch | Cheap separation at scale | Mostly easy unless batches are large or grouped by topic |
| Hard (static) | Top results from BM25 or a fixed embedding model | Lexical and semantic look-alikes | Can contain unlabeled positives |
| Hard (dynamic) | Top results from the model being trained, refreshed periodically | The model's current mistakes | Expensive re-indexing; highest false-negative rate |
| False negative | A "negative" that actually answers the query | The wrong boundary | Actively damages the model |

The DPR paper showed that adding BM25 hard negatives to in-batch negatives produced a dense retriever that beat BM25 by 9 to 19 points of top-20 accuracy on open-domain QA. ANCE went further by drawing negatives from an approximate nearest-neighbor index of the corpus that is rebuilt as the model trains, so the negatives keep tracking the model's own errors. Both ideas rest on the same machinery: embed the corpus, index it, and search it with training queries.

## Why do hard negatives improve retrieval?

Early in training, random negatives carry most of the learning signal because the model cannot yet tell topics apart. Once it can, random negatives produce near-zero loss and stop contributing. Hard negatives keep the loss informative by presenting cases that sit near the decision boundary. In practice this shows up as better precision at the top of the ranking, which is what matters for RAG and agents that only read the first few results.

The catch is that the hardest negatives are also the most likely to be mislabeled. In most retrieval datasets each query has one or a few labeled positives, while the corpus often contains other passages that also answer it. The higher a mined passage ranks, the more likely it is one of those unlabeled positives. Training on it pushes the model away from correct answers.

## How to mine hard negatives with Milvus

Assume a corpus collection with `chunk_id` (primary key), `doc_id`, `text`, a `FLOAT_VECTOR` embedding from your current model, and metadata such as `product`, `version`, and `tenant_id`.

### 1. Retrieve candidates for each training query

Search with every training query, asking for more results than you need so filtering leaves enough:

```python
res = client.search(
    collection_name="corpus",
    data=query_vectors,                # batch of training queries
    limit=50,
    filter='tenant_id == "acme"',      # mine inside the same eligibility scope you serve
    output_fields=["chunk_id", "doc_id", "text"],
    search_params={"metric_type": "COSINE"},
)
```

Batch queries in one call, and use [filtered search](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance) to keep candidates in the same scope the production system will search. A passage from another tenant is an access-control problem, not a relevance lesson, and should never become a training negative.

### 2. Remove positives and their relatives

Drop the labeled positive and any chunk from the same source document (`doc_id`), since neighboring chunks often contain the answer too. Drop near-duplicates of the positive as well. A [range search](/ai-quick-reference/when-to-use-vector-range-search) around the positive's vector with a high similarity floor returns them, or you can reuse the dedup labels described in [embedding-based deduplication](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping).

### 3. Filter likely false negatives

Positive-aware mining uses the positive's own score as an anchor: discard any candidate whose similarity to the query exceeds a fraction of the positive's similarity (NV-Retriever reports good results with a cut around 95%), or exceeds it minus a fixed margin. A cross-encoder reranker is a stronger second check. Score each candidate with the reranker and drop those it rates as relevant. Ambiguous cases near the cut should go to human review rather than straight into training. Sentence Transformers' `mine_hard_negatives` utility implements several of these rules (rank ranges, score ceilings, margins relative to the positive) if you prefer a library to hand-rolled filtering.

### 4. Sample, don't just take the top

Skipping the first few ranks and sampling from, say, ranks 10 to 50 lowers the false-negative rate while still giving hard examples. Mixing in some random and in-batch negatives keeps the model calibrated on ordinary queries; a set made only of adversarial pairs can over-specialize.

### 5. Record provenance and refresh

Store with each triple the mining model revision, the rank and score, and the filter that admitted it. After you retrain, re-embed the corpus into a new collection and mine again: yesterday's hard negatives are often easy for the new model, and new failure modes appear. This is the ANCE loop run in epochs instead of continuously, and Milvus makes each round a batch of filtered ANN searches rather than a full brute-force pass. Keeping the old and new collections side by side also gives you an easy A/B comparison.

## What makes a good hard negative?

The best negatives differ from the positive in a way the task cares about. For a support bot, that is the right product but the wrong version, or the right symptom but the wrong fix. For legal retrieval, it is the right statute but a superseded revision. Mine them from your own corpus and query logs, not only from a public benchmark, because the confusions that hurt you are domain-specific.

A passage that also answers the question is an additional positive. Relabel it as such instead of discarding it, since multi-positive training data is valuable in its own right.

## How do you evaluate the result?

Hold out queries and documents that were never used for mining, and check for near-duplicate leakage between training and evaluation sets. Report recall@k and nDCG@10 overall and on slices where hard negatives should help (exact identifiers, version-sensitive questions, paraphrases), and compare against the model before fine-tuning. Retrieval evaluation methods are covered in [how to evaluate retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved) and [how to build evaluation sets](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets). If a fine-tuned model wins, choosing it is the same decision covered in [selecting an embedding model for retrieval](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy).

## Next step

Index your corpus in Milvus with the [Quickstart](https://milvus.io/docs/quickstart.md), run a batch of filtered searches over your training queries, and pass the candidates through a [reranker](https://milvus.io/docs/rerankers-overview.md) before labeling. The [Milvus Bootcamp](https://milvus.io/bootcamp) has retrieval notebooks you can adapt for the mining loop.

## Sources and further reading

- [Karpukhin et al., Dense Passage Retrieval for Open-Domain Question Answering (arXiv)](https://arxiv.org/abs/2004.04906)
- [Xiong et al., ANCE: Approximate Nearest Neighbor Negative Contrastive Learning for Dense Text Retrieval (arXiv)](https://arxiv.org/abs/2007.00808)
- [Moreira et al., NV-Retriever: Improving text embedding models with effective hard-negative mining (arXiv)](https://arxiv.org/abs/2407.15831)
- [Sentence Transformers utilities, including hard-negative mining](https://www.sbert.net/docs/package_reference/util/index.html)
- [Milvus filtered search](https://milvus.io/docs/filtered-search.md)
- [Milvus rerankers overview](https://milvus.io/docs/rerankers-overview.md)
