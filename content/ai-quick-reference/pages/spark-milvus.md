---
slug: "how-spark-integrates-with-milvus"
title: "How does the Spark-Milvus connector fit into an AI data pipeline?"
topic: "ecosystem"
order: 58
---

The Spark-Milvus connector connects distributed dataframe processing with Milvus data workflows. Spark can prepare records, join metadata, generate or organize embeddings, and move supported data through the connector. Milvus supplies the retrieval service used after that processing.

![A bounded Spark-to-Milvus data workflow](/images/ai-reference/spark.svg)

## Select the connector path deliberately

Check the connector revision, Spark and Scala versions, Java runtime, Milvus compatibility, and any native storage dependency. The current project README is the starting point for its build and release instructions. Older integration examples can describe a different connector generation, so avoid mixing their package coordinates and options.

Choose whether the job writes through a serving API, prepares a bulk-import artifact, or reads a supported collection snapshot. These paths have different consistency, throughput, and failure behavior. Confirm the selected connector's actual contract rather than assuming that all dataframe operations are supported uniformly.

## Make distributed retries safe

Spark tasks can retry or recompute partitions. Use stable source IDs and an explicit write policy so replay does not create unintended logical duplicates. Track job, partition, source version, and embedding revision when reconciling a partial run.

Create the target schema deliberately when automatic inference cannot express required field types, constraints, or indexing choices. Validate dimensions and metadata before sending a large partition. A well-formed dataframe does not prove that the target serving schema is appropriate.

## Evaluate the end-to-end job

Measure reading, transformation, embedding, transfer, index preparation, and readiness separately. If source data already lives in a compatible lake format, compare ingestion with an external-collection design that retains source ownership.

For reads used in training or evaluation, use a reproducible dataset state and record its identity. Test executor failure and a resumed job, then compare logical record membership and expected retrieval behavior. The connector is valuable when it removes integration work while preserving the pipeline's semantics, not simply when a demo dataframe can be written successfully.

## Make a read-to-curation pilot explicit

The following is workflow pseudocode, not connector configuration or a runnable Spark API example:

```text
record supported source state and connector revision
read a bounded fixture through the documented path
project stable_id, source_revision, embedding, required_metadata
join reviewed quality and ownership labels
find duplicate candidates or propose clusters
review decisions and write a versioned selection manifest
retry one partition and reconcile logical IDs
publish only the approved result through a supported write path
```

Keep the selection manifest even when only a small serving subset is written back. It records what the job intended to publish and makes a partial retry or later model comparison explainable. Follow the connector's current README for actual snapshot/read options; an old tutorial's coordinates are not a compatibility contract.

## Example to test

Read a bounded, supported snapshot into Spark, project only needed fields, join quality labels, and write a reviewed selection manifest. Retry one partition and compare logical IDs. Confirm connector-specific read options rather than mixing generations of examples.

## From concept to implementation

- [Add observability to the workflow](https://milvus.io/docs/monitor_overview.md).
- [Find community support and contribution channels](https://milvus.io/community).

## Continue learning

- [How should you design a scalable embedding-generation pipeline?](/ai-quick-reference/how-to-build-distributed-embedding-pipelines)
- [How do you make vector-search and training experiments reproducible?](/ai-quick-reference/how-to-reproduce-vector-search-and-training-experiments)
- [What does the milvus-storage project provide?](/ai-quick-reference/what-is-milvus-storage)
- [What is Vector Lakebase, and how does it connect a lake to vector search?](/ai-quick-reference/what-is-vector-lakebase)

## Implementation guides and sources

- [Current connector build and compatibility guidance](https://github.com/zilliztech/spark-milvus)
- [Spark and Milvus integration](https://milvus.io/docs/integrate_with_spark.md)
- [Versioned collection views](https://milvus.io/docs/snapshots.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
