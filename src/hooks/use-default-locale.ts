import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { LanguageEnum } from '@/types/localization';

export const useDefaultLocale = () => {
  const pathname = usePathname();
  const { i18n } = useTranslation();

  const isDocsPage = pathname.startsWith('/docs');
  const isBlogPage = pathname.startsWith('/blog');
  const locales = Object.values(LanguageEnum);
  const pathArray = pathname.split('/');
  const targetPathLocale = locales.find(locale => pathArray.includes(locale));
  const pathLocale =
    isDocsPage || isBlogPage
      ? targetPathLocale ?? LanguageEnum.ENGLISH
      : targetPathLocale;

  return {
    defaultLocale: pathLocale || (i18n.language as LanguageEnum),
  };
};
