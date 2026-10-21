import { LandingIndex } from '@/components/seo-landings/LandingPage';
import { getLandingIndexProps } from '@/server/seo-landing-catalog';
export default LandingIndex;
export const getStaticProps = async () => getLandingIndexProps('en', 'solutions');
