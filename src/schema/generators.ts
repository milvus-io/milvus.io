import { SITE } from './constants';

const SCHEMA_CONTEXT = 'https://schema.org';

/** A plain JSON-LD object. Generators return objects; the `<JsonLd>` component
 *  serializes them with JSON.stringify so quotes/newlines can never produce
 *  invalid JSON (the bug that hand-built template strings used to have). */
export type SchemaObject = Record<string, any>;

type DateInput = string | number | Date | null | undefined;

/** Normalize any date-ish value to an ISO 8601 string, or undefined. */
const toISO = (date: DateInput): string | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? undefined : d.toJSON();
};

export type ArticleType =
  | 'Article'
  | 'BlogPosting'
  | 'TechArticle'
  | 'NewsArticle';

export interface ArticleInput {
  type?: ArticleType;
  absoluteUrl: string;
  title: string;
  desc?: string;
  publishTime?: DateInput;
  modifiedTime?: DateInput;
  imageUrl?: string;
  /** Named human author; falls back to the Organization when absent. */
  author?: { name?: string; type?: 'Person' | 'Organization' };
}

/** Article / BlogPosting / TechArticle / NewsArticle — the generic content page. */
export function articleSchema({
  type = 'Article',
  absoluteUrl,
  title,
  desc,
  publishTime,
  modifiedTime,
  imageUrl,
  author,
}: ArticleInput): SchemaObject {
  const datePublished = toISO(publishTime);
  const dateModified = toISO(modifiedTime) || datePublished;

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': type,
    '@id': `${absoluteUrl}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl },
    url: absoluteUrl,
    headline: title.slice(0, 110), // Google recommends ≤110 chars
    description: desc || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified,
    author:
      author?.name && author.type === 'Person'
        ? { '@type': 'Person', name: author.name }
        : { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@id': SITE.orgId }, // points at the homepage Organization
  };
}

/** Organization node — defined once on the homepage, referenced everywhere via @id. */
export function organizationSchema(): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Organization',
    '@id': SITE.orgId,
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    description: SITE.description,
    sameAs: SITE.sameAs,
  };
}

/** WebSite node — homepage only. */
export function websiteSchema(): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': SITE.websiteId,
    url: SITE.url,
    name: SITE.name,
    publisher: { '@id': SITE.orgId },
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

/** BreadcrumbList from a Home→…→current trail. The last item may omit its url.
 *  Items whose name is empty/blank are dropped and positions are renumbered so
 *  every ListItem always carries a non-empty `name` — otherwise Google reports
 *  "Either 'name' or 'item.name' should be specified (in 'itemListElement')". */
export function breadcrumbSchema(items: BreadcrumbItem[]): SchemaObject {
  const named = (items ?? [])
    .map(item => ({ ...item, name: item.name?.trim() }))
    .filter((item): item is BreadcrumbItem & { name: string } => !!item.name);
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: named.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export interface FaqInput {
  absoluteUrl: string;
  faqItems: { question: string; answerPlainText: string }[];
}

/** FAQPage — for AI search / machine understanding (no longer a Google rich
 *  result since 2026-05). faqItems must be real, page-visible Q&A. */
export function faqSchema({ absoluteUrl, faqItems }: FaqInput): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    '@id': `${absoluteUrl}#faq`,
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answerPlainText },
    })),
  };
}

export interface VideoInput {
  name: string;
  desc?: string;
  thumbnailUrl: string;
  uploadDate: DateInput;
  contentUrl?: string;
  embedUrl?: string;
  /** ISO 8601 duration, e.g. "PT1H02M". */
  duration?: string;
}

/** VideoObject — webinar replays / embedded YouTube. */
export function videoSchema({
  name,
  desc,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
}: VideoInput): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'VideoObject',
    name,
    description: desc || undefined,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: toISO(uploadDate),
    contentUrl,
    embedUrl,
    duration,
    publisher: { '@id': SITE.orgId },
  };
}

export interface SoftwareAppInput {
  name?: string;
  desc?: string;
  url?: string;
  offerUrl?: string;
  /** Open-source repository — adds codeRepository semantics. */
  codeRepository?: string;
}

/** SoftwareApplication — product pages. Never add aggregateRating/review
 *  (self-rating violates Google policy). */
export function softwareAppSchema({
  name = SITE.name,
  desc = SITE.description,
  url = SITE.url,
  offerUrl,
  codeRepository,
}: SoftwareAppInput = {}): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'SoftwareApplication',
    name,
    description: desc,
    url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cloud / Linux / macOS / Windows',
    publisher: { '@id': SITE.orgId },
    ...(codeRepository ? { codeRepository } : {}),
    offers: offerUrl
      ? {
          '@type': 'Offer',
          url: offerUrl,
          price: '0',
          priceCurrency: 'USD',
        }
      : undefined,
  };
}

export interface DefinedTermInput {
  term: string;
  definition: string;
  url: string;
  /** The DefinedTermSet this term belongs to (e.g. a glossary index URL). */
  termSetUrl?: string;
}

/** DefinedTerm — glossary entries. */
export function definedTermSchema({
  term,
  definition,
  url,
  termSetUrl,
}: DefinedTermInput): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'DefinedTerm',
    name: term,
    description: definition,
    url,
    ...(termSetUrl ? { inDefinedTermSet: termSetUrl } : {}),
  };
}

export interface EventInput {
  name: string;
  desc?: string;
  startDate: DateInput;
  endDate?: DateInput;
  url: string;
  locationName?: string;
  address?: string;
  isOnline?: boolean;
  imageUrl?: string;
}

/** Event — still a Google rich result. Required: name, startDate, location. */
export function eventSchema({
  name,
  desc,
  startDate,
  endDate,
  url,
  locationName,
  address,
  isOnline,
  imageUrl,
}: EventInput): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Event',
    name,
    description: desc || undefined,
    startDate: toISO(startDate),
    endDate: toISO(endDate),
    eventAttendanceMode: isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: isOnline
      ? { '@type': 'VirtualLocation', url }
      : { '@type': 'Place', name: locationName, address },
    image: imageUrl ? [imageUrl] : undefined,
    organizer: { '@id': SITE.orgId },
    offers: {
      '@type': 'Offer',
      url,
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

export interface JobPostingInput {
  title: string;
  desc: string;
  datePosted: DateInput;
  validThrough?: DateInput;
  employmentType?: string;
  locationAddress?: string;
  remote?: boolean;
}

/** JobPosting — careers pages with a real listing. */
export function jobPostingSchema({
  title,
  desc,
  datePosted,
  validThrough,
  employmentType,
  locationAddress,
  remote,
}: JobPostingInput): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'JobPosting',
    title,
    description: desc,
    datePosted: toISO(datePosted),
    validThrough: toISO(validThrough),
    employmentType,
    hiringOrganization: { '@id': SITE.orgId },
    jobLocationType: remote ? 'TELECOMMUTE' : undefined,
    jobLocation: remote
      ? undefined
      : { '@type': 'Place', address: locationAddress },
  };
}
