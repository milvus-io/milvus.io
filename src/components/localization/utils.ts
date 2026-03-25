import { LanguageEnum } from '@/types/localization';
import { ABSOLUTE_BASE_URL } from '@/consts';

interface HreflangEntry {
  lang: string;
  url: string;
}

// Generate hreflang entries for all available languages of a doc within the same version.
// x-default points to English version.
export const getDocHreflangUrls = (params: {
  version: string;
  latestVersion: string;
  docId?: string;
  availableLanguages: LanguageEnum[];
}): HreflangEntry[] => {
  const { version, latestVersion, docId, availableLanguages } = params;
  const versionSuffix = version === latestVersion ? '' : `/${version}`;
  const docIdSuffix = docId ? `/${docId}` : '';

  const entries: HreflangEntry[] = availableLanguages.map(lang => {
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

// Canonical URL points to the latest version (same language) to consolidate
// link equity across versioned docs. Falls back to current version URL if
// the doc doesn't exist in the latest version (e.g. removed/renamed pages).
export const getDocCanonicalUrl = (params: {
  lang: LanguageEnum;
  version: string;
  latestVersion: string;
  docId?: string;
  latestVersionMds?: string[];
}): string => {
  const { lang, version, latestVersion, docId, latestVersionMds } = params;
  const langSuffix = lang === LanguageEnum.ENGLISH ? '' : `/${lang}`;
  const docIdSuffix = docId ? `/${docId}` : '';

  const existsInLatest =
    !docId || version === latestVersion || latestVersionMds?.includes(docId);

  const versionSuffix = existsInLatest ? '' : `/${version}`;
  return `${ABSOLUTE_BASE_URL}/docs${langSuffix}${versionSuffix}${docIdSuffix}`;
};
