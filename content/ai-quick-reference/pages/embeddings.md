---
slug: "what-are-embeddings-in-vector-search"
title: "What are embeddings in vector search?"
topic: "foundations"
order: 3
---

An embedding is a numeric representation produced by a model. In retrieval, the aim is to place useful query–document matches near each other under a chosen metric. Individual coordinates usually do not have simple human-readable meanings; it is the learned representation and its geometry that matter.

## Model compatibility matters

The document and query encoders must be compatible. Some models use different prompts or encoding paths for queries and documents, while others use one encoder for both. Follow the model's documented retrieval setup, including normalization and input limits.

Vectors from unrelated models do not become comparable merely because they have the same dimension. Mixing them in one field can silently produce meaningless distances. Record the model identifier, revision, preprocessing, and chunking configuration with the ingestion pipeline. Treat a model change as a data migration that needs validation.

## Decide what one vector represents

A vector might represent a sentence, passage, whole document, image, or audio segment. That choice determines what retrieval can return. A single vector for a long document can obscure a short relevant detail; very small chunks can lose the context needed to interpret a match. Preserve source IDs and offsets so retrieved pieces can be reconstructed and cited.

In Milvus, a dense vector field has a defined dimension. The inserted vectors and query vectors must match that field's requirements. Store ordinary metadata in scalar fields so the application can filter candidates and recover the original content.

## Validate the representation

Use realistic positive matches and hard negatives: similar terminology with different meanings, near-identical passages with a changed fact, and cross-language cases if your product supports them. Measure retrieval on these examples before choosing the largest model. Higher dimensionality is not a guarantee of better relevance and increases the amount of vector data to store and process.

## Continue learning

- [How do Arrow and Parquet fit into vector data pipelines?](/ai-quick-reference/how-arrow-and-parquet-fit-vector-data-pipelines)
- [How should you design a scalable embedding-generation pipeline?](/ai-quick-reference/how-to-build-distributed-embedding-pipelines)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [What are dense and sparse embeddings?](/ai-quick-reference/what-are-dense-and-sparse-embeddings)
- [How do cosine similarity, inner product, and L2 differ?](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings)

## Implementation guides and sources

- [Dense vector fields](https://milvus.io/docs/dense-vector.md)
- [Generate and search embeddings](https://milvus.io/docs/quickstart.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
