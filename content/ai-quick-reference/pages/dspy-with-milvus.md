---
slug: "dspy-with-milvus"
title: "How can DSPy optimize a retrieval application backed by Milvus?"
topic: "frameworks"
order: 107
---

DSPy expresses language-model programs as modules with signatures and optimizes their behavior against a metric and examples. It is useful when a retrieval application's query formulation or evidence use needs systematic improvement. Milvus supplies candidate passages; DSPy does not replace the database index or automatically retrain the embedding model.

## Define a retriever with a stable contract

Give the program a retrieval function that accepts a question and mandatory filters, calls Milvus, and returns passage text, IDs, and sources. Use the official integration guide for the relevant package version, or implement a small adapter around the current client. Keep tenant and authorization constraints outside optimizer-controlled prompt choices.

A minimal retriever module:

```python
import dspy
from pymilvus import MilvusClient

client = MilvusClient(uri="http://localhost:19530")

class MilvusRM(dspy.Retrieve):
    def forward(self, query, k=5):
        vec = embed(query)  # your embedding function
        hits = client.search(
            collection_name="docs", data=[vec], limit=k,
            output_fields=["text", "source_id"],
        )
        return dspy.Prediction(passages=[h["entity"]["text"] for h in hits[0]])

dspy.settings.configure(lm=dspy.LM("openai/gpt-4o-mini"), rm=MilvusRM())
```

Subclassing `dspy.Retrieve` and wiring it through `dspy.settings.configure(rm=...)` is the integration point — DSPy's optimizers tune the surrounding prompts and module calls, not this retrieval function itself.

For a support assistant, define separate modules for query rewriting and answer generation. Start with fixed retrieval settings. Compare the initial program with an optimized program on the same held-out questions. This reveals whether changes help retrieve or use evidence rather than merely produce more persuasive text.

## Choose a metric that matches the task

Evaluate source correctness, answer support, and required abstention, not only string overlap with a sample answer. Reserve held-out documents and questions to reduce leakage. Record optimizer settings, model revision, training examples, and the program artifact.

## Validate the resulting system

Optimization can increase calls, latency, or cost. Measure these along with quality and inspect failures across tenants and query categories. Run retrieval evaluation independently. An answer-generation prompt cannot use evidence absent from its supplied context, but an optimized query rewriter can change a later candidate set. Measure those two effects separately instead of claiming that prompt optimization can never improve retrieval. Treat the optimized program as a versioned application component with regression tests.

## Example to test

Optimize prompts on a development split while holding the retrieval corpus version fixed. Evaluate on an untouched split and save the compiled configuration. Otherwise prompt changes and corpus changes become impossible to attribute separately.

## From concept to implementation

- [Use the topic-specific integration guide](https://milvus.io/docs/integrate_with_dspy.md).
- [Keep a direct-client verification baseline](https://milvus.io/docs/quickstart.md).

## Continue learning

- [How do you choose an AI framework for a Milvus application?](/ai-quick-reference/choose-ai-framework-for-milvus)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)
- [What are hard negatives in retrieval training, and how can you mine them?](/ai-quick-reference/what-are-hard-negatives-in-retrieval)

## Implementation guides and sources

- [DSPy programming modules](https://dspy.ai/3.1.3/learn/programming/modules/)
- [Milvus and DSPy integration](https://milvus.io/docs/integrate_with_dspy.md)

