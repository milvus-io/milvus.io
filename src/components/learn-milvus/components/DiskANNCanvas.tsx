import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import type { Point } from '../algorithms/metrics';
import type { DiskANNGraph, DiskANNStep } from '../algorithms/diskann';

interface Props {
  width: number;
  height: number;
  graph: DiskANNGraph;
  query: Point;
  onQueryChange?: (p: Point) => void;
  steps: DiskANNStep[];
  stepIdx: number;
  topK: number[];
}

const PADDING = 16;
const DOMAIN = 260;

type ReplayState = {
  visited: Set<number>;
  current: number;
  recentPq: number[];
  pathEdges: [number, number][];
  pool: number[];
  diskReads: Set<number>;
  recentDisk: number | null;
  done: boolean;
  topK: number[];
};

function replay(steps: DiskANNStep[], upto: number, entry: number): ReplayState {
  const state: ReplayState = {
    visited: new Set([entry]),
    current: entry,
    recentPq: [],
    pathEdges: [],
    pool: [],
    diskReads: new Set(),
    recentDisk: null,
    done: false,
    topK: [],
  };
  for (let i = 0; i < Math.min(upto, steps.length); i++) {
    const s = steps[i];
    state.recentPq = [];
    state.recentDisk = null;
    switch (s.type) {
      case 'enter':
        state.current = s.current;
        state.visited.add(s.current);
        break;
      case 'pq-compare':
        state.recentPq = s.neighbors;
        s.neighbors.forEach((n) => state.visited.add(n));
        state.current = s.current;
        break;
      case 'move':
        state.pathEdges.push([s.from, s.to]);
        state.current = s.to;
        break;
      case 'pool-trim':
        state.pool = s.pool;
        break;
      case 'disk-read':
        state.diskReads.add(s.node);
        state.recentDisk = s.node;
        break;
      case 'done':
        state.done = true;
        state.topK = s.topK;
        break;
    }
  }
  return state;
}

export default function DiskANNCanvas({
  width,
  height,
  graph,
  query,
  onQueryChange,
  steps,
  stepIdx,
  topK,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);

  const xScale = useCallback(
    () =>
      d3
        .scaleLinear()
        .domain([-DOMAIN, DOMAIN])
        .range([PADDING, width - PADDING]),
    [width],
  );
  const yScale = useCallback(
    () =>
      d3
        .scaleLinear()
        .domain([-DOMAIN, DOMAIN])
        .range([height - PADDING, PADDING]),
    [height],
  );

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = xScale();
    const y = yScale();
    const state = replay(steps, stepIdx, graph.entryPoint);
    const finalTopK = state.done ? state.topK : topK;
    const poolSet = new Set(state.pool);
    const topKSet = new Set(finalTopK);

    // Background — light
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc')
      .attr('rx', 12);

    // Grid
    for (let v = -200; v <= 200; v += 100) {
      svg
        .append('line')
        .attr('x1', x(v))
        .attr('y1', y(-DOMAIN))
        .attr('x2', x(v))
        .attr('y2', y(DOMAIN))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);
      svg
        .append('line')
        .attr('x1', x(-DOMAIN))
        .attr('y1', y(v))
        .attr('x2', x(DOMAIN))
        .attr('y2', y(v))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);
    }

    // Edges
    const drawn = new Set<string>();
    for (const n of graph.nodes) {
      for (const nid of n.neighbors) {
        const key = n.id < nid ? `${n.id}-${nid}` : `${nid}-${n.id}`;
        if (drawn.has(key)) continue;
        drawn.add(key);
        const other = graph.nodes[nid];
        svg
          .append('line')
          .attr('x1', x(n.point.x))
          .attr('y1', y(n.point.y))
          .attr('x2', x(other.point.x))
          .attr('y2', y(other.point.y))
          .attr('stroke', '#d1d5db')
          .attr('stroke-width', 0.8)
          .attr('opacity', 0.7);
      }
    }

    // Search path trail
    state.pathEdges.forEach(([from, to]) => {
      const a = graph.nodes[from];
      const b = graph.nodes[to];
      svg
        .append('line')
        .attr('x1', x(a.point.x))
        .attr('y1', y(a.point.y))
        .attr('x2', x(b.point.x))
        .attr('y2', y(b.point.y))
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2.2)
        .attr('opacity', 0.8);
    });

    // Recent PQ-compare beams
    if (state.recentPq.length > 0) {
      const cur = graph.nodes[state.current];
      for (const nid of state.recentPq) {
        const nb = graph.nodes[nid];
        svg
          .append('line')
          .attr('x1', x(cur.point.x))
          .attr('y1', y(cur.point.y))
          .attr('x2', x(nb.point.x))
          .attr('y2', y(nb.point.y))
          .attr('stroke', '#38bdf8')
          .attr('stroke-width', 1.8)
          .attr('opacity', 0.85)
          .attr('stroke-dasharray', '4,2');
      }
    }

    // Nodes
    for (const n of graph.nodes) {
      const isVisited = state.visited.has(n.id);
      const isPool = poolSet.has(n.id);
      const isCurrent = state.current === n.id;
      const isRecentPq = state.recentPq.includes(n.id);
      const isDisk = state.diskReads.has(n.id);
      const isRecentDisk = state.recentDisk === n.id;
      const isTop = state.done && topKSet.has(n.id);

      let fill = '#cbd5e1';
      let opacity = 0.5;
      let r = 4;
      if (isVisited) {
        fill = '#00a1ea';
        opacity = 0.85;
      }
      if (isPool) {
        fill = '#38bdf8';
        opacity = 0.95;
        r = 5;
      }
      if (isRecentPq) {
        fill = '#7dd3fc';
        opacity = 1;
        r = 5;
      }
      if (isDisk) {
        fill = '#dc3545';
        opacity = 1;
        r = 6;
      }
      if (isRecentDisk) {
        fill = '#dc3545';
        r = 8;
      }
      if (isTop) {
        fill = '#16a34a';
        opacity = 1;
        r = 7;
      }
      if (isCurrent && !state.done) {
        fill = '#00a1ea';
        opacity = 1;
        r = 7;
      }

      svg
        .append('circle')
        .attr('cx', x(n.point.x))
        .attr('cy', y(n.point.y))
        .attr('r', r)
        .attr('fill', fill)
        .attr('opacity', opacity)
        .attr('stroke', isCurrent || isTop || isDisk ? '#191919' : 'none')
        .attr('stroke-width', isCurrent || isTop || isDisk ? 1.5 : 0);

      if (isRecentDisk) {
        svg
          .append('circle')
          .attr('cx', x(n.point.x))
          .attr('cy', y(n.point.y))
          .attr('r', 14)
          .attr('fill', 'none')
          .attr('stroke', '#dc3545')
          .attr('stroke-width', 2)
          .attr('opacity', 0.8);
        svg
          .append('text')
          .attr('x', x(n.point.x))
          .attr('y', y(n.point.y) - 16)
          .attr('text-anchor', 'middle')
          .attr('fill', '#dc3545')
          .attr('font-size', 10)
          .attr('font-weight', 700)
          .text('disk read');
      }
    }

    // Query point
    svg
      .append('circle')
      .attr('cx', x(query.x))
      .attr('cy', y(query.y))
      .attr('r', 11)
      .attr('fill', '#00a1ea')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5)
      .style('cursor', onQueryChange ? 'grab' : 'default')
      .style('filter', 'drop-shadow(0 0 6px rgba(0,161,234,0.4))');
  }, [
    graph,
    query,
    steps,
    stepIdx,
    topK,
    width,
    height,
    xScale,
    yScale,
    onQueryChange,
  ]);

  // Drag handler
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !onQueryChange) return;
    const x = xScale();
    const y = yScale();

    function toData(e: MouseEvent | TouchEvent) {
      const rect = svg!.getBoundingClientRect();
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: x.invert(cx - rect.left),
        y: y.invert(cy - rect.top),
      };
    }
    function start(e: MouseEvent | TouchEvent) {
      const p = toData(e);
      const dx = p.x - query.x;
      const dy = p.y - query.y;
      if (dx * dx + dy * dy < 1500) {
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
  }, [query, onQueryChange, xScale, yScale]);

  return <svg ref={svgRef} width={width} height={height} />;
}
