import { getAllLanguageSlugs } from '@/i18n';
import { MilvusDemos } from '@/parts/tutorials/Demo';

export default MilvusDemos;

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
