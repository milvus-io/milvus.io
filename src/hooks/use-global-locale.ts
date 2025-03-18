import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';

import { LanguageEnum } from '@/types/localization';
import {
  DOCS_LANGUAGE_DISABLED_MAP,
  SHOW_LANGUAGE_SELECTOR_VERSIONS,
  DISABLED_LANGUAGE_SELECTOR_VERSIONS,
} from '@/components/localization/const';
import { useStore } from '@/hooks/use-store';
import Cookies from 'js-cookie';

const LANGUAGES = Object.values(LanguageEnum);

export const useGlobalLocale = () => {
  const { i18n } = useTranslation();
  const { state, dispatch } = useStore();
  const { locale } = state;

  const router = useRouter();
  const pathname = usePathname();
  const isDocsPage = pathname.startsWith('/docs');
  const isApiReferencePage = pathname.includes('/api-reference');

  const { disabled, disabledLanguages } = useMemo(() => {
    const version = SHOW_LANGUAGE_SELECTOR_VERSIONS.find(version =>
      pathname.includes(version)
    );
    const versionDisabled = DISABLED_LANGUAGE_SELECTOR_VERSIONS.some(version =>
      pathname.includes(version)
    );
    return {
      disabled: (isDocsPage && versionDisabled) || isApiReferencePage,
      disabledLanguages: DOCS_LANGUAGE_DISABLED_MAP[version] ?? [],
    };
  }, [pathname, isDocsPage, isApiReferencePage]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleDocsLocaleChange = (newLocale: LanguageEnum) => {
    const [, docs, lang, ...rest] = pathname.split(`/`);
    if (lang && LANGUAGES.includes(lang as LanguageEnum)) {
      const newPath =
        newLocale === LanguageEnum.ENGLISH
          ? ['', docs, ...rest].join(`/`)
          : ['', docs, newLocale, ...rest].join(`/`);
      router.push(newPath || '/');
    } else {
      const newPath = ['', docs, newLocale, lang, ...rest].join(`/`);
      router.push(newPath || '/');
    }
  };

  const handlePageLocaleChange = (newLocale: LanguageEnum) => {
    const [, lang, ...rest] = pathname.split(`/`);
    if (lang && LANGUAGES.includes(lang as LanguageEnum)) {
      const newPath =
        newLocale === LanguageEnum.ENGLISH
          ? ['', ...rest].join(`/`)
          : ['', newLocale, ...rest].join(`/`);
      router.push(newPath || '/');
    } else {
      const newPath = ['', newLocale, lang, ...rest].join(`/`);
      router.push(newPath || '/');
    }
  };

  const changeLocale = (newLocale: LanguageEnum) => {
    // write local to coolie, replace or add lang=newLocal;
    Cookies.set('lang', newLocale, {
      expires: 365,
      secure: true,
      sameSite: 'Lax',
    }); // Expires in 1 year

    i18n.changeLanguage(newLocale);
    dispatch({ type: 'SET_LOCALE', payload: newLocale });
  };

  const onLocaleChange = (newLocale: LanguageEnum) => {
    if (isDocsPage) {
      handleDocsLocaleChange(newLocale);
    } else if (isApiReferencePage) {
      // Nothing to do, no translated files for api reference
    } else {
      handlePageLocaleChange(newLocale);
    }
    changeLocale(newLocale);
  };

  const getLocalePath = (path: string) => {
    if (locale === LanguageEnum.ENGLISH) {
      return path;
    }
    if (path === '/docs') {
      return `${path}/${locale}`;
    }
    return `/${locale}${path}`;
  };

  return {
    locale,
    disabledLanguages,
    disabled,
    localeSuffix: locale === LanguageEnum.ENGLISH ? '' : `/${locale}`,
    onLocaleChange,
    changeLocale,
    getLocalePath,
  };
};
