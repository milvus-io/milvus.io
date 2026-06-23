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

    const allData = blogUtils.getAllData(lang);
    const enData = blogUtils.getAllData(LanguageEnum.ENGLISH);

    const langData = allData.find(v => v.id === id);
    const fallbackData = enData.find(v => v.id === id);
    const noTranslationData = {
      tags: [],
      metaData: {},
      title: id,
      content: 'Blog Translation Not Provided.',
    };

    const sourceData = langData || fallbackData || noTranslationData;

    const { content, tags, metaData, ...rest } = sourceData;

    const {
      tree: newHtml,
      codeList = [],
      anchorList = [],
    } = sourceData === langData || sourceData === fallbackData
      ? markdownToHtml(content, {
          showAnchor: true,
          version: 'blog',
          useLatex: true,
        })
      : { ...metaData, tree: content };

    const moreBlogs = allData
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
    const enBlog = enData.find(v => v.id === id) as
      | Record<string, any>
      | undefined;
    const enCanonicalUrl = enBlog?.canonicalUrl as string | undefined;
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
        anchorList: anchorList.filter(item => item.label !== rest.title && item.type === 2),
        codeList,
        moreBlogs: [
          ...moreBlogs,
          ...allData.filter(item => item.id !== id),
        ].slice(0, 4),
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
