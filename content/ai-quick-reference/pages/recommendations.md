---
slug: "vector-search-for-recommendations"
title: "How do vector databases support recommendation candidate retrieval?"
topic: "applications"
order: 97
---

A vector database can retrieve recommendation candidates by comparing a user, session, or item representation with eligible item vectors. This is one stage of a recommendation system. The final result can also depend on ranking, availability, diversity, user controls, and the way outcomes are measured.

## Define the representation and freshness contract

Decide what the query vector represents: long-term preference, recent session behavior, or similarity to a selected item. Use an item encoder and query encoder that are compatible. Record model revisions and how new or changed items receive vectors.

For a session-based application, consider how quickly new behavior should affect recommendations. Database update freshness and the model's ability to encode that behavior are separate requirements. A perfectly fresh index cannot compensate for an unsuitable representation.

## Retrieve eligible and varied candidates

Apply required filters for availability, region, user restrictions, and already consumed items where appropriate. Select enough candidates for downstream ranking without making payload and reranking costs excessive.

Near-identical variants can fill a candidate list. Where suitable, grouping or an application-level diversity step can return a more useful set. Measure whether that choice improves the user's task rather than assuming more visual variety is always better.

## Evaluate the whole funnel

Use offline retrieval metrics on a well-defined time split, then assess the full ranking and product workflow. Avoid leakage from future behavior into historical query representations. Include new items, sparse-history users, and important catalog segments.

Track serving latency, empty eligible results, repeated items, and the stability of the recommendation experience. In an online evaluation, account for position and exposure effects rather than interpreting every click as an unbiased relevance label. Milvus supplies candidate retrieval and metadata operations; the learning, ranking, and experiment systems determine how those candidates become a useful recommendation service.

## Continue learning

- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [How can hybrid and multimodal search improve product discovery?](/ai-quick-reference/hybrid-multimodal-product-search)
- [How do batching, latency, and throughput interact in vector search?](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Recommendation-system example](https://milvus.io/docs/recommendation_system.md)
- [Group and diversify returned candidates](https://milvus.io/docs/grouping-search.md)
- [Apply catalog eligibility rules](https://milvus.io/docs/filtered-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
