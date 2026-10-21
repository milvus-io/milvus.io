import LandingPage from '@/components/seo-landings/LandingPage';
import { getLandingPaths, getLandingProps } from '@/server/seo-landing-catalog';
export default LandingPage;
export const getStaticPaths = async () => getLandingPaths('en', 'solutions', false);
export const getStaticProps = async ({ params }) => getLandingProps('en', 'solutions', params.slug);
