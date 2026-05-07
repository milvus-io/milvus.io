import type { Point } from './metrics';
import { l2 } from './metrics';

export type HNSWNode = {
  id: number;
  point: Point;
  maxLayer: number;
  neighbors: number[][];
};

export type HNSWGraph = {
  nodes: HNSWNode[];
  numLayers: number;
  entryPoint: number;
  M: number;
};

export function buildHNSW(
  points: Point[],
  M: number,
  seed = 42,
  maxLayerCap = 3,
): HNSWGraph {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };

  const mL = 1 / Math.log(Math.max(2, M));

  const layers = points.map(() => {
    const u = rand();
    return Math.min(maxLayerCap, Math.floor(-Math.log(u + 1e-9) * mL));
  });

  const observedMax = Math.max(...layers);
  if (observedMax < 1) layers[0] = 1;

  const numLayers = Math.max(...layers) + 1;

  const nodes: HNSWNode[] = points.map((p, i) => ({
    id: i,
    point: p,
    maxLayer: layers[i],
    neighbors: Array.from({ length: numLayers }, () => []),
  }));

  for (let layer = 0; layer < numLayers; layer++) {
    const inLayer = nodes.filter((n) => n.maxLayer >= layer);
    for (const n of inLayer) {
      const ranked = inLayer
        .filter((other) => other.id !== n.id)
        .map((other) => ({ id: other.id, d: l2(n.point, other.point) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, M);
      n.neighbors[layer] = ranked.map((r) => r.id);
    }
  }

  const top = nodes.find((n) => n.maxLayer === numLayers - 1) ?? nodes[0];
  return { nodes, numLayers, entryPoint: top.id, M };
}

export type HNSWStep =
  | { type: 'enter'; layer: number; current: number }
  | { type: 'evaluate'; layer: number; current: number; neighbors: number[] }
  | { type: 'move'; layer: number; from: number; to: number }
  | { type: 'drop'; layer: number; current: number }
  | { type: 'done'; layer: number; current: number; topK: number[] };

export type HNSWSearchResult = {
  steps: HNSWStep[];
  topK: number[];
  visited: number[];
  comparisons: number;
};

export function searchHNSW(
  query: Point,
  graph: HNSWGraph,
  ef: number,
  topK: number,
): HNSWSearchResult {
  const steps: HNSWStep[] = [];
  const visited = new Set<number>();

  let current = graph.entryPoint;
  visited.add(current);
  steps.push({ type: 'enter', layer: graph.numLayers - 1, current });

  for (let layer = graph.numLayers - 1; layer >= 1; layer--) {
    while (true) {
      const neighborIds = graph.nodes[current].neighbors[layer] ?? [];
      const newlySeen = neighborIds.filter((n) => !visited.has(n));
      newlySeen.forEach((n) => visited.add(n));
      if (newlySeen.length > 0) {
        steps.push({
          type: 'evaluate',
          layer,
          current,
          neighbors: newlySeen,
        });
      }

      let best = current;
      let bestD = l2(query, graph.nodes[current].point);
      for (const nid of neighborIds) {
        const d = l2(query, graph.nodes[nid].point);
        if (d < bestD) {
          bestD = d;
          best = nid;
        }
      }

      if (best === current) break;
      steps.push({ type: 'move', layer, from: current, to: best });
      current = best;
    }
    steps.push({ type: 'drop', layer: layer - 1, current });
  }

  type Cand = { id: number; d: number };
  const cmp = (a: Cand, b: Cand) => a.d - b.d;

  let candidates: Cand[] = [
    { id: current, d: l2(query, graph.nodes[current].point) },
  ];
  let frontier: Cand[] = [...candidates];

  while (frontier.length > 0) {
    frontier.sort(cmp);
    const c = frontier.shift()!;
    candidates.sort(cmp);
    const farD = candidates[Math.min(ef - 1, candidates.length - 1)].d;
    if (c.d > farD && candidates.length >= ef) break;

    const ns = graph.nodes[c.id].neighbors[0] ?? [];
    const newlySeen: number[] = [];
    for (const nid of ns) {
      if (visited.has(nid)) continue;
      visited.add(nid);
      newlySeen.push(nid);
      const d = l2(query, graph.nodes[nid].point);
      candidates.push({ id: nid, d });
      frontier.push({ id: nid, d });
    }
    if (newlySeen.length > 0) {
      steps.push({
        type: 'evaluate',
        layer: 0,
        current: c.id,
        neighbors: newlySeen,
      });
    }
    candidates.sort(cmp);
    if (candidates.length > ef) candidates = candidates.slice(0, ef);
  }

  candidates.sort(cmp);
  const topKIds = candidates.slice(0, topK).map((c) => c.id);
  steps.push({
    type: 'done',
    layer: 0,
    current: topKIds[0] ?? current,
    topK: topKIds,
  });

  return {
    steps,
    topK: topKIds,
    visited: Array.from(visited),
    comparisons: visited.size,
  };
}
