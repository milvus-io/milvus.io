---
slug: "how-to-reproduce-vector-search-and-training-experiments"
title: "How do you make vector-search and training experiments reproducible?"
topic: "lake"
order: 45
---

An experiment is reproducible when someone else can rerun it later and get the same numbers, or explain exactly why they differ. For vector search and training, that means pinning five things together: the **data version** (a lake snapshot and a Milvus collection snapshot), the **embedding model and preprocessing**, the **index and search configuration**, the **query and label set**, and the **code and environment**. Record identifiers for all five with every result, and keep the underlying data alive for as long as the result might need to be rerun.

![Pinning data, model, and evaluation together](/images/ai-reference/evaluation.svg)

## Why are vector experiments hard to reproduce?

In ordinary ML, the dataset and the model are the main moving parts. Retrieval adds more, and they change independently:

- Source documents are edited or deleted.
- Chunking rules change, which changes what an embedding even refers to.
- A new encoder revision produces vectors in a different space.
- Index parameters (`M`, `efConstruction`, `nlist`) and search parameters (`ef`, `nprobe`) shift recall.
- Approximate search is not exact: recall below 100% means a few results can differ between builds.
- Relevance labels are corrected over time.

A notebook timestamp captures none of this. If last month's recall@10 was 0.91 and today's is 0.88, you need to know which of these changed.

## What should an experiment record contain?

| Component | Record | Example |
| --- | --- | --- |
| Source data | Lake table and snapshot or version ID | Iceberg snapshot `5937117119577207000` |
| Serving data | Milvus collection and snapshot name | `docs_eval_2026_10_01` |
| Representation | Encoder name and revision, chunking settings | `bge-m3@v1`, 512 tokens, 64 overlap |
| Index and search | Index type, build and search parameters, metric | HNSW, `M=16`, `ef=128`, COSINE |
| Evaluation | Query set version, relevance judgments, metric code | `qset-v7`, `qrels-v7`, recall@10 |
| Training selection | Manifest of IDs, revisions, splits, weights | `train-manifest-2026-10-01.parquet` |
| Environment | Git commit, library versions, hardware | `a1b2c3d`, pinned client and library versions |

Store this record next to the results, not in someone's head.

## Use Milvus snapshots to pin the serving state

Milvus 3.0 adds [collection snapshots](https://milvus.io/docs/snapshots.md): point-in-time, read-only images of a collection that reference existing segment, deletion-log, and index files rather than copying vector data. A snapshot captures the schema, partition layout, index metadata, and segment data at creation time, which is exactly what an evaluation run needs to pin.

The [snapshot management API](https://milvus.io/docs/manage-snapshots.md) is short:

```python
client.flush(collection_name="docs")
client.create_snapshot(
    collection_name="docs",
    snapshot_name="docs_eval_2026_10_01",
    description="Baseline for bge-m3 v1 vs v2 comparison",
)

# Later: rebuild the exact state as a new collection
job_id = client.restore_snapshot(snapshot_name="docs_eval_2026_10_01", collection_name="docs_eval_replay")
print(client.get_restore_snapshot_state(job_id=job_id))
```

A few properties matter for experiments:

- **Restore creates a new collection** in the same cluster, with the same schema, shard count, and partitions. Restoration copies segment files directly rather than re-inserting data, so it is fast.
- **Snapshots are immutable**, which is what you want for a baseline.
- **Referenced files are kept.** Milvus does not garbage-collect segment or index files referenced by a snapshot until you drop it. That protects reproducibility but costs storage, so drop snapshots you no longer need with `drop_snapshot()`.
- **Pins can expire on their own.** `pin_snapshot_data()` takes a `ttl_seconds` value, useful for keeping a snapshot's data available for the duration of a long offline job.
- **TTL can interfere.** If the collection uses a time-to-live, restoring old data may expire immediately; adjust or disable TTL on the restored collection.

Snapshots are designed for short- and medium-term rollback and experimentation (days to weeks). For long-term disaster recovery, use a backup stored independently; see [backup and recovery planning](/ai-quick-reference/how-do-vector-databases-handle-backup-and-restore-or-replication-for-very-large-datasets-and-what-impact-does-that-have-on-system-design-in-terms-of-time-and-storage-overhead).

## Pin the lake side too

If the data lives in a lake, pin it there as well. Iceberg snapshot IDs and Lance dataset versions give you time travel to the exact rows an experiment used. For an Iceberg-backed external collection, the snapshot ID is part of the collection's configuration, so recording it ties Milvus's view to a named table state; see [searching Iceberg tables with Milvus](/ai-quick-reference/how-can-milvus-search-iceberg-tables).

Retention is the catch. Iceberg's snapshot expiration and orphan-file cleanup will eventually delete files an old experiment depends on, and a saved snapshot ID is useless once its files are gone. Tag or retain the snapshots that back published results, and set the retention window deliberately rather than inheriting the default.

## Change one variable at a time

Reproducibility pays off when comparisons are clean:

- **Comparing embedding models?** Hold the source snapshot, chunking, query set, and labels fixed; change only the encoder.
- **Comparing data improvements?** Hold the encoder fixed; change only the source version.
- **Tuning an index?** Compare against an exact [FLAT baseline](/ai-quick-reference/why-use-flat-search-as-an-ann-baseline) on the same snapshot, so recall is measured against ground truth rather than another approximation.
- **Training on retrieved data?** Save the selection manifest (IDs, revisions, splits) rather than the query that produced it; rerunning the query on newer data will select different rows.

## Prove it by replaying

The real test is a replay: after the original environment is gone, restore the Milvus snapshot, check out the code commit, load the recorded model revision, and rerun the evaluation. Compare membership, top-k results, and metrics with the original. Small recall differences from ANN nondeterminism are expected; large ones point at an unrecorded dependency. Doing this once per quarter catches gaps in your records long before an auditor or a paper reviewer does.

## Related reading

- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)
- [How should you benchmark vector search performance?](/ai-quick-reference/what-tools-help-benchmark-vector-search-performance)
- [How do you build an evaluation set for agentic and vector search?](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets)
- [How should you refresh a Milvus external collection safely?](/ai-quick-reference/how-to-refresh-milvus-external-collections)

## Sources

- [Milvus snapshots](https://milvus.io/docs/snapshots.md)
- [Manage snapshots](https://milvus.io/docs/manage-snapshots.md)
- [Iceberg table maintenance: snapshot expiration](https://iceberg.apache.org/docs/latest/maintenance/)
- [Apache Iceberg specification](https://iceberg.apache.org/spec/)
- Explore end-to-end evaluation notebooks in the [Milvus Bootcamp](https://milvus.io/bootcamp).
