---
slug: "what-is-vector-search"
title: "What is vector search?"
topic: "foundations"
order: 2
---

Vector search ranks records by comparing a query vector with stored vectors. The vectors encode features of text, images, audio, or other data. Their usefulness depends on the representation: proximity is a mathematical relationship, and it only approximates the application's notion of relevance when the model and metric fit the task.

![From question to verifiable evidence](/images/ai-reference/retrieval.svg)

## Follow the retrieval path

First, encode the documents or other searchable units. Store each vector with a stable ID and the metadata needed to interpret it. Encode a user query with a compatible query encoder, apply eligibility constraints, and return the nearest candidates under the configured metric. Fetch the source content for display, reranking, or generation.

For example, a query about a damaged shipment may retrieve an article titled “Reporting a broken delivery.” Whether that match is useful should be checked against actual support questions. Similar wording about an unrelated product can still be a bad result.

## Exact and approximate search

Exact nearest-neighbor search returns the correct top-k under the chosen vector score over the eligible set, subject to tie and numerical conventions. FLAT commonly computes this by exhaustive comparisons; exactness is a result guarantee, not a requirement that every possible exact algorithm must scan every vector. ANN may omit exact neighbors. Neither method establishes semantic relevance when the representation does not fit the task.

The top-k parameter controls how many candidates are returned; it is not a quality threshold. A database can return k results even when none answers the question. Applications need an evaluated policy for weak evidence rather than treating the first result as automatically correct.

## Verify before tuning

Start with a small corpus and a fixed query set. Inspect returned IDs, source passages, and metric values. Then measure relevance, filtered-result correctness, and latency. Compare approximate results with an exact-vector baseline to isolate index approximation from model-quality problems. Once those causes are separated, you can decide whether to change the model, corpus, filters, or index.

## Example to test

Trace a query from its input through encoding, eligibility filtering, candidate retrieval, and source lookup. Keep the returned ID and original evidence. A plausible nearest vector is not useful if the application cannot resolve its source.

## From concept to implementation

- [Run a first verified search](https://milvus.io/docs/quickstart.md).
- [Explore hands-on Milvus projects](https://milvus.io/bootcamp).

## Continue learning

- [Why use a FLAT baseline when tuning an ANN index?](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline)
- [When should you use range search instead of only top-k?](/ai-quick-reference/when-to-use-vector-range-search)
- [What are embeddings in vector search?](/ai-quick-reference/what-are-embeddings-in-vector-search)
- [How do cosine similarity, inner product, and L2 differ?](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings)
- [What is approximate nearest-neighbor search?](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search)

## Implementation guides and sources

- [Run a vector search](https://milvus.io/docs/quickstart.md)
- [Similarity metrics](https://milvus.io/docs/metric.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
