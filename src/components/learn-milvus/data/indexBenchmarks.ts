export type IndexId =
  | 'FLAT'
  | 'IVF_FLAT'
  | 'IVF_SQ8'
  | 'IVF_PQ'
  | 'HNSW'
  | 'DISKANN';

export type Scale = '1K' | '100K' | '10M';

export type IndexBenchmark = {
  qps: number;
  recall: number;
  memoryMB: number;
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
  { id: '1K', label: '1K vectors', size: 1_000 },
  { id: '100K', label: '100K vectors', size: 100_000 },
  { id: '10M', label: '10M vectors', size: 10_000_000 },
];

export const INDEXES: IndexInfo[] = [
  {
    id: 'FLAT',
    name: 'FLAT',
    tagline: 'Brute force \u2014 compare against every vector.',
    color: '#94a3b8',
    bestFor: 'Tiny datasets or "ground truth" baselines.',
    worstFor: 'Anything large \u2014 speed scales linearly with N.',
    perScale: {
      '1K': { qps: 5000, recall: 1.0, memoryMB: 3, buildSec: 0 },
      '100K': { qps: 50, recall: 1.0, memoryMB: 300, buildSec: 0 },
      '10M': { qps: 0.5, recall: 1.0, memoryMB: 30000, buildSec: 0 },
    },
  },
  {
    id: 'IVF_FLAT',
    name: 'IVF_FLAT',
    tagline: 'Cluster the data; search only the nearest clusters.',
    color: '#4dabf7',
    bestFor: 'Medium datasets where you want exact distances within clusters.',
    worstFor: 'Very high recall on large data \u2014 you must scan many clusters.',
    perScale: {
      '1K': { qps: 8000, recall: 0.99, memoryMB: 4, buildSec: 0.1 },
      '100K': { qps: 800, recall: 0.95, memoryMB: 320, buildSec: 5 },
      '10M': { qps: 50, recall: 0.92, memoryMB: 32000, buildSec: 600 },
    },
  },
  {
    id: 'IVF_SQ8',
    name: 'IVF_SQ8',
    tagline: 'IVF + 8-bit scalar quantization. ~4\u00d7 less memory.',
    color: '#69db7c',
    bestFor: 'When IVF_FLAT does not fit in memory.',
    worstFor: 'When you need maximum recall \u2014 quantization adds noise.',
    perScale: {
      '1K': { qps: 9000, recall: 0.97, memoryMB: 2, buildSec: 0.2 },
      '100K': { qps: 1200, recall: 0.93, memoryMB: 80, buildSec: 8 },
      '10M': { qps: 100, recall: 0.89, memoryMB: 8000, buildSec: 900 },
    },
  },
  {
    id: 'IVF_PQ',
    name: 'IVF_PQ',
    tagline: 'IVF + product quantization. Aggressive compression, ~16\u00d7 smaller.',
    color: '#ffd43b',
    bestFor: 'Huge datasets where memory is the bottleneck.',
    worstFor: 'Latency-critical or high-recall workloads.',
    perScale: {
      '1K': { qps: 10000, recall: 0.85, memoryMB: 1, buildSec: 0.5 },
      '100K': { qps: 3000, recall: 0.8, memoryMB: 25, buildSec: 15 },
      '10M': { qps: 800, recall: 0.75, memoryMB: 2500, buildSec: 1800 },
    },
  },
  {
    id: 'HNSW',
    name: 'HNSW',
    tagline: 'Hierarchical graph. Best speed-recall trade-off in memory.',
    color: '#da77f2',
    bestFor: 'Latency-critical search with high recall and ample RAM.',
    worstFor: 'Memory-constrained environments \u2014 uses ~1.5\u20132\u00d7 the raw data.',
    perScale: {
      '1K': { qps: 12000, recall: 0.99, memoryMB: 6, buildSec: 0.3 },
      '100K': { qps: 5000, recall: 0.98, memoryMB: 600, buildSec: 30 },
      '10M': { qps: 1500, recall: 0.95, memoryMB: 60000, buildSec: 7200 },
    },
  },
  {
    id: 'DISKANN',
    name: 'DISKANN',
    tagline: 'Graph index that lives on disk. Trades latency for memory.',
    color: '#ff8787',
    bestFor: 'Billion-scale datasets that cannot fit in RAM.',
    worstFor: 'Small datasets \u2014 disk I/O overhead outweighs benefits.',
    perScale: {
      '1K': { qps: 2000, recall: 0.97, memoryMB: 4, buildSec: 1 },
      '100K': { qps: 1500, recall: 0.96, memoryMB: 80, buildSec: 60 },
      '10M': { qps: 800, recall: 0.93, memoryMB: 8000, buildSec: 14400 },
    },
  },
];
