---
slug: "vector-search-for-healthcare-evidence"
title: "How should you design evidence retrieval for healthcare agents?"
topic: "applications"
order: 94
---

Evidence retrieval for a healthcare agent should **find the passage that applies to the specific patient population, dose, or condition in the question, from a source the user is allowed to see, and return it with a citation a clinician can check**. In practice that means structure-aware chunking of guidelines and literature, per-chunk metadata for source, version, and population, hard access filters for separate corpora, hybrid lexical and semantic search for drug names and codes, reranking, and an evaluation set built around the qualifiers that change clinical meaning.

![Eligibility is a rule, relevance is an ordering](/images/ai-reference/filtering.svg)

## Why does healthcare need more than generic RAG?

A clinical guideline rarely says one simple thing. A query like "metformin dosing in renal impairment" can match a dozen passages that look topically identical but differ in exactly the detail that matters: one applies to eGFR 30-45, another to eGFR under 30 and contraindicates the drug outright. Retrieval that captures only the topic and loses the qualifier produces a fluent, confident, unsafe answer.

[Retrieval-augmented generation](/ai-quick-reference/what-is-rag-retrievalaugmented-generation-in-nlp) does help when it is built carefully. The MIRAGE benchmark of 7,663 medical questions found that retrieval improved six different LLMs by up to 18% over chain-of-thought prompting alone, and that combining several medical corpora and retrievers worked best ([Xiong et al., 2024](https://arxiv.org/abs/2402.13178)). The same study also observed a "lost-in-the-middle" effect, where models used evidence at the start and end of the context more reliably than evidence in the middle, which argues for retrieving fewer, better-ranked passages. A RAG system over UK NICE guidelines (about 10,000 chunks from 300 guidelines) reached a mean reciprocal rank of 0.81 with hybrid retrieval and raised answer faithfulness well above a non-retrieval baseline ([Lewis et al., 2025](https://arxiv.org/abs/2510.02967)). The pattern in that work is consistent: retrieval quality sets the ceiling on answer quality.

## What does the architecture look like?

| Layer | Design decision |
|---|---|
| Sources | Separate corpora: published guidelines, literature (e.g. PubMed abstracts), drug labels, internal protocols, and patient records |
| Chunking | Follow document structure: recommendation plus its population, dosing table plus caveats |
| Metadata | `source_id`, `guideline_version`, `published_at`, `review_by`, `population`, `corpus`, `org_id`, `access_level` |
| Embedding | General or biomedical model, chosen on your own queries; BM25 sparse vectors for exact terms |
| Access | Corpus and permission scoping before ranking |
| Retrieval | Hybrid dense + BM25, fused, then reranked |
| Generation | Answer only from cited passages; show source and date |
| Evaluation | Contrast pairs, citation accuracy, access isolation, clinician review |

### Make the chunk boundary the first decision

If a guideline splits renal-dosing guidance across a table and a footnote on contraindications, and the chunker cuts between them, the retrieved passage can state a dose without its disqualifying condition. Decide the chunk unit from the document's structure: a dosing table should travel with its preceding population statement and following caveats, and a recommendation should keep its strength-of-evidence grading. Store the source, guideline version, publication and review dates, and population scope on every chunk so a retrieved passage carries its own qualifiers. When a guideline is updated, insert the new chunks and delete or mark the superseded ones in the same pipeline, so outdated advice is not served as current. [Choosing chunk size for RAG](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications) covers the general mechanics.

### Choose embeddings on your own queries

Biomedical encoders trained on PubMed-style text often handle clinical vocabulary better than general models, but strong general-purpose models have closed much of that gap, and clinician questions are frequently written in plain language. Don't pick from a leaderboard. Run a shortlist against a few hundred real queries from your users. [Choosing an embedding model](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy) explains what to measure.

### Combine exact and semantic matching

Drug names, dose units, lab thresholds, ICD-10 or SNOMED codes, and negation ("not recommended" versus "recommended") carry clinical meaning, and paraphrase-friendly embeddings can blur them. Milvus can hold both signals in one collection. A text field with `enable_analyzer=True` feeds a BM25 function that produces a sparse vector for [full-text search](https://milvus.io/docs/full-text-search.md), and a dense vector field holds the embedding. A [hybrid search](https://milvus.io/docs/multi-vector-search.md) runs both and fuses them with `RRFRanker` or `WeightedRanker`:

```python
scope = 'corpus == "guidelines" and status == "current"'
reqs = [
    AnnSearchRequest(data=[query_vec], anns_field="dense", param={}, limit=40, expr=scope),
    AnnSearchRequest(data=[query_text], anns_field="sparse_bm25", param={}, limit=40, expr=scope),
]
hits = client.hybrid_search("clinical_evidence", reqs=reqs, ranker=RRFRanker(),
                            limit=10, output_fields=["source_id", "guideline_version", "text"])
```

Mapping brand names to generics and expanding abbreviations at query time (for example "CKD" to "chronic kidney disease") also improves lexical recall. A cross-encoder [reranker](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it) over the fused top candidates helps separate the eGFR-under-30 passage from the eGFR 30-45 one. [Hybrid search explained](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it) goes further into fusion choices.

### Keep corpora and permissions separate

An internal operations knowledge base, a published research corpus, and a patient-record system have different eligibility rules and different consequences when they are wrong. Scope each retrieval call to the corpus it needs with an explicit filter, rather than running one similarity search across all of them. A result that is fine for a clinician's reference lookup may not belong in a patient-facing tool.

Milvus gives you several isolation levels. [RBAC](https://milvus.io/docs/rbac.md) grants privileges at the instance, database, and collection level, so placing patient-specific data in its own collection or database lets the database itself enforce who can read it. Within a shared collection, a [partition key](https://milvus.io/docs/use-partition-key.md) on a field such as `org_id` groups each organization's data and makes the filter efficient, but the application must always apply that filter. The [multi-tenancy guide](https://milvus.io/docs/multi_tenancy.md) compares these strategies. Keep protected health information out of the vector store unless retrieval actually needs it. Compliance with HIPAA or other regulations depends on your whole deployment and operating processes, and no retrieval component settles it on its own. [Authentication, RBAC, and tenant filters](/ai-quick-reference/milvus-security-rbac) covers the Milvus side in detail.

## How do you validate it?

Build a reviewed test set from real clinical questions, and include **contrast pairs**: passages that differ only in population, dose threshold, or negation. Then check:

- **Qualifier retention**: does the retrieved passage keep the eGFR threshold, age group, or contraindication attached?
- **Retrieval quality**: Recall@K and MRR against clinician-labeled relevant passages.
- **Currency**: are superseded guideline versions excluded?
- **Access isolation**: does any result cross a corpus or permission boundary? This should never happen.
- **Faithfulness and citation accuracy**: is every claim in the generated answer supported by the passage it cites?

A concrete test: index the metformin renal-dosing guideline twice, once with the dosing table joined to its eGFR qualifier and contraindication and once with them split. Query "metformin dose for low kidney function" against both and check whether the contraindication for eGFR under 30 survives into the retrieved result. This is a retrieval test design, not clinical advice. Milvus provides fields, indexes, filters, and hybrid search; clinical validity is established by clinical owners reviewing results on tests like this one. [Building search and agent evaluation sets](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets) has more on test construction.

## Next steps

Start with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), then build the baseline with the [RAG tutorial](https://milvus.io/docs/build-rag-with-milvus.md) and add BM25 hybrid search and filters on top. [Published Milvus use cases](https://milvus.io/use-cases) show the same building blocks in production. For deployments that must keep data inside your own cloud account, [Zilliz Cloud BYOC](https://docs.zilliz.com/docs/byoc/byoc-intro) runs the managed service in your VPC.

## Sources and further reading

- [Build RAG with Milvus](https://milvus.io/docs/build-rag-with-milvus.md)
- [Filtered search](https://milvus.io/docs/filtered-search.md)
- [Full-text search (BM25)](https://milvus.io/docs/full-text-search.md) and [hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Multi-tenancy strategies](https://milvus.io/docs/multi_tenancy.md), [partition key](https://milvus.io/docs/use-partition-key.md), and [RBAC](https://milvus.io/docs/rbac.md)
- [Xiong et al., Benchmarking Retrieval-Augmented Generation for Medicine (arXiv 2402.13178)](https://arxiv.org/abs/2402.13178)
- [Lewis et al., Grounding LLMs in Clinical Evidence: RAG over UK NICE Guidelines (arXiv 2510.02967)](https://arxiv.org/abs/2510.02967)
- [How should you design vector retrieval for legal-document agents?](/ai-quick-reference/vector-search-for-legal-document-agents)
