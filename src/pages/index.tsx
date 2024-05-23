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

export default function Homepage() {
  const { t } = useTranslation('home');

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
        <HomePageHeaderSection download={45987} star={27214} />
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
