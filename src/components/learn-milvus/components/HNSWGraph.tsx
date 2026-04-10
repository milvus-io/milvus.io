import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import type { Point } from '../algorithms/metrics';
import type { HNSWGraph as HNSWG, HNSWStep } from '../algorithms/hnsw';

interface Props {
  width: number;
  graph: HNSWG;
  query: Point;
  onQueryChange?: (p: Point) => void;
  steps: HNSWStep[];
  stepIdx: number;
  topK: number[];
}

const LAYER_HEIGHT = 130;
const LAYER_GAP = 18;
const LAYER_LABEL_W = 70;
const PADDING = 12;
const DOMAIN = 260;

type ReplayState = {
  activeLayer: number;
  currentNode: number;
  visited: Set<number>;
  recentEvals: number[];
  recentEvalLayer: number;
  pathByLayer: Map<number, [number, number][]>;
  done: boolean;
  topK: number[];
};

function replay(steps: HNSWStep[], upto: number, numLayers: number, fallbackEntry: number): ReplayState {
  const state: ReplayState = {
    activeLayer: numLayers - 1,
    currentNode: fallbackEntry,
    visited: new Set([fallbackEntry]),
    recentEvals: [],
    recentEvalLayer: -1,
    pathByLayer: new Map(),
    done: false,
    topK: [],
  };
  for (let i = 0; i < Math.min(upto, steps.length); i++) {
    const step = steps[i];
    state.recentEvals = [];
    state.recentEvalLayer = -1;
    switch (step.type) {
      case 'enter':
        state.activeLayer = step.layer;
        state.currentNode = step.current;
        state.visited.add(step.current);
        break;
      case 'evaluate':
        state.activeLayer = step.layer;
        state.currentNode = step.current;
        step.neighbors.forEach((n) => state.visited.add(n));
        state.recentEvals = step.neighbors;
        state.recentEvalLayer = step.layer;
        break;
      case 'move': {
        state.activeLayer = step.layer;
        const arr = state.pathByLayer.get(step.layer) ?? [];
        arr.push([step.from, step.to]);
        state.pathByLayer.set(step.layer, arr);
        state.currentNode = step.to;
        break;
      }
      case 'drop':
        state.activeLayer = step.layer;
        state.currentNode = step.current;
        break;
      case 'done':
        state.done = true;
        state.topK = step.topK;
        state.activeLayer = step.layer;
        state.currentNode = step.current;
        break;
    }
  }
  return state;
}

export default function HNSWGraph({
  width,
  graph,
  query,
  onQueryChange,
  steps,
  stepIdx,
  topK,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);

  const numLayers = graph.numLayers;
  const totalHeight = numLayers * LAYER_HEIGHT + (numLayers - 1) * LAYER_GAP + PADDING * 2;
  const panelLeft = LAYER_LABEL_W + PADDING;
  const panelRight = width - PADDING;
  const panelWidth = panelRight - panelLeft;

  const xScale = useCallback(
    () =>
      d3
        .scaleLinear()
        .domain([-DOMAIN, DOMAIN])
        .range([panelLeft + 12, panelRight - 12]),
    [panelLeft, panelRight],
  );

  const yForLayer = useCallback(
    (layer: number, dataY: number) => {
      const layerIdxFromTop = numLayers - 1 - layer;
      const top = PADDING + layerIdxFromTop * (LAYER_HEIGHT + LAYER_GAP);
      const inner = d3
        .scaleLinear()
        .domain([-DOMAIN, DOMAIN])
        .range([top + LAYER_HEIGHT - 14, top + 14]);
      return inner(dataY);
    },
    [numLayers],
  );

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = xScale();
    const state = replay(steps, stepIdx, numLayers, graph.entryPoint);
    const finalTopK = state.done ? state.topK : topK;

    // Background — light
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', totalHeight)
      .attr('fill', '#f8fafc')
      .attr('rx', 12);

    for (let layer = numLayers - 1; layer >= 0; layer--) {
      const layerIdxFromTop = numLayers - 1 - layer;
      const top = PADDING + layerIdxFromTop * (LAYER_HEIGHT + LAYER_GAP);
      const isActive = layer === state.activeLayer;

      // Panel bg
      svg
        .append('rect')
        .attr('x', panelLeft)
        .attr('y', top)
        .attr('width', panelWidth)
        .attr('height', LAYER_HEIGHT)
        .attr('fill', isActive ? '#f0f9ff' : '#ffffff')
        .attr('stroke', isActive ? '#00a1ea' : '#e9e9ed')
        .attr('stroke-width', isActive ? 1.5 : 1)
        .attr('rx', 8);

      // Layer label
      svg
        .append('text')
        .attr('x', PADDING)
        .attr('y', top + LAYER_HEIGHT / 2 - 6)
        .attr('fill', isActive ? '#00a1ea' : '#667176')
        .attr('font-size', 13)
        .attr('font-weight', 700)
        .text(`Layer ${layer}`);
      const inLayerCount = graph.nodes.filter((n) => n.maxLayer >= layer).length;
      svg
        .append('text')
        .attr('x', PADDING)
        .attr('y', top + LAYER_HEIGHT / 2 + 10)
        .attr('fill', '#94a3b8')
        .attr('font-size', 10)
        .text(`${inLayerCount} nodes`);

      const inLayer = graph.nodes.filter((n) => n.maxLayer >= layer);

      // Edges
      const edgeGroup = svg.append('g');
      const drawn = new Set<string>();
      for (const n of inLayer) {
        for (const nid of n.neighbors[layer] ?? []) {
          const key = n.id < nid ? `${n.id}-${nid}` : `${nid}-${n.id}`;
          if (drawn.has(key)) continue;
          drawn.add(key);
          const other = graph.nodes[nid];
          edgeGroup
            .append('line')
            .attr('x1', x(n.point.x))
            .attr('y1', yForLayer(layer, n.point.y))
            .attr('x2', x(other.point.x))
            .attr('y2', yForLayer(layer, other.point.y))
            .attr('stroke', isActive ? '#94a3b8' : '#d1d5db')
            .attr('stroke-width', isActive ? 1 : 0.6)
            .attr('opacity', isActive ? 0.7 : 0.4);
        }
      }

      // Search path trail
      const pathEdges = state.pathByLayer.get(layer) ?? [];
      pathEdges.forEach(([from, to]) => {
        const a = graph.nodes[from];
        const b = graph.nodes[to];
        svg
          .append('line')
          .attr('x1', x(a.point.x))
          .attr('y1', yForLayer(layer, a.point.y))
          .attr('x2', x(b.point.x))
          .attr('y2', yForLayer(layer, b.point.y))
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 2.5)
          .attr('opacity', 0.85);
      });

      // Recent eval beams
      if (isActive && state.recentEvalLayer === layer && state.recentEvals.length > 0) {
        const cur = graph.nodes[state.currentNode];
        for (const nid of state.recentEvals) {
          const nb = graph.nodes[nid];
          svg
            .append('line')
            .attr('x1', x(cur.point.x))
            .attr('y1', yForLayer(layer, cur.point.y))
            .attr('x2', x(nb.point.x))
            .attr('y2', yForLayer(layer, nb.point.y))
            .attr('stroke', '#00a1ea')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.9)
            .attr('stroke-dasharray', '4,2');
        }
      }

      // Nodes
      for (const n of inLayer) {
        const isVisited = state.visited.has(n.id);
        const isCurrent = isActive && state.currentNode === n.id;
        const isTop = state.done && finalTopK.includes(n.id) && layer === 0;
        const isRecent =
          isActive && state.recentEvalLayer === layer && state.recentEvals.includes(n.id);

        let fill = '#cbd5e1';
        let opacity = 0.5;
        let r = 4;
        if (isVisited) {
          fill = '#00a1ea';
          opacity = 0.85;
        }
        if (isRecent) {
          fill = '#4fc4f9';
          opacity = 1;
          r = 5;
        }
        if (isTop) {
          fill = '#16a34a';
          opacity = 1;
          r = 6;
        }
        if (isCurrent) {
          fill = '#00a1ea';
          opacity = 1;
          r = 7;
        }

        svg
          .append('circle')
          .attr('cx', x(n.point.x))
          .attr('cy', yForLayer(layer, n.point.y))
          .attr('r', r)
          .attr('fill', fill)
          .attr('opacity', opacity)
          .attr('stroke', isCurrent || isTop ? '#191919' : 'none')
          .attr('stroke-width', isCurrent || isTop ? 1.5 : 0);

        if (isCurrent) {
          svg
            .append('circle')
            .attr('cx', x(n.point.x))
            .attr('cy', yForLayer(layer, n.point.y))
            .attr('r', 11)
            .attr('fill', 'none')
            .attr('stroke', '#00a1ea')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.5);
        }
      }

      // Query point overlay
      svg
        .append('circle')
        .attr('cx', x(query.x))
        .attr('cy', yForLayer(layer, query.y))
        .attr('r', isActive && layer === 0 ? 8 : 5)
        .attr('fill', '#00a1ea')
        .attr('opacity', isActive ? 0.9 : 0.35)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .style('cursor', layer === 0 && onQueryChange ? 'grab' : 'default')
        .style('filter', isActive ? 'drop-shadow(0 0 5px rgba(0,161,234,0.4))' : 'none');
    }
  }, [
    graph,
    query,
    steps,
    stepIdx,
    topK,
    width,
    totalHeight,
    numLayers,
    panelLeft,
    panelWidth,
    xScale,
    yForLayer,
    onQueryChange,
  ]);

  // Drag query point on layer 0
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !onQueryChange) return;

    const x = xScale();
    const layer0Top = PADDING + (numLayers - 1) * (LAYER_HEIGHT + LAYER_GAP);
    const layer0Inner = d3
      .scaleLinear()
      .domain([-DOMAIN, DOMAIN])
      .range([layer0Top + LAYER_HEIGHT - 14, layer0Top + 14]);

    function toData(e: MouseEvent | TouchEvent) {
      const rect = svg!.getBoundingClientRect();
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: x.invert(cx - rect.left),
        y: layer0Inner.invert(cy - rect.top),
      };
    }

    function start(e: MouseEvent | TouchEvent) {
      const p = toData(e);
      const dx = p.x - query.x;
      const dy = p.y - query.y;
      const rect = svg!.getBoundingClientRect();
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const localY = cy - rect.top;
      if (localY >= layer0Top && localY <= layer0Top + LAYER_HEIGHT && dx * dx + dy * dy < 1500) {
        draggingRef.current = true;
        e.preventDefault();
      }
    }
    function move(e: MouseEvent | TouchEvent) {
      if (!draggingRef.current) return;
      e.preventDefault();
      const p = toData(e);
      const clamp = (v: number) => Math.max(-240, Math.min(240, v));
      onQueryChange!({ x: clamp(p.x), y: clamp(p.y) });
    }
    function end() {
      draggingRef.current = false;
    }

    svg.addEventListener('mousedown', start);
    svg.addEventListener('mousemove', move);
    svg.addEventListener('mouseup', end);
    svg.addEventListener('mouseleave', end);
    svg.addEventListener('touchstart', start, { passive: false });
    svg.addEventListener('touchmove', move, { passive: false });
    svg.addEventListener('touchend', end);
    return () => {
      svg.removeEventListener('mousedown', start);
      svg.removeEventListener('mousemove', move);
      svg.removeEventListener('mouseup', end);
      svg.removeEventListener('mouseleave', end);
      svg.removeEventListener('touchstart', start);
      svg.removeEventListener('touchmove', move);
      svg.removeEventListener('touchend', end);
    };
  }, [query, onQueryChange, xScale, numLayers]);

  return <svg ref={svgRef} width={width} height={totalHeight} />;
}
