import Head from 'next/head';
import HomePageHeaderSection from '../parts/home/headerSection';
import CodeExampleSection from '../parts/home/codeExampleSection';
import TryFreeSection, { AIToolsSection } from '@/parts/home/tryFreeSection';
import LovedSection from '@/parts/home/lovedSection';
import VectorDatabaseSection from '@/parts/home/vdbSection';
import DeploySection from '@/parts/home/deploySection';
import DevelopSection from '@/parts/home/developSection';
import SubscribeSection from '@/parts/home/subscribeSection';
import Layout from '@/components/layout/commonLayout';
import { getMilvusStats } from '@/http/home';
import { ProductionSection } from '@/parts/home/productionSection/ProductionSection';
import { ABSOLUTE_BASE_URL } from '@/consts';

export default function Homepage(props: {
  pipInstall: number;
  milvusStars: number;
}) {
  // deconstruction props
  const { pipInstall, milvusStars } = props;

  return (
    <Layout>
      <main
        style={{
          backgroundColor: '#FAFAFA',
        }}
      >
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
        <HomePageHeaderSection download={pipInstall} star={milvusStars} />
        <CodeExampleSection />
        <TryFreeSection />
        <DeploySection />
        <AIToolsSection />
        <LovedSection />
        <ProductionSection />
        <VectorDatabaseSection />
        <DevelopSection />
        <SubscribeSection />
      </main>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { pipInstall, milvusStars } = await getMilvusStats();

  return {
    props: {
      pipInstall,
      milvusStars,
    },
  };
};
