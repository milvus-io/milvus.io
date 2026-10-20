---
slug: "how-to-build-search-and-agent-evaluation-datasets"
title: "How do you build an evaluation set for agentic and vector search?"
topic: "rag-agents"
order: 80
---

An evaluation set is itself a maintained artifact, not a one-time export. Building one means defining who labels relevance, how query slices are chosen and kept current, and when the set needs to be refreshed as the corpus and product change. A set that was representative at creation can quietly stop representing the live traffic mix within a few months.

![Measure four different outcomes separately](/images/ai-reference/evaluation.svg)

## Choose a labeling process you can defend

Decide who judges relevance — domain reviewers, end-user feedback, or a documented LLM-as-judge rubric — and write down the instructions a judge follows, including how ties, partial relevance, and "no good answer" are marked. Have two reviewers independently label a sample and measure agreement before trusting a single-reviewer label set at scale. Record the judge's identity or model version with each label, not just the label itself, so a later rubric change is attributable rather than silently baked in.

## Define slices before you need them

A slice is a named subset of queries that shares a property you expect to matter: exact identifiers, paraphrases, a specific language, a rare entity type, a tenant with unusual data, or questions with no supported answer. Define slices up front, from known intent categories and past incident reports, rather than discovering them only after an average score looks fine but a specific segment is failing. Tag each query with its slice membership (a query can belong to more than one) so slice-level reporting doesn't require re-labeling later.

## Keep the set fresh and free of leakage

Revisit the set on a cadence tied to how fast the corpus and product change: a new product line, a schema change, or a model swap are all triggers to add queries, not just a calendar date. Track the corpus snapshot and source revisions each query assumes, and retire or re-judge a query once its assumed corpus state is gone. Keep the evaluation set's queries and near-duplicates out of training data, prompt examples, and few-shot exemplars — leakage into the eval set from the other direction is the more common failure, but it runs both ways.

## Govern changes to the set itself

Version the set like code: every added, removed, or re-labeled query should be attributable to a reason and a date, not an untracked edit. An updated rubric or a batch of newly added hard queries should not silently change the apparent trend of an otherwise unchanged system — report before/after the change explicitly instead of blending it into a continuous score history. Keep a development split for iteration and a held-out split that the team does not tune against.

## Example to test

Add a new slice for a product line launched last quarter, re-label a sample with two independent reviewers, and compare their agreement before trusting the new labels. Confirm which older queries that slice's launch invalidated and retire them explicitly rather than leaving stale assumptions in the set.

## From concept to implementation

- [Build an evidence-backed RAG pipeline](https://milvus.io/docs/build-rag-with-milvus.md).
- [Find a runnable application starting point](https://milvus.io/bootcamp).

## Continue learning

- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [RAG evaluation integration](https://milvus.io/docs/integrate_with_ragas.md)
- [Retrieval metric definitions](https://github.com/beir-cellar/beir/wiki/Metrics-available)
- [Agentic retrieval reference workflow](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md)
