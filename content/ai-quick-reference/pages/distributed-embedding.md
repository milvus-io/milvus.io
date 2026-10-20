---
slug: "how-to-build-distributed-embedding-pipelines"
title: "How should you design a scalable embedding-generation pipeline?"
topic: "data"
order: 91
---

A scalable embedding pipeline must preserve representation semantics while reading, batching, encoding, and publishing many source records toward a Milvus import, not just maximize encoder throughput. A high-throughput GPU worker is not useful if the files it produces have missing IDs, mixed model revisions, or inconsistent dimensions when Milvus tries to load them.

![Version the representation before indexing it](/images/ai-reference/encoding.svg)

## Shape output for bulk import, not just for the encoder

Milvus's bulk-import path expects Parquet, JSON, or CSV files whose rows match the target collection's schema: the same field names, the same vector dimension, and types that satisfy any `NOT NULL` or default-value constraints. Design the pipeline's output stage around that contract from the start. Each distributed worker should write files sized within the importer's documented per-file limits, with a stable `source_id` (and `chunk_id` if a document fans out into several rows) as a scalar field alongside the vector, so a partial or re-run import can be reconciled against what is already indexed.

Keep document and query encoding instructions compatible with the chosen model, and record tokenization, truncation, normalization, and the model revision as a field on every row. A rolling job that silently mixes two model revisions across files produces a collection where vectors are not comparable, and nothing in the import job itself will flag that.

## Batch and backpressure, bounded by the importer downstream

Ray Data and Spark-based workers can run GPU inference far faster than Milvus can ingest and index the resulting files. Measure source reads, tokenization, model inference, serialization, and file writes separately so the bottleneck is visible, and cap in-flight output files rather than letting a fast encoder stage pile up unbounded Parquet shards waiting on a bulk-import queue. For lower-volume or streaming updates, write through `insert`/`upsert` instead of accumulating files for bulk import, and apply the same batch-size and backpressure discipline against the client's configured RPC limits.

## Publish a validated, importable dataset

Before handing files to a bulk-import job, check counts, unique logical IDs, dimensions against the collection schema, finite numeric values, and model revisions, then sample a few rows to confirm the source-to-vector mapping is correct. Submit the import, monitor the job's reported state, and verify indexed record counts against the written-file counts rather than trusting job success alone.

## Example to test

Fail a worker midway through a source partition, retry it, and reconcile output by stable source ID plus model revision before import. Submit the resulting files as a bulk-import job, then check the collection's row count and a sampled source-to-vector mapping. A successful import job status does not establish that every logical record arrived exactly once.

## From concept to implementation

- [Shape pipeline output to match Milvus's bulk-import file contract](https://milvus.io/docs/prepare-source-data.md).
- [Submit and monitor the bulk-import job that consumes pipeline output](https://milvus.io/docs/import-data.md).

## Continue learning

- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [How does the Spark-Milvus connector fit into an AI data pipeline?](/ai-quick-reference/how-spark-integrates-with-milvus)
- [How do you make vector-search and training experiments reproducible?](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments)
- [How do Arrow and Parquet fit into vector data pipelines?](/ai-quick-reference/how-arrow-and-parquet-fit-vector-data-pipelines)

## Implementation guides and sources

- [Distributed batch inference](https://docs.ray.io/en/latest/data/batch_inference.html)
- [Prepare compatible import records](https://milvus.io/docs/prepare-source-data.md)
- [Milvus data import workflow](https://milvus.io/docs/import-data.md)
