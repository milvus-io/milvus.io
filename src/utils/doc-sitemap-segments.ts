import fs from 'fs';
import { join } from 'path';

// Doc and api-reference detail pages are rendered on demand (blocking fallback)
// instead of being fully prerendered, so next-sitemap can no longer discover
// them from the prerender manifest. During `next build` each route writes its
// URLs here, and sitemap.config.js reads them back so the sitemap stays
// complete for SEO.
export const DOC_SITEMAP_SEGMENT_DIR = join(process.cwd(), '.doc-sitemap');

export const writeSitemapSegment = (key: string, urls: string[]) => {
  // Only relevant during a production build; skip the filesystem churn in dev,
  // where getStaticPaths runs per request.
  if (process.env.NODE_ENV !== 'production') return;

  try {
    fs.mkdirSync(DOC_SITEMAP_SEGMENT_DIR, { recursive: true });
    fs.writeFileSync(
      join(DOC_SITEMAP_SEGMENT_DIR, `${key}.json`),
      JSON.stringify(urls)
    );
  } catch (error) {
    console.error('writeDocSitemapSegment error:', error);
  }
};
