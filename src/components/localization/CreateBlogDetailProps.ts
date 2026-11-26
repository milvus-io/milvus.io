import blogUtils from '@/utils/blog.utils';
import { isIndexableLanguage, LanguageEnum } from '@/types/localization';
import { markdownToHtml } from '@/utils/markdown';
import { ABSOLUTE_BASE_URL } from '@/consts';

export const createBlogDetailProps = (lang: LanguageEnum) => {
  const getBlogDetailStaticPaths = () => {
    const paths = blogUtils.getRouter(lang);

    return {
      paths,
      fallback: false,
    };
  };

  const getBlogDetailStaticProps = async ({ params }) => {
    const { id } = params;

    // Validate against the lightweight English metadata index first so unknown
    // IDs on localized blocking routes 404 immediately without scanning or
    // caching any localized directory or article bodies.
    const enList = blogUtils.getListData(LanguageEnum.ENGLISH);
    const enMeta = enList.find(v => v.id === id) as
      | Record<string, any>
      | undefined;
    if (!enMeta) {
      return { notFound: true };
    }

    const langData =
      lang === LanguageEnum.ENGLISH
        ? undefined
        : blogUtils.getSingleData(lang, id);
    const sourceData =
      langData || blogUtils.getSingleData(LanguageEnum.ENGLISH, id);
    if (!sourceData) {
      return { notFound: true };
    }

    const { content, tags, metaData, ...rest } = sourceData;

    const {
      tree: newHtml,
      codeList = [],
      anchorList = [],
    } = markdownToHtml(content, {
      showAnchor: true,
      version: 'blog',
      useLatex: true,
    });

    const listData =
      lang === LanguageEnum.ENGLISH ? enList : blogUtils.getListData(lang);
    const moreBlogs = listData
      .filter(v => v.tags.some(tag => tags.includes(tag) && v.id !== id))
      .slice(0, 4);

    // Canonical strategy by language:
    // - A cross-post (English blog has an external canonicalUrl, e.g. a
    //   zilliz.com original) always wins for every language — none of these
    //   should be indexed on milvus.io.
    // - Indexable languages (en/zh/ko/zh-hant/ja) self-reference so each gets
    //   indexed, paired with the hreflang cluster emitted in BlogDetail.
    // - Every other language points to the English milvus.io blog URL to
    //   consolidate it to English instead of competing for the index.
    const enCanonicalUrl = enMeta.canonicalUrl as string | undefined;
    let canonicalUrl: string | null =
      (rest as Record<string, any>).canonicalUrl ?? null;
    if (lang !== LanguageEnum.ENGLISH) {
      canonicalUrl =
        enCanonicalUrl ||
        (isIndexableLanguage(lang)
          ? `${ABSOLUTE_BASE_URL}/${lang}/blog/${id}`
          : `${ABSOLUTE_BASE_URL}/blog/${id}`);
    }

    const availableLanguages = blogUtils.getAvailableLanguages(id);

    return {
      props: {
        blogId: id,
        locale: lang,
        newHtml,
        anchorList: anchorList.filter(
          item => item.label !== rest.title && item.type === 2
        ),
        codeList,
        moreBlogs: [
          ...moreBlogs,
          ...listData.filter(item => item.id !== id),
        ]
          .slice(0, 4)
          .map(({ id, title, cover, tags, desc }) => ({
            id,
            title,
            cover,
            tags,
            ...(desc !== undefined && { desc }),
          })),
        tags,
        ...rest,
        canonicalUrl,
        availableLanguages,
      },
    };
  };

  return {
    getBlogDetailStaticPaths,
    getBlogDetailStaticProps,
  };
};
