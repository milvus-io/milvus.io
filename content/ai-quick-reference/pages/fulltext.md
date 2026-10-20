---
slug: "what-is-fulltext-search"
title: "What is full-text search, and how does BM25 fit?"
topic: "retrieval"
order: 9
demo: "hybrid search"
demoDescription: "Check out our hybrid semantic search & full-text matching demo built with Milvus:"
---

Full-text search analyzes text into terms and retrieves documents using lexical evidence. BM25 is a term-based ranking function: it gives weight to query terms found in a document, then combines those term contributions into a document score. It is designed for keyword relevance, not for understanding paraphrases.

## How BM25 scores a document

A common BM25 form is:

`score(q,d) = Σ(t in q) IDF(t) × [ f(t,d) × (k1 + 1) / ( f(t,d) + k1 × (1 - b + b × |d| / avgdl) ) ]`

Here `f(t,d)` is how often term `t` occurs in document `d`; `|d|` is that document's analyzed length; `avgdl` is the average analyzed document length; `IDF(t)` weights how informative the term is across the collection; and `k1` and `b` control term-frequency saturation and length normalization. Implementations may use different IDF variants and defaults, so use this formula to understand the roles and check the target system for exact score behavior.

The formula has three useful effects:

- **Term frequency (TF):** A document containing a query term can gain score when the term repeats. The gain saturates, so repeating a word 20 times does not count as 20 independent pieces of evidence.
- **Inverse document frequency (IDF):** A term found in only a small fraction of the corpus is usually more informative than a very common term. If “HNSW” is rare in a technical corpus but “index” appears everywhere, a match on `HNSW` can contribute stronger evidence, subject to the analyzer and scoring configuration.
- **Length normalization:** Matching terms in an unusually long document are normalized against document length and the corpus average. This reduces the advantage that a document would get merely by containing more words; parameter `b` controls how much normalization is applied.

BM25 scores are ranking signals, not probabilities that a document is relevant. A high score does not guarantee that all query terms or a requested phrase occur. Term matching depends on the analyzer's tokenization and normalization.

## Why it works well for keyword search

The score is built from query/document term overlap, term frequency, collection statistics, and document length. This gives a useful ranking for explicit strings such as identifiers, product names, error codes, and uncommon technical terms. BM25 can distinguish a document where an informative term occurs from one that only repeats common words. It can also return a lower-ranked document when just some of a multi-term query matches, so use explicit phrase or boolean conditions when those are requirements.

BM25 does not encode synonymy by itself. If the query says “stale results” and the document says “outdated search output,” they may share no analyzed terms. Dense semantic retrieval can help with that vocabulary gap. Hybrid retrieval can combine the lexical and dense candidate lists, then fuse their rankings.

## How Milvus applies it

Milvus analyzes the source text, creates a sparse term representation through the BM25 Function, and uses corpus statistics and a sparse index to retrieve ranked documents. This path does not require a large language model to generate the lexical representation. Analyzer choice is part of the retrieval behavior; test domain codes, punctuation, languages, and token boundaries on the actual text.

Full-text ranking differs from exact filtering and phrase matching. Use the documented text match or phrase feature when you need those semantics. When comparing BM25 settings, record the analyzer, corpus snapshot, query set, `k1`/`b` configuration, and final relevance judgments.

## Example to test

Search a corpus for `HNSW efSearch`. Include one concise page that explains the parameter, a long page that mentions it once, and a page that repeats the terms many times without answering the question. Inspect analyzer output and ranking. The useful result should reflect term rarity, repeated-term saturation, document length, and the actual passage—not simply raw mention count.

## From concept to implementation

- [Configure Milvus BM25 full-text search](https://milvus.io/docs/full-text-search.md).
- [Combine BM25 and dense search with hybrid retrieval](https://milvus.io/docs/multi-vector-search.md).
- [Try the hybrid search and full-text matching Bootcamp demo](https://milvus.io/bootcamp).

## Continue learning

- [What is hybrid search, and when should you use it?](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- [How does semantic search differ from keyword search?](/ai-quick-reference/what-is-semantic-search-and-how-does-it-differ-from-keyword-search)
- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [How does a sparse inverted index differ from dense ANN?](/ai-quick-reference/how-sparse-inverted-indexes-work)
- [How can hybrid and multimodal search improve product discovery?](/ai-quick-reference/hybrid-multimodal-product-search)

## Implementation guides and sources

- [Milvus full-text search and BM25](https://milvus.io/docs/full-text-search.md)
- [Milvus BM25 Function and scoring](https://milvus.io/docs/bm25-function.md)
- [Robertson and Zaragoza: BM25 and beyond](https://doi.org/10.1561/1500000019)
- [Milvus hybrid search](https://milvus.io/docs/multi-vector-search.md)
