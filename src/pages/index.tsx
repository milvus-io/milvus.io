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
import classes from '@/styles/home.module.css';
import pageClasses from '@/styles/responsive.module.css';
import { LanguageEnum } from '@/types/localization';
import { HomeMeta } from '@/parts/home/meta/HomeMeta';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import JsonLd from '@/components/JsonLd';
import { buildSchema } from '@/schema';
import { CLOUD_SIGNUP_LINK, GITHUB_MILVUS_LINK } from '@/consts';

export default function Homepage(props: {
  headlines: { label: string; link: string; tag: string }[];
}) {
  const { headlines } = props;
  const { locale } = useGlobalLocale();

  return (
    <Layout headerClassName={pageClasses.homeContainer}>
      <main className={classes.homepageContainer}>
        <HomeMeta locale={locale || LanguageEnum.ENGLISH} />
        <JsonLd
          schema={[
            buildSchema('organization'),
            buildSchema('website'),
            buildSchema('softwareApp', {
              offerUrl: CLOUD_SIGNUP_LINK,
              codeRepository: GITHUB_MILVUS_LINK,
            }),
          ]}
        />
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
