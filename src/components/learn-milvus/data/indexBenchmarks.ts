// ⚠️ PLACEHOLDER DATA — DO NOT TRUST THESE NUMBERS.
// Every qps / recall / buildSec below is a placeholder pending real
// VectorDBBench runs (Cohere 768d, k=10). Replace each value with the
// measured result.
//
// What to fill per (index, scale):
//   qps      → peak QPS from the concurrent search phase
//   recall   → Recall@10 from the serial search phase (run with --k 10), 0~1
//   buildSec → index build/optimize duration in seconds (NOT load duration)
//
// Memory was intentionally removed: VectorDBBench's memory metric is
// unreliable for self-hosted Milvus, so the page no longer shows it.

export type IndexId =
  | 'FLAT'
  | 'IVF_FLAT'
  | 'IVF_SQ8'
  | 'IVF_PQ'
  | 'HNSW'
  | 'DISKANN';

export type Scale = '100K' | '1M' | '10M';

export type IndexBenchmark = {
  qps: number;
  recall: number;
  buildSec: number;
};

export type IndexInfo = {
  id: IndexId;
  name: string;
  tagline: string;
  color: string;
  bestFor: string;
  worstFor: string;
  perScale: Record<Scale, IndexBenchmark>;
};

export const SCALES: { id: Scale; label: string; size: number }[] = [
  { id: '100K', label: '100K vectors', size: 100_000 },
  { id: '1M', label: '1M vectors', size: 1_000_000 },
  { id: '10M', label: '10M vectors', size: 10_000_000 },
];

// TODO(benchmark): replace all perScale numbers with VectorDBBench results.
export const INDEXES: IndexInfo[] = [
  {
    id: 'FLAT',
    name: 'FLAT',
    tagline: 'Brute force — compare against every vector.',
    color: '#94a3b8',
    bestFor: 'Tiny datasets or "ground truth" baselines.',
    worstFor: 'Anything large — speed scales linearly with N.',
    perScale: {
      '100K': { qps: 0, recall: 1.0, buildSec: 0 },
      '1M': { qps: 0, recall: 1.0, buildSec: 0 },
      '10M': { qps: 0, recall: 1.0, buildSec: 0 },
    },
  },
  {
    id: 'IVF_FLAT',
    name: 'IVF_FLAT',
    tagline: 'Cluster the data; search only the nearest clusters.',
    color: '#4dabf7',
    bestFor: 'Medium datasets where you want exact distances within clusters.',
    worstFor: 'Very high recall on large data — you must scan many clusters.',
    perScale: {
      '100K': { qps: 0, recall: 0, buildSec: 0 },
      '1M': { qps: 0, recall: 0, buildSec: 0 },
      '10M': { qps: 0, recall: 0, buildSec: 0 },
    },
  },
  {
    id: 'IVF_SQ8',
    name: 'IVF_SQ8',
    tagline: 'IVF + 8-bit scalar quantization. ~4× less memory.',
    color: '#69db7c',
    bestFor: 'When IVF_FLAT does not fit in memory.',
    worstFor: 'When you need maximum recall — quantization adds noise.',
    perScale: {
      '100K': { qps: 0, recall: 0, buildSec: 0 },
      '1M': { qps: 0, recall: 0, buildSec: 0 },
      '10M': { qps: 0, recall: 0, buildSec: 0 },
    },
  },
  {
    id: 'IVF_PQ',
    name: 'IVF_PQ',
    tagline: 'IVF + product quantization. Aggressive compression, ~16× smaller.',
    color: '#ffd43b',
    bestFor: 'Huge datasets where memory is the bottleneck.',
    worstFor: 'Latency-critical or high-recall workloads.',
    // NOTE: IVF_PQ has no CPU CLI command in VectorDBBench — run it via the Web UI (init_bench).
    perScale: {
      '100K': { qps: 0, recall: 0, buildSec: 0 },
      '1M': { qps: 0, recall: 0, buildSec: 0 },
      '10M': { qps: 0, recall: 0, buildSec: 0 },
    },
  },
  {
    id: 'HNSW',
    name: 'HNSW',
    tagline: 'Hierarchical graph. Best speed-recall trade-off in memory.',
    color: '#da77f2',
    bestFor: 'Latency-critical search with high recall and ample RAM.',
    worstFor: 'Memory-constrained environments — uses ~1.5–2× the raw data.',
    perScale: {
      '100K': { qps: 0, recall: 0, buildSec: 0 },
      '1M': { qps: 0, recall: 0, buildSec: 0 },
      '10M': { qps: 0, recall: 0, buildSec: 0 },
    },
  },
  {
    id: 'DISKANN',
    name: 'DISKANN',
    tagline: 'Graph index that lives on disk. Trades latency for memory.',
    color: '#ff8787',
    bestFor: 'Billion-scale datasets that cannot fit in RAM.',
    worstFor: 'Small datasets — disk I/O overhead outweighs benefits.',
    perScale: {
      '100K': { qps: 0, recall: 0, buildSec: 0 },
      '1M': { qps: 0, recall: 0, buildSec: 0 },
      '10M': { qps: 0, recall: 0, buildSec: 0 },
    },
  },
];
