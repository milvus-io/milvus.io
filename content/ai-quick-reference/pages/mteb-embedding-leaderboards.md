---
slug: "mteb-embedding-leaderboards"
title: "How do you read MTEB and compare the current embedding shortlist?"
topic: "models"
order: 117
---

MTEB (the Massive Text Embedding Benchmark) is an open collection of evaluation tasks for text embedding models, published with a public leaderboard on Hugging Face. It scores each model on many datasets grouped by task type, such as retrieval, classification, clustering, and semantic similarity, then summarizes the results. Read it as a shortlisting tool: the sub-score for the task you actually run, on the languages you actually serve, matters far more than the headline rank.

## Where MTEB came from and what it covers now

The original MTEB paper (Muennighoff et al., 2022) brought together 8 embedding task types across 58 datasets and 112 languages, and showed that no single model dominated every task. That finding still holds and is the main reason to read the leaderboard by category. In 2025 the community-built MMTEB extension grew the collection to more than 500 quality-controlled tasks in over 250 languages, adding instruction following, long-document retrieval, and code retrieval. MMTEB also introduced downsampled benchmark selections that keep model rankings stable while costing far less compute to run.

Because of this growth, "MTEB score" is no longer one thing. The leaderboard lets you choose a benchmark selection (for example an English set, a multilingual set, a code set, or a domain or language-specific set), and the same model can sit in very different positions depending on that choice. Always note which selection a number came from before comparing it with another.

## What does each MTEB task type measure?

Every MTEB task turns a dataset into a question that can be answered with embeddings alone, then measures the answer with a task-appropriate metric. Knowing the metric tells you what a strong score actually means.

| Task type | What the model must do | Typical main metric |
|---|---|---|
| Retrieval | Find relevant documents for a query in a corpus | nDCG@10 |
| Reranking | Order a given candidate list by relevance | MAP |
| Semantic textual similarity (STS) | Produce similarity scores that agree with human ratings | Spearman correlation |
| Classification | Embeddings feed a simple classifier that predicts labels | Accuracy |
| Clustering | Similar texts group together | V-measure |
| Pair classification | Decide whether two texts are duplicates or paraphrases | Average precision |
| Bitext mining | Match translations across languages | F1 |
| Summarization | Score machine summaries the way humans do | Spearman correlation |

For RAG, semantic search, and most agent memory workloads, the **Retrieval** column (nDCG@10) is the one to read. A model can rank highly overall because it is excellent at classification or clustering while being only average at retrieval. If you also plan to use embeddings for deduplication or topic grouping, the clustering and pair-classification columns become relevant too.

## Why the overall rank can mislead you

The headline score is an average over tasks, and averages hide three things.

**Task mix.** Categories with many datasets weigh more. A language with only a handful of tasks, or tasks dominated by translation matching, produces a per-language score that says little about retrieval in that language.

**Training overlap.** Many public MTEB datasets are also available as training data. A model trained on a benchmark's training split, or on closely related data, will look better on it than on unseen text. The leaderboard marks whether a model was evaluated zero-shot on the selected tasks; prefer zero-shot results when comparing generalization.

**Size and cost.** A larger model with a slightly higher score can cost several times more to run at ingestion time and query time, and its larger output dimension raises vector storage and memory. Small score gaps rarely survive contact with a real corpus, so treat differences of a point or two as a tie and decide on cost, latency, and license.

This is also why this page does not reproduce a ranking table: submissions and evaluation code change often, and a frozen snapshot goes out of date within weeks. Use the **[live MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard)** for current numbers. It supports filtering by task, language, domain, and model size, and comparing selected models side by side.

## How do you turn the leaderboard into a shortlist?

A practical workflow takes an afternoon and saves weeks of re-embedding later:

1. **Filter by hard constraints first.** Remove models whose language coverage, maximum input length, license, or hosting model (API versus self-hosted weights) does not fit. A non-commercial license rules a model out of production regardless of its rank.
2. **Select the right benchmark and column.** Choose the benchmark selection that matches your languages and domain, then sort by the Retrieval score.
3. **Check the zero-shot marker and model card.** Read the card for the required query and document prefixes or instructions, pooling method, normalization, and supported output dimensions. Many retrieval models expect different prompts for queries and passages, and skipping them quietly lowers quality.
4. **Collapse families.** Several neighbouring rows are often sizes or revisions of the same family. Keep one or two per family so your shortlist covers genuinely different approaches, ideally including a learned-sparse or hybrid option (see [dense, sparse, and compact model families](/ai-quick-reference/dense-sparse-model-families)).
5. **Stop at three to six candidates**, including one cheap baseline. The baseline tells you how much the expensive models actually buy you.

## How do you validate the shortlist on your own data?

The leaderboard ends where your evaluation begins. Build a held-out set of real queries with relevance judgments: 50 to 100 well-labelled queries are enough to separate clearly different models, and more are needed to detect small gaps. Include the query types that break embeddings in practice, such as product codes, error strings, rare names, paraphrases, cross-language questions, and queries with no correct answer. The [retrieval-evaluation guide](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved) covers metric choice and labelling.

If you want to run MTEB-style tasks on private data, the open-source `mteb` Python package lets you define a custom retrieval task and evaluate any model the same way the leaderboard does.

## Comparing candidates in Milvus

Milvus makes the comparison straightforward because each candidate can live in its own collection (or its own vector field) with identical source IDs and metadata:

- Encode the same chunks with each model, pinning the model revision, prompts, dimension, and normalization. Record them alongside the collection.
- Pick the metric the model card specifies. Normalized embeddings are usually compared with `COSINE` or `IP`; see [how cosine, inner product, and L2 differ](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings).
- Start with a `FLAT` index so you measure the embedding model, not approximate-search recall loss. Once you have chosen a model, add HNSW or another index and tune it against the FLAT results, as described in [why to use a FLAT baseline](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline).
- Report Recall@k and nDCG alongside encoding throughput, vector storage, and query latency, with the same metadata filters you will use in production.

For a learned-sparse candidate, add a `SPARSE_FLOAT_VECTOR` field and compare it, and a dense-plus-sparse hybrid search, against the dense-only run. The model-side options for producing these vectors are covered in the [Milvus embedding documentation](https://milvus.io/docs/embeddings.md) and the [server-side embedding Function overview](https://milvus.io/docs/embedding-function-overview.md).

## Common questions

**Is the top-ranked MTEB model the best choice for RAG?** Not necessarily. Read the Retrieval column for your language and domain, check zero-shot status and license, and confirm on your own queries. A smaller model a point or two lower is often the better engineering choice.

**Does MTEB cover images or video?** MTEB focuses on text. For image, video, visual-document, and audio embeddings, see [how MMEB evaluates multimodal embeddings](/ai-quick-reference/mmeb-multimodal-evaluation).

**Can I mix vectors from two models that share a dimension?** No. Equal dimension does not mean a shared vector space. Switching models means re-embedding the corpus into a new field or collection.

## Related reading

- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How do Sentence Transformers models feed a Milvus retrieval pipeline?](/ai-quick-reference/sentence-transformers-with-milvus)

To try a shortlist end to end, start with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md) and load one collection per candidate model.

## Sources and further reading

- [MTEB: Massive Text Embedding Benchmark (arXiv)](https://arxiv.org/abs/2210.07316)
- [MMTEB: Massive Multilingual Text Embedding Benchmark (arXiv)](https://arxiv.org/abs/2502.13595)
- [Official MTEB leaderboard (live, filterable)](https://huggingface.co/spaces/mteb/leaderboard)
- [MTEB evaluation documentation](https://embeddings-benchmark.github.io/mteb/)
- [Milvus: embedding overview](https://milvus.io/docs/embeddings.md)
- [Milvus: embedding Function overview](https://milvus.io/docs/embedding-function-overview.md)
