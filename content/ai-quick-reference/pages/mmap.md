---
slug: "how-mmap-differs-from-diskann"
title: "How does mmap differ from a disk-oriented ANN index?"
topic: "retrieval"
order: 70
---

Memory mapping makes file contents accessible through a process's virtual address space. The operating system brings accessed pages into memory as needed. This changes how data is loaded and cached; it does not by itself change an index's candidate-search algorithm into a disk-oriented design such as DISKANN.

## Separate address space from resident memory

A large mapped file does not mean all its bytes are currently resident. Conversely, mapped data still uses physical memory while pages are cached and accessed. Process RSS, file-backed memory, and application allocations describe different parts of the footprint.

Milvus documents mmap settings for supported fields and indexes. Check the exact release and index compatibility. Enabling a setting on an unsupported object or observing a smaller initial load does not establish that the complete workload will use less memory at steady state.

## Measure access locality

A graph traversal can touch scattered locations; a scan reads data differently. If the working set fits in useful memory, mmap can perform well. If many queries continuously fault in pages from slow storage, tail latency and I/O can become limiting.

Test cold start, a warmed workload, and a changed query mix. Measure resident memory, page faults, local disk activity, latency percentiles, and errors together. Include other processes or workloads that compete for the same memory and storage.

## Compare the complete alternatives

DISKANN has its own disk-oriented graph, compressed structures, and caching behavior. Tiered storage manages data access through another supported caching model. These options can interact with index and field choices, so compare concrete configurations rather than combining their names into a single assumed optimization.

Keep recall and returned fields fixed while evaluating performance. Include loading and recovery after node replacement, not only warmed requests. Adopt mmap when it provides the desired capacity and lifecycle behavior under realistic access patterns. Treat it as a memory-management and I/O choice whose benefit must be measured, rather than a general guarantee that a larger collection can be served at unchanged latency.

## Continue learning

- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [How should you separate hot vector serving from cold lake data?](/ai-quick-reference/how-to-design-hot-and-cold-vector-serving)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus mmap configuration and scope](https://milvus.io/docs/mmap.md)
- [DISKANN search organization](https://milvus.io/docs/diskann.md)
- [On-demand storage and caching](https://milvus.io/docs/tiered-storage-overview.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
