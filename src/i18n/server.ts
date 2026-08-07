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

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// Module namespace objects also expose `default`/`__esModule` once serialized;
// they are not translation namespaces.
const toNamespaceMap = (resource: unknown): Record<string, unknown> => {
  if (!isPlainObject(resource)) return {};
  const { default: _default, __esModule, ...namespaceMap } = resource;
  return namespaceMap;
};

/** Keys present in `source` but absent from `target`, recursively. */
const pickMissing = (
  source: Record<string, unknown>,
  target: Record<string, unknown>
): Record<string, unknown> => {
  const missing: Record<string, unknown> = {};
  Object.entries(source).forEach(([key, value]) => {
    if (isPlainObject(value)) {
      const nested = pickMissing(
        value,
        isPlainObject(target[key]) ? target[key] : {}
      );
      if (Object.keys(nested).length) missing[key] = nested;
      return;
    }
    if (!(key in target)) missing[key] = value;
  });
  return missing;
};

const fallbackCache = new Map<string, Record<string, unknown>>();

/**
 * The English keys a locale is missing.
 *
 * The server renders with every language bundle loaded plus `fallbackLng: 'en'`,
 * so an untranslated key comes out as English HTML. The browser only ever loads
 * the current locale's bundle, so without this it would render the raw key
 * instead — a text mismatch that fails hydration on every non-English page and
 * makes React throw away the server DOM. Shipping just the gap (~15KB, vs ~67KB
 * for the whole English bundle) keeps both sides in agreement.
 */
export function getFallbackResources(lang: string) {
  if (!lang || lang === defaultLanguage) return null;
  const cached = fallbackCache.get(lang);
  if (cached) return cached;

  const localeResources = resources[lang];
  if (!localeResources) return null;

  const englishMap = toNamespaceMap(resources[defaultLanguage]);
  const localeMap = toNamespaceMap(localeResources);
  const fallback: Record<string, unknown> = {};

  Object.entries(englishMap).forEach(([namespace, value]) => {
    if (!isPlainObject(value)) return;
    const missing = pickMissing(
      value,
      isPlainObject(localeMap[namespace]) ? localeMap[namespace] : {}
    );
    if (Object.keys(missing).length) fallback[namespace] = missing;
  });

  fallbackCache.set(lang, fallback);
  return fallback;
}

export const namespaces = [
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
  'learnMilvus',
];

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    ns: namespaces,
    defaultNS,
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    lowerCaseLng: true,
    initImmediate: false,
    resources,
  });
}

export function getAllLanguageSlugs() {
  return languages
    .filter(v => v !== defaultLanguage && v !== 'cn')
    .map(lang => {
      return { params: { lang: lang } };
    });
}

export default i18n;
