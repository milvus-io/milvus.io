---
slug: "what-is-knowhere"
title: "What is Knowhere, and how does Milvus use it?"
topic: "ecosystem"
order: 50
---

Knowhere is the open-source C++ vector search engine at the core of Milvus. It builds vector indexes and runs similarity search: the distance kernels, the HNSW graph walks, the IVF cluster scans, DiskANN, quantization, and GPU indexes all execute inside Knowhere. Milvus wraps it with everything a database needs (collections, distributed storage, ingestion, filtering, replication, and APIs), so you choose an index in Milvus and Knowhere does the actual math.

The name is a pun on "know where": the engine decides which implementation and which hardware path (CPU instruction set or GPU) should execute a given build or search request.

![Library, index layer and database. An ANN library supplies algorithms; a database adds operational semantics.](/images/ai-reference/faiss-knowhere-stack.svg)

## What does Knowhere actually do?

Think of Knowhere as the layer between Milvus's distributed services and the raw algorithms. Its main jobs are:

- **Index building and search.** It implements or integrates the index families Milvus exposes: FLAT brute force; IVF_FLAT, IVF_SQ8, IVF_PQ, and IVF_RABITQ; HNSW and its compressed variants HNSW_SQ, HNSW_PQ, and HNSW_PRQ; SCANN; DISKANN for SSD-resident graphs; binary indexes such as BIN_FLAT, BIN_IVF_FLAT, and MINHASH_LSH; SPARSE_INVERTED_INDEX for sparse vectors and BM25 full-text scoring; and GPU indexes (GPU_CAGRA, GPU_IVF_FLAT, GPU_IVF_PQ, GPU_BRUTE_FORCE) built on NVIDIA's cuVS.
- **Distance computation.** L2, inner product, and cosine for float vectors; Hamming and Jaccard for binary vectors; IP and BM25 for sparse vectors.
- **Hardware dispatch.** On x86 it detects the CPU at runtime and picks the best available SIMD path (SSE, AVX2, or AVX-512) without a special build; it also builds for ARM (aarch64, including Apple Silicon) and, with `WITH_GPU=True`, for CUDA GPUs.
- **Filtering during search.** Every search accepts a bitset that marks which rows are ineligible, whether because they were deleted or excluded by a scalar filter. Those rows are skipped inside the index traversal, so filtered and deleted rows never take a slot in your top-k.

In Milvus terms, each index type is described by three parts (a data structure such as an IVF partitioning or a graph, an optional quantizer such as SQ8 or PQ, and an optional refiner that re-scores candidates at higher precision), and all three live in Knowhere.

## How does Milvus call Knowhere?

Milvus's distributed services are written in Go; the execution core (segcore) and Knowhere are C++. When a Data Node builds an index for a sealed segment, it loads that segment's vectors and hands them to Knowhere with your index parameters (`M` and `efConstruction` for HNSW, `nlist` for IVF, and so on); the serialized index is written to object storage. When a Query Node serves a search, segcore evaluates the filter expression into a bitset, then calls Knowhere on each loaded segment with the query vectors, `limit`, search parameters such as `ef` or `nprobe`, and the bitset. Knowhere returns candidate IDs and distances, and Milvus merges results across segments, shards, and nodes.

Because Knowhere works one segment at a time, it never has to know about shards, replicas, consistency levels, or schema. That separation is what lets Milvus scale out across many machines while keeping the vector engine a focused, heavily optimized library. The [Milvus architecture page](/ai-quick-reference/how-milvus-separates-ingestion-storage-and-search) shows where segment search fits in the full request path.

## How is Knowhere different from FAISS?

FAISS is Meta's vector search library and one of the libraries Knowhere integrates. Knowhere is not a replacement for FAISS so much as a layer that adapts several libraries (FAISS, hnswlib-derived HNSW, DiskANN, cuVS) to the needs of a database.

| | FAISS | Knowhere | Milvus |
|---|---|---|---|
| What it is | Similarity-search library | Vector engine inside Milvus | Distributed vector database |
| Index families | IVF, PQ, HNSW, flat, GPU indexes, and more | FAISS-based IVF plus HNSW, DiskANN, SCANN, sparse inverted, cuVS GPU indexes | Exposes Knowhere's indexes per field |
| Filtering and deletes | ID selectors you wire up yourself | Bitset applied inside every search path | Filter expressions and deletes compiled into bitsets automatically |
| Persistence, updates, scaling | Your responsibility | Per-segment only | Handled: WAL, object storage, compaction, sharding, replicas |
| Typical use | Embedded experiments, research, custom systems | Not used directly by applications | Production applications |

Knowhere's early design notes list concrete additions on top of FAISS: bitsets on every exposed query API, extra binary metrics, AVX-512 kernels (reported as 20 to 30 percent faster than AVX2 for build and query at the time), and automatic SIMD selection. If you are deciding between a library and a database, the [FAISS explainer](/ai-quick-reference/what-is-faiss) goes deeper.

## Should you use Knowhere directly?

Usually not. Knowhere is an independent Apache-2.0 project with its own build and a Python wheel, which makes it useful for contributors, index researchers, and people benchmarking algorithms in isolation. Applications should go through Milvus, which pins a specific Knowhere revision per release and tests that combination. A feature that appears on a Knowhere branch reaches users only once a Milvus release exposes it, so check the Milvus docs for your version before relying on a new index type or vector data type.

For the same reason, a Knowhere microbenchmark and a Milvus benchmark answer different questions. The first measures a single segment's index; the second includes filtering, multiple segments, growing data, merging, network, and concurrency. Both are useful, but only the second tells you whether an application will meet its latency target.

## How do you choose an index that Knowhere will run?

Pick the index in Milvus based on data size, memory budget, recall target, and hardware:

- **HNSW** for low-latency, high-recall in-memory search; add SQ, PQ, or PRQ to trade some recall for memory. See [what is HNSW](/ai-quick-reference/what-is-hnsw).
- **IVF variants** for faster builds and smaller footprints, tuned with `nlist` and `nprobe`; IVF_RABITQ for aggressive 1-bit compression with refinement.
- **DISKANN** when the dataset is larger than RAM but you have fast NVMe. See [when to use DISKANN](/ai-quick-reference/what-is-diskann).
- **GPU_CAGRA** when you need very high throughput and have supported NVIDIA GPUs. See [what is GPU_CAGRA](/ai-quick-reference/what-is-gpu-cagra).
- **FLAT** for small collections or as an exact baseline to measure recall against.

Whatever you choose, evaluate it the same way: fix the vectors, metric, query set, `limit`, and filter; compute exact results with FLAT; then measure recall, p99 latency, throughput, memory, and build time across realistic filter selectivities and with data changing underneath. The [index selection guide](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload) walks through the decision.

## Related reading

- [How does the Milvus architecture separate ingestion, storage, and search?](/ai-quick-reference/how-milvus-separates-ingestion-storage-and-search)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)
- [What is FAISS, and how does it relate to vector indexes?](/ai-quick-reference/what-is-faiss)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [What is GPU_CAGRA, and when does it help vector search?](/ai-quick-reference/what-is-gpu-cagra)

To see Knowhere at work without building anything, create an HNSW or IVF index in the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), then read [Index Explained](https://milvus.io/docs/index-explained.md) to compare the options.

## Sources

- [Knowhere source, build options, and license](https://github.com/zilliztech/knowhere)
- [Knowhere in the Milvus docs](https://milvus.io/docs/knowhere.md)
- [What powers similarity search in Milvus (Knowhere deep dive)](https://milvus.io/blog/deep-dive-8-knowhere.md)
- [Index Explained: index types supported by Milvus](https://milvus.io/docs/index-explained.md)
- [Bitsets in vector execution](https://milvus.io/docs/bitset.md)
- [Benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md)
