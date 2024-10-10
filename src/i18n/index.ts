import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import demoEn from './en/demo.json';
import docsEn from './en/docs.json';
import headerEn from './en/header.json';
import homeEn from './en/home.json';
import introEn from './en/intro.json';
import commonEn from './en/milvus.json';
import sizingToolEn from './en/sizingTool.json';
import useCaseEn from './en/useCase.json';
import communityEn from './en/community.json';
import notFoundEn from './en/404.json';

import docsCn from './cn/docs.json';
import headerCn from './cn/header.json';
import introCn from './cn/intro.json';
import commonCn from './cn/milvus.json';
import sizingToolCn from './cn/sizingTool.json';
import useCaseCn from './cn/useCase.json';

import docsDe from './de/docs.json';
import docsEs from './es/docs.json';
import docsFr from './fr/docs.json';
import docsIt from './it/docs.json';
import docsJa from './ja/docs.json';
import docsKo from './ko/docs.json';
import docsPt from './pt/docs.json';

export const resources = {
  en: {
    common: commonEn,
    useCase: useCaseEn,
    intro: introEn,
    header: headerEn,
    sizingTool: sizingToolEn,
    home: homeEn,
    docs: docsEn,
    demo: demoEn,
    community: communityEn,
    notFound: notFoundEn,
  },
  cn: {
    common: commonCn,
    useCase: useCaseCn,
    intro: introCn,
    header: headerCn,
    sizingTool: sizingToolCn,
    docs: docsCn,
  },
  zh: {
    common: commonCn,
    useCase: useCaseCn,
    intro: introCn,
    header: headerCn,
    sizingTool: sizingToolCn,
    docs: docsCn,
  },
  ja: {
    docs: docsJa,
  },
  ko: {
    docs: docsKo,
  },
  fr: {
    docs: docsFr,
  },
  de: {
    docs: docsDe,
  },
  it: {
    docs: docsIt,
  },
  pt: {
    docs: docsPt,
  },
  es: {
    docs: docsEs,
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
