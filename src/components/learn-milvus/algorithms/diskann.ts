import type { Point } from './metrics';
import { l2 } from './metrics';

export type DiskANNNode = {
  id: number;
  point: Point;
  neighbors: number[];
};

export type DiskANNGraph = {
  nodes: DiskANNNode[];
  R: number;
  entryPoint: number;
};

export function buildDiskANN(points: Point[], R: number): DiskANNGraph {
  const nodes: DiskANNNode[] = points.map((p, i) => ({
    id: i,
    point: p,
    neighbors: [],
  }));

  for (const n of nodes) {
    const ranked = nodes
      .filter((other) => other.id !== n.id)
      .map((other) => ({ id: other.id, d: l2(n.point, other.point) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, R);
    n.neighbors = ranked.map((r) => r.id);
  }

  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  const center = { x: cx, y: cy };
  let entryPoint = 0;
  let bestD = l2(center, points[0]);
  for (let i = 1; i < points.length; i++) {
    const d = l2(center, points[i]);
    if (d < bestD) {
      bestD = d;
      entryPoint = i;
    }
  }

  return { nodes, R, entryPoint };
}

export type DiskANNStep =
  | { type: 'enter'; current: number }
  | { type: 'pq-compare'; current: number; neighbors: number[] }
  | { type: 'move'; from: number; to: number }
  | { type: 'pool-trim'; pool: number[] }
  | { type: 'disk-read'; node: number; rank: number }
  | { type: 'done'; topK: number[] };

export type DiskANNSearchResult = {
  steps: DiskANNStep[];
  topK: number[];
  pqCompares: number;
  diskReads: number;
  visited: number[];
  finalPool: number[];
};

export function searchDiskANN(
  query: Point,
  graph: DiskANNGraph,
  L: number,
  reRank: number,
  topK: number,
): DiskANNSearchResult {
  const steps: DiskANNStep[] = [];
  const visited = new Set<number>();

  type Cand = { id: number; d: number };
  const cmp = (a: Cand, b: Cand) => a.d - b.d;

  let current = graph.entryPoint;
  visited.add(current);
  let pqCompares = 1;
  steps.push({ type: 'enter', current });

  let pool: Cand[] = [
    { id: current, d: l2(query, graph.nodes[current].point) },
  ];
  let frontier: Cand[] = [...pool];

  while (frontier.length > 0) {
    frontier.sort(cmp);
    const c = frontier.shift()!;
    pool.sort(cmp);
    const farD = pool[Math.min(L - 1, pool.length - 1)].d;
    if (c.d > farD && pool.length >= L) break;

    if (c.id !== current) {
      steps.push({ type: 'move', from: current, to: c.id });
      current = c.id;
    }

    const ns = graph.nodes[c.id].neighbors;
    const newlySeen: number[] = [];
    for (const nid of ns) {
      if (visited.has(nid)) continue;
      visited.add(nid);
      newlySeen.push(nid);
      const d = l2(query, graph.nodes[nid].point);
      pqCompares += 1;
      pool.push({ id: nid, d });
      frontier.push({ id: nid, d });
    }
    if (newlySeen.length > 0) {
      steps.push({ type: 'pq-compare', current: c.id, neighbors: newlySeen });
    }

    pool.sort(cmp);
    if (pool.length > L) pool = pool.slice(0, L);
    steps.push({ type: 'pool-trim', pool: pool.map((p) => p.id) });
  }

  pool.sort(cmp);
  const finalPool = pool.slice(0, Math.max(reRank, topK));

  const reRankedCands: Cand[] = [];
  finalPool.forEach((c, i) => {
    steps.push({ type: 'disk-read', node: c.id, rank: i });
    reRankedCands.push({ id: c.id, d: l2(query, graph.nodes[c.id].point) });
  });
  reRankedCands.sort(cmp);

  const topKIds = reRankedCands.slice(0, topK).map((c) => c.id);
  steps.push({ type: 'done', topK: topKIds });

  return {
    steps,
    topK: topKIds,
    pqCompares,
    diskReads: finalPool.length,
    visited: Array.from(visited),
    finalPool: finalPool.map((c) => c.id),
  };
}
