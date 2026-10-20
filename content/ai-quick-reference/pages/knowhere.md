---
slug: "what-is-knowhere"
title: "What is Knowhere, and how does Milvus use it?"
topic: "ecosystem"
order: 50
---

Knowhere is the C++ vector-search engine used inside Milvus. It supplies an integration layer for vector-index implementations and their execution, while the database provides collection management, distributed coordination, ingestion, and serving APIs around that work.

## Understand the engine boundary

An application normally selects an index and search parameters through Milvus. Milvus prepares the relevant data and invokes the execution engine. The choice of implementation can affect index building, supported vector types, search effort, memory use, and hardware requirements.

Running an ANN library directly is therefore a different engineering decision from running Milvus. The library can be appropriate for an embedded experiment, while a database addresses a broader lifecycle: changes, filters, persistence, concurrency, access controls, and operations. Evaluate the responsibilities your application actually needs.

## Check the database's supported contract

A capability present in a Knowhere branch is not automatically available through every released Milvus API or package. Confirm the Milvus version, build, index type, vector data type, and hardware before documenting an implementation choice. Use the supported database configuration rather than replacing an internal library in an otherwise unchanged production installation.

Eligibility matters during vector execution. Milvus uses mechanisms such as bitsets to exclude ineligible records. Correctness and performance should be assessed with realistic filters and deletions, not only an unfiltered nearest-neighbor benchmark.

## Evaluate an engine change reproducibly

Keep vectors, metric, query set, top-k, and eligible records fixed. Compare against an exact-vector baseline, then measure recall, tail latency, throughput, memory, build time, and loading. Include different filter selectivities and a changing-data case.

When investigating an issue, preserve the complete index and database configuration alongside the source revision. A favorable microbenchmark in an engine repository establishes a narrower result than an improvement in a distributed application. The useful question is whether the supported integration meets the application's quality and operating targets across its actual workload.

## Example to test

When diagnosing an ANN discrepancy, first save the metric, filter, index configuration, and exact baseline at the Milvus API boundary. Then isolate the index-library behavior. A library microbenchmark cannot account for distributed serving overhead.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [How does the Milvus architecture separate ingestion, storage, and search?](/ai-quick-reference/how-milvus-separates-ingestion-storage-and-search)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [What is GPU_CAGRA, and when does it help vector search?](/ai-quick-reference/what-is-gpu-cagra)

## Implementation guides and sources

- [Knowhere source and build guidance](https://github.com/zilliztech/knowhere)
- [Indexes exposed through Milvus](https://milvus.io/docs/index-explained.md)
- [Eligibility masks in vector execution](https://milvus.io/docs/bitset.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
