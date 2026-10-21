---
slug: "why-use-flat-search-as-an-ann-baseline"
title: "Why use a FLAT baseline when tuning an ANN index?"
topic: "retrieval"
order: 67
---

A FLAT search compares the query with every eligible vector and returns the true top-k for the chosen metric, so it is the ground truth against which any approximate index is measured. Without it, you cannot say what recall an HNSW, IVF, or DiskANN configuration actually achieves: you can only say it is fast. FLAT is also a legitimate serving index when the set of vectors a query can see is small enough to scan.

![Control the workload before comparing performance](/images/ai-reference/benchmark.svg)

## What does a FLAT index do?

FLAT stores vectors as they are and builds nothing on top of them. At query time it computes the distance from the query to each eligible vector, keeps the best `k`, and returns them. There is no training step, no graph, no clusters, and nothing to tune: in Milvus, `FLAT` takes no build or search parameters. It supports the `COSINE`, `L2`, and `IP` metrics for dense float vectors, and its binary counterpart `BIN_FLAT` does the same for binary vectors with `HAMMING` or `JACCARD`. GPU deployments also offer `GPU_BRUTE_FORCE`, which performs the same exhaustive comparison on the GPU and returns recall of 1.

The price is linear cost. A query costs about `N × d` multiply-adds, where `N` is the number of eligible vectors and `d` the dimension. For one million 768-dimensional vectors that is roughly 770 million operations per query, and it doubles when the collection doubles. An ANN index, by contrast, scores a few thousand candidates. That gap is the reason ANN indexes exist, and the reason the slow exact answer remains the yardstick.

## Why is exact search the ground truth for ANN recall?

ANN quality is usually reported as **Recall@k**:

```
Recall@k = |ANN top-k ∩ exact top-k| / k     (averaged over the query set)
```

The "exact top-k" in that formula has to come from somewhere, and only an exhaustive search can produce it with certainty. Once you have it, every tuning decision becomes a measurable trade: sweeping HNSW `ef` or IVF `nprobe` traces a curve of recall against latency, and you can pick the cheapest setting that meets your target. Public benchmarks such as ANN-Benchmarks are built the same way, plotting recall (computed against precomputed exact neighbors) against queries per second.

The baseline also tells you *where* a quality problem lives. If FLAT returns the right evidence and the ANN index misses it, the fix is in the index: search effort, construction parameters, quantization, or filtering strategy. If FLAT also returns the wrong evidence, no index tuning will help, and you should look at the embedding model, chunking, the source data, or how queries are phrased. Exact neighbors are a geometric reference, not a relevance judgment; track judged relevance (see [how to evaluate retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)) alongside exact-neighbor recall.

## How do you compute Recall@k against FLAT in Milvus?

A practical setup is two collections loaded with the same data: one with the index under test, one with `FLAT`. Because both receive identical vectors, IDs, and scalar fields, any difference in results is approximation error.

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="http://localhost:19530")

# Ground-truth collection: same schema and data as the ANN collection
idx = client.prepare_index_params()
idx.add_index(field_name="embedding", index_type="FLAT",
              metric_type="COSINE", params={})
client.create_index("docs_flat", idx)
client.load_collection("docs_flat")

def top_ids(collection, queries, k, search_params, flt=""):
    res = client.search(collection_name=collection, data=queries,
                        anns_field="embedding", limit=k, filter=flt,
                        search_params=search_params,
                        consistency_level="Strong")
    return [[hit["id"] for hit in hits] for hits in res]

k = 10
exact = top_ids("docs_flat", queries, k, {"params": {}}, flt="tenant == 'a'")
approx = top_ids("docs_hnsw", queries, k, {"params": {"ef": 64}}, flt="tenant == 'a'")

recall = sum(len(set(a) & set(e)) / k for a, e in zip(approx, exact)) / len(queries)
print(f"Recall@{k}: {recall:.3f}")
```

Then repeat the ANN search with several values of `ef` (or `nprobe` for IVF, `search_list` for DiskANN) and record recall and p95 latency for each. Save the exact IDs with the benchmark artifacts so later runs compare against the same reference. For very large corpora you can also compute exact neighbors offline (for example with a GPU brute-force pass), as long as the vectors, metric, normalization, and filters are identical.

## What makes a baseline fair?

The baseline is only meaningful if it answers exactly the same question as the ANN run.

- **Same data state.** Both searches must see the same inserts and deletes. Use `Strong` consistency (or wait for writes to be visible) so one side is not missing recent rows.
- **Same metric and normalization.** COSINE on one side and IP on unnormalized vectors on the other produces different rankings that have nothing to do with the index. See [how cosine, IP, and L2 differ](/ai-quick-reference/what-is-the-role-of-distance-metrics-in-embeddings).
- **Same filters.** A filtered query needs filtered ground truth. An unfiltered global top-k is not a valid reference for a tenant- or time-scoped search, even with identical vectors ([how filters interact with vector search](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance)).
- **Same corpus.** You may sample the *queries* to keep ground-truth computation cheap, but compute their exact neighbors over the full corpus the ANN index serves. If you shrink the corpus, build both indexes on that same subset and label the result as a subset experiment.
- **Ties and duplicates.** When several vectors sit at nearly the same distance around position `k`, two valid orderings can disagree on IDs. Decide whether to count a tie as a hit (for example, compare by distance with a small tolerance), and remove duplicate source items that make the benchmark artificially easy.

## When is FLAT alone enough?

FLAT is not only a testing tool. It is often the right production choice when:

- The collection is small enough that a scan fits the latency budget; the Milvus index-selection guide suggests FLAT for datasets under about a million vectors.
- Filters or partitioning shrink each query's eligible set to a small slice. Milvus's index guidance recommends FLAT when filters remove more than about 98% of the data, because a graph would spend most of its effort skipping ineligible nodes.
- Results must be exact, as in auditing, deduplication checks, or regulated retrieval where "approximately right" is not acceptable.
- Data changes so quickly that building and maintaining an ANN index costs more than it saves.

Beyond that, FLAT becomes a cost problem rather than a quality one, and an ANN index tuned against the FLAT baseline is the better trade. [How to choose a vector index](/ai-quick-reference/how-do-you-choose-the-right-index-type-for-your-workload) explains which family to try next, and [what ANN search is](/ai-quick-reference/what-is-approximate-nearestneighbor-ann-search) covers why the approximation works.

## Try it

The [Milvus Quickstart](https://milvus.io/docs/quickstart.md) gets a collection running in minutes; add a FLAT copy next to your ANN collection and you have a recall harness. For full benchmarking practice, see [how to benchmark vector search performance](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance).

## Sources and further reading

- [Milvus FLAT index](https://milvus.io/docs/flat.md)
- [Milvus BIN_FLAT index](https://milvus.io/docs/bin-flat.md)
- [Milvus GPU indexes, including GPU_BRUTE_FORCE](https://milvus.io/docs/gpu_index.md)
- [Milvus metric types](https://milvus.io/docs/metric.md)
- [Milvus index explained: selection by filter ratio](https://milvus.io/docs/index-explained.md)
- [Aumüller et al., ANN-Benchmarks (arXiv:1807.05614)](https://arxiv.org/abs/1807.05614)
- [Nearest neighbor search (Wikipedia)](https://en.wikipedia.org/wiki/Nearest_neighbor_search)
