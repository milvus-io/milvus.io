import { fetchMilvusReleases } from '@/http/milvus';
import { getAllLanguageSlugs } from '@/utils/localization';
import SizingTool from '@/pages/tools/sizing-v250';

export default SizingTool;

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const latestTag = await fetchMilvusReleases('v2.5.');
  return {
    props: { locale: params.lang, latestTag },
  };
}
