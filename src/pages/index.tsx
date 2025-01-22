import Head from 'next/head';
import HomePageHeaderSection from '../parts/home/headerSection';
import CodeExampleSection from '../parts/home/codeExampleSection';
import TryFreeSection, { AIToolsSection } from '@/parts/home/tryFreeSection';
import LovedSection from '@/parts/home/lovedSection';
import VectorDatabaseSection from '@/parts/home/vdbSection';
import DeploySection from '@/parts/home/deploySection';
import DevelopSection, { MeetupsSection } from '@/parts/home/developSection';
import SubscribeSection from '@/parts/home/subscribeSection';
import Layout from '@/components/layout/commonLayout';
import { getMilvusStats } from '@/http/home';
import { ProductionSection } from '@/parts/home/productionSection/ProductionSection';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { getHomepageHeadline } from '@/utils/blogs';
import classes from '@/styles/home.module.less';
import { LanguageEnum } from '@/types/localization';

export default function Homepage(props: {
  headline: { label: string; link: string };
}) {
  const { headline } = props;
  return (
    <Layout>
      <main className={classes.homepageContainer}>
        <Head>
          <title>
            The High-Performance Vector Database Built for Scale | Milvus
          </title>
          <meta
            name="description"
            content="Open-source vector database built for GenAI applications. Install with pip, perform high-speed searches, and scale to tens of billions of vectors."
          />
          <link rel="alternate" href={`${ABSOLUTE_BASE_URL}/`} hrefLang="en" />
        </Head>
        <HomePageHeaderSection {...headline} locale={LanguageEnum.ENGLISH} />
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
  const headline = getHomepageHeadline();
  return {
    props: {
      headline,
    },
  };
};
