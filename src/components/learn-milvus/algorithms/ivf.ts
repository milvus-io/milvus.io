import type { Point } from './metrics';
import { l2 } from './metrics';

export type Cluster = {
  centroid: Point;
  pointIndices: number[];
};

/**
 * Simple k-means clustering with k-means++ initialization.
 * Uses a seeded RNG so the layout stays stable across renders.
 */
export function kmeans(
  points: Point[],
  k: number,
  seed = 7,
  maxIter = 30,
): Cluster[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };

  // k-means++ init
  const centroids: Point[] = [];
  centroids.push({ ...points[Math.floor(rand() * points.length)] });
  while (centroids.length < k) {
    const distances = points.map((p) =>
      Math.min(...centroids.map((c) => l2(p, c))),
    );
    const sum = distances.reduce((a, b) => a + b, 0);
    let r = rand() * sum;
    let chosen = points.length - 1;
    for (let i = 0; i < points.length; i++) {
      r -= distances[i];
      if (r <= 0) {
        chosen = i;
        break;
      }
    }
    centroids.push({ ...points[chosen] });
  }

  const assignments = new Array(points.length).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < points.length; i++) {
      let best = 0;
      let bestDist = l2(points[i], centroids[0]);
      for (let j = 1; j < k; j++) {
        const d = l2(points[i], centroids[j]);
        if (d < bestDist) {
          bestDist = d;
          best = j;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }
    if (!changed) break;
    for (let j = 0; j < k; j++) {
      let sx = 0,
        sy = 0,
        n = 0;
      for (let i = 0; i < points.length; i++) {
        if (assignments[i] === j) {
          sx += points[i].x;
          sy += points[i].y;
          n++;
        }
      }
      if (n > 0) centroids[j] = { x: sx / n, y: sy / n };
    }
  }

  return centroids.map((c, j) => ({
    centroid: c,
    pointIndices: points.map((_, i) => i).filter((i) => assignments[i] === j),
  }));
}

/** FLAT (brute-force) search: scan every point, return ranked top-K. */
export function flatSearch(
  query: Point,
  points: Point[],
  topK: number,
): { scanOrder: number[]; topK: number[]; comparisons: number } {
  const scanOrder = points.map((_, i) => i);
  const ranked = scanOrder
    .map((i) => ({ i, d: l2(query, points[i]) }))
    .sort((a, b) => a.d - b.d);
  return {
    scanOrder,
    topK: ranked.slice(0, topK).map((r) => r.i),
    comparisons: points.length,
  };
}

export type IVFResult = {
  centroidEvalOrder: number[];
  selectedClusters: number[];
  scannedPoints: number[];
  topK: number[];
  comparisons: number;
};

export function ivfSearch(
  query: Point,
  points: Point[],
  clusters: Cluster[],
  nprobe: number,
  topK: number,
): IVFResult {
  const centroidScores = clusters.map((c, idx) => ({
    idx,
    dist: l2(query, c.centroid),
  }));
  const centroidEvalOrder = clusters.map((_, i) => i);
  const sorted = [...centroidScores].sort((a, b) => a.dist - b.dist);
  const selectedClusters = sorted.slice(0, nprobe).map((c) => c.idx);

  const scannedPoints: number[] = [];
  for (const cIdx of selectedClusters) {
    scannedPoints.push(...clusters[cIdx].pointIndices);
  }

  const ranked = scannedPoints
    .map((i) => ({ i, d: l2(query, points[i]) }))
    .sort((a, b) => a.d - b.d);

  return {
    centroidEvalOrder,
    selectedClusters,
    scannedPoints,
    topK: ranked.slice(0, topK).map((r) => r.i),
    comparisons: clusters.length + scannedPoints.length,
  };
}

/** Recall@K: how many of the IVF top-K are in the true top-K. */
export function recallAtK(ivfTopK: number[], trueTopK: number[]): number {
  const trueSet = new Set(trueTopK);
  const hits = ivfTopK.filter((i) => trueSet.has(i)).length;
  return trueSet.size === 0 ? 1 : hits / trueSet.size;
}
