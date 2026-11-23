import fs from 'fs';
import { join } from 'path';

// During next build, record content dates for prerendered routes and URLs for
// on-demand routes that next-sitemap cannot discover in the prerender manifest.
export const DOC_SITEMAP_SEGMENT_DIR = join(process.cwd(), '.doc-sitemap');

export interface ContentSitemapEntry {
  loc: string;
  lastmod?: string;
  onDemand?: boolean;
}

export const writeSitemapSegment = (key: string, pages: ContentSitemapEntry[]) => {
  // Only relevant during a production build; skip the filesystem churn in dev,
  // where getStaticPaths runs per request.
  if (process.env.NODE_ENV !== 'production') return;

  try {
    fs.mkdirSync(DOC_SITEMAP_SEGMENT_DIR, { recursive: true });
    fs.writeFileSync(
      join(DOC_SITEMAP_SEGMENT_DIR, `${key}.json`),
      JSON.stringify(pages)
    );
  } catch (error) {
    console.error('writeDocSitemapSegment error:', error);
  }
};
