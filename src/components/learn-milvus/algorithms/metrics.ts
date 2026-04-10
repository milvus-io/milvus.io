export type Point = { x: number; y: number };

export type MetricType = 'L2' | 'COSINE' | 'IP';

/** Euclidean distance (squared — no sqrt needed for ranking) */
export function l2(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

/** Cosine similarity: dot / (|a| * |b|). Returns similarity (higher = closer). */
export function cosine(a: Point, b: Point): number {
  const dot = a.x * b.x + a.y * b.y;
  const normA = Math.sqrt(a.x ** 2 + a.y ** 2);
  const normB = Math.sqrt(b.x ** 2 + b.y ** 2);
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

/** Inner product (higher = closer). */
export function ip(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y;
}

/** Compute distance/similarity using the given metric. */
export function computeMetric(a: Point, b: Point, metric: MetricType): number {
  switch (metric) {
    case 'L2':
      return l2(a, b);
    case 'COSINE':
      return cosine(a, b);
    case 'IP':
      return ip(a, b);
  }
}

/** Whether higher values mean "more similar" for this metric. */
export function isHigherBetter(metric: MetricType): boolean {
  return metric === 'COSINE' || metric === 'IP';
}

/** Rank points by distance/similarity to the query. Returns sorted indices. */
export function rankNeighbors(
  query: Point,
  points: Point[],
  metric: MetricType,
): number[] {
  const scores = points.map((p, i) => ({ i, score: computeMetric(query, p, metric) }));
  const higherBetter = isHigherBetter(metric);
  scores.sort((a, b) => (higherBetter ? b.score - a.score : a.score - b.score));
  return scores.map((s) => s.i);
}

/** Get the angle (in radians) of a point from the origin. */
export function angle(p: Point): number {
  return Math.atan2(p.y, p.x);
}

/** Get the magnitude of a point vector. */
export function magnitude(p: Point): number {
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}
