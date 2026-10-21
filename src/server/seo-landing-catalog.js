const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(process.cwd(), 'content/seo-landings');
const LANGUAGES = ['en', 'zh'];
const readPages = (lang = 'en') => {
  if (!LANGUAGES.includes(lang)) return [];
  return fs.readdirSync(path.join(ROOT, lang)).filter(f => f.endsWith('.json'))
    .sort().map(f => JSON.parse(fs.readFileSync(path.join(ROOT, lang, f), 'utf8')));
};
const listLandingPages = (lang, group) => readPages(lang).filter(p => p.path.includes(`/${group}/`));
const publicPage = page => {
  const { notes, research, sem_seed_for_zilliz, keywords, ...published } = page;
  return published;
};
const getLandingProps = (lang, group, slug) => {
  const page = listLandingPages(lang, group).find(p => p.path.split('/').pop() === slug);
  if (!page) return { notFound: true };
  const twin = readPages(lang === 'en' ? 'zh' : 'en').find(p => p.slug === page.slug);
  const related = readPages(lang).filter(p => page.related?.includes(p.slug))
    .map(p => ({ title: p.nav, path: p.path }));
  const aiq = JSON.parse(fs.readFileSync(path.join(ROOT, 'aiq-index.json'), 'utf8'));
  const references = (page.aiq || []).map(slug => ({ slug, title: aiq[slug]?.title })).filter(x => x.title);
  return { props: { page: publicPage(page), twinPath: twin.path, related, references, lang } };
};
const getLandingPaths = (lang, group, localized = false) => ({
  paths: listLandingPages(lang, group).map(p => ({ params: {
    ...(localized ? { lang } : {}), slug: p.path.split('/').pop(),
  } })), fallback: false,
});
const getLandingIndexProps = (lang, group) => ({ props: {
  lang, group, pages: listLandingPages(lang, group).map(p => ({ title: p.nav, description: p.description, path: p.path })),
} });
const getLandingSitemapPaths = () => LANGUAGES.flatMap(lang => [
  ...readPages(lang).map(p => ({ loc: p.path, lastmod: p.reviewedOn, changefreq: 'monthly', priority: 0.7 })),
  ...['solutions', 'compare'].map(group => ({ loc: `${lang === 'zh' ? '/zh' : ''}/${group}`, changefreq: 'monthly', priority: 0.7 })),
]);
module.exports = { LANGUAGES, readPages, listLandingPages, getLandingProps, getLandingPaths, getLandingIndexProps, getLandingSitemapPaths };
