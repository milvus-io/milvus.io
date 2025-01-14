import { LanguageEnum } from '@/types/localization';

export const getBlogPath = (locale: LanguageEnum) => {
  return locale === LanguageEnum.ENGLISH ? '/blog' : `/${locale}/blog`;
};

export const getLocalePath = (params: {
  locale: LanguageEnum;
  path: string;
}) => {
  return params.locale === LanguageEnum.ENGLISH
    ? params.path
    : `/${params.locale}${params.path}`;
};
