export enum LanguageEnum {
  ENGLISH = 'en',
  CHINESE = 'zh',
  CHINESE_TW = 'zh-hant',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  FRANCE = 'fr',
  GERMAN = 'de',
  SPANISH = 'es',
  ITALIAN = 'it',
  PORTUGUESE = 'pt',
  RUSSIAN = 'ru',
  INDONESIAN = 'id',
  ARABIC = 'ar',
}

// Languages we want search engines to index. These are advertised in the
// sitemap and form the hreflang cluster; every other language self-references
// the user-facing page but canonicalizes to English so it is consolidated
// instead of competing for the index. Driven by GSC click data — only English
// plus zh/ko/zh-hant/ja carry meaningful non-English traffic.
//
// NOTE: sitemap.config.js (CommonJS) keeps its own copy of this list and must
// be kept in sync with this constant.
export const INDEXABLE_LANGUAGES: LanguageEnum[] = [
  LanguageEnum.ENGLISH,
  LanguageEnum.CHINESE,
  LanguageEnum.KOREAN,
  LanguageEnum.CHINESE_TW,
  LanguageEnum.JAPANESE,
];

export const isIndexableLanguage = (lang: LanguageEnum | string): boolean =>
  INDEXABLE_LANGUAGES.includes(lang as LanguageEnum);
