---
slug: "what-is-diskann"
title: "When should you use DISKANN in Milvus?"
topic: "retrieval"
order: 59
---

DISKANN is an approximate nearest-neighbor index designed to combine graph search with disk-oriented data access. In Milvus, it is an option for workloads whose capacity and cost requirements make a fully memory-resident index unattractive. Its usefulness depends on the storage device, cache, search effort, and required recall.

## Budget for both memory and storage I/O

A disk-oriented index still needs memory for working structures, compressed representations, caches, and request execution. It also consumes local storage and I/O bandwidth. Estimate the complete serving footprint rather than dividing raw vector size by available disk capacity.

Milvus's DISKANN guide describes graph construction, quantization-related structures, and search controls. Check the deployment prerequisites and parameter names for the running release. A machine with slow or highly contended storage can behave very differently from a benchmark using dedicated NVMe.

## Tune at a fixed quality target

Build an exact-vector baseline using the same vectors, metric, top-k, and eligibility filters. Sweep supported search effort and caching settings while recording recall and latency percentiles. Index build resources and duration also matter if the dataset changes or must be rebuilt after a failure.

Compare against HNSW and other candidates at matched recall and resource budgets. A lower-memory configuration that misses the application's quality target is not equivalent to a higher-recall in-memory run. Include selective filters and concurrent writes if the application uses them.

## Test the working-set transition

Measure cold startup, warmed traffic, a shifted query distribution, and recovery after a serving-node replacement. Track disk IOPS, bandwidth, queueing, cache behavior, memory, and errors. Tail latency can worsen when many requests simultaneously miss the useful working set.

Keep mmap as a separate decision: mapping a file into virtual memory does not automatically give another index DISKANN's search organization. Choose the supported index and storage settings together. Adopt DISKANN when measured recall, tail latency, capacity, and recovery cost satisfy the workload rather than when a dataset is merely described as large.

## Example to test

Replay an identical query mix after a serving-node restart and after warm-up. Compare recall and tail latency with disk queueing and memory use. The warm-cache result alone does not establish the experience during recovery.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [What is HNSW, and how should you tune it?](/ai-quick-reference/what-is-hnsw)
- [How does mmap differ from a disk-oriented ANN index?](/ai-quick-reference/how-mmap-differs-from-diskann)
- [How should you separate hot vector serving from cold lake data?](/ai-quick-reference/how-to-design-hot-and-cold-vector-serving)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [DISKANN design and configuration](https://milvus.io/docs/diskann.md)
- [Index selection trade-offs](https://milvus.io/docs/index-explained.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
