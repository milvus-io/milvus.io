import LandingPage from '@/components/seo-landings/LandingPage';
import { getLandingPaths, getLandingProps } from '@/server/seo-landing-catalog';
export default LandingPage;
export const getStaticPaths = async () => getLandingPaths('en', 'compare', false);
export const getStaticProps = async ({ params }) => getLandingProps('en', 'compare', params.slug);
