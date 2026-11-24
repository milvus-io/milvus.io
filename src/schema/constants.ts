import {
  ABSOLUTE_BASE_URL,
  GITHUB_MILVUS_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_LINKEDIN_URL,
  MILVUS_YOUTUBE_CHANNEL_LINK,
  DISCORD_INVITE_URL,
} from '@/consts';

/**
 * Single source of truth for site-level identity used by every JSON-LD
 * generator. Keeping domain / brand / logo / social links here means each
 * generator just references SITE instead of re-declaring them.
 */
export const SITE = {
  name: 'Milvus',
  url: ABSOLUTE_BASE_URL,
  /** Stable @id for the Organization node, referenced by publisher/author/etc. */
  orgId: `${ABSOLUTE_BASE_URL}/#organization`,
  /** Stable @id for the WebSite node. */
  websiteId: `${ABSOLUTE_BASE_URL}/#website`,
  /** Stable @id for the flagship Milvus SoftwareApplication node. */
  softwareAppId: `${ABSOLUTE_BASE_URL}/#software`,
  /**
   * Organization logo. Google requires a raster format (PNG/JPG) for the
   * logo property — SVG is NOT accepted — so this points at the PNG lockup,
   * not the SVG used elsewhere in the UI.
   */
  logo: `${ABSOLUTE_BASE_URL}/images/milvus-logo-group.png`,
  description:
    'Milvus is an open-source vector database built for GenAI applications, enabling fast and scalable similarity search over billions of vectors.',
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
  softwareVersion: '3.0',
  founder: {
    '@type': 'Organization',
    name: 'Zilliz',
    url: 'https://zilliz.com/',
  },
  memberOf: {
    '@type': 'Organization',
    name: 'LF AI & Data Foundation',
    url: 'https://lfaidata.foundation/',
  },
  featureList: [
    'Distributed cloud-native vector database scaling to 100 billion vectors',
    'Dense, sparse, and BM25 full-text hybrid search with metadata filtering',
    'HNSW, IVF, DiskANN, RaBitQ, and GPU CAGRA indexes via Knowhere',
    'Storage-compute separation with object storage and tiered caching',
    'External collections over Parquet, Lance, Iceberg, and Vortex',
    'Partition-key multi-tenancy, RBAC, CDC replication, and snapshots',
  ],
  sameAs: [
    GITHUB_MILVUS_LINK,
    MILVUS_TWITTER_LINK,
    MILVUS_LINKEDIN_URL,
    MILVUS_YOUTUBE_CHANNEL_LINK,
    DISCORD_INVITE_URL,
    'https://en.wikipedia.org/wiki/Milvus_(vector_database)',
    'https://lfaidata.foundation/projects/milvus/',
  ].filter(Boolean),
  softwareSameAs: [
    GITHUB_MILVUS_LINK,
    'https://en.wikipedia.org/wiki/Milvus_(vector_database)',
    'https://lfaidata.foundation/projects/milvus/',
    'https://hub.docker.com/r/milvusdb/milvus',
  ].filter(Boolean),
} as const;
