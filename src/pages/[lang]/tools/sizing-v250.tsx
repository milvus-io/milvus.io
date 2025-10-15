import { getAllLanguageSlugs } from '@/i18n';
import SizingTool from '@/pages/tools/sizing-v250';

export default SizingTool;

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
