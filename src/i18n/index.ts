import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from './en';
import * as cn from './cn';
import * as ja from './ja';
import * as de from './de';
import * as es from './es';
import * as fr from './fr';
import * as it from './it';
import * as ko from './ko';
import * as pt from './pt';
import * as ru from './ru';
import * as id from './id';
import * as ar from './ar';
import * as zhHant from './zh-hant';

export const resources = {
  en,
  cn,
  ja,
  ko,
  fr,
  de,
  it,
  pt,
  es,
  ru,
  id,
  ar,
  zh: cn,
  ['zh-hant']: zhHant,
};

export const defaultNS = 'common';
export const defaultLanguage = 'en';
export const languages = Object.keys(resources);

i18n.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  ns: [
    'common',
    'useCase',
    'intro',
    'header',
    'sizingTool',
    'home',
    'docs',
    'demo',
    'community',
    'notFound',
    'blog',
    'contact',
    'faq',
    'llm',
  ],
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
  lowerCaseLng: true,
  resources,
});

export function getAllLanguageSlugs() {
  return languages
    .filter(v => v !== defaultLanguage && v !== 'cn')
    .map(lang => {
      return { params: { lang: lang } };
    });
}
