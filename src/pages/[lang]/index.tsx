import HomePageHeaderSection from '@/parts/home/headerSection';
import CodeExampleSection from '@/parts/home/codeExampleSection';
import { AIToolsSection } from '@/parts/home/tryFreeSection';
import LovedSection from '@/parts/home/lovedSection';
import VectorDatabaseSection from '@/parts/home/vdbSection';
import DeploySection from '@/parts/home/deploySection';
import DevelopSection, { MeetupsSection } from '@/parts/home/developSection';
import Layout from '@/components/layout/commonLayout';
import { ProductionSection } from '@/parts/home/productionSection/ProductionSection';
import { getHomepageHeadline } from '@/utils/blogs';
import classes from '@/styles/home.module.less';
import { getAllLanguageSlugs } from '@/i18n';
import { LanguageEnum } from '@/types/localization';
import { HomeMeta } from '@/parts/home/meta/HomeMeta';

export default function Homepage(props: {
  headline: { label: string; link: string };
  lang: LanguageEnum;
}) {
  const { headline, lang } = props;
  return (
    <Layout>
      <main className={classes.homepageContainer}>
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
