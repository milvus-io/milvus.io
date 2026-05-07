import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { IndexInfo, Scale } from '../data/indexBenchmarks';

interface Props {
  width: number;
  height: number;
  indexes: IndexInfo[];
  scale: Scale;
  highlight: string | null;
  onHighlight: (id: string | null) => void;
}

const M = { top: 30, right: 30, bottom: 56, left: 60 };

export default function TradeoffChart({
  width,
  height,
  indexes,
  scale,
  highlight,
  onHighlight,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerW = width - M.left - M.right;
    const innerH = height - M.top - M.bottom;

    // Background — light
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc')
      .attr('rx', 12);

    const data = indexes.map((idx) => ({
      ...idx,
      qps: idx.perScale[scale].qps,
      recall: idx.perScale[scale].recall,
      memoryMB: idx.perScale[scale].memoryMB,
    }));

    const minQps = Math.max(0.1, d3.min(data, (d) => d.qps)!);
    const maxQps = d3.max(data, (d) => d.qps)!;

    const x = d3
      .scaleLog()
      .domain([minQps * 0.5, maxQps * 1.5])
      .range([M.left, M.left + innerW]);

    const y = d3
      .scaleLinear()
      .domain([0.7, 1.02])
      .range([M.top + innerH, M.top]);

    const maxMem = d3.max(data, (d) => d.memoryMB)!;
    const minMem = d3.min(data, (d) => d.memoryMB)!;
    const r = d3
      .scaleSqrt()
      .domain([minMem, maxMem])
      .range([22, 10]);

    // Grid lines
    const recallTicks = [0.7, 0.8, 0.9, 1.0];
    recallTicks.forEach((t) => {
      svg
        .append('line')
        .attr('x1', M.left)
        .attr('y1', y(t))
        .attr('x2', M.left + innerW)
        .attr('y2', y(t))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', t === 1.0 ? '0' : '3,4');
      svg
        .append('text')
        .attr('x', M.left - 8)
        .attr('y', y(t) + 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#667176')
        .attr('font-size', 10)
        .text(`${(t * 100).toFixed(0)}%`);
    });

    const logTicks = x.ticks(6);
    logTicks.forEach((t) => {
      svg
        .append('line')
        .attr('x1', x(t))
        .attr('y1', M.top)
        .attr('x2', x(t))
        .attr('y2', M.top + innerH)
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,4');
      svg
        .append('text')
        .attr('x', x(t))
        .attr('y', M.top + innerH + 16)
        .attr('text-anchor', 'middle')
        .attr('fill', '#667176')
        .attr('font-size', 10)
        .text(formatQps(t));
    });

    // Axis labels
    svg
      .append('text')
      .attr('x', M.left + innerW / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4c5a67')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .text('Search throughput (queries/sec, log scale) \u2192');

    svg
      .append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -(M.top + innerH / 2))
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4c5a67')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .text('Recall@10 \u2192');

    // "Better" indicator
    svg
      .append('text')
      .attr('x', M.left + innerW - 6)
      .attr('y', M.top + 16)
      .attr('text-anchor', 'end')
      .attr('fill', '#16a34a')
      .attr('font-size', 10)
      .attr('font-weight', 600)
      .text('\u2197 better');

    // Bubbles
    const sortedData = [...data].sort((a, b) => r(b.memoryMB) - r(a.memoryMB));
    sortedData.forEach((d) => {
      const isHighlighted = highlight === d.id;
      const isFaded = highlight !== null && !isHighlighted;
      const cx = x(d.qps);
      const cy = y(d.recall);
      const radius = r(d.memoryMB);

      svg
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', radius)
        .attr('fill', d.color)
        .attr('opacity', isFaded ? 0.18 : 0.4)
        .attr('stroke', d.color)
        .attr('stroke-width', isHighlighted ? 2.5 : 1.5)
        .style('cursor', 'pointer')
        .on('mouseenter', () => onHighlight(d.id))
        .on('mouseleave', () => onHighlight(null));

      svg
        .append('text')
        .attr('x', cx)
        .attr('y', cy + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', isFaded ? '#94a3b8' : '#191919')
        .attr('font-size', 11)
        .attr('font-weight', 700)
        .attr('pointer-events', 'none')
        .text(d.name);
    });
  }, [width, height, indexes, scale, highlight, onHighlight]);

  return <svg ref={svgRef} width={width} height={height} />;
}

function formatQps(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
  if (v >= 1) return `${v.toFixed(0)}`;
  return v.toFixed(1);
}
