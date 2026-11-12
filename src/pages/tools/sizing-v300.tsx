export { default } from './sizing';
import { MILVUS_V300_TAG } from '@/utils/sizingToolV300';

export const getStaticProps = async () => ({
  props: { profile: 'v300', latestTag: MILVUS_V300_TAG },
});
