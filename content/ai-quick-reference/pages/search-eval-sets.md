---
slug: "how-to-build-search-and-agent-evaluation-datasets"
title: "How do you build an evaluation set for agentic and vector search?"
topic: "rag-agents"
order: 80
---

An evaluation set for search, RAG, or agents is a versioned collection of realistic queries or tasks, each paired with ground truth: the passages that should be retrieved, the answer that should be produced, or the outcome a task should reach. Build it by sampling real traffic, filling gaps with carefully checked synthetic cases, labeling relevance on a written rubric with measured reviewer agreement, tagging every case with slices, and freezing it against a corpus snapshot. A few hundred well-labeled cases usually tell you more than thousands of unreviewed ones.

![Measure four different outcomes separately](/images/ai-reference/evaluation.svg)

## What goes into one evaluation case?

Decide the record format before collecting anything, because it determines what you can measure later.

| Field | Search / RAG case | Agent task case |
| --- | --- | --- |
| Input | Query text, plus user context (tenant, language, filters) | Task instruction and starting state |
| Ground truth | Relevant passage IDs or document spans with graded labels | Expected outcome, checker, or reference trajectory |
| Reference answer | Short correct answer with citations (optional) | Final state or deliverable |
| Corpus / environment | Corpus snapshot or source revisions assumed | Tool versions, environment revision |
| Slices | Intent, query type, language, entity rarity, filtered? | Task family, number of steps, tools needed |
| Provenance | Where the query came from; who labeled it, when, with which rubric version | Same |

Label against stable document IDs and spans rather than chunk IDs. Chunk boundaries change whenever you retune [chunking](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications); spans let you remap labels instead of relabeling.

## Where should the queries come from?

**Production logs are the best source.** Sample from them, deduplicate near-identical queries (embedding similarity plus a threshold works well), and cluster the rest to see the intent mix. Then sample per cluster, so the long tail is represented and not drowned by the three most common questions. Strip personal data before anything leaves the logging system.

**Before launch, or for rare intents, generate synthetic queries** by asking an LLM to write questions a passage answers. This is fast and gives you a free relevance label, but it has known biases:

- Generated questions reuse the passage's wording, which flatters lexical and dense retrieval alike. Ask for paraphrases, user-style phrasing, and typos.
- One question per passage means every query has exactly one relevant passage, which hides cases where several documents answer the question or none does.
- Generated questions skew toward what the document says, not what users actually ask.

Mix the two, mark which cases are synthetic, and report them as a separate slice. Add **adversarial and negative cases** on purpose: questions whose answer is not in the corpus, near-miss entities (a similar product name, an adjacent version), questions that require a filter to answer correctly, and questions that span two documents.

For **agents**, the unit is a task rather than a query. Pull tasks from real tickets or user sessions, write a deterministic checker where possible (a test that passes, a record that exists, a value that matches), and fall back to a rubric-graded outcome only where no checker is possible.

## How do you label relevance reliably?

1. **Write the rubric first.** Use graded labels, for example 2 = fully answers, 1 = partially relevant or needs another passage, 0 = not relevant. Say how to treat duplicates, outdated versions, and "correct but not what the user meant".
2. **Pool candidates.** For each query, label the union of the top 10-20 results from several systems (dense, BM25, hybrid, a reranker). Pooling, the approach used in TREC-style evaluations, keeps labels from being biased toward the system you happen to run today.
3. **Double-label a sample.** Have two reviewers label the same 50-100 cases independently and compute Cohen's kappa, κ = (p_o − p_e) / (1 − p_e), where p_o is observed agreement and p_e is agreement expected by chance. Values above roughly 0.6 are commonly read as substantial agreement; well below that, fix the rubric before scaling.
4. **Calibrate LLM judges against humans.** An LLM-as-judge can label at scale, but measure its agreement with the human sample and record the judge model and prompt version with every label.
5. **Record who labeled what.** Store labeler identity or judge version, rubric version, and date on each label, so a rubric change does not silently rewrite history.

## How big does the set need to be?

Big enough that the differences you care about are not noise. With 100 queries, a recall@10 change of a few points can be random; with 300-500 it is much more trustworthy, and the uncertainty shrinks roughly with the square root of the number of queries. More important than the total is coverage: aim for at least 30-50 cases in every slice you will make decisions about. Bootstrap confidence intervals over queries are a cheap way to see whether two systems really differ.

## Slices to define up front

Define slices from known intents, past incidents, and product structure, and tag each case with every slice it belongs to:

- Exact identifiers (SKUs, error codes, ticket IDs) versus natural-language questions
- Paraphrase-heavy and synonym-heavy questions
- Rare entities and new content added since the last model update
- Languages and locales
- Filtered queries (tenant, date range, product) and permission-sensitive queries
- Multi-document and multi-hop questions
- Unanswerable questions, where the correct behavior is to abstain

Slices are what turn "recall dropped 2 points" into "recall on identifier queries dropped 15 points after we removed BM25".

## Keep the set fresh and free of leakage

Refresh on product events, not only on a calendar: a new product line, a schema change, an embedding-model swap, or a big corpus import should each trigger new cases. Retire or re-judge cases whose assumed corpus state no longer exists.

Leakage runs in both directions. Evaluation queries and their near-duplicates must not appear in fine-tuning data, few-shot examples, or prompt templates, and training-set questions must not be recycled as evaluation cases. Keep a development split for iteration and a held-out test split that nobody tunes against.

## Version the set like code

Store the set in a repository or a versioned table, with a changelog for every added, removed, or relabeled case and the reason. When the set changes, re-run the previous system on the new version, so a trend chart compares like with like instead of mixing a system change with a dataset change. A practical layout is one file of cases, one file of qrels (query ID, document ID, span, grade), a rubric document, and a manifest naming the corpus snapshot.

## Using the set with Milvus

Keep the corpus snapshot reproducible, for example by recording collection names and data versions (see [reproducible vector-search experiments](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments)), run every case through the same search, filter, and rerank calls the application uses, and score the returned IDs against the qrels. The metric formulas (recall@k, MRR, nDCG) and a scoring loop are in [how to evaluate retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved). For generation-side checks, the [Ragas integration](https://milvus.io/docs/integrate_with_ragas.md) computes faithfulness and context metrics on a Milvus-backed pipeline, and the [agentic RAG with LangGraph tutorial](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md) gives a loop you can evaluate task by task. For a pipeline to evaluate, start from [Build RAG with Milvus](https://milvus.io/docs/build-rag-with-milvus.md) or a runnable application in the [Milvus Bootcamp](https://milvus.io/bootcamp).

## Related reading

- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How can embeddings help with data deduplication?](/ai-quick-reference/how-can-sentence-transformers-be-used-for-data-deduplication-when-you-have-a-large-set-of-text-entries-that-might-be-redundant-or-overlapping)
- [What are hard negatives in retrieval training, and how can you mine them?](/ai-quick-reference/what-are-hard-negatives-in-retrieval)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Sources

- [Retrieval metric definitions (BEIR)](https://github.com/beir-cellar/beir/wiki/Metrics-available)
- [Cohen's kappa (Wikipedia)](https://en.wikipedia.org/wiki/Cohen%27s_kappa)
- [Es et al., Ragas: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217)
- [RAG evaluation integration](https://milvus.io/docs/integrate_with_ragas.md)
- [Agentic retrieval reference workflow](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)
