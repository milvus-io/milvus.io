// ⚠️ PLACEHOLDER: final design should produce an animated SVG/Lottie asset
// per spec §5.4. This is a simplified static version for the /index2 preview.
// TODO(i18n): SVG text labels are hardcoded pending the final diagram asset;
// externalize into home2.json when the animated version ships.

export default function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 720 520"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      role="img"
      aria-label="Milvus 2.6 architecture with four layers: Access (Proxy Service), Coordinator, Workers (QueryNode, DataNode, StreamingNode), and Storage (Object Storage, etcd, Woodpecker WAL)"
    >
      {/* Access Layer */}
      <rect x="260" y="20" width="200" height="48" rx="6" fill="#dbeafe" stroke="#1d4ed8" />
      <text x="360" y="50" textAnchor="middle" fontSize="14" fill="#1e3a8a">
        Proxy Service (Access)
      </text>

      {/* Coordinator */}
      <rect x="140" y="100" width="440" height="56" rx="6" fill="#fef3c7" stroke="#b45309" />
      <text x="360" y="125" textAnchor="middle" fontSize="13" fill="#78350f">
        Coordinator (RootCoord · DataCoord · QueryCoord · Streaming Coord)
      </text>
      <text x="360" y="145" textAnchor="middle" fontSize="11" fill="#92400e">
        single active
      </text>

      {/* Workers */}
      <rect x="60" y="200" width="180" height="60" rx="6" fill="#dcfce7" stroke="#166534" />
      <text x="150" y="225" textAnchor="middle" fontSize="13" fill="#14532d">
        QueryNode
      </text>
      <text x="150" y="245" textAnchor="middle" fontSize="11" fill="#166534">
        vector + scalar search
      </text>

      <rect x="270" y="200" width="180" height="60" rx="6" fill="#dcfce7" stroke="#166534" />
      <text x="360" y="225" textAnchor="middle" fontSize="13" fill="#14532d">
        DataNode
      </text>
      <text x="360" y="245" textAnchor="middle" fontSize="11" fill="#166534">
        flush binlogs
      </text>

      <rect x="480" y="200" width="180" height="60" rx="6" fill="#dcfce7" stroke="#166534" />
      <text x="570" y="225" textAnchor="middle" fontSize="13" fill="#14532d">
        StreamingNode
      </text>
      <text x="570" y="245" textAnchor="middle" fontSize="11" fill="#166534">
        WAL · growing data (2.6 NEW)
      </text>

      {/* Storage */}
      <rect x="20" y="320" width="680" height="80" rx="6" fill="#ede9fe" stroke="#6d28d9" />
      <text x="360" y="350" textAnchor="middle" fontSize="14" fill="#4c1d95">
        Storage
      </text>
      <text x="360" y="370" textAnchor="middle" fontSize="12" fill="#5b21b6">
        Object Storage (S3 · GCS · MinIO · Azure · OSS) · etcd · Woodpecker (WAL)
      </text>

      {/* Connectors */}
      <line x1="360" y1="68" x2="360" y2="100" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="156" x2="150" y2="200" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="156" x2="360" y2="200" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="156" x2="570" y2="200" stroke="#64748b" strokeWidth="1.5" />
      <line x1="150" y1="260" x2="150" y2="320" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="260" x2="360" y2="320" stroke="#64748b" strokeWidth="1.5" />
      <line x1="570" y1="260" x2="570" y2="320" stroke="#64748b" strokeWidth="1.5" />
    </svg>
  );
}
