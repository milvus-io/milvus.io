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
    const { content, tags, metaData, ...rest } = allData.find(
      v => v.id === id
    ) || {
      tags: [],
      metaData: {},
      title: id,
      content: 'Blog Translation Not Provided.',
    };

    const {
      tree: newHtml,
      codeList = [],
      anchorList = [],
    } = lang === LanguageEnum.ENGLISH
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
        locale: lang,
        newHtml,
        anchorList: anchorList.filter(item => item.label !== rest.title),
        codeList,
        moreBlogs: moreBlogs.length
          ? moreBlogs
          : allData.filter(item => item.id !== id).slice(0, 4),
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
