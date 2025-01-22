import { LanguageEnum } from '@/types/localization';
import { BlogDetail } from '@/components/localization/BlogDetail';
import { createBlogDetailProps } from '@/components/localization/CreateBlogDetailProps';

export default BlogDetail;

export const getStaticPaths = () => {
  const { getBlogDetailStaticPaths } = createBlogDetailProps(
    LanguageEnum.ENGLISH
  );
  return getBlogDetailStaticPaths();
};

export const getStaticProps = async ({ params }) => {
  const { getBlogDetailStaticProps } = createBlogDetailProps(
    LanguageEnum.ENGLISH
  );
  return getBlogDetailStaticProps({ params });
};
