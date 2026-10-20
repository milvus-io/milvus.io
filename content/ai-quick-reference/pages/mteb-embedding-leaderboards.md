---
slug: "mteb-embedding-leaderboards"
title: "How do you read MTEB and compare the current embedding shortlist?"
topic: "models"
order: 117
---

MTEB is a suite of embedding evaluations, not an embedding model. It measures tasks including retrieval, classification, clustering, and similarity across many languages. The task mix matters as much as the overall score: a broad average is not a direct estimate of performance on your legal, medical, code, or multimodal corpus.

## What MTEB actually measures

MTEB groups tasks into categories — retrieval, classification, clustering, pair classification, reranking, summarization, and similarity, among others — and reports both an overall mean and per-category scores. A model's overall rank can be driven by categories irrelevant to your application. If your use case is retrieval, look at the retrieval sub-score specifically, not the headline number: a model that scores well on classification or clustering is not thereby proven as a retrieval choice.

Language and domain coverage also vary by benchmark variant. MTEB(Multilingual) is not the same evaluation as an English-only or code-specific variant, and a model's position can shift substantially between them. Check which variant produced the number you are looking at.

## Why a pinned snapshot goes stale fast

Embedding leaderboards change frequently: new checkpoints are submitted, evaluation backends get revised, and rankings can shift within weeks. A table of exact scores frozen at one point in time will be wrong, or at least outdated, well before this page is next read. It can also be gamed or overfit — a high aggregate score does not guarantee the model generalizes to task types or domains outside the benchmark's own task mix.

Rather than embedding a dated snapshot here, check the **[official MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard)** directly. It lets you filter by task category, language, and model size, and it reflects the current submission set rather than a point-in-time copy.

## Use MTEB to build a shortlist, not a final answer

Filter the live leaderboard to your languages, your relevant task category (usually retrieval), and a parameter-count or dimension range you can afford to serve. Note which models are related variants of the same family — a leaderboard full of same-family checkpoints is not evidence of twenty independent architectural approaches. Check each candidate's license and model card; some weights carry non-commercial or custom terms that rule out production use regardless of rank.

Take the resulting shortlist — typically three to six models — and validate it on your own data before committing. Pin model revisions, query instructions, dimension, pooling, and normalization for each candidate. Encode the same source documents into separate collections per model, then evaluate exact-search retrieval first before introducing an ANN index, so index-induced recall loss doesn't get confused with a difference in the underlying embedding quality.

## Example to test

Keep a held-out query set with relevance judgments specific to your domain, and report Recall@k, NDCG, latency, storage, and encoding cost for each shortlisted model. Re-run the comparison with rare identifiers and paraphrases typical of your corpus. A leaderboard position is a shortlist signal; your own held-out task supplies the acceptance criteria.

## From concept to implementation

- [Review embedding representation and integration paths](https://milvus.io/docs/embeddings.md).
- [Distinguish external inference from server orchestration](https://milvus.io/docs/embedding-function-overview.md).

## Continue learning

- [How do MMEB versions evaluate multimodal embeddings?](/ai-quick-reference/mmeb-multimodal-evaluation)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do Sentence Transformers models feed a Milvus retrieval pipeline?](/ai-quick-reference/sentence-transformers-with-milvus)

## Implementation guides and sources

- [Official MTEB leaderboard (live, filterable)](https://huggingface.co/spaces/mteb/leaderboard)
- [MTEB evaluation documentation](https://embeddings-benchmark.github.io/mteb/)
