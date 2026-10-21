---
slug: "vector-search-for-legal-document-agents"
title: "How should you design vector retrieval for legal-document agents?"
topic: "applications"
order: 93
---

Legal retrieval for an AI agent works best as **scoped hybrid search over structure-aware chunks**. Split contracts, cases, and statutes along their own clause and section boundaries, store each chunk with its document, version, jurisdiction, and matter metadata, filter to the right matter and jurisdiction before ranking, combine BM25 (for citations and defined terms) with dense embeddings (for "find clauses like this one"), rerank, and return every passage with a citation a lawyer can check. Accuracy depends on the details embeddings tend to blur: the dollar cap, the carve-out, the effective date.

![Eligibility is a rule, relevance is an ordering](/images/ai-reference/filtering.svg)

## Why is legal retrieval harder than generic RAG?

Two indemnification clauses can read almost the same ("Vendor shall indemnify Client against all claims arising from...") while one caps liability at $1M and the other has no cap and excludes gross negligence. They embed close together, but a reviewer who gets the wrong one gets the wrong exposure number. Legal corpora have several properties that break naive [retrieval-augmented generation](/ai-quick-reference/what-is-rag-retrievalaugmented-generation-in-nlp):

- **Boilerplate everywhere.** Thousands of contracts share near-identical language, so a similarity search can pull a perfect-looking clause from the *wrong document*. Researchers studying large legal RAG datasets call this document-level retrieval mismatch and found it to be a dominant failure mode ([Reuter et al., 2025](https://arxiv.org/abs/2510.06999)).
- **Meaning lives in exact tokens.** Citations ("17 U.S.C. § 107"), case names, defined terms ("Confidential Information"), and numbers carry the answer, and dense models handle them less reliably than lexical matching.
- **Authority and time matter.** A superseded amendment, an overruled case, or a clause from a different jurisdiction can be textually perfect and legally wrong.
- **Confidentiality is mandatory.** Matter and client walls are professional obligations, not ranking preferences.

The stakes are real. A preregistered Stanford study of commercial legal research assistants built on RAG found hallucination rates between roughly 17% and 33% ([Magesh et al., 2024](https://arxiv.org/abs/2405.20362)). Retrieval reduces errors compared with an ungrounded model, but it does not remove them, so the design has to make errors easy to catch.

## What does the end-to-end architecture look like?

| Stage | What it does | Milvus piece |
|---|---|---|
| Parse | Extract text with section numbers, headings, defined terms, tables, and page anchors | Upstream (OCR/parser) |
| Chunk | Split at clause, section, or paragraph boundaries; attach parent context | Upstream |
| Embed | Dense vector per chunk; BM25 sparse vector generated from the text | Dense field + BM25 `Function` |
| Store | Chunk text plus `doc_id`, `version`, `section_ref`, `jurisdiction`, `doc_type`, `effective_date`, `status`, `matter_id` | Scalar fields, partition key |
| Scope | Restrict to the matter, jurisdiction, document type, and current status | `filter` expression |
| Retrieve | Lexical and semantic search in parallel, fused | `hybrid_search` with RRF or weighted ranker |
| Rerank | Cross-encoder reorders the top candidates | Reranker after retrieval |
| Ground | Return passages with citations; the model answers only from them | Application |

### Chunk along legal structure

Chunk at the unit a lawyer would cite: a contract clause with its sub-clauses, a statute section, a court opinion's paragraph. Fixed token windows cut a liability clause away from its exceptions and make it read as unconditional. Keep three kinds of context attached to each chunk:

1. **Local qualifiers** such as carve-outs, caps, and "subject to Section 9.2" references, kept in the same chunk or linked through `section_ref`.
2. **Definitions** used in the clause, either inlined or retrievable by their defined term.
3. **Document context**, meaning a short header naming the party, document type, and date. Prepending a brief document summary to each chunk significantly reduced wrong-document retrieval in the Reuter et al. experiments, and it is cheap to do at ingest time.

For case law, add the case name, court, decision date, and citation as metadata, and treat headnotes and holdings as their own chunks. [Choosing chunk size for RAG](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications) covers the general trade-offs.

### Scope before you rank

Apply matter, client, and jurisdiction as hard filters so a clause from an unrelated matter can never enter the candidate list, however similar it looks. In Milvus this is a [filtered search](https://milvus.io/docs/filtered-search.md) such as `matter_id == "M-2024-117" and status == "current" and jurisdiction in ["NY", "DE"]`. For a firm with many matters, declaring `matter_id` as a [partition key](https://milvus.io/docs/use-partition-key.md) routes each matter's data into its own partition group, so the filter also narrows what gets searched. Where walls must be enforced by the database rather than by the application's filter, separate collections or databases let Milvus [RBAC](https://milvus.io/docs/rbac.md) grant access per collection. [Multi-tenancy in Milvus](https://milvus.io/docs/multi_tenancy.md) compares these options; partition-key tenancy scales to many more tenants but relies on the application to apply the filter. The [multi-tenancy design guide](/ai-quick-reference/what-is-the-role-of-multitenancy-in-scalability-considerations-for-vector-databases-and-how-might-resource-isolation-be-handled-when-multiple-applications-share-the-same-infrastructure) walks through the choice.

### Combine exact and semantic matching

Legal queries mix two intents. "Cases citing *Campbell v. Acuff-Rose*" or "where is 'Material Adverse Effect' defined" need lexical precision, while "clauses that shift data-breach costs to the vendor" needs semantic recall. Milvus handles both in one collection: a VARCHAR text field with `enable_analyzer=True` feeds a BM25 function that writes a sparse vector ([full-text search](https://milvus.io/docs/full-text-search.md)), and a dense vector field holds the embedding. A [hybrid search](https://milvus.io/docs/multi-vector-search.md) sends one `AnnSearchRequest` to each field and fuses the two lists with `RRFRanker` or `WeightedRanker`:

```python
dense_req = AnnSearchRequest(data=[query_vec], anns_field="dense",
                             param={}, limit=50, expr=scope)
bm25_req  = AnnSearchRequest(data=[query_text], anns_field="sparse_bm25",
                             param={}, limit=50, expr=scope)
hits = client.hybrid_search("clauses", reqs=[dense_req, bm25_req],
                            ranker=RRFRanker(), limit=20,
                            output_fields=["doc_id", "section_ref", "text"])
```

A cross-encoder [reranker](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it) over the top 20-50 fused hits then does the fine-grained comparison that bi-encoders miss, such as whether a clause actually contains a cap. For research that follows citations from case to case, a citation graph alongside vector search helps; see [Graph RAG](/ai-quick-reference/how-does-milvus-enable-graph-rag-for-multihop-agent-reasoning).

### Ground every answer in a checkable passage

Return the original passage, its document, version, and section reference with every result, and instruct the model to answer only from retrieved text and to cite it. Treat retrieved contract text as evidence for a reviewer, never as instructions to the agent; a document that says "ignore prior instructions" is still just a document. When an agentic loop keeps re-querying without finding new evidence, the corpus or chunking usually needs fixing, and a deeper loop will not help. [Agentic search](/ai-quick-reference/what-is-agentic-search) explains how agents plan these multi-step lookups.

## How do you evaluate a legal retriever?

Build a reviewed test set from real questions, and include **contrast pairs**: clauses or holdings that differ in only one detail (cap amount, carve-out, jurisdiction, effective date). Then measure:

- **Recall@K and document accuracy**: was the right passage retrieved, and from the right document and version?
- **Qualifier retention**: did the retrieved chunk contain the cap or exception, not just the shared boilerplate?
- **Scope leakage**: did anything outside the matter, jurisdiction, or current status appear? This should be zero.
- **Citation faithfulness**: is every claim in the final answer supported by a cited passage?

A quick test: index two contracts, one with a $1M indemnification cap and one uncapped with a gross-negligence carve-out. Query "indemnification obligations for vendor claims" scoped to each matter, and check that each result includes its own cap or carve-out language rather than only the boilerplate they share. Milvus retrieves passages; deciding what a passage means for the matter remains the reviewing lawyer's job. [Building search and agent evaluation sets](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets) has more on test-set design.

## Real-world example and next steps

Document-heavy professional workflows share this pattern of strict scoping, exact terms, and verifiable sources. [Rexera's story](https://zilliz.com/customers/rexera) shows a real-estate transaction workflow built on document retrieval with Zilliz. To build your own, start with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), follow the [RAG tutorial](https://milvus.io/docs/build-rag-with-milvus.md), and add BM25 and hybrid search once the baseline works. For managed deployment with private networking, see [Zilliz Cloud](https://zilliz.com/cloud).

## Sources and further reading

- [Build RAG with Milvus](https://milvus.io/docs/build-rag-with-milvus.md)
- [Full-text search (BM25) in Milvus](https://milvus.io/docs/full-text-search.md)
- [Hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Filtered search](https://milvus.io/docs/filtered-search.md)
- [Partition key](https://milvus.io/docs/use-partition-key.md) and [multi-tenancy strategies](https://milvus.io/docs/multi_tenancy.md)
- [Role-based access control](https://milvus.io/docs/rbac.md)
- [Magesh et al., Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools (arXiv 2405.20362)](https://arxiv.org/abs/2405.20362)
- [Reuter et al., Towards Reliable Retrieval in RAG Systems for Large Legal Datasets (arXiv 2510.06999)](https://arxiv.org/abs/2510.06999)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do you keep stable identities between lake data and vector search?](/ai-quick-reference/how-to-keep-stable-ids-between-lake-data-and-vector-search)
