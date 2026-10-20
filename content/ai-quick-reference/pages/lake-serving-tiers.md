---
slug: "how-to-design-hot-and-cold-vector-serving"
title: "How should you separate hot vector serving from cold lake data?"
topic: "lake"
order: 47
---

Hot and cold describe access patterns, not permanent properties of a dataset. A vector-search service may repeatedly traverse a small index working set while occasionally fetching large source payloads. Lake analytics can scan the same data in a very different order.

## Separate index, vector, and payload needs

Measure which bytes are needed to find candidate IDs, refine their scores, and return the final payload. A service that returns a few identifiers can have a different working set from one that returns large texts or media metadata. Additional vector fields and reranking stages introduce further reads.

Milvus tiered storage documents a model in which QueryNodes initially load metadata and bring other data into caches as needed. Availability and settings depend on the release. Evaluate the supported configuration for the actual collection instead of assuming that every index and storage layout has identical behavior.

## Benchmark cache transitions

Test at least three states: a cold start, a warmed representative query mix, and a workload shift. Record p95/p99 latency, object-store requests, local disk traffic, cache occupancy, and successful throughput. A warm benchmark can conceal an unacceptable first-query experience after failover or a traffic shift.

Use documented warm-up controls where appropriate, and measure their completion and resource cost. Preloading every possible payload can remove the capacity benefit of tiering. Conversely, a very small cache can turn a high-volume serving workload into continuous remote reads.

## Give batch work an interference budget

A curation scan and interactive retrieval can compete for storage bandwidth, local cache, CPU, and network. Run them together at realistic rates before sharing the same resources. Separate compute or schedule heavy jobs when the serving latency requirement cannot tolerate that interference.

Compare the complete cost against a bounded managed serving subset. Include cache replacement after node failure and the time needed to recover a useful working set. A successful tiering design meets the application target through ordinary changes in data and traffic, rather than depending on an indefinitely warm cache or an unusually favorable query sequence.

## Example to test

Replay a popular query set, then shift traffic to previously cold records. Track source fetches, cache behavior, and tail latency. A low average storage cost is useful only if the working-set transition still meets service goals.

## From concept to implementation

- [Check the supported external-source workflow](https://milvus.io/docs/create-an-external-collection.md).
- [Connect retrieval with batch preparation](https://milvus.io/docs/integrate_with_spark.md).

## Continue learning

- [What is Talon, and when can object-store caching help vector workloads?](/ai-quick-reference/what-is-talon)
- [How does mmap differ from a disk-oriented ANN index?](/ai-quick-reference/how-mmap-differs-from-diskann)
- [When should you use DISKANN in Milvus?](/ai-quick-reference/what-is-diskann)
- [How do you compare managed and self-hosted vector-search costs?](/ai-quick-reference/what-are-the-tradeoffs-of-using-a-cloudbased-vector-store-service-in-a-rag-system-evaluation-in-terms-of-latency-variance-network-costs-etc-versus-a-local-inmemory-store)

## Implementation guides and sources

- [Milvus tiered storage](https://milvus.io/docs/tiered-storage-overview.md)
- [Warm-up behavior](https://milvus.io/docs/warm-up.md)
- [Tiered-storage workload guidance](https://milvus.io/docs/best-practices-for-tiered-storage.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
