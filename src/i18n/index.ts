import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './en/milvus.json';
import commonCn from './cn/milvus.json';
import useCaseEn from './en/useCase.json';
import useCaseCn from './cn/useCase.json';
import introEn from './en/intro.json';
import introCn from './cn/intro.json';
import headerEn from './en/header.json';
import headerCn from './cn/header.json';

export const resources = {
  en: {
    common: commonEn,
    useCase: useCaseEn,
    intro: introEn,
    header: headerEn,
  },
  cn: {
    common: commonCn,
    useCase: useCaseCn,
    intro: introCn,
    header: headerCn,
  },
};

export const defaultNS = 'common';
export const languages = Object.keys(resources);
export const defaultLanguage = 'en';

i18n.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: 'en',
  ns: ['common'],
  keySeparator: '.',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});

/**
 * use for [lang] pages
 * defaultLanguage is render by root pages.
 * so we need filter it in [lang] pages
 * @returns
 */
export function getAllLanguageSlugs() {
  return languages
    .filter(v => v !== defaultLanguage)
    .map(lang => {
      return { params: { lang: lang } };
    });
}
