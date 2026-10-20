---
slug: "how-mmap-differs-from-diskann"
title: "How does mmap differ from a disk-oriented ANN index?"
topic: "retrieval"
order: 70
---

Memory mapping (mmap) makes file contents accessible through a process's virtual address space, and the operating system brings accessed pages into memory as needed. In Milvus, mmap is a loading strategy you can apply to fields and index segments so they are not all pulled into RAM up front — it works underneath whatever index algorithm the collection actually uses (HNSW, IVF, FLAT, DISKANN, or anything else). DISKANN, by contrast, is a specific graph algorithm (Vamana) designed from the ground up for SSD access: its graph layout, its in-memory PQ codes, and its disk read pattern are all built around minimizing random I/O for *that* search structure. mmap doesn't give another index DISKANN's search organization — it just changes which bytes of that index's existing structure are resident at a given moment.

## Separate address space from resident memory

A large mapped file does not mean all its bytes are currently resident. Conversely, mapped data still uses physical memory while pages are cached and accessed. Process RSS, file-backed memory, and application allocations describe different parts of the footprint.

Milvus documents mmap settings for supported fields and indexes. Check the exact release and index compatibility. Enabling a setting on an unsupported object or observing a smaller initial load does not establish that the complete workload will use less memory at steady state.

## Measure access locality

A graph traversal can touch scattered locations; a scan reads data differently. If the working set fits in useful memory, mmap can perform well. If many queries continuously fault in pages from slow storage, tail latency and I/O can become limiting.

Test cold start, a warmed workload, and a changed query mix. Measure resident memory, page faults, local disk activity, latency percentiles, and errors together. Include other processes or workloads that compete for the same memory and storage.

## mmap, DISKANN, and tiered storage are independent decisions

You can run mmap on top of any supported index, including DISKANN itself — enabling mmap on a field does not replace choosing DISKANN when the working set genuinely exceeds RAM, and choosing DISKANN does not remove the value of mmap for deciding how much of its structures stay resident. Tiered storage adds a third, separate caching layer that manages which data sits on fast versus slow storage. Compare concrete configurations of these three together rather than assuming any one name solves what the other two are for.

Keep recall and returned fields fixed while evaluating performance. Include loading and recovery after node replacement, not only warmed requests. Adopt mmap when it provides the desired capacity and lifecycle behavior under realistic access patterns — it is a memory-management and I/O choice whose benefit has to be measured, not a guarantee that a larger collection serves at unchanged latency.

## Example to test

After a cold start, compare resident memory, page faults, and tail latency under the same query mix. A large virtual mapping does not mean those bytes are resident, and a lower resident footprint can still bring more I/O.

## From concept to implementation

- [Configure Milvus mmap for fields and indexes](https://milvus.io/docs/mmap.md).
- [Review DISKANN's own disk-oriented graph design](https://milvus.io/docs/diskann.md).

## Continue learning

- [How do you estimate memory for vector search?](/ai-quick-reference/how-does-vector-search-manage-memory-usage)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [How should you separate hot vector serving from cold lake data?](/ai-quick-reference/how-to-design-hot-and-cold-vector-serving)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)

## Implementation guides and sources

- [Milvus mmap configuration and scope](https://milvus.io/docs/mmap.md)
- [DISKANN search organization](https://milvus.io/docs/diskann.md)
- [On-demand storage and caching](https://milvus.io/docs/tiered-storage-overview.md)
