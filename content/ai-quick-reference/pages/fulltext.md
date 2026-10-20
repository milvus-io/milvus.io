---
slug: "what-is-fulltext-search"
title: "What is full-text search, and how does BM25 fit?"
topic: "retrieval"
order: 9
demo: "hybrid search"
demoDescription: "Check out our hybrid semantic search & full-text matching demo built with Milvus:"
---

Full-text search retrieves and ranks text using its terms. BM25 is a widely used relevance scoring method that considers factors including term frequency, how common a term is across the corpus, and document length. Its scores rank candidates for a query; they are not probabilities that a document is correct.

## Text analysis comes first

The analyzer determines which terms are indexed. Language, token boundaries, case handling, punctuation, and domain terminology can all affect matches. A product code, a hyphenated error name, and ordinary prose may need different test cases. Diagnose analysis problems before trying to fix them with ranking weights.

Milvus full-text search accepts raw text, analyzes it, and uses a BM25 function to produce a sparse representation for retrieval. The collection needs the appropriate text field, sparse-vector field, function, and index configuration described in the implementation guide.

## Know the boundary

Full-text ranking is different from a boolean requirement that a field contains an exact value, and different from phrase matching. Choose an explicit filter or the documented text/phrase matching capability when a condition must hold. Do not infer that a high BM25 score enforces every word or phrase in a user's request.

BM25 can complement dense semantic retrieval when precise terminology matters. A semantic model may recover paraphrases that share few terms, while BM25 can recover identifiers the model handles poorly. Combine them only after evaluating each path independently.

## Verify the implementation

Use a small corpus with known positive and negative cases. Confirm which tokens are produced, whether expected documents are eligible, and how changes in wording affect ranking. Then add realistic corpus sizes and concurrency. Evaluate final relevance, query latency, and ingestion behavior together so a ranking improvement does not conceal an unusable operational trade-off.

## Continue learning

- [How does a sparse inverted index differ from dense ANN?](/ai-quick-reference/how-sparse-inverted-indexes-work)
- [How can hybrid and multimodal search improve product discovery?](/ai-quick-reference/hybrid-multimodal-product-search)
- [How does semantic search differ from keyword search?](/ai-quick-reference/what-is-semantic-search-and-how-does-it-differ-from-keyword-search)
- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)

## Implementation guides and sources

- [Milvus BM25 full-text search](https://milvus.io/docs/full-text-search.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
