---
slug: "reranking-model-catalog"
title: "Which reranking models fit a Milvus retrieval pipeline?"
topic: "models"
order: 119
---

A reranking model takes a query and a short list of candidates that a first-stage search already found, reads each query–candidate pair together, and reorders the list by relevance. In a Milvus pipeline, vector, sparse, or hybrid search retrieves the top 25 to 100 candidates quickly, and the reranker spends more compute on just those to put the best evidence first. The right reranker depends on your latency budget, languages, modality, and license more than on any single leaderboard score.

![Retrieve broadly, rerank a shortlist. A reranker cannot recover a document absent from its candidate pool.](/images/ai-reference/rerank-cascade.svg)

## Why rerank at all?

Embedding search is fast because documents are encoded once, independently of any query. That independence is also its limit: the model never sees the query and the document side by side. A reranker, usually a cross-encoder, feeds both texts through the same network so attention can connect query terms to the exact passage that answers them. The result is noticeably better precision at the top of the list, which is what a RAG prompt or a user actually sees.

Reranking pays off most when the right answer is usually somewhere in your top 50 but rarely in the top two. If first-stage precision is already high, or the answer is often missing from the candidates entirely, a reranker adds latency without much gain. It can never recover a document that was filtered out or never retrieved, so fix recall first.

## What kinds of rerankers are there?

| Type | How it scores | Strengths | Costs and caveats |
|---|---|---|---|
| Cross-encoder (pointwise) | Scores each query–document pair independently with an encoder model | Best precision per millisecond for most text workloads; runs locally; easy to batch | Cost grows linearly with candidate count; input length limits truncate long passages |
| LLM-based pointwise reranker | A decoder model judges relevance of each pair, often with an instruction | Better at nuanced or instruction-dependent relevance | Larger models, higher latency and GPU cost |
| Listwise reranker | Reads the query and many candidates in one context and outputs an ordering | Can compare candidates against each other | Sensitive to candidate order and context length; harder to cache |
| Late interaction (ColBERT-style) | Precomputed token vectors, MaxSim at query time | Low query-time cost | Large storage; usually used as a retriever, see [late interaction](/ai-quick-reference/what-is-late-interaction-retrieval) |
| Multimodal / visual reranker | Scores pairs that include page images, photos, or frames | Uses layout and visual evidence a text excerpt loses | Image preprocessing and tiling raise compute per pair |
| Hosted reranking API | Provider runs the model | No GPUs to manage; quality and fast tiers | Per-request cost, network latency, data leaves your environment |

A sensible default is a cross-encoder over 25 to 50 candidates. Reach for an LLM or listwise reranker when relevance depends on instructions ("prefer the most recent policy", "only peer-reviewed sources") or multi-criteria judgment, and you can afford the extra latency.

## How do you choose a reranker?

Work through the constraints in order:

1. **Modality and language.** Text-only, multilingual text, structured records, or page images? A reranker trained on English web passages will underperform on Chinese contracts or code.
2. **Latency budget.** Measure P50 and P95 with your real candidate count and passage length. Reranking 100 long passages can cost several times more than 25 short ones.
3. **Deployment and license.** Hosted API, self-hosted open weights, or both? Several strong open checkpoints are non-commercial.
4. **Quality on your data.** Freeze the first-stage candidates for a set of judged queries and compare nDCG@10 or judged relevance before and after reranking. Keep "no reranker" as a baseline.

Leaderboards for rerankers are less standardized than for embeddings, because pointwise, listwise, and visual models are often evaluated on different candidate pools. Treat published comparisons as hints and use the same frozen candidates for every model you test.

## Reranker families worth evaluating

These are well-documented families and baselines, grouped by type rather than ranked. Hosted providers revise version identifiers over time, so check each provider's documentation for the current model name before integrating.

**Hosted text rerankers**
- [Cohere Rerank](https://docs.cohere.com/docs/rerank-overview): multilingual text and structured-document ranking with quality and fast tiers. Serialize fields consistently; its score is a relevance signal, not a calibrated probability of correctness.
- [Voyage rerankers](https://docs.voyageai.com/docs/reranker): standard and lite tiers; compare both under the same candidates and respect their query and document token limits.

**Open-weight text rerankers**
- [BAAI/bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3): an established multilingual cross-encoder and a strong cost/quality baseline.
- [Qwen/Qwen3-Reranker-8B](https://huggingface.co/Qwen/Qwen3-Reranker-8B) and [Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B): LLM-based relevance models in a large and a budget size. Use the documented instruction and scoring procedure.
- [jinaai/jina-reranker-v3.5](https://huggingface.co/jinaai/jina-reranker-v3.5): a compact listwise model that scores a candidate set with shared context; public weights are CC-BY-NC.
- [mixedbread-ai/mxbai-rerank-large-v2](https://huggingface.co/mixedbread-ai/mxbai-rerank-large-v2), [Alibaba-NLP/gte-multilingual-reranker-base](https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base), and [maidalun1020/bce-reranker-base_v1](https://huggingface.co/maidalun1020/bce-reranker-base_v1) (Chinese/English): encoder-based options to include when language coverage or size matters.
- [cross-encoder/ms-marco-MiniLM-L6-v2](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L6-v2): a tiny English baseline for plumbing and cost tests; its MS MARCO training limits what it says about other domains.

**Instruction-following rerankers**
- [ContextualAI/ctxl-rerank-v2-instruct-multilingual-2b](https://huggingface.co/ContextualAI/ctxl-rerank-v2-instruct-multilingual-2b) and [zeroentropy/zerank-2](https://huggingface.co/zeroentropy/zerank-2): accept ranking instructions. Test whether constraints are actually followed rather than trusting the generic score.

**Visual and multimodal rerankers**
- [Qwen/Qwen3-VL-Reranker-8B](https://huggingface.co/Qwen/Qwen3-VL-Reranker-8B): scores pairs containing text and images; pass original pages or frames instead of a text excerpt.
- [nvidia/llama-nemotron-rerank-vl-1b-v2](https://huggingface.co/nvidia/llama-nemotron-rerank-vl-1b-v2): a vision-language cross-encoder for document pages; tiling and context settings drive cost. Check NVIDIA's model terms.

**Specialized designs**
- [KaLM-Reranker-V1](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Small-R2) (Nano/Small/Large): an encoder-decoder design where a passage encoder produces a compressed document representation and a decoder attends over it with the query. The compressed state can be cached but is not a general ANN vector.
- [tencent/R3-rerank-0.6b](https://huggingface.co/tencent/R3-rerank-0.6b) paired with [R3-embedding-0.6b](https://huggingface.co/tencent/R3-embedding-0.6b): a two-stage retriever for agent skills, where the embedding model shortlists skills from a catalog and the reranker refines them. Useful for tool and skill selection, not a general document reranker.

## How do rerankers plug into Milvus?

There are two integration paths, and they can coexist.

**Client-side with PyMilvus Model.** Run the reranker in your application after `search` or `hybrid_search` returns candidates. The `pymilvus[model]` package includes `BGERerankFunction`, `CrossEncoderRerankFunction`, `CohereRerankFunction`, `VoyageRerankFunction`, `JinaRerankFunction`, `JevRerankFunction`, and `TEIRerankFunction` (for a model served by Hugging Face Text Embeddings Inference):

```python
from pymilvus.model.reranker import BGERerankFunction

bge_rf = BGERerankFunction(model_name="BAAI/bge-reranker-v2-m3", device="cpu")
reranked = bge_rf(query, [hit["entity"]["text"] for hit in hits], top_k=5)
```

**Server-side with a Model Ranker.** From Milvus 2.6, a `Function` of type `RERANK` with `"reranker": "model"` asks Milvus to call a model service during search, so results come back already reranked. Supported providers include TEI, vLLM, Cohere, Voyage AI, SiliconFlow, DashScope, and Hugging Face:

```python
from pymilvus import Function, FunctionType

model_ranker = Function(
    name="semantic_ranker",
    input_field_names=["document"],
    function_type=FunctionType.RERANK,
    params={
        "reranker": "model",
        "provider": "tei",
        "queries": ["machine learning for time series"],
        "endpoint": "http://model-service:8080",
    },
)
```

Pass `ranker=model_ranker` to `search`. Do not confuse this with RRF or weighted fusion rankers, which merge result lists from several vector fields in [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it) using ranks or scores alone and never read the text.

Whichever path you use, keep stable primary keys through the whole flow. Map the reranker's output positions back to IDs, rerank only candidates the user is permitted to see, and log the original Milvus rank so you can tell whether a bad answer came from retrieval or reranking.

## Evaluate rerankers fairly

Freeze first-stage results per test query, then vary one thing at a time: the model, the candidate count, or the passage truncation length. Report nDCG or judged relevance alongside P50/P95 latency, failure rate, and cost per thousand queries. Record the model revision, input serialization, and truncation policy, and re-tune any score threshold after changing models: scores from different rerankers are not on the same scale. The [retrieval-evaluation guide](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved) covers judgment sets and metrics.

## Related reading

- [What is reranking, and when should you apply it?](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it)
- [How should you serve and version embedding and reranking models for Milvus?](/ai-quick-reference/model-inference-serving)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)
- [Which current embedding models should you evaluate for Milvus?](/ai-quick-reference/embedding-reranking-model-catalog)

Next step: add a Model Ranker to an existing search by following the [Model Ranker overview](https://milvus.io/docs/model-ranker-overview.md), or try reranking in a full RAG app from the [Milvus Bootcamp](https://milvus.io/bootcamp).

## Sources and further reading

- [Milvus: Model Ranker overview](https://milvus.io/docs/model-ranker-overview.md)
- [Milvus: vLLM ranker](https://milvus.io/docs/vllm-ranker.md)
- [Milvus: rerankers in PyMilvus Model](https://milvus.io/docs/rerankers-overview.md)
- [Milvus: multi-vector hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Released reranker wrappers (milvus-model v0.3.4)](https://github.com/milvus-io/milvus-model/tree/v0.3.4/src/pymilvus/model)
- [ColBERT: late interaction over BERT (arXiv)](https://arxiv.org/abs/2004.12832)
- [Hugging Face Text Embeddings Inference](https://github.com/huggingface/text-embeddings-inference)
- [KaLM-Reranker FBNL technical report](https://arxiv.org/abs/2606.22807)
- [Tencent R3-Skill implementation](https://github.com/Tencent/R3-Skill)
