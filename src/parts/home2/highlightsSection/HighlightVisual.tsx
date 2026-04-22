import * as React from 'react';

/*
 * Decorative SVG visuals for the Highlights cards.
 *
 * Style cues borrowed from the Zilliz Web 2026 reference (node 595-1650):
 * 150x150 area, 1.5px hairline strokes, monochrome ink with a single
 * Milvus-blue accent element per card so the eye has somewhere to land.
 */

type Id =
  | 'lake'
  | 'multivector'
  | 'hardware'
  | 'tiering'
  | 'streaming'
  | 'enterprise';

const INK = 'var(--m-ink)';
const INK_2 = 'var(--m-ink-2)';
const MUTED = 'var(--m-ink-muted)';
const LINE = 'var(--m-line)';
const ACCENT = 'var(--m-accent)';

function LakeVisual() {
  // DB row on top, three lake layers below — implies "serving + analytics
  // on the same Parquet". Top slab is accent (the live, queried tier).
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden>
      <rect x="10" y="34" width="130" height="14" rx="2" fill={ACCENT} />
      <text x="14" y="44" fontFamily="var(--m-font-mono)" fontSize="8" fill="#ffffff" letterSpacing="0.12em">
        DB
      </text>
      <rect x="10" y="60" width="130" height="10" rx="2" fill={INK} />
      <rect x="10" y="74" width="120" height="10" rx="2" fill={INK_2} opacity="0.85" />
      <rect x="10" y="88" width="108" height="10" rx="2" fill={MUTED} opacity="0.7" />
      <rect x="10" y="102" width="92" height="10" rx="2" fill={MUTED} opacity="0.4" />
      <text x="118" y="118" fontFamily="var(--m-font-mono)" fontSize="8" fill={INK_2} letterSpacing="0.1em" textAnchor="end">
        PARQUET
      </text>
    </svg>
  );
}

function MultiVectorVisual() {
  // Three rows showing different vector "shapes" coexisting in one collection:
  // dense (filled dots), sparse (varying-height bars), patches (small squares).
  const denseDots = Array.from({ length: 14 }, (_, i) => 14 + i * 9);
  const sparseHeights = [4, 7, 3, 8, 5, 9, 4, 6, 3, 7, 5, 4, 8, 3];
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden>
      <text x="10" y="32" fontFamily="var(--m-font-mono)" fontSize="8" fill={INK_2} letterSpacing="0.1em">
        DENSE
      </text>
      {denseDots.map(x => (
        <circle key={`d${x}`} cx={x} cy="44" r="2" fill={ACCENT} />
      ))}
      <text x="10" y="68" fontFamily="var(--m-font-mono)" fontSize="8" fill={INK_2} letterSpacing="0.1em">
        SPARSE
      </text>
      {sparseHeights.map((h, i) => (
        <rect
          key={`s${i}`}
          x={12 + i * 9}
          y={86 - h}
          width="4"
          height={h}
          fill={INK}
        />
      ))}
      <text x="10" y="108" fontFamily="var(--m-font-mono)" fontSize="8" fill={INK_2} letterSpacing="0.1em">
        PATCHES
      </text>
      {Array.from({ length: 14 }, (_, i) => (
        <rect
          key={`p${i}`}
          x={12 + i * 9}
          y="118"
          width="6"
          height="6"
          rx="1"
          fill="none"
          stroke={INK}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function HardwareVisual() {
  // Stylized GPU chip: outer package, inner die with a 4x4 grid of cores.
  // A diagonal of cores lights up in accent color for a sense of compute.
  const cores: { row: number; col: number }[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) cores.push({ row: r, col: c });
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden>
      {/* package pins */}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`pt${i}`} x={32 + i * 14} y="22" width="4" height="6" fill={INK_2} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`pb${i}`} x={32 + i * 14} y="122" width="4" height="6" fill={INK_2} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`pl${i}`} x="22" y={32 + i * 14} width="6" height="4" fill={INK_2} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`pr${i}`} x="122" y={32 + i * 14} width="6" height="4" fill={INK_2} />
      ))}
      {/* package */}
      <rect x="28" y="28" width="94" height="94" rx="4" stroke={INK} strokeWidth="1.5" />
      {/* die */}
      <rect x="44" y="44" width="62" height="62" rx="2" stroke={INK} strokeWidth="1" />
      {cores.map(({ row, col }) => {
        const x = 48 + col * 14;
        const y = 48 + row * 14;
        const lit = row + col === 3 || (row === 1 && col === 1);
        return (
          <rect
            key={`c${row}${col}`}
            x={x}
            y={y}
            width="10"
            height="10"
            rx="1"
            fill={lit ? ACCENT : INK_2}
            opacity={lit ? 1 : 0.35}
          />
        );
      })}
      <text x="75" y="142" fontFamily="var(--m-font-mono)" fontSize="8" fill={INK_2} textAnchor="middle" letterSpacing="0.18em">
        CAGRA · GPU
      </text>
    </svg>
  );
}

function TieringVisual() {
  // Three nested layers — top (HOT, accent), middle (WARM), bottom (COLD).
  // Reads as a tier diagram without literally drawing a pyramid.
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden>
      <rect x="44" y="30" width="62" height="20" rx="2" fill={ACCENT} />
      <text x="75" y="44" fontFamily="var(--m-font-mono)" fontSize="9" fill="#ffffff" textAnchor="middle" letterSpacing="0.14em">
        HOT · SSD
      </text>
      <rect x="28" y="58" width="94" height="20" rx="2" fill={INK} />
      <text x="75" y="72" fontFamily="var(--m-font-mono)" fontSize="9" fill="#ffffff" textAnchor="middle" letterSpacing="0.14em">
        WARM · S3
      </text>
      <rect x="12" y="86" width="126" height="20" rx="2" fill="none" stroke={INK_2} strokeWidth="1.5" />
      <text x="75" y="100" fontFamily="var(--m-font-mono)" fontSize="9" fill={INK_2} textAnchor="middle" letterSpacing="0.14em">
        COLD · GLACIER
      </text>
      <text x="75" y="124" fontFamily="var(--m-font-mono)" fontSize="8" fill={MUTED} textAnchor="middle" letterSpacing="0.18em">
        SAME .search()
      </text>
    </svg>
  );
}

function StreamingVisual() {
  // A waveform with insert ticks above and a "ms" marker — implies writes
  // landing in milliseconds. Wave is one continuous accent path.
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden>
      {/* insert ticks */}
      {[24, 48, 78, 108, 132].map((x, i) => (
        <g key={`t${i}`}>
          <line x1={x} y1="32" x2={x} y2="44" stroke={INK} strokeWidth="1.5" />
          <polygon points={`${x - 3},44 ${x + 3},44 ${x},48`} fill={INK} />
        </g>
      ))}
      <text x="10" y="30" fontFamily="var(--m-font-mono)" fontSize="8" fill={INK_2} letterSpacing="0.12em">
        INSERTS
      </text>
      {/* main wave */}
      <path
        d="M10 88 L34 88 L40 64 L52 88 L78 88 L84 100 L96 88 L122 88 L128 76 L140 88"
        stroke={ACCENT}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* baseline */}
      <line x1="10" y1="108" x2="140" y2="108" stroke={LINE} strokeWidth="1" />
      <text x="10" y="124" fontFamily="var(--m-font-mono)" fontSize="8" fill={INK_2} letterSpacing="0.12em">
        QUERYABLE
      </text>
      <text x="140" y="124" fontFamily="var(--m-font-mono)" fontSize="8" fill={ACCENT} textAnchor="end" letterSpacing="0.12em" fontWeight="600">
        ~5 MS
      </text>
    </svg>
  );
}

function EnterpriseVisual() {
  // Four security primitives as chips, mirroring the Zilliz "chip group"
  // pattern (vec.knn / where geo / rerank / filter).
  const chips = [
    { x: 8, y: 30, w: 56, label: 'TLS' },
    { x: 70, y: 30, w: 72, label: 'RBAC' },
    { x: 8, y: 64, w: 72, label: 'OIDC SSO' },
    { x: 86, y: 64, w: 56, label: 'AUDIT' },
    { x: 8, y: 98, w: 134, label: 'BYOC · ANY CLOUD' },
  ];
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden>
      {chips.map((c, i) => {
        const accent = i === 4;
        return (
          <g key={c.label}>
            <rect
              x={c.x}
              y={c.y}
              width={c.w}
              height="22"
              rx="4"
              fill={accent ? ACCENT : 'none'}
              stroke={accent ? ACCENT : INK}
              strokeWidth="1"
            />
            <text
              x={c.x + c.w / 2}
              y={c.y + 15}
              fontFamily="var(--m-font-mono)"
              fontSize="9"
              fill={accent ? '#ffffff' : INK}
              textAnchor="middle"
              letterSpacing="0.14em"
              fontWeight="600"
            >
              {c.label}
            </text>
          </g>
        );
      })}
      <text x="75" y="138" fontFamily="var(--m-font-mono)" fontSize="8" fill={MUTED} textAnchor="middle" letterSpacing="0.18em">
        SECURE BY DEFAULT
      </text>
    </svg>
  );
}

const VISUALS: Record<Id, () => React.ReactElement> = {
  lake: LakeVisual,
  multivector: MultiVectorVisual,
  hardware: HardwareVisual,
  tiering: TieringVisual,
  streaming: StreamingVisual,
  enterprise: EnterpriseVisual,
};

export default function HighlightVisual({ id }: { id: Id }) {
  const V = VISUALS[id];
  return <V />;
}
