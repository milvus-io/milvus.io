import HomePageHeaderSection from '../parts/home/headerSection';
import CodeExampleSection from '../parts/home/codeExampleSection';
import { AIToolsSection } from '@/parts/home/tryFreeSection';
import LovedSection from '@/parts/home/lovedSection';
import VectorDatabaseSection from '@/parts/home/vdbSection';
import DeploySection from '@/parts/home/deploySection';
import DevelopSection, { MeetupsSection } from '@/parts/home/developSection';
import Layout from '@/components/layout/commonLayout';
import { ProductionSection } from '@/parts/home/productionSection/ProductionSection';
import { getHomepageHeadline } from '@/utils/blogs';
import classes from '@/styles/home.module.less';
import { LanguageEnum } from '@/types/localization';
import { HomeMeta } from '@/parts/home/meta/HomeMeta';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export default function Homepage(props: {
  headlines: { label: string; link: string; tag: string }[];
}) {
  const { headlines } = props;
  const { locale } = useGlobalLocale();

  return (
    <Layout>
      <main className={classes.homepageContainer}>
        <HomeMeta locale={locale || LanguageEnum.ENGLISH} />
        <HomePageHeaderSection headlines={headlines} locale={locale} />
        <CodeExampleSection />
        <DeploySection />
        <AIToolsSection />
        <DevelopSection />
        <LovedSection />
        <ProductionSection />
        <MeetupsSection />
        <VectorDatabaseSection />
      </main>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { headlines } = getHomepageHeadline();
  return {
    props: {
      headlines,
    },
  };
};
