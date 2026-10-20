---
slug: "what-are-embeddings-in-vector-search"
title: "What are embeddings in vector search?"
topic: "foundations"
order: 3
---

An embedding maps an object into a numeric representation used by a model or retrieval system. In common neural-retrieval usage, the term often means a learned dense vector. A vector-search system can also search sparse lexical representations and learned sparse embeddings. It is useful to explain those families together without claiming that every vector is a large-language-model output.

![Dense and sparse describe coordinate occupancy, not model size](/images/ai-reference/vector-representations.svg)

## Dense and sparse describe the representation

A dense vector is usually stored as a fixed-length array, for example `[0.2, -0.4, 0.7, 0.1]`; most coordinates may be nonzero. A sparse vector has relatively few nonzero coordinates in a larger coordinate space and can be stored as index/value pairs, for example `{2: 0.7, 105: 1.3}`. Sparse does not mean one-hot, binary, or a smaller logical dimension.

Coordinates in a dense latent space usually have no simple standalone label. Coordinates in a lexical sparse representation can correspond to vocabulary terms. A learned sparse model may assign weights to useful expansion terms, including terms not literally present in the input. See [dense versus sparse representations](/ai-quick-reference/what-are-dense-and-sparse-embeddings) for the mechanics and database paths.

## They do not all come from large models

| Generation route | Example | What determines the meaning |
| --- | --- | --- |
| Neural encoder | A compact sentence encoder, large retrieval model, or image encoder | Training objective, checkpoint, preprocessing, and query/document conventions |
| Classical learned projection | Latent semantic analysis using truncated SVD on a term matrix | Fitted vocabulary, weighting, and projection |
| Learned sparse encoder | SPLADE-style vocabulary weighting and expansion | Model training, tokenizer, and sparsity control |
| Statistical lexical representation | TF-IDF weighting or a BM25 retrieval pipeline | Tokenization, corpus statistics, document length, and scoring rules |

BM25 is a lexical scoring function, not a transformer that emits a semantic dense vector. Systems can construct sparse term representations for BM25 retrieval. Naming all of these representations embeddings is common in broad product language, but the generation and score contracts still differ. A generative LLM is neither required nor automatically a suitable embedding model.

## Compatibility includes more than dimension

Query and document representations must use compatible coordinates and scoring. For neural models this can require different query/document prompts or encoders. For lexical representations it includes the same vocabulary/analyzer and compatible corpus statistics. Two arrays with the same length can still describe unrelated spaces.

Record the model or function revision, preprocessing, vocabulary/statistics where relevant, normalization, and chunk boundaries. Changing those can require re-encoding or rebuilding affected data. In Milvus, use dense and sparse field types according to the representation; a sparse field need not declare the dense field's fixed dimension, but its coordinate IDs must remain meaningful.

## One object can have one vector or many

The retrieval unit might be a passage, image, audio segment, or structured item. One representation can summarize the object; another design keeps token or patch vectors for detailed matching. [Multi-vector retrieval](/ai-quick-reference/what-is-multi-vector-retrieval) explains that distinction. Multiple input modalities are a separate question, covered by [multimodal alignment](/ai-quick-reference/what-are-multimodal-embeddings).

## Example to test

Encode a support query with its intended neural query encoder and also analyze it through a lexical path. Inspect coordinates and returned source IDs separately. An error code helps the lexical route only if tokenization preserves it; a paraphrase helps the neural route only if the model represents that relationship. Compare judged relevance before combining results.

## From concept to implementation

- [Create a dense vector field](https://milvus.io/docs/dense-vector.md).
- [Build BM25 full-text retrieval](https://milvus.io/docs/full-text-search.md).

## Continue learning

- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [How do cosine similarity, inner product, and L2 differ?](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings)
- [What is multi-vector retrieval, and how do MaxSim and MUVERA work?](/ai-quick-reference/what-is-multi-vector-retrieval)
- [What are multimodal embeddings?](/ai-quick-reference/what-are-multimodal-embeddings)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)

## Implementation guides and sources

- [Dense vector fields](https://milvus.io/docs/dense-vector.md)
- [Generate and search embeddings](https://milvus.io/docs/quickstart.md)
- [Built-in BM25 full-text retrieval](https://milvus.io/docs/full-text-search.md)
- [Sparse field representation](https://milvus.io/docs/sparse_vector.md)
- [SPLADE learned sparse representations](https://arxiv.org/abs/2107.05720)
- [Truncated SVD and latent semantic analysis](https://scikit-learn.org/stable/modules/decomposition.html)

Sources checked: 2026-10-20. Algorithms and illustrative calculations are documentation-reviewed; model inference and target-release deployment were not run.
