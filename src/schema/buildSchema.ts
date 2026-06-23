import {
  articleSchema,
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  faqSchema,
  videoSchema,
  softwareAppSchema,
  definedTermSchema,
  eventSchema,
  jobPostingSchema,
  type SchemaObject,
} from './generators';

export type SchemaPageType =
  | 'article'
  | 'techArticle'
  | 'blogPosting'
  | 'newsArticle'
  | 'organization'
  | 'website'
  | 'event'
  | 'video'
  | 'faq'
  | 'breadcrumb'
  | 'softwareApp'
  | 'definedTerm'
  | 'jobPosting';

/**
 * Single entry point for producing a JSON-LD object. Every route should call
 * this rather than hand-assembling schema, so the conventions (https context,
 * @id fragments, publisher → homepage Organization) stay consistent and new
 * page types only cost one extra generator + one call site.
 */
export function buildSchema(
  pageType: SchemaPageType,
  data?: any
): SchemaObject {
  switch (pageType) {
    case 'article':
      return articleSchema(data);
    case 'techArticle':
      return articleSchema({ ...data, type: 'TechArticle' });
    case 'blogPosting':
      return articleSchema({ ...data, type: 'BlogPosting' });
    case 'newsArticle':
      return articleSchema({ ...data, type: 'NewsArticle' });
    case 'organization':
      return organizationSchema();
    case 'website':
      return websiteSchema();
    case 'event':
      return eventSchema(data);
    case 'video':
      return videoSchema(data);
    case 'faq':
      return faqSchema(data);
    case 'breadcrumb':
      return breadcrumbSchema(data);
    case 'softwareApp':
      return softwareAppSchema(data);
    case 'definedTerm':
      return definedTermSchema(data);
    case 'jobPosting':
      return jobPostingSchema(data);
    default:
      throw new Error(`Unknown pageType: ${pageType}`);
  }
}
