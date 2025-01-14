import Head from 'next/head';
import HomePageHeaderSection from '@/parts/home/headerSection';
import CodeExampleSection from '@/parts/home/codeExampleSection';
import { AIToolsSection } from '@/parts/home/tryFreeSection';
import LovedSection from '@/parts/home/lovedSection';
import VectorDatabaseSection from '@/parts/home/vdbSection';
import DeploySection from '@/parts/home/deploySection';
import DevelopSection, { MeetupsSection } from '@/parts/home/developSection';
import Layout from '@/components/layout/commonLayout';
import { ProductionSection } from '@/parts/home/productionSection/ProductionSection';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { getHomepageHeadline } from '@/utils/blogs';
import classes from '@/styles/home.module.less';
import { getAllLanguageSlugs } from '@/i18n';
import { LanguageEnum } from '@/types/localization';

export default function Homepage(props: {
  headline: { label: string; link: string };
  lang: LanguageEnum;
}) {
  const { headline, lang } = props;
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
          <link
            rel="alternate"
            href={`${ABSOLUTE_BASE_URL}/${lang}`}
            hrefLang={lang}
          />
        </Head>
        <HomePageHeaderSection {...headline} locale={lang} />
        <CodeExampleSection />
        <DeploySection />
        <AIToolsSection />
        <LovedSection />
        <ProductionSection />
        <DevelopSection />
        <MeetupsSection />
        <VectorDatabaseSection />
      </main>
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const { lang } = params;
  const headline = getHomepageHeadline(
    `src/blogs/localization/homepage/${lang}/index.json`
  );
  return {
    props: {
      lang,
      headline,
    },
  };
};
