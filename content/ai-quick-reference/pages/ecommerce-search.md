---
slug: "hybrid-multimodal-product-search"
title: "How can hybrid and multimodal search improve product discovery?"
topic: "applications"
order: 96
---

Product discovery often combines exact requirements with a visual or conceptual preference. A shopper can search for a known model number, describe a style, or provide an image. A useful retrieval design gives each signal a defined role and keeps availability and catalog rules explicit.

![Candidate retrieval is one stage of recommendation](/images/ai-reference/recommendation.svg)

## Represent the catalog at the right level

Choose whether a record represents a product, variant, or offer. Keep stable IDs, images, descriptive text, category, dimensions, locale, and relevant availability metadata. A result for the wrong size or unavailable variant can be a poor outcome despite strong semantic similarity.

Use compatible multimodal models for the intended query direction. An image-to-image demonstration does not establish text-to-image quality. Keep model and preprocessing revisions so catalog re-embedding can be evaluated and rolled out deliberately.

## Combine candidate signals

Lexical retrieval is useful for identifiers and exact product attributes. Dense or image retrieval can support paraphrases and visual similarity. Apply hard catalog eligibility rules consistently, then fuse or rerank candidates using a measured approach.

Distinguish relevance from merchandising policies. Stock, regional availability, or seller eligibility can be mandatory filters, while business preferences may be ranking features. Keep the policy inspectable so a poor result can be traced to data, retrieval, or ranking.

## Evaluate beyond a plausible demo

Build queries for exact items, broad categories, fine-grained attributes, uploaded images, and items absent from the catalog. Include hard negatives that look similar but violate an important requirement. Measure useful product retrieval and invalid-result rates alongside latency and cost.

When measuring conversion, distinguish retrieval changes from price, inventory, and presentation changes. Use a controlled rollout where possible and retain the query and catalog state. Milvus can provide candidate retrieval and filtering; the catalog pipeline and product experience determine whether those candidates become useful customer choices.

## Example to test

Search for a waterproof red jacket in an available size. Use semantic or image similarity for style, but enforce stock, market, and size eligibility explicitly. Judge result diversity across products rather than returning many variants of one item.

## From concept to implementation

- [Build a recommendation candidate pipeline](https://milvus.io/docs/recommendation_system.md).
- [Related product-search story: Tokopedia](https://zilliz.com/customers/tokopedia).

## Continue learning

- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How do metadata filters interact with vector search?](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How do vector databases support recommendation candidate retrieval?](/ai-quick-reference/vector-search-for-recommendations)

## Implementation guides and sources

- [Text-to-image retrieval example](https://milvus.io/docs/text_image_search.md)
- [Lexical product retrieval](https://milvus.io/docs/full-text-search.md)
- [Constrain eligible catalog items](https://milvus.io/docs/filtered-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
