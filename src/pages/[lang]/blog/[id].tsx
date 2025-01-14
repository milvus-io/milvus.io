import { LanguageEnum } from '@/types/localization';
import { BlogDetail } from '@/components/localization/BlogDetail';
import { createBlogDetailProps } from '@/components/localization/CreateBlogDetailProps';
import { getAllLanguageSlugs } from '@/i18n';

export default BlogDetail;

export const getStaticPaths = () => {
  const langPaths = getAllLanguageSlugs();
  const { getBlogDetailStaticPaths } = createBlogDetailProps(
    LanguageEnum.ENGLISH
  );

  let paths = [];
  const { paths: idPaths } = getBlogDetailStaticPaths();
  for (let langPath of langPaths) {
    for (let idPath of idPaths) {
      paths.push({ params: { ...langPath.params, ...idPath.params } });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const locale = params.lang as LanguageEnum;
  const { getBlogDetailStaticProps } = createBlogDetailProps(locale);
  return getBlogDetailStaticProps({ params });
};
