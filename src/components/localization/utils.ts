import { isIndexableLanguage, LanguageEnum } from '@/types/localization';
import { ABSOLUTE_BASE_URL } from '@/consts';

interface HreflangEntry {
  lang: string;
  url: string;
}

// Generate hreflang entries for a doc within the same version. The cluster only
// contains indexable languages (en/zh/ko/zh-hant/ja) that actually have this
// doc at this version, so every entry is a self-canonical, reciprocal 200 page.
// hreflang clusters per-version: it never links across versions. x-default
// points to the English version.
export const getDocHreflangUrls = (params: {
  version: string;
  latestVersion: string;
  docId?: string;
  availableLanguages: LanguageEnum[];
}): HreflangEntry[] => {
  const { version, latestVersion, docId, availableLanguages } = params;
  const versionSuffix = version === latestVersion ? '' : `/${version}`;
  const docIdSuffix = docId ? `/${docId}` : '';

  const entries: HreflangEntry[] = availableLanguages
    .filter(isIndexableLanguage)
    .map(lang => {
      const langSuffix = lang === LanguageEnum.ENGLISH ? '' : `/${lang}`;
      return {
        lang,
        url: `${ABSOLUTE_BASE_URL}/docs${langSuffix}${versionSuffix}${docIdSuffix}`,
      };
    });

  // x-default points to the English version
  const enEntry = entries.find(e => e.lang === LanguageEnum.ENGLISH);
  if (enEntry) {
    entries.push({ lang: 'x-default', url: enEntry.url });
  }

  return entries;
};

export const getHomePageLink = (params: {
  lang: LanguageEnum;
  version: string;
  latestVersion: string;
}) => {
  const { lang, version, latestVersion } = params;
  const versionSuffix = version === latestVersion ? '' : `/${version}`;
  const langSuffix = lang === LanguageEnum.ENGLISH ? '' : `/${lang}`;
  return `/docs${langSuffix}${versionSuffix}`;
};

export const getSeoUrl = (params: {
  lang: LanguageEnum;
  version: string;
  latestVersion: string;
  docId?: string;
}): string => {
  const { lang, version, latestVersion, docId } = params;
  const versionSuffix = version === latestVersion ? '' : `/${version}`;
  const langSuffix = lang === LanguageEnum.ENGLISH ? '' : `/${lang}`;
  const docIdSuffix = docId ? `/${docId}` : '';
  return `${ABSOLUTE_BASE_URL}/docs${langSuffix}${versionSuffix}${docIdSuffix}`;
};

// Canonical URL for api-reference pages. Points to latest version to
// consolidate link equity. Falls back to current version if the doc
// doesn't exist in the latest version.
export const getApiCanonicalUrl = (params: {
  languageCategory: string;
  version: string;
  latestVersion: string;
  relativePath: string;
  latestVersionMds?: string[];
}): string => {
  const {
    languageCategory,
    version,
    latestVersion,
    relativePath,
    latestVersionMds,
  } = params;

  // relativePath is like /v2.6.x/ORM/db/using_database.md
  // We need the part after the version: /ORM/db/using_database.md
  const pathWithoutVersion = relativePath.replace(/^\/v[\d.]+x/, '');
  // formatApiRelativePath converts "vx.x.x/a/b/c" to "a-b-c", so
  // latestVersionMds contains ids like "ORM-db-using_database.md"
  const currentMdId = pathWithoutVersion.replace(/^\//, '').replace(/\//g, '-');

  const existsInLatest =
    version === latestVersion || latestVersionMds?.includes(currentMdId);

  const targetVersion = existsInLatest ? latestVersion : version;
  const targetRelativePath = relativePath.replace(
    /\/v[\d.]+x/,
    `/${targetVersion}`
  );

  return `${ABSOLUTE_BASE_URL}/api-reference/${languageCategory}${targetRelativePath}`;
};

// The language whose page a doc canonicalizes to: indexable languages
// (en/zh/ko/zh-hant/ja) keep their own language, every other language
// consolidates to English.
export const getDocCanonicalLang = (lang: LanguageEnum): LanguageEnum =>
  isIndexableLanguage(lang) ? lang : LanguageEnum.ENGLISH;

// Canonical URL for a doc page, handling both the version and language axes:
// - Version: archived versions (for example, /docs/v2.6.x/x.md) point to the
//   latest-version equivalent (/docs/x.md) when that page exists in the latest
//   version (existsInLatest), mirroring getApiCanonicalUrl, so old versions stop
//   competing with latest in search. When the page no longer exists in latest,
//   the archived page keeps its version segment and self-references, so we never
//   canonicalize to a 404.
// - Language: indexable languages (en/zh/ko/zh-hant/ja) self-reference so each
//   gets indexed; every other language drops its language segment and points to
//   the English page, consolidating it to English instead of competing for the
//   index. The English source always has the same docId, so for the same version
//   this target is guaranteed to exist; for the latest version the caller must
//   check existence in getDocCanonicalLang(lang) before setting existsInLatest.
export const getDocCanonicalUrl = (params: {
  lang: LanguageEnum;
  version: string;
  latestVersion: string;
  docId?: string;
  existsInLatest?: boolean;
}): string => {
  const {
    lang,
    version,
    latestVersion,
    docId,
    existsInLatest = false,
  } = params;
  const canonicalLang = getDocCanonicalLang(lang);
  const langSuffix =
    canonicalLang === LanguageEnum.ENGLISH ? '' : `/${canonicalLang}`;
  const versionSuffix =
    version === latestVersion || existsInLatest ? '' : `/${version}`;
  const docIdSuffix = docId ? `/${docId}` : '';

  return `${ABSOLUTE_BASE_URL}/docs${langSuffix}${versionSuffix}${docIdSuffix}`;
};
