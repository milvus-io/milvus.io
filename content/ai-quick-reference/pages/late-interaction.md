---
slug: "what-is-late-interaction-retrieval"
title: "What is late-interaction retrieval, and how can embedding lists help?"
topic: "retrieval"
order: 69
---

Most vector search compresses a document down to one summary vector and compares it against one query vector. Late interaction keeps a vector for every token (or patch, for images) instead of collapsing them into a single summary — so a query and a document are compared piece by piece, not as two single points. That preserves detail a single averaged vector would blur away: a document can match a query closely on the specific terms that matter, even if the rest of the document is unrelated.

Late-interaction retrieval independently encodes queries and documents, then computes detailed interactions during pair scoring. Token-level models may preserve useful local matching signals that a single vector loses; relevance gains depend on training and the score. Multiple stored vectors alone do not define a late-interaction model. Its representation and scoring also add storage and computation costs.

![Preserve page structure through multi-vector retrieval](/images/ai-reference/visual-page.svg)

## Distinguish it from other multi-vector designs

Storing separate title and body vectors and fusing their result lists is one form of multi-vector retrieval. An embedding-list model that compares query tokens with document-token vectors is another. These approaches need different scoring logic and should not be described as interchangeable simply because both store several vectors.

Milvus 3.0 documents StructArray vector subfields and separate EmbeddingList and element-level search modes. The appropriate MAX_SIM-style metric and supported index path depend on the intended mode. Verify the release's schema and index requirements before adopting an example.

## Keep the representation compatible

Use the intended query and document encoding, including tokenization, masking, and any normalization. Record model revisions and how source tokens, chunks, or image patches map to stored elements. A document with many elements may need explicit size limits and a reproducible truncation policy.

For example, a long technical document can contain one decisive passage amid unrelated text. A finer-grained representation may preserve that signal, but the scoring function and training determine whether it helps. Merely splitting a document into many unrelated vectors does not establish a valid late-interaction model.

## Compare relevance against the added cost

Measure retrieval quality on the task's difficult queries, then include index size, build time, memory, candidate search, payload reads, and end-to-end latency. Compare with a single-vector candidate stage followed by reranking at a similar operating budget.

Test long documents, many-element records, metadata filters, and deletion of an element or parent record under the supported data model. Choose late interaction when the measured relevance gain justifies the larger representation and operational complexity. Preserve source mappings so returned document-level results can still expose the evidence that made them useful.

## What late interaction means in a ColBERT-style model

The query and document are encoded independently into token vectors; their detailed interaction happens when scoring a pair. In a common MaxSim score, each query-token vector takes its highest similarity to a document-token vector and those maxima are summed. The score is directional and depends on the model's masking, normalization, and aggregation rules. This is not equivalent to averaging all vectors or fusing independent title/body rankings. The database's supported metric and search mode must match the chosen model.

## Candidate indexes and the final score

MaxSim specifies how a query list is compared with a document list. Token-level ANN and MUVERA describe ways to retrieve candidates efficiently; neither is a substitute name for the score. The separate [multi-vector article](/ai-quick-reference/what-is-multi-vector-retrieval) gives a worked score matrix, distinguishes independent fields from joint lists, and explains candidate/index trade-offs. Verify target-release support before adopting the strategy page's low-level parameters.

## Example to test

Retrieve page candidates and inspect whether the relevant page was included before token-level scoring. Increasing final MaxSim scoring cannot recover a page the candidate stage omitted. Evaluate candidate recall and final ordering separately.

## From concept to implementation

- [Check versioned embedding-list search](https://milvus.io/docs/basic-vector-search-with-structarray.md).
- [Connect media evidence to an application](https://milvus.io/docs/multimodal_rag_with_milvus.md).

## Continue learning

- [What is multi-vector retrieval, and how do MaxSim and MUVERA work?](/ai-quick-reference/what-is-multi-vector-retrieval)
- [How do ColPali, ColQwen, and other page encoders use Milvus embedding lists?](/ai-quick-reference/visual-document-models)
- [Which embedding and reranking models fit your workload?](/ai-quick-reference/reranking-model-catalog)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [What is reranking, and when should you apply it?](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it)
- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)

## Implementation guides and sources

- [EmbeddingList and element-level search](https://milvus.io/docs/basic-vector-search-with-structarray.md)
- [Indexes and metrics for StructArray vectors](https://milvus.io/docs/index-structarray-fields.md)
- [StructArray data model](https://milvus.io/docs/array-of-structs.md)
- [ColBERT independent encoding and late interaction](https://arxiv.org/abs/2004.12832)
- [Candidate strategies and release caveats](https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md)
