import type { Point } from '../algorithms/metrics';

/** Generate n random points in [-range, range]. */
export function randomPoints(n: number, range = 200): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    points.push({
      x: (Math.random() - 0.5) * 2 * range,
      y: (Math.random() - 0.5) * 2 * range,
    });
  }
  return points;
}

/** Generate clustered points: k clusters with n/k points each. */
export function clusteredPoints(n: number, k = 4, range = 200, spread = 40): Point[] {
  const points: Point[] = [];
  const centers: Point[] = [];
  for (let i = 0; i < k; i++) {
    centers.push({
      x: (Math.random() - 0.5) * 1.4 * range,
      y: (Math.random() - 0.5) * 1.4 * range,
    });
  }
  const perCluster = Math.ceil(n / k);
  for (const center of centers) {
    for (let i = 0; i < perCluster && points.length < n; i++) {
      points.push({
        x: center.x + (Math.random() - 0.5) * spread * 2,
        y: center.y + (Math.random() - 0.5) * spread * 2,
      });
    }
  }
  return points;
}

/** Stable seed-based random for reproducible demos. */
export function seededPoints(seed: number, n: number, range = 200): Point[] {
  let s = seed;
  function next() {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  }
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    points.push({
      x: (next() - 0.5) * 2 * range,
      y: (next() - 0.5) * 2 * range,
    });
  }
  return points;
}
