import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import HomePageHeaderSection from '../parts/home/headerSection';
import CodeExampleSection from '../parts/home/codeExampleSection';
import TryFreeSection from '@/parts/home/tryFreeSection';
import LovedSection from '@/parts/home/lovedSection';
import VectorDatabaseSection from '@/parts/home/vdbSection';
import DeploySection from '@/parts/home/deploySection';
import DevelopSection from '@/parts/home/developSection';
import SubscribeSection from '@/parts/home/subscribeSection';
import Layout from '@/components/layout/commonLayout';
import { getMilvusStats } from '@/http/home';

export default function Homepage(props: {
  pipInstall: number;
  milvusStars: number;
}) {
  const { t } = useTranslation('home');

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
          <title>Vector database - Milvus</title>
          <meta name="description" content="" />
        </Head>
        <HomePageHeaderSection download={pipInstall} star={milvusStars} />
        <CodeExampleSection />
        <TryFreeSection />
        <LovedSection />
        <VectorDatabaseSection />
        <DeploySection />
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
