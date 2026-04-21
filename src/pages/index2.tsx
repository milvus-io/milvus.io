import Layout from '@/components/layout/commonLayout';
import { HomeMeta2 } from '@/parts/home2/meta/HomeMeta2';
import HeroSection2 from '@/parts/home2/heroSection2';
import CapabilityPillars from '@/parts/home2/capabilityPillars';
import CodeWalkthrough from '@/parts/home2/codeWalkthrough';
import ArchitectureSection from '@/parts/home2/architectureSection';
import EcosystemMatrix from '@/parts/home2/ecosystemMatrix';
import ProductionSection2 from '@/parts/home2/productionSection2';
import LovedSection2 from '@/parts/home2/lovedSection2';
import CommunityMeetups from '@/parts/home2/communityMeetups';
import FinalCTA from '@/parts/home2/finalCTA';
import classes from '@/styles/home2.module.css';
import pageClasses from '@/styles/responsive.module.css';
import { LanguageEnum } from '@/types/localization';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { getHomepageHeadline } from '@/utils/blogs';

type Props = {
  headlines: { label: string; link: string; tag: string }[];
};

export default function Homepage2(props: Props) {
  const { headlines } = props;
  const { locale } = useGlobalLocale();
  const resolvedLocale = locale || LanguageEnum.ENGLISH;

  return (
    <Layout headerClassName={pageClasses.homeContainer}>
      <main className={classes.homepageContainer}>
        <HomeMeta2 locale={resolvedLocale} />
        <HeroSection2 headlines={headlines} locale={resolvedLocale} />
        <CapabilityPillars />
        <CodeWalkthrough />
        <ArchitectureSection />
        <EcosystemMatrix />
        <ProductionSection2 />
        <LovedSection2 />
        <CommunityMeetups />
        <FinalCTA />
        {/* Sections 2-9 added in later tasks */}
      </main>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { headlines } = getHomepageHeadline();
  return { props: { headlines } };
};
