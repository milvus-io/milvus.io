import { fetchMilvusReleases } from '@/http/milvus';
import { getAllLanguageSlugs } from '@/utils/localization';
import SizingTool from '@/pages/tools/sizing';

export default SizingTool;

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const latestTag = await fetchMilvusReleases('v2.6.');
  return {
    props: { locale: params.lang, latestTag },
  };
}
