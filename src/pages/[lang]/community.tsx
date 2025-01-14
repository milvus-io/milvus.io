import { getAllLanguageSlugs } from '@/i18n';
import { Community } from '@/parts/community/Community';

export default Community;

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
