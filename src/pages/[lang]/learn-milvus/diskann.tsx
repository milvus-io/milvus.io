import { getAllLanguageSlugs } from '@/utils/localization';
import LearnMilvusPage from '@/pages/learn-milvus/diskann';

export default LearnMilvusPage;

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
