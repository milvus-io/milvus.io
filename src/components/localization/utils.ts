import { LanguageEnum } from '@/types/localization';
import { ABSOLUTE_BASE_URL } from '@/consts';

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
  const docIdSuffix = docId ? '' : `/${docId}`;
  return `${ABSOLUTE_BASE_URL}/docs${langSuffix}${versionSuffix}${docIdSuffix}`;
};
