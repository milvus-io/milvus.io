import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import type { Point } from '../algorithms/metrics';
import type { Cluster } from '../algorithms/ivf';

export type FlatProgress = {
  mode: 'flat';
  scanOrder: number[];
  scanned: number;
  topK: number[];
  done: boolean;
};

export type IvfProgress = {
  mode: 'ivf';
  clusters: Cluster[];
  centroidEvalOrder: number[];
  centroidsEvaluated: number;
  selectedClusters: number[];
  scannedPoints: number[];
  pointsScanned: number;
  topK: number[];
  done: boolean;
};

export type Progress = FlatProgress | IvfProgress;

interface Props {
  width: number;
  height: number;
  points: Point[];
  query: Point;
  onQueryChange?: (p: Point) => void;
  progress: Progress;
  clusterColors?: string[];
}

const MARGIN = 30;
const DOMAIN = 260;

export default function IndexCanvas({
  width,
  height,
  points,
  query,
  onQueryChange,
  progress,
  clusterColors = [],
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);

  const xScale = useCallback(
    () =>
      d3
        .scaleLinear()
        .domain([-DOMAIN, DOMAIN])
        .range([MARGIN, width - MARGIN]),
    [width],
  );
  const yScale = useCallback(
    () =>
      d3
        .scaleLinear()
        .domain([-DOMAIN, DOMAIN])
        .range([height - MARGIN, MARGIN]),
    [height],
  );

  const pointCluster: number[] = (() => {
    if (progress.mode !== 'ivf') return [];
    const arr = new Array(points.length).fill(-1);
    progress.clusters.forEach((c, ci) => {
      c.pointIndices.forEach((pi) => {
        arr[pi] = ci;
      });
    });
    return arr;
  })();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = xScale();
    const y = yScale();

    // Background — light
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc')
      .attr('rx', 12);

    // Grid
    const grid = svg.append('g');
    for (let v = -200; v <= 200; v += 100) {
      grid
        .append('line')
        .attr('x1', x(v))
        .attr('y1', y(-DOMAIN))
        .attr('x2', x(v))
        .attr('y2', y(DOMAIN))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);
      grid
        .append('line')
        .attr('x1', x(-DOMAIN))
        .attr('y1', y(v))
        .attr('x2', x(DOMAIN))
        .attr('y2', y(v))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);
    }

    const topSet = new Set(progress.topK);
    const scannedSet = new Set<number>();

    if (progress.mode === 'flat') {
      for (let i = 0; i < progress.scanned; i++) {
        scannedSet.add(progress.scanOrder[i]);
      }

      if (!progress.done && progress.scanned > 0 && progress.scanned <= progress.scanOrder.length) {
        const currentIdx = progress.scanOrder[progress.scanned - 1];
        const cur = points[currentIdx];
        svg
          .append('line')
          .attr('x1', x(query.x))
          .attr('y1', y(query.y))
          .attr('x2', x(cur.x))
          .attr('y2', y(cur.y))
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.7);
      }

      points.forEach((p, i) => {
        const isScanned = scannedSet.has(i);
        const isTop = progress.done && topSet.has(i);
        svg
          .append('circle')
          .attr('cx', x(p.x))
          .attr('cy', y(p.y))
          .attr('r', isTop ? 6 : 4)
          .attr('fill', isTop ? '#16a34a' : isScanned ? '#00a1ea' : '#cbd5e1')
          .attr('opacity', isTop ? 1 : isScanned ? 0.9 : 0.6)
          .attr('stroke', isTop ? '#191919' : 'none')
          .attr('stroke-width', isTop ? 1.5 : 0);
      });
    } else {
      const evaluatedCentroids = new Set<number>();
      for (let i = 0; i < progress.centroidsEvaluated; i++) {
        evaluatedCentroids.add(progress.centroidEvalOrder[i]);
      }
      for (let i = 0; i < progress.pointsScanned; i++) {
        scannedSet.add(progress.scannedPoints[i]);
      }
      const selectedSet = new Set(progress.selectedClusters);

      if (progress.centroidsEvaluated > 0 && progress.pointsScanned === 0) {
        progress.centroidEvalOrder
          .slice(0, progress.centroidsEvaluated)
          .forEach((ci) => {
            const c = progress.clusters[ci].centroid;
            svg
              .append('line')
              .attr('x1', x(query.x))
              .attr('y1', y(query.y))
              .attr('x2', x(c.x))
              .attr('y2', y(c.y))
              .attr('stroke', '#f59e0b')
              .attr('stroke-width', 1.2)
              .attr('stroke-opacity', 0.5)
              .attr('stroke-dasharray', '3,3');
          });
      }

      if (
        !progress.done &&
        progress.pointsScanned > 0 &&
        progress.pointsScanned <= progress.scannedPoints.length
      ) {
        const currentIdx = progress.scannedPoints[progress.pointsScanned - 1];
        const cur = points[currentIdx];
        svg
          .append('line')
          .attr('x1', x(query.x))
          .attr('y1', y(query.y))
          .attr('x2', x(cur.x))
          .attr('y2', y(cur.y))
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.8);
      }

      points.forEach((p, i) => {
        const ci = pointCluster[i];
        const inSelectedCluster = selectedSet.has(ci);
        const isScanned = scannedSet.has(i);
        const isTop = progress.done && topSet.has(i);

        let fill = '#cbd5e1';
        let opacity = 0.35;
        if (inSelectedCluster) {
          fill = clusterColors[ci] ?? '#00a1ea';
          opacity = isScanned ? 0.95 : 0.55;
        } else if (progress.centroidsEvaluated >= progress.clusters.length) {
          fill = clusterColors[ci] ?? '#cbd5e1';
          opacity = 0.25;
        }

        svg
          .append('circle')
          .attr('cx', x(p.x))
          .attr('cy', y(p.y))
          .attr('r', isTop ? 6 : 4)
          .attr('fill', isTop ? '#16a34a' : fill)
          .attr('opacity', isTop ? 1 : opacity)
          .attr('stroke', isTop ? '#191919' : 'none')
          .attr('stroke-width', isTop ? 1.5 : 0);
      });

      progress.clusters.forEach((c, ci) => {
        const evaluated = evaluatedCentroids.has(ci);
        const selected = selectedSet.has(ci);
        const color = clusterColors[ci] ?? '#00a1ea';
        const cx = x(c.centroid.x);
        const cy = y(c.centroid.y);

        const size = selected ? 8 : 6;
        svg
          .append('line')
          .attr('x1', cx - size)
          .attr('y1', cy - size)
          .attr('x2', cx + size)
          .attr('y2', cy + size)
          .attr('stroke', evaluated ? color : '#94a3b8')
          .attr('stroke-width', selected ? 3 : 2);
        svg
          .append('line')
          .attr('x1', cx - size)
          .attr('y1', cy + size)
          .attr('x2', cx + size)
          .attr('y2', cy - size)
          .attr('stroke', evaluated ? color : '#94a3b8')
          .attr('stroke-width', selected ? 3 : 2);

        if (selected) {
          svg
            .append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', 14)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.5);
        }
      });
    }

    // Query point
    svg
      .append('circle')
      .attr('cx', x(query.x))
      .attr('cy', y(query.y))
      .attr('r', 10)
      .attr('fill', '#00a1ea')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5)
      .style('cursor', onQueryChange ? 'grab' : 'default')
      .style('filter', 'drop-shadow(0 0 6px rgba(0,161,234,0.4))');
  }, [
    points,
    query,
    progress,
    width,
    height,
    xScale,
    yScale,
    clusterColors,
    pointCluster,
  ]);

  // Drag handling
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !onQueryChange) return;

    const x = xScale();
    const y = yScale();

    function toData(e: MouseEvent | TouchEvent) {
      const rect = svg!.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: x.invert(clientX - rect.left),
        y: y.invert(clientY - rect.top),
      };
    }

    function start(e: MouseEvent | TouchEvent) {
      const p = toData(e);
      const dx = p.x - query.x;
      const dy = p.y - query.y;
      if (dx * dx + dy * dy < 700) {
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
