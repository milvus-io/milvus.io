---
slug: "dspy-with-milvus"
title: "How can DSPy optimize a retrieval application backed by Milvus?"
topic: "frameworks"
order: 107
---

DSPy is a framework from Stanford NLP for *programming* language models instead of hand-writing prompts. You describe each step as a **signature** (inputs → outputs), compose the steps into **modules**, and let an **optimizer** such as MIPROv2 or BootstrapFewShot search for better instructions and few-shot examples against a metric you define. Milvus supplies the retrieval step. A DSPy module calls a function that searches a Milvus collection and returns passages, and the optimizer tunes how the program uses them. DSPy does not change your vectors, your index, or your embedding model. It changes the prompts and the demonstrations around them.

## Retrieval in current DSPy: just a Python function

Older tutorials, including some integration guides, use a `MilvusRM` class imported from `dspy.retrieve.milvus_rm` and passed in with `dspy.settings.configure(rm=...)`. That module is gone from current DSPy releases (3.x), so those imports fail. The current pattern is simpler. Any Python callable that returns passages can be used inside a module. With PyMilvus it looks like this:

```python
import dspy
from pymilvus import MilvusClient

lm = dspy.LM("openai/gpt-4o-mini")
dspy.configure(lm=lm)

embedder = dspy.Embedder("openai/text-embedding-3-small", dimensions=512)
client = MilvusClient(uri="http://localhost:19530", token="root:Milvus")

def search(query: str, k: int = 5, tenant: str = "acme") -> list[str]:
    hits = client.search(
        collection_name="support_docs",
        data=[embedder(query).tolist()],
        limit=k,
        filter=f'tenant == "{tenant}"',
        output_fields=["text", "source"],
    )
    return [f"[{h['entity']['source']}] {h['entity']['text']}" for h in hits[0]]
```

The collection must have been loaded with vectors from the same embedding model and dimension (512 here). The filter is applied by Milvus during the search, and the tenant value should come from your application, never from the model.

## A RAG module DSPy can optimize

```python
class RAG(dspy.Module):
    def __init__(self):
        self.respond = dspy.ChainOfThought("context, question -> response")

    def forward(self, question: str):
        context = search(question, k=5)
        return self.respond(context=context, question=question)

rag = RAG()
print(rag(question="How do I rotate an API key?").response)
```

The signature string `"context, question -> response"` is the whole prompt specification. DSPy builds the actual prompt, and the optimizer is free to rewrite its instructions and add worked examples.

## Choosing a metric and optimizing

Optimization needs labeled examples (`dspy.Example(question=..., response=...).with_inputs("question")`) and a metric. DSPy ships `SemanticF1`, which uses the LM to compare a response with the reference answer. Split the examples into train and dev sets, measure a baseline, optimize, and measure again:

```python
from dspy.evaluate import SemanticF1

metric = SemanticF1(decompositional=True)
evaluate = dspy.Evaluate(devset=devset, metric=metric, num_threads=8, display_progress=True)

evaluate(RAG())                                   # baseline

optimizer = dspy.MIPROv2(metric=metric, auto="light", num_threads=8)
optimized_rag = optimizer.compile(RAG(), trainset=trainset)

evaluate(optimized_rag)                           # after optimization
optimized_rag.save("optimized_rag.json")
```

`auto` takes `"light"`, `"medium"`, or `"heavy"`, which trades optimization cost for search depth. `BootstrapFewShot` is a cheaper starting point that only collects successful demonstrations. Save the compiled program and load it with `RAG().load("optimized_rag.json")` in production so you serve exactly what you evaluated.

A response-similarity metric alone can reward fluent answers that cite the wrong evidence. For retrieval applications, combine it with checks you control: did the cited source IDs include the gold document, and did the program abstain when the corpus has no answer? A custom metric is just a Python function `metric(example, pred, trace=None)` that returns a number or a boolean. For building the labeled set, see [how to build an evaluation set for agentic and vector search](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets).

## Can DSPy improve retrieval itself?

Indirectly, yes. If the program includes a query-writing step, for example a `dspy.ChainOfThought("question -> search_query")` module whose output goes to `search`, the optimizer can learn better search queries, and that changes which passages Milvus returns. Multi-hop programs that generate several queries benefit the most. What DSPy cannot fix is a candidate set that never contains the answer. A prompt cannot use a passage that was never retrieved. So measure retrieval separately with Recall@k on the same questions, outside the DSPy loop, as described in [how to evaluate retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved). If recall is the bottleneck, the fix is on the Milvus side: better chunking, a different embedding model, [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it), or a reranker. Changing `k` or the index parameters is also an experiment you run yourself. The optimizer will not explore it.

## Keeping optimization honest

- **Freeze the corpus during a run.** If documents change while you optimize, you can't tell prompt gains from data changes. Record the collection name and a snapshot or ingestion version with the saved program.
- **Hold out a test split** that neither the optimizer nor you looked at while iterating.
- **Watch cost and latency.** Optimized programs can make more LM calls (chain-of-thought, extra demonstrations). Track tokens and p95 latency next to quality.
- **Keep security out of the optimizable surface.** Tenant filters and permission checks belong in `search`, not in anything the optimizer can rewrite.
- **Version the compiled JSON** like code and re-run the dev evaluation in CI when the corpus, model, or DSPy version changes.

## Next steps

Load your corpus into Milvus with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), or skip operations with [Zilliz Cloud](https://zilliz.com/cloud), then plug the `search` function above into the DSPy RAG tutorial. The [Milvus and DSPy guide](https://milvus.io/docs/integrate_with_dspy.md) walks through an end-to-end HotpotQA example. Note that it uses the older `MilvusRM` interface, so swap in a plain search function when you run it on a current DSPy release.

## Related reading

- [How do you choose an AI framework for a Milvus application?](/ai-quick-reference/choose-ai-framework-for-milvus)
- [What is retrieval-augmented generation (RAG)?](/ai-quick-reference/what-is-rag-retrievalaugmented-generation-in-nlp)
- [What are hard negatives in retrieval training, and how can you mine them?](/ai-quick-reference/what-are-hard-negatives-in-retrieval)
- [What is reranking, and when should you apply it?](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it)

## Sources

- [DSPy RAG tutorial](https://dspy.ai/current/tutorials/rag/)
- [DSPy programming modules](https://dspy.ai/3.1.3/learn/programming/modules/)
- [DSPy paper (arXiv:2310.03714)](https://arxiv.org/abs/2310.03714)
- [Milvus and DSPy integration](https://milvus.io/docs/integrate_with_dspy.md)
