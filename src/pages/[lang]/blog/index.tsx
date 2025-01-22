import { BlogHome } from '@/components/localization/BlogHome';
import blogUtils from '@/utils/blog.utils';
import { LanguageEnum } from '@/types/localization';
import { getAllLanguageSlugs } from '@/i18n';

export default BlogHome;

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export const getStaticProps = props => {
  const { lang } = props.params;
  const locale = lang as LanguageEnum;
  const blogList = blogUtils.getAllData(locale);

  return {
    props: {
      locale,
      blogList,
    },
  };
};
