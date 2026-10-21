#!/usr/bin/env python3
"""Render original, local SVG schematics from the reviewed illustration ledger.

Run from the repository root. This script never edits article text or hashes.
"""
import json
import textwrap
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / 'content/ai-quick-reference/illustrations-2026-10-21.json'
OUTPUT = ROOT / 'public/images/ai-reference'
INK, PAPER, WARM = '#0F1F2E', '#FAF6EE', '#F4ECDC'
TEAL, CORAL, MUTED = '#1E5F70', '#E85A2B', '#6B6356'


def lines(value, width):
    return textwrap.wrap(value, width=width, break_long_words=False,
                         break_on_hyphens=False)


def text(x, y, value, size=20, color=INK, width=52, weight='400', serif=False):
    family = 'Georgia, serif' if serif else 'Arial, sans-serif'
    spans = ''.join(f'<tspan x="{x}" dy="{0 if i == 0 else size * 1.3:g}">{escape(s)}</tspan>'
                    for i, s in enumerate(lines(value, width)))
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{color}">{spans}</text>')


def render(diagram):
    rows = diagram['rows']
    title_lines = len(lines(diagram['title'], 36))
    top = 110 + (title_lines - 1) * 36
    compare = diagram['kind'] == 'compare'
    heights = []
    for row in rows:
        if compare:
            left_h = len(lines(row[0], 14)) * 29
            right_h = len(lines(row[1], 29)) * 26 + len(lines(row[2], 33)) * 24 + 10
            heights.append(max(left_h, right_h) + 34)
        else:
            heights.append(len(lines(row[0], 41)) * 30 + len(lines(row[1], 49)) * 26 + 30)
    gap = 26 if diagram['kind'] == 'flow' else 12
    bottom = top + sum(heights) + gap * (len(rows) - 1)
    height = bottom + 50 + len(lines(diagram['note'], 59)) * 24
    desc = '. '.join(': '.join(row) for row in rows) + '. ' + diagram['note']
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 {height}" '
           f'width="640" height="{height}" role="img" aria-labelledby="title desc">',
           f'<title id="title">{escape(diagram["title"])}</title>',
           f'<desc id="desc">{escape(desc)}</desc>',
           '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" '
           f'orient="auto"><path d="M1 1 L6 4 L1 7" fill="none" stroke="{TEAL}" stroke-width="1.5"/></marker></defs>',
           f'<rect width="640" height="{height}" fill="{PAPER}"/>',
           text(28, 30, 'MILVUS / AI REFERENCE / SCHEMATIC', 12, MUTED, 70),
           text(28, 72, diagram['title'], 28, INK, 36, '700', True)]
    y = top
    for i, (row, h) in enumerate(zip(rows, heights)):
        svg.append(f'<rect x="28" y="{y}" width="584" height="{h}" fill="{WARM}" '
                   f'stroke="{INK}" stroke-width="1.5"/>')
        if compare:
            svg += [f'<path d="M230 {y} V{y+h}" stroke="{INK}" stroke-width="1.5"/>',
                    text(44, y+32, row[0], 23, TEAL, 14, '700'),
                    text(248, y+31, row[1], 21, INK, 29, '700'),
                    text(248, y+31+len(lines(row[1],29))*26+10, row[2], 19, MUTED, 33)]
        else:
            svg += [f'<rect x="28" y="{y}" width="5" height="{h}" fill="{CORAL if i==len(rows)-1 else TEAL}"/>',
                    text(48, y+31, row[0], 23, INK, 41, '700'),
                    text(48, y+31+len(lines(row[0],41))*30, row[1], 20, MUTED, 49)]
        y += h
        if i < len(rows) - 1 and diagram['kind'] == 'flow':
            svg.append(f'<path d="M320 {y+3} V{y+gap-4}" fill="none" stroke="{TEAL}" '
                       'stroke-width="2" marker-end="url(#arrow)"/>')
        y += gap
    svg += [f'<path d="M28 {bottom+22} H612" stroke="{INK}" stroke-width="1.5"/>',
            text(28, bottom+48, diagram['note'], 18, MUTED, 59), '</svg>']
    return '\n'.join(svg) + '\n'


if __name__ == '__main__':
    diagrams = json.loads(LEDGER.read_text())['diagrams']
    OUTPUT.mkdir(exist_ok=True, parents=True)
    for diagram in diagrams:
        (OUTPUT / (diagram['id'] + '.svg')).write_text(render(diagram))
    print(f'Rendered {len(diagrams)} original SVG schematics.')
