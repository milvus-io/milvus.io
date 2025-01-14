import { LanguageEnum } from '@/types/localization';
import { createDocHomeProps } from '@/components/localization/CreateDocHomeProps';
import { DocHomepage } from '@/components/localization/DocHome';

export default DocHomepage;

export const getStaticProps = async () => {
  const getPageStaticProps = createDocHomeProps(LanguageEnum.FRANCE, 'v2.4.x');
  return getPageStaticProps();
};
