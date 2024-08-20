import { GetStaticProps } from 'next';
import { DocSlugPage } from '@/components/localization/DocSlug';
import { createDocSlugProps } from '@/components/localization/CreateDocSlugProps';
import { LanguageEnum } from '@/components/language-selector';

// this is doc detail page which's version is not the latest
export default DocSlugPage;

export const getStaticPaths = () => {
  const { getPageStaticPaths } = createDocSlugProps(LanguageEnum.ENGLISH);
  return getPageStaticPaths();
};

export const getStaticProps: GetStaticProps = async context => {
  const { getPageStaticProps } = createDocSlugProps(LanguageEnum.ENGLISH);
  return getPageStaticProps(context);
};
