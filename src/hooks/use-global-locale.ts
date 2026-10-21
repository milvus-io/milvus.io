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
import { loadI18nResources } from '@/i18n/client';

const LANGUAGES = Object.values(LanguageEnum);
const LANDING_LANGUAGES = [LanguageEnum.ENGLISH, LanguageEnum.CHINESE];

const writeLocaleCookie = (locale: LanguageEnum) => {
  Cookies.set('lang', locale, {
    expires: 365,
    secure: true,
    sameSite: 'Lax',
  });
};

export const useGlobalLocale = () => {
  const { i18n } = useTranslation();
  const { state, dispatch } = useStore();
  const { locale } = state;

  const router = useRouter();
  const pathname = usePathname();
  const isDocsPage = pathname.startsWith('/docs');
  const isApiReferencePage = pathname.includes('/api-reference');
  const isLandingPage = /^\/(?:zh\/)?(?:solutions|compare)(?:\/|$)/.test(pathname);

  const { disabled, disabledLanguages } = useMemo(() => {
    const version = SHOW_LANGUAGE_SELECTOR_VERSIONS.find(version =>
      pathname.includes(version)
    );
    const versionDisabled = DISABLED_LANGUAGE_SELECTOR_VERSIONS.some(version =>
      pathname.includes(version)
    );
    return {
      disabled: (isDocsPage && versionDisabled) || isApiReferencePage,
      disabledLanguages: isLandingPage
        ? LANGUAGES.filter(lang => !LANDING_LANGUAGES.includes(lang))
        : DOCS_LANGUAGE_DISABLED_MAP[version] ?? [],
    };
  }, [pathname, isDocsPage, isApiReferencePage, isLandingPage]);

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
    writeLocaleCookie(newLocale);

    loadI18nResources(newLocale).then(() => {
      i18n.changeLanguage(newLocale);
    });
    dispatch({ type: 'SET_LOCALE', payload: newLocale });
  };

  const onLocaleChange = (newLocale: LanguageEnum) => {
    if (isLandingPage) {
      if (!LANDING_LANGUAGES.includes(newLocale)) return;
      const path = pathname.replace(/^\/zh(?=\/)/, '');
      const prefix = newLocale === LanguageEnum.CHINESE ? '/zh' : '';
      writeLocaleCookie(newLocale);
      // Initialize the destination's server-provided language bundle instead
      // of letting the current landing's locale effect reset the selection.
      window.location.assign(`${prefix}${path}${window.location.search}${window.location.hash}`);
      return;
    }
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
