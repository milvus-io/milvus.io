import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const defaultNS = 'common';
const defaultLanguage = 'en';
const namespaces = [
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

type I18nResource = Record<string, unknown>;

declare global {
  interface Window {
    __I18N_RESOURCES__?: Record<string, I18nResource>;
  }
}

const loadedLanguages = new Set<string>();
const isBrowser = typeof window !== 'undefined';

const normalizeLocale = (locale = defaultLanguage) => locale.toLowerCase();

const normalizeResource = (resource: Record<string, unknown>) => {
  const { default: defaultExport, __esModule, ...namedExports } = resource;
  return Object.keys(namedExports).length
    ? namedExports
    : ((defaultExport as I18nResource) ?? {});
};

const addResource = (locale: string, resource: Record<string, unknown>) => {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedResource = normalizeResource(resource);

  Object.entries(normalizedResource).forEach(([namespace, value]) => {
    i18n.addResourceBundle(normalizedLocale, namespace, value, true, true);
  });

  loadedLanguages.add(normalizedLocale);

  if (normalizedLocale === 'zh' && !loadedLanguages.has('cn')) {
    addResource('cn', normalizedResource);
  }

  if (normalizedLocale === 'cn' && !loadedLanguages.has('zh')) {
    addResource('zh', normalizedResource);
  }
};

const getResourceLoader = (locale: string) => {
  switch (normalizeLocale(locale)) {
    case 'cn':
    case 'zh':
      return () => import('./cn');
    case 'zh-hant':
      return () => import('./zh-hant');
    case 'ja':
      return () => import('./ja');
    case 'ko':
      return () => import('./ko');
    case 'fr':
      return () => import('./fr');
    case 'de':
      return () => import('./de');
    case 'it':
      return () => import('./it');
    case 'pt':
      return () => import('./pt');
    case 'es':
      return () => import('./es');
    case 'ru':
      return () => import('./ru');
    case 'id':
      return () => import('./id');
    case 'ar':
      return () => import('./ar');
    case 'en':
    default:
      return () => import('./en');
  }
};

export const loadI18nResources = async (locale = defaultLanguage) => {
  const normalizedLocale = normalizeLocale(locale);
  if (loadedLanguages.has(normalizedLocale)) {
    return;
  }

  const inlineResources = window.__I18N_RESOURCES__?.[normalizedLocale];
  const resources =
    inlineResources ?? (await getResourceLoader(normalizedLocale)());
  addResource(normalizedLocale, resources as Record<string, unknown>);
};

if (isBrowser && !i18n.isInitialized) {
  const initialLocale = normalizeLocale(
    document.documentElement.lang ||
      document.cookie.match(/(?:^|; )lang=([^;]+)/)?.[1] ||
      defaultLanguage
  );
  const initialResources = window.__I18N_RESOURCES__?.[initialLocale];

  i18n.use(initReactI18next).init({
    lng: initialLocale,
    fallbackLng: defaultLanguage,
    ns: namespaces,
    defaultNS,
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    lowerCaseLng: true,
    initImmediate: false,
    partialBundledLanguages: true,
    resources: initialResources ? { [initialLocale]: initialResources } : {},
  });

  if (initialResources) {
    loadedLanguages.add(initialLocale);
  }
}

export default i18n;
