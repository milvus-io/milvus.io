import Layout from '@/components/layout/commonLayout';
import { HomeMeta2 } from '@/parts/home2/meta/HomeMeta2';
import classes from '@/styles/home2.module.css';
import pageClasses from '@/styles/responsive.module.css';
import { LanguageEnum } from '@/types/localization';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export default function Homepage2() {
  const { locale } = useGlobalLocale();

  return (
    <Layout headerClassName={pageClasses.homeContainer}>
      <main className={classes.homepageContainer}>
        <HomeMeta2 locale={locale || LanguageEnum.ENGLISH} />
        {/* Sections will be added in later tasks */}
      </main>
    </Layout>
  );
}
