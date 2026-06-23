import {
  ABSOLUTE_BASE_URL,
  GITHUB_MILVUS_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_LINKEDIN_URL,
  MILVUS_YOUTUBE_CHANNEL_LINK,
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
  /**
   * Organization logo. Google requires a raster format (PNG/JPG) for the
   * logo property — SVG is NOT accepted — so this points at the PNG lockup,
   * not the SVG used elsewhere in the UI.
   */
  logo: `${ABSOLUTE_BASE_URL}/images/milvus-logo-group.png`,
  description:
    'Milvus is an open-source vector database built for GenAI applications, enabling fast and scalable similarity search over billions of vectors.',
  sameAs: [
    GITHUB_MILVUS_LINK,
    MILVUS_TWITTER_LINK,
    MILVUS_LINKEDIN_URL,
    MILVUS_YOUTUBE_CHANNEL_LINK,
  ],
} as const;
