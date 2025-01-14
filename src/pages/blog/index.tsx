import { BlogHome } from '@/components/localization/BlogHome';
import blogUtils from '@/utils/blog.utils';
import { LanguageEnum } from '@/types/localization';

export default BlogHome;

export const getStaticProps = () => {
  const locale = LanguageEnum.ENGLISH;
  const blogList = blogUtils.getAllData(locale);
  return {
    props: {
      locale,
      blogList,
    },
  };
};
