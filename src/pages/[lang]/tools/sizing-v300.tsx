import { getAllLanguageSlugs } from '@/utils/localization';
import SizingTool from '@/pages/tools/sizing';
import { MILVUS_V300_TAG } from '@/utils/sizingToolV300';

export default SizingTool;
export function getStaticPaths() {
  return { paths: getAllLanguageSlugs(), fallback: false };
}
export function getStaticProps({ params }) {
  return { props: { locale: params.lang, profile: 'v300', latestTag: MILVUS_V300_TAG } };
}
