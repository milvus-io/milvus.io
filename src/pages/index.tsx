import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import HomePageHeaderSection from '../parts/home/headerSection';
import CodeExampleSection from '../parts/home/codeExampleSection';
import TryFreeSection from '@/parts/home/tryFreeSection';
import LovedSection from '@/parts/home/lovedSection';
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
      </main>
    </Layout>
  );
}
