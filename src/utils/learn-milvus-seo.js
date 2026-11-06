// Shared by page metadata, sitemap generation and llms.txt. Keep the locale
// list aligned with LanguageEnum; regression tests check both lists and routes.
const LEARN_MILVUS_LOCALES = [
  'en', 'zh', 'zh-hant', 'ja', 'ko', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'id', 'ar',
];
const LEARN_MILVUS_TOPICS = ['home', 'metric', 'ivf', 'hnsw', 'diskann'];
const ORIGIN = 'https://milvus.io';

function getLearnMilvusPath(locale, topic = 'home') {
  if (!LEARN_MILVUS_LOCALES.includes(locale) || !LEARN_MILVUS_TOPICS.includes(topic)) {
    return null;
  }
  return `${locale === 'en' ? '' : `/${locale}`}/learn-milvus${topic === 'home' ? '' : `/${topic}`}`;
}

function getLearnMilvusAlternates(path) {
  const topic = LEARN_MILVUS_TOPICS.find(topic => getLearnMilvusPath('en', topic) === path);
  if (!topic) return [];
  return [
    ...LEARN_MILVUS_LOCALES.map(locale => ({
      hreflang: locale,
      href: `${ORIGIN}${getLearnMilvusPath(locale, topic)}`,
    })),
    { hreflang: 'x-default', href: `${ORIGIN}${getLearnMilvusPath('en', topic)}` },
  ];
}

function getLearnMilvusSitemapPaths() {
  return LEARN_MILVUS_TOPICS.flatMap(topic => {
    const alternateRefs = getLearnMilvusAlternates(getLearnMilvusPath('en', topic));
    return LEARN_MILVUS_LOCALES.map(locale => ({
      loc: getLearnMilvusPath(locale, topic),
      changefreq: 'monthly',
      priority: topic === 'home' ? 0.8 : 0.7,
      alternateRefs: alternateRefs.map(ref => ({ ...ref, hrefIsAbsolute: true })),
    }));
  });
}

module.exports = {
  LEARN_MILVUS_LOCALES,
  LEARN_MILVUS_TOPICS,
  getLearnMilvusPath,
  getLearnMilvusAlternates,
  getLearnMilvusSitemapPaths,
};
