---
slug: "vector-search-for-recommendations"
title: "How do vector databases support recommendation candidate retrieval?"
topic: "applications"
order: 97
---

A vector database can retrieve recommendation candidates by comparing a user, session, or item representation with eligible item vectors. This is one stage of a recommendation system. The final result can also depend on ranking, availability, diversity, user controls, and the way outcomes are measured.

![Candidate retrieval is one stage of recommendation](/images/ai-reference/recommendation.svg)

## Define the representation and freshness contract

Decide what the query vector represents: long-term preference, recent session behavior, or similarity to a selected item. Use an item encoder and query encoder that are compatible. Record model revisions and how new or changed items receive vectors.

For a session-based application, consider how quickly new behavior should affect recommendations. Database update freshness and the model's ability to encode that behavior are separate requirements. A perfectly fresh index cannot compensate for an unsuitable representation.

## Retrieve eligible and varied candidates

Apply required filters for availability, region, user restrictions, and already consumed items where appropriate. Select enough candidates for downstream ranking without making payload and reranking costs excessive.

Near-identical variants can fill a candidate list. Where suitable, grouping or an application-level diversity step can return a more useful set. Measure whether that choice improves the user's task rather than assuming more visual variety is always better.

## Evaluate the whole funnel

Use offline retrieval metrics on a well-defined time split, then assess the full ranking and product workflow. Avoid leakage from future behavior into historical query representations. Include new items, sparse-history users, and important catalog segments.

Track serving latency, empty eligible results, repeated items, and the stability of the recommendation experience. In an online evaluation, account for position and exposure effects rather than interpreting every click as an unbiased relevance label. Milvus supplies candidate retrieval and metadata operations; the learning, ranking, and experiment systems determine how those candidates become a useful recommendation service.

## Content similarity is not the same as personalized preference

An item-to-item feature can retrieve products similar in appearance or description. A personalized user-to-item retriever needs compatible user/item representations learned or constructed for that objective. A generic image-text embedding does not become a user-preference model merely by averaging more modalities. A content-based rule or history aggregation can be a baseline, but its usefulness must be measured rather than assumed.

Recommendation pipelines commonly distinguish candidate generation from later ranking. In each experiment, state which stage changed. Compare against content-only and interaction-based baselines where available, preserve a time split, and report cold-start users and items separately. Multimodal item features may help some tasks and harm others; no click or conversion gain follows automatically from their presence.

## Example to test

Retrieve candidates from a user or session representation, enforce stock and region, then diversify before downstream ranking. Compare useful candidate coverage with the final product outcome; a nearest-item hit is not itself evidence of a conversion lift.

## From concept to implementation

- [Build a recommendation candidate pipeline](https://milvus.io/docs/recommendation_system.md).
- [Related product-search story: Tokopedia](https://zilliz.com/customers/tokopedia).

## Continue learning

- [What is vector search?](/ai-quick-reference/what-is-vector-search)
- [How can hybrid and multimodal search improve product discovery?](/ai-quick-reference/hybrid-multimodal-product-search)
- [How do batching, latency, and throughput interact in vector search?](/ai-quick-reference/how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Implementation guides and sources

- [Recommendation-system example](https://milvus.io/docs/recommendation_system.md)
- [Group and diversify returned candidates](https://milvus.io/docs/grouping-search.md)
- [Apply catalog eligibility rules](https://milvus.io/docs/filtered-search.md)
- [Recommendation candidate generation and ranking](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
