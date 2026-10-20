---
slug: "how-does-batching-multiple-queries-together-affect-latency-and-throughput-in-what-scenarios-is-batch-querying-beneficial-or-detrimental-for-vector-search"
title: "How do batching, latency, and throughput interact in vector search?"
topic: "production"
order: 34
---

Latency is the time taken by a request; throughput is the rate of successfully completed work. Batching and concurrency can increase resource utilization, but they can also introduce waiting and queueing. Optimizing one figure without measuring the other can produce a misleading result.

![Control the workload before comparing performance](/images/ai-reference/benchmark.svg)

## Distinguish a batch from concurrent requests

A batch sends several query vectors together. Concurrent requests are separate operations in flight at the same time. A system may process these forms differently. Batch size, client concurrency, request arrival pattern, and server scheduling all affect the result.

Offline jobs can often wait to accumulate work, while an interactive user cannot. Include the time spent waiting to form a batch in user-visible latency. Do not present per-query compute time inside a large batch as the response time a single user would experience.

## Find the saturation point

Increase concurrency gradually while keeping quality parameters, top-k, filters, and data fixed. Measure throughput and latency percentiles together. Once a constrained resource is saturated, more outstanding work may mainly increase queueing, timeouts, and tail latency.

Check client-side limits as well as server resources. A load generator can bottleneck or hide queueing. Network transfer, query embedding, payload fetch, and reranking may dominate end-to-end latency even when database execution is fast.

## Choose by workload class

For interactive search, select a configuration that meets tail-latency and error-rate targets at the expected arrival rate. For offline processing, throughput and total completion time may matter more. Run both classes separately if the application needs both, then test them together to reveal interference. Keep retrieval quality constant so a faster configuration is not merely doing less useful search work.

## Tune the levers that actually move the numbers

Once you know whether you are latency-bound or throughput-bound, a small set of Milvus-specific levers account for most of the practical gain:

- **Replica count.** Query nodes can be scaled out with additional replicas to raise read concurrency and throughput; this helps a saturated read path but does not reduce single-query latency by itself.
- **Search parameters.** Index-specific parameters such as `nprobe` or `ef` trade recall for query latency. Tightening them lowers latency and raises throughput at the cost of quality, so changes should be validated against a fixed recall target, not applied blindly.
- **Resource allocation.** CPU, memory, and whether vectors are memory-resident versus mmap/disk-backed change both tail latency and the point at which the system starts queueing. Index build and load configuration also affect how much headroom remains for concurrent queries.
- **Batching and concurrency.** As covered above, raising client concurrency only increases throughput until a resource saturates; past that point it mainly adds queueing and tail latency.

Change one lever at a time, re-measure at the same recall target, and record the resulting curve so a decision can be revisited as the workload grows.

## Example to test

Record request arrival, queue wait, search duration, and completion. Increase concurrency until the service target stops holding. Reporting only completed searches can hide dropped requests or a backlog that makes interactive use unacceptable.

## From concept to implementation

- [Compare supported index choices](https://milvus.io/docs/index-explained.md).
- [Read the benchmark methodology discussion](https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md).

## Continue learning

- [What is GPU_CAGRA, and when does it help vector search?](/ai-quick-reference/what-is-gpu-cagra)
- [How do vector databases support recommendation candidate retrieval?](/ai-quick-reference/vector-search-for-recommendations)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)
- [How do you choose a vector index for your workload?](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload)
- [What is reranking, and when should you apply it?](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it)

## Implementation guides and sources

- [Vector search requests](https://milvus.io/docs/single-vector-search.md)
- [Repeatable performance workloads](https://github.com/zilliztech/VectorDBBench)
- [Turn your workload into a sizing estimate](https://milvus.io/tools/sizing)
