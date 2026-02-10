import blogUtils from '@/utils/blog.utils';
import { LanguageEnum } from '@/types/localization';
import { markdownToHtml } from '@/utils/common';

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

    return {
      props: {
        blogId: id,
        locale: lang,
        newHtml,
        anchorList: anchorList.filter(item => item.label !== rest.title),
        codeList,
        moreBlogs: [
          ...moreBlogs,
          ...allData.filter(item => item.id !== id),
        ].slice(0, 4),
        tags,
        ...rest,
      },
    };
  };

  return {
    getBlogDetailStaticPaths,
    getBlogDetailStaticProps,
  };
};
