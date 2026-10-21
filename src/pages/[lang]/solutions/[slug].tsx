import LandingPage from '@/components/seo-landings/LandingPage';
import { getLandingPaths, getLandingProps } from '@/server/seo-landing-catalog';
export default LandingPage;
export const getStaticPaths = async () => getLandingPaths('zh', 'solutions', true);
export const getStaticProps = async ({ params }) => getLandingProps('zh', 'solutions', params.slug);
