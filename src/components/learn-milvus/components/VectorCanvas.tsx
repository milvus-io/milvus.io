import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import {
  computeMetric,
  magnitude,
  angle,
} from '../algorithms/metrics';
import type { Point, MetricType } from '../algorithms/metrics';

interface Props {
  width: number;
  height: number;
  points: Point[];
  query: Point;
  onQueryChange: (p: Point) => void;
  metric: MetricType;
  topKIndices: number[];
  colors: string[];
  topK?: number;
}

const MARGIN = 40;

export default function VectorCanvas({
  width,
  height,
  points,
  query,
  onQueryChange,
  metric,
  topKIndices,
  colors,
  topK = 5,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);

  const xScale = useCallback(
    () =>
      d3
        .scaleLinear()
        .domain([-250, 250])
        .range([MARGIN, width - MARGIN]),
    [width],
  );

  const yScale = useCallback(
    () =>
      d3
        .scaleLinear()
        .domain([-250, 250])
        .range([height - MARGIN, MARGIN]),
    [height],
  );

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = xScale();
    const y = yScale();
    const topSet = new Set(topKIndices.slice(0, topK));

    // Background — light
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc')
      .attr('rx', 12);

    // Grid lines
    const gridGroup = svg.append('g').attr('class', 'grid');
    for (let v = -200; v <= 200; v += 100) {
      gridGroup
        .append('line')
        .attr('x1', x(v))
        .attr('y1', y(-250))
        .attr('x2', x(v))
        .attr('y2', y(250))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);
      gridGroup
        .append('line')
        .attr('x1', x(-250))
        .attr('y1', y(v))
        .attr('x2', x(250))
        .attr('y2', y(v))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);
    }

    // Axes
    svg
      .append('line')
      .attr('x1', x(-250))
      .attr('y1', y(0))
      .attr('x2', x(250))
      .attr('y2', y(0))
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1.5);
    svg
      .append('line')
      .attr('x1', x(0))
      .attr('y1', y(-250))
      .attr('x2', x(0))
      .attr('y2', y(250))
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1.5);

    // Metric-specific overlay
    const overlayGroup = svg.append('g').attr('class', 'overlay');
    drawMetricOverlay(overlayGroup, query, metric, x, y);

    // Connection lines from query to top-K
    const linesGroup = svg.append('g').attr('class', 'connections');
    topKIndices.slice(0, topK).forEach((idx, rank) => {
      const p = points[idx];
      const opacity = 1 - rank * 0.15;

      if (metric === 'L2') {
        linesGroup
          .append('line')
          .attr('x1', x(query.x))
          .attr('y1', y(query.y))
          .attr('x2', x(p.x))
          .attr('y2', y(p.y))
          .attr('stroke', colors[idx])
          .attr('stroke-width', 2)
          .attr('stroke-opacity', opacity)
          .attr('stroke-dasharray', '6,3');
      } else if (metric === 'COSINE') {
        const qAngle = angle(query);
        const pAngle = angle(p);
        const radius = 50 + rank * 15;
        const arc = d3.arc()({
          innerRadius: radius - 1,
          outerRadius: radius + 1,
          startAngle: Math.PI / 2 - qAngle,
          endAngle: Math.PI / 2 - pAngle,
        });
        if (arc) {
          linesGroup
            .append('path')
            .attr('d', arc)
            .attr('transform', `translate(${x(0)},${y(0)})`)
            .attr('fill', colors[idx])
            .attr('opacity', opacity * 0.6);
        }
        linesGroup
          .append('line')
          .attr('x1', x(0))
          .attr('y1', y(0))
          .attr('x2', x(p.x))
          .attr('y2', y(p.y))
          .attr('stroke', colors[idx])
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', opacity * 0.5)
          .attr('stroke-dasharray', '4,4');
      } else {
        const qMag = magnitude(query);
        if (qMag > 0) {
          const projScalar = computeMetric(query, p, 'IP') / (qMag * qMag);
          const projX = query.x * projScalar;
          const projY = query.y * projScalar;
          linesGroup
            .append('line')
            .attr('x1', x(p.x))
            .attr('y1', y(p.y))
            .attr('x2', x(projX))
            .attr('y2', y(projY))
            .attr('stroke', colors[idx])
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', opacity * 0.5)
            .attr('stroke-dasharray', '3,3');
          linesGroup
            .append('circle')
            .attr('cx', x(projX))
            .attr('cy', y(projY))
            .attr('r', 3)
            .attr('fill', colors[idx])
            .attr('opacity', opacity);
        }
      }
    });

    // Data points
    points.forEach((p, i) => {
      const isTop = topSet.has(i);
      svg
        .append('circle')
        .attr('cx', x(p.x))
        .attr('cy', y(p.y))
        .attr('r', isTop ? 7 : 5)
        .attr('fill', colors[i])
        .attr('opacity', isTop ? 1 : 0.5)
        .attr('stroke', isTop ? '#191919' : 'none')
        .attr('stroke-width', isTop ? 2 : 0);

      if (isTop) {
        svg
          .append('text')
          .attr('x', x(p.x))
          .attr('y', y(p.y) - 12)
          .attr('text-anchor', 'middle')
          .attr('fill', '#191919')
          .attr('font-size', 10)
          .attr('font-weight', 600)
          .text(`P${i}`);
      }
    });

    // Query point
    const queryGroup = svg.append('g').attr('class', 'query-point');
    queryGroup
      .append('circle')
      .attr('cx', x(query.x))
      .attr('cy', y(query.y))
      .attr('r', 12)
      .attr('fill', '#00a1ea')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('cursor', 'grab')
      .style('filter', 'drop-shadow(0 0 8px rgba(0,161,234,0.4))');

    queryGroup
      .append('text')
      .attr('x', x(query.x))
      .attr('y', y(query.y) - 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#00a1ea')
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .text('Query');

    if (metric === 'COSINE' || metric === 'IP') {
      const qMag = magnitude(query);
      if (qMag > 0) {
        const extend = 300 / qMag;
        svg
          .append('line')
          .attr('x1', x(0))
          .attr('y1', y(0))
          .attr('x2', x(query.x * extend))
          .attr('y2', y(query.y * extend))
          .attr('stroke', '#00a1ea')
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.3)
          .attr('stroke-dasharray', '8,4');
      }
    }
  }, [points, query, metric, topKIndices, colors, topK, width, height, xScale, yScale]);

  // Drag handling
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const x = xScale();
    const y = yScale();

    function toDataCoords(e: MouseEvent | TouchEvent) {
      const rect = svg!.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: x.invert(clientX - rect.left),
        y: y.invert(clientY - rect.top),
      };
    }

    function onStart(e: MouseEvent | TouchEvent) {
      const p = toDataCoords(e);
      const dx = p.x - query.x;
      const dy = p.y - query.y;
      if (dx * dx + dy * dy < 900) {
        draggingRef.current = true;
        e.preventDefault();
      }
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!draggingRef.current) return;
      e.preventDefault();
      const p = toDataCoords(e);
      const clamp = (v: number) => Math.max(-240, Math.min(240, v));
      onQueryChange({ x: clamp(p.x), y: clamp(p.y) });
    }

    function onEnd() {
      draggingRef.current = false;
    }

    svg.addEventListener('mousedown', onStart);
    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseup', onEnd);
    svg.addEventListener('mouseleave', onEnd);
    svg.addEventListener('touchstart', onStart, { passive: false });
    svg.addEventListener('touchmove', onMove, { passive: false });
    svg.addEventListener('touchend', onEnd);

    return () => {
      svg.removeEventListener('mousedown', onStart);
      svg.removeEventListener('mousemove', onMove);
      svg.removeEventListener('mouseup', onEnd);
      svg.removeEventListener('mouseleave', onEnd);
      svg.removeEventListener('touchstart', onStart);
      svg.removeEventListener('touchmove', onMove);
      svg.removeEventListener('touchend', onEnd);
    };
  }, [query, onQueryChange, xScale, yScale]);

  return <svg ref={svgRef} width={width} height={height} />;
}

function drawMetricOverlay(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  query: Point,
  metric: MetricType,
  x: d3.ScaleLinear<number, number>,
  y: d3.ScaleLinear<number, number>,
) {
  if (metric === 'L2') {
    [60, 120, 180].forEach((r) => {
      const pixelR = x(r) - x(0);
      group
        .append('circle')
        .attr('cx', x(query.x))
        .attr('cy', y(query.y))
        .attr('r', Math.abs(pixelR))
        .attr('fill', 'none')
        .attr('stroke', '#00a1ea')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.2)
        .attr('stroke-dasharray', '4,6');
    });
  } else if (metric === 'COSINE') {
    group
      .append('circle')
      .attr('cx', x(0))
      .attr('cy', y(0))
      .attr('r', 4)
      .attr('fill', '#00a1ea')
      .attr('opacity', 0.6);
    group
      .append('text')
      .attr('x', x(0) + 8)
      .attr('y', y(0) - 8)
      .attr('fill', '#00a1ea')
      .attr('font-size', 10)
      .attr('opacity', 0.6)
      .text('Origin');
  } else {
    const qMag = magnitude(query);
    if (qMag > 0) {
      const norm = { x: query.x / qMag, y: query.y / qMag };
      const perp = { x: -norm.y, y: norm.x };
      [0.3, 0.6, 0.9].forEach((frac) => {
        const cx = norm.x * frac * 200;
        const cy = norm.y * frac * 200;
        group
          .append('line')
          .attr('x1', x(cx - perp.x * 300))
          .attr('y1', y(cy - perp.y * 300))
          .attr('x2', x(cx + perp.x * 300))
          .attr('y2', y(cy + perp.y * 300))
          .attr('stroke', '#00a1ea')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.15)
          .attr('stroke-dasharray', '4,6');
      });
    }
  }
}
