import { getAllLanguageSlugs } from '@/i18n';
import { IntroMilvus } from '@/parts/intro/IntroMIlvus';

export default IntroMilvus;

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return {
    props: { locale: params.lang },
  };
}
