import { GetStaticProps } from 'next';
import { LanguageEnum } from '@/types/localization';
import { DocDetailPage } from '@/components/localization/DocDetail';
import { createDocDetailProps } from '@/components/localization/CreateDocDetailProps';

export default DocDetailPage;

export const getStaticPaths = () => {
  const { getPageStaticPaths } = createDocDetailProps(
    LanguageEnum.KOREAN,
    'v2.4.x'
  );
  return getPageStaticPaths();
};

export const getStaticProps: GetStaticProps = async context => {
  const { getPageStaticProps } = createDocDetailProps(
    LanguageEnum.KOREAN,
    'v2.4.x'
  );
  return getPageStaticProps(context);
};
