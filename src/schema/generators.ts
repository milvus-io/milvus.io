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
  inLanguage?: string;
  softwareVersion?: string;
  keywords?: string[];
  imageUrl?: string;
  about?: SchemaObject | SchemaObject[];
  mentions?: SchemaObject[];
  citation?: string[];
  /** Named human author; falls back to the Organization when absent. */
  author?: { name?: string; type?: 'Person' | 'Organization' };
}

const orgAuthorRef = (): SchemaObject => ({
  '@type': 'Organization',
  '@id': SITE.orgId,
  name: SITE.name,
  url: SITE.url,
});

/** Article / BlogPosting / TechArticle / NewsArticle — the generic content page. */
export function articleSchema({
  type = 'Article',
  absoluteUrl,
  title,
  desc,
  publishTime,
  modifiedTime,
  inLanguage,
  softwareVersion,
  keywords,
  imageUrl,
  about,
  mentions,
  citation,
  author,
}: ArticleInput): SchemaObject {
  const datePublished = toISO(publishTime);
  const dateModified = toISO(modifiedTime) || datePublished;
  const resolvedAbout =
    about ??
    (softwareVersion
      ? {
          '@type': 'SoftwareApplication',
          '@id': `${SITE.softwareAppId}-${encodeURIComponent(softwareVersion)}`,
          name: SITE.name,
          url: SITE.url,
          softwareVersion,
        }
      : undefined);

  const resolvedAuthor =
    author?.name && author.type === 'Person'
      ? { '@type': 'Person', name: author.name }
      : author?.name && author.type === 'Organization'
        ? { '@type': 'Organization', name: author.name }
        : orgAuthorRef();

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
    inLanguage,
    keywords: keywords?.length ? keywords : undefined,
    about: resolvedAbout,
    mentions: mentions?.length ? mentions : undefined,
    citation: citation?.length ? citation : undefined,
    author: resolvedAuthor,
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
    founder: SITE.founder,
    memberOf: SITE.memberOf,
    sameAs: SITE.sameAs,
  };
}

export interface WebSiteInput {
  inLanguage?: string;
}

/** WebSite node — canonical root domain identity (never overridden by localized paths). */
export function websiteSchema({ inLanguage }: WebSiteInput = {}): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': SITE.websiteId,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage,
    publisher: { '@id': SITE.orgId },
  };
}

export interface WebPageInput {
  absoluteUrl: string;
  name?: string;
  desc?: string;
  inLanguage?: string;
  about?: SchemaObject;
}

/** WebPage node — localized homepages or standalone pages linked to #website via isPartOf. */
export function webPageSchema({
  absoluteUrl,
  name = SITE.name,
  desc = SITE.description,
  inLanguage,
  about,
}: WebPageInput): SchemaObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebPage',
    '@id': `${absoluteUrl}#webpage`,
    url: absoluteUrl,
    name,
    description: desc || undefined,
    inLanguage,
    isPartOf: { '@id': SITE.websiteId },
    publisher: { '@id': SITE.orgId },
    about,
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
  softwareVersion?: string;
  license?: string;
  isAccessibleForFree?: boolean;
  featureList?: readonly string[];
  applicationCategory?: string;
  operatingSystem?: string;
  inLanguage?: string;
}

/** SoftwareApplication — product & tool pages. Never add aggregateRating/review
 *  (self-rating violates Google policy). */
export function softwareAppSchema({
  name = SITE.name,
  desc = SITE.description,
  url = SITE.url,
  offerUrl,
  codeRepository,
  softwareVersion,
  license,
  isAccessibleForFree = true,
  featureList,
  applicationCategory = 'DeveloperApplication',
  operatingSystem = 'Cloud / Linux / macOS / Windows',
  inLanguage,
}: SoftwareAppInput = {}): SchemaObject {
  const isFlagship = name === SITE.name && url === SITE.url;
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'SoftwareApplication',
    '@id': isFlagship ? SITE.softwareAppId : `${url}#software`,
    name,
    description: desc,
    url,
    applicationCategory,
    operatingSystem,
    isAccessibleForFree,
    softwareVersion: softwareVersion ?? (isFlagship ? SITE.softwareVersion : undefined),
    license: license ?? (isFlagship ? SITE.license : undefined),
    featureList:
      featureList && featureList.length
        ? [...featureList]
        : isFlagship
          ? [...SITE.featureList]
          : undefined,
    inLanguage,
    creator: isFlagship ? SITE.founder : { '@id': SITE.orgId },
    publisher: { '@id': SITE.orgId },
    ...(isFlagship && SITE.softwareSameAs.length
      ? { sameAs: [...SITE.softwareSameAs] }
      : {}),
    ...(codeRepository ? { codeRepository } : {}),
    offers: offerUrl
      ? {
          '@type': 'Offer',
          url: offerUrl,
          price: '0',
          priceCurrency: 'USD',
        }
      : isAccessibleForFree
        ? {
            '@type': 'Offer',
            url,
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

const NAMED_HTML_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
};

const decodeHtmlEntities = (input: string): string =>
  input.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (match, dec, hex, name) => {
    if (dec) {
      const code = Number.parseInt(dec, 10);
      return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    if (hex) {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    const resolved = NAMED_HTML_ENTITIES[name.toLowerCase()];
    return resolved ?? match;
  });

const stripHtml = (input: string): string =>
  decodeHtmlEntities(
    input
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, '')
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

/** Parse rendered glossary HTML (`<h2>Term</h2><p>Definition</p>`) into DefinedTerm inputs. */
export function extractGlossaryTermsFromHtml(
  html: string,
  canonicalUrl: string
): DefinedTermInput[] {
  if (!html) return [];
  const headingRe = /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi;
  const headings: { id?: string; term: string; end: number; start: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRe.exec(html)) !== null) {
    const attrs = match[1] || '';
    const idMatch = attrs.match(/\bid=["']([^"']+)["']/i);
    const term = stripHtml(match[2] || '');
    if (term) {
      headings.push({
        id: idMatch?.[1],
        term,
        start: match.index,
        end: headingRe.lastIndex,
      });
    }
  }
  const terms: DefinedTermInput[] = [];
  for (let i = 0; i < headings.length; i += 1) {
    const current = headings[i];
    const nextStart = i + 1 < headings.length ? headings[i + 1].start : html.length;
    const bodyHtml = html.slice(current.end, nextStart);
    const definition = stripHtml(bodyHtml);
    if (!definition) continue;
    const url = current.id
      ? `${canonicalUrl}#${encodeURIComponent(current.id)}`
      : canonicalUrl;
    terms.push({
      term: current.term,
      definition: definition.slice(0, 500),
      url,
      termSetUrl: `${canonicalUrl}#definedtermset`,
    });
  }
  return terms;
}

export interface DefinedTermSetInput {
  absoluteUrl: string;
  name: string;
  desc?: string;
  inLanguage?: string;
  terms?: DefinedTermInput[];
  html?: string;
}

/** DefinedTermSet — glossary pages (e.g. /docs/glossary.md). */
export function definedTermSetSchema({
  absoluteUrl,
  name,
  desc,
  inLanguage,
  terms,
  html,
}: DefinedTermSetInput): SchemaObject {
  const termSetId = `${absoluteUrl}#definedtermset`;
  const resolvedTerms =
    terms ?? (html ? extractGlossaryTermsFromHtml(html, absoluteUrl) : []);
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'DefinedTermSet',
    '@id': termSetId,
    url: absoluteUrl,
    name,
    description: desc || undefined,
    inLanguage,
    publisher: { '@id': SITE.orgId },
    hasDefinedTerm: resolvedTerms.map(item => {
      const { '@context': _ctx, ...termNode } = definedTermSchema({
        ...item,
        termSetUrl: item.termSetUrl || termSetId,
      });
      return termNode;
    }),
  };
}

export interface CollectionPageItem {
  name: string;
  url?: string;
  description?: string;
}

export interface CollectionPageInput {
  absoluteUrl: string;
  name: string;
  desc?: string;
  inLanguage?: string;
  about?: SchemaObject;
  items?: CollectionPageItem[];
}

/** CollectionPage — index / hub pages (/docs, /blog, /use-cases). */
export function collectionPageSchema({
  absoluteUrl,
  name,
  desc,
  inLanguage,
  about,
  items,
}: CollectionPageInput): SchemaObject {
  const validItems = (items ?? []).filter(item => item.name?.trim());
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl}#webpage`,
    url: absoluteUrl,
    name,
    description: desc || undefined,
    inLanguage,
    isPartOf: { '@id': SITE.websiteId },
    publisher: { '@id': SITE.orgId },
    about,
    mainEntity: validItems.length
      ? {
          '@type': 'ItemList',
          numberOfItems: validItems.length,
          itemListElement: validItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name.trim(),
            ...(item.url ? { url: item.url } : {}),
            ...(item.description ? { description: item.description } : {}),
          })),
        }
      : undefined,
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
