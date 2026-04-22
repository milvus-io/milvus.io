/*
 * Milvus architecture — data-flow diagram.
 *
 * Brutalist hairline schematic with two animated request paths (WRITE and
 * READ) that circulate through the stack. Blue particle glow marks the
 * "live" path; everything else stays black line-art. StreamingNode and
 * Woodpecker components get breathing status LEDs to draw the eye.
 *
 * TODO(i18n): SVG text labels are hardcoded. Externalize into home2.json
 *   when the final diagram ships.
 * TODO(a11y): animations ignored when prefers-reduced-motion is set; SMIL
 *   animations do not honor that MQ natively — add a wrapper later that
 *   swaps to a static path on reduced-motion preference.
 */

const INK = '#0a0a0a';
const ACCENT = '#00b3ff';
const DIM = 'rgba(10, 10, 10, 0.55)';
const HAIRLINE = 'rgba(10, 10, 10, 0.35)';

// Mirror of the WRITE path — used both as a faint dashed guide line and as
// the motion path for the animated request particle.
const WRITE_PATH =
  'M 450 8 L 450 78 L 450 122 L 450 180 L 450 232 L 730 232 L 730 300 L 730 372';

// READ path — fan-out to QueryNode + StreamingNode, merge back up to SDK.
const READ_PATH_A =
  'M 450 8 L 450 78 L 450 122 L 170 232 L 170 300 L 170 232 L 450 122 L 450 78 L 450 8';
const READ_PATH_B =
  'M 450 8 L 450 78 L 450 122 L 730 232 L 730 300 L 730 232 L 450 122 L 450 78 L 450 8';

export default function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 900 500"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      role="img"
      aria-label="Milvus architecture data flow: a write request travels SDK to Proxy to StreamingNode to Woodpecker WAL in object storage; a read request fans out from Proxy to QueryNode and StreamingNode and returns."
    >
      <defs>
        {/* Glow filter for the live particle */}
        <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Reusable motion paths (invisible) */}
        <path id="hero-write-path" d={WRITE_PATH} fill="none" />
        <path id="hero-read-path-a" d={READ_PATH_A} fill="none" />
        <path id="hero-read-path-b" d={READ_PATH_B} fill="none" />

        {/* Arrow marker */}
        <marker
          id="hero-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={INK} />
        </marker>
      </defs>

      {/* ─── SDK anchor (top) ─────────────────────────────────────────── */}
      <g>
        <rect
          x="378"
          y="0"
          width="144"
          height="28"
          fill={INK}
          stroke={INK}
          strokeWidth="1.5"
        />
        <text
          x="450"
          y="18"
          textAnchor="middle"
          fontSize="11"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontWeight={600}
          letterSpacing="0.12em"
          fill="#fafafa"
        >
          MilvusClient SDK
        </text>
      </g>

      {/* ─── Layer 1: Access ──────────────────────────────────────────── */}
      <LayerLabel y={58} index="01" name="ACCESS" />
      <line
        x1="0"
        y1="42"
        x2="900"
        y2="42"
        stroke={HAIRLINE}
        strokeDasharray="4 4"
      />

      <NodeBox x={350} y={72} w={200} h={44} title="Proxy Service" sub="stateless gRPC / HTTP" />

      {/* ─── Layer 2: Coordinator ─────────────────────────────────────── */}
      <LayerLabel y={148} index="02" name="COORDINATOR" />
      <line
        x1="0"
        y1="132"
        x2="900"
        y2="132"
        stroke={HAIRLINE}
        strokeDasharray="4 4"
      />

      <NodeBox
        x={140}
        y={150}
        w={620}
        h={52}
        title="Coordinator (single active)"
        sub="RootCoord · DataCoord · QueryCoord · StreamingCoord"
      />

      {/* ─── Layer 3: Worker ──────────────────────────────────────────── */}
      <LayerLabel y={248} index="03" name="WORKER" />
      <line
        x1="0"
        y1="232"
        x2="900"
        y2="232"
        stroke={HAIRLINE}
        strokeDasharray="4 4"
      />

      <NodeBox
        x={60}
        y={252}
        w={220}
        h={60}
        title="QueryNode"
        sub="vector + scalar search"
      />

      <NodeBox
        x={340}
        y={252}
        w={220}
        h={60}
        title="DataNode"
        sub="flush binlogs"
      />

      <NodeBox
        x={620}
        y={252}
        w={220}
        h={60}
        title="StreamingNode"
        sub="WAL · growing data"
        accent
      />
      {/* Status LED — pulsing dot to indicate "live" component. */}
      <StatusDot cx={830} cy={262} label="" />

      {/* ─── Layer 4: Storage ─────────────────────────────────────────── */}
      <LayerLabel y={384} index="04" name="STORAGE" />
      <line
        x1="0"
        y1="368"
        x2="900"
        y2="368"
        stroke={HAIRLINE}
        strokeDasharray="4 4"
      />

      <NodeBox
        x={60}
        y={388}
        w={440}
        h={64}
        title="Object Storage"
        sub="S3 · GCS · MinIO · Azure · OSS"
      />
      <NodeBox x={520} y={388} w={80} h={64} title="etcd" sub="meta" />
      <NodeBox
        x={620}
        y={388}
        w={220}
        h={64}
        title="Woodpecker"
        sub="WAL · zero-disk"
        accent
      />
      <StatusDot cx={830} cy={398} label="" />

      {/* ─── Path stroke (faint dashed, shows the write route) ────────── */}
      <path
        d={WRITE_PATH}
        fill="none"
        stroke={ACCENT}
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeDasharray="3 5"
      />

      {/* ─── Legend (top-right) ───────────────────────────────────────── */}
      <g transform="translate(680, 6)">
        <circle cx="6" cy="8" r="4" fill={ACCENT} filter="url(#particleGlow)" />
        <text
          x="18"
          y="12"
          fontSize="10"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontWeight={500}
          letterSpacing="0.14em"
          fill={DIM}
        >
          WRITE
        </text>
        <circle cx="80" cy="8" r="3" fill="none" stroke={ACCENT} strokeWidth="1.5" />
        <text
          x="92"
          y="12"
          fontSize="10"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontWeight={500}
          letterSpacing="0.14em"
          fill={DIM}
        >
          READ
        </text>
      </g>

      {/* ─── Animated particle: WRITE path (solid glow, 5s loop) ──────── */}
      <circle r="5" fill={ACCENT} filter="url(#particleGlow)">
        <animateMotion dur="4.8s" repeatCount="indefinite" rotate="auto" begin="0s">
          <mpath href="#hero-write-path" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;1;0"
          keyTimes="0;0.08;0.5;0.92;1"
          dur="4.8s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ─── Animated particle: READ path A (QueryNode fan, ring only) ── */}
      <circle r="4" fill="none" stroke={ACCENT} strokeWidth="1.5">
        <animateMotion dur="5.6s" repeatCount="indefinite" begin="1.2s">
          <mpath href="#hero-read-path-a" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.08;0.92;1"
          dur="5.6s"
          repeatCount="indefinite"
          begin="1.2s"
        />
      </circle>

      {/* ─── Animated particle: READ path B (StreamingNode fan) ───────── */}
      <circle r="4" fill="none" stroke={ACCENT} strokeWidth="1.5">
        <animateMotion dur="5.6s" repeatCount="indefinite" begin="2.4s">
          <mpath href="#hero-read-path-b" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.08;0.92;1"
          dur="5.6s"
          repeatCount="indefinite"
          begin="2.4s"
        />
      </circle>
    </svg>
  );
}

/* ── helpers ────────────────────────────────────────────────────────── */

function LayerLabel({
  y,
  index,
  name,
}: {
  y: number;
  index: string;
  name: string;
}) {
  return (
    <text
      x="20"
      y={y}
      fontSize="10"
      fontFamily="'JetBrains Mono', ui-monospace, monospace"
      fontWeight={600}
      letterSpacing="0.18em"
      fill={DIM}
    >
      <tspan fill={ACCENT}>{index}</tspan>
      <tspan dx="10">/ {name}</tspan>
    </text>
  );
}

function NodeBox({
  x,
  y,
  w,
  h,
  title,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  accent?: boolean;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#fafafa"
        stroke={INK}
        strokeWidth={accent ? 2 : 1.2}
      />
      {/* Brutalist corner tick */}
      {accent && (
        <>
          <path
            d={`M ${x} ${y - 4} L ${x} ${y + 8} M ${x - 4} ${y} L ${x + 8} ${y}`}
            stroke={ACCENT}
            strokeWidth="2"
          />
          <path
            d={`M ${x + w} ${y - 4} L ${x + w} ${y + 8} M ${x + w - 8} ${y} L ${x + w + 4} ${y}`}
            stroke={ACCENT}
            strokeWidth="2"
          />
        </>
      )}
      <text
        x={cx}
        y={y + (sub ? h / 2 - 2 : h / 2 + 4)}
        textAnchor="middle"
        fontSize="12"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontWeight={600}
        fill={INK}
      >
        {title}
      </text>
      {sub && (
        <text
          x={cx}
          y={y + h / 2 + 14}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fill={DIM}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function StatusDot({
  cx,
  cy,
  label,
}: {
  cx: number;
  cy: number;
  label: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="4" fill={ACCENT}>
        <animate
          attributeName="opacity"
          values="1;0.25;1"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x={cx + 8}
        y={cy + 3}
        fontSize="9"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontWeight={600}
        letterSpacing="0.1em"
        fill={ACCENT}
      >
        {label}
      </text>
    </g>
  );
}
