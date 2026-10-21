import { LandingIndex } from '@/components/seo-landings/LandingPage';
import { getLandingIndexProps } from '@/server/seo-landing-catalog';
export default LandingIndex;
export const getStaticPaths = async () => ({ paths: [{params:{lang:'zh'}}], fallback: false });
export const getStaticProps = async () => getLandingIndexProps('zh', 'compare');
