import { LanguageEnum } from '@/types/localization';

export const SHOW_LANGUAGE_SELECTOR_VERSIONS = ['v2.4.x', 'v2.5.x'];

export const DISABLED_LANGUAGE_SELECTOR_VERSIONS = [
  'v2.3.x',
  'v2.2.x',
  'v2.1.x',
  'v2.0.x',
];

export const DOCS_LANGUAGE_DISABLED_MAP = {
  'v2.5.x': [],
  'v2.4.x': [
    LanguageEnum.CHINESE_TW,
    LanguageEnum.RUSSIAN,
    LanguageEnum.INDONESIAN,
    LanguageEnum.ARABIC,
  ],
};
