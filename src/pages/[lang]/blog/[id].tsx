import { INDEXABLE_LANGUAGES, LanguageEnum } from '@/types/localization';
import { BlogDetail } from '@/components/localization/BlogDetail';
import { createBlogDetailProps } from '@/components/localization/CreateBlogDetailProps';
import { getAllLanguageSlugs } from '@/utils/localization';
import {
  writeSitemapSegment,
  type ContentSitemapEntry,
} from '@/utils/doc-sitemap-segments';
import {
  getContentLastModified,
  readContentFrontMatter,
} from '@/server/content-freshness';

export default BlogDetail;

const VALID_LOCALIZED_BLOG_LANGS = new Set<string>(
  getAllLanguageSlugs().map(({ params }) => params.lang)
);

const INDEXABLE_NON_EN_LANGS = INDEXABLE_LANGUAGES.filter(
  lang => lang !== LanguageEnum.ENGLISH
);

export const getStaticPaths = () => {
  if (process.env.NODE_ENV === 'production') {
    const { getBlogDetailStaticPaths } = createBlogDetailProps(
      LanguageEnum.ENGLISH
    );
    const { paths: idPaths } = getBlogDetailStaticPaths();

    const entries: ContentSitemapEntry[] = [];
    for (const lang of INDEXABLE_NON_EN_LANGS) {
      for (const {
        params: { id },
      } of idPaths) {
        const localizedPath = `src/blogs/localization/blog/${lang}/${id}`;
        const localizedMeta = readContentFrontMatter(localizedPath);
        let lastmod: string | undefined;
        if (
          typeof localizedMeta?.title === 'string' &&
          localizedMeta.title.trim()
        ) {
          lastmod = getContentLastModified(localizedPath, localizedMeta);
        } else {
          const englishPath = `src/blogs/blog/en/${id}`;
          const englishMeta = readContentFrontMatter(englishPath);
          if (englishMeta) {
            lastmod = getContentLastModified(englishPath, englishMeta);
          }
        }
        entries.push({
          loc: `/${lang}/blog/${id}`,
          lastmod,
          onDemand: true,
        });
      }
    }
    writeSitemapSegment('blog__localized', entries);
  }

  // Only English blogs (/blog/[id]) are prerendered at build time. Localized
  // blog routes are generated on demand via the blocking fallback and cached
  // by the running server, matching the docs and archived API-reference setup.
  return {
    paths: [],
    fallback: 'blocking' as const,
  };
};

export const getStaticProps = async ({ params }) => {
  const locale = params.lang as LanguageEnum;
  if (!VALID_LOCALIZED_BLOG_LANGS.has(locale)) {
    return { notFound: true };
  }
  const { getBlogDetailStaticProps } = createBlogDetailProps(locale);
  return getBlogDetailStaticProps({ params });
};
