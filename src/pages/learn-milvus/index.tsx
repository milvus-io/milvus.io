import Link from 'next/link';
import Head from 'next/head';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import Layout from '@/components/layout/commonLayout';
import styles from '@/components/learn-milvus/learnMilvus.module.css';

export default function LearnMilvusHome() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const PAGES = [
    { to: '/learn-milvus/metric', title: t('home.cards.metric.title'), desc: t('home.cards.metric.desc') },
    { to: '/learn-milvus/ivf', title: t('home.cards.ivf.title'), desc: t('home.cards.ivf.desc') },
    { to: '/learn-milvus/hnsw', title: t('home.cards.hnsw.title'), desc: t('home.cards.hnsw.desc') },
    { to: '/learn-milvus/diskann', title: t('home.cards.diskann.title'), desc: t('home.cards.diskann.desc') },
    { to: '/learn-milvus/tradeoff', title: t('home.cards.tradeoff.title'), desc: t('home.cards.tradeoff.desc') },
  ];

  return (
    <Layout disableLangSelector>
      <Head>
        <title>{t('home.metaTitle')}</title>
        <meta name="description" content={t('home.metaDesc')} />
      </Head>
      <div className={styles.home}>
        <header className={styles.homeHeader}>
          <h1>{t('home.title')}</h1>
          <p>
            <Trans t={t} i18nKey="home.subtitle" components={{ strong: <strong key="strong" /> }} />
          </p>
        </header>
        <div className={styles.homeGrid}>
          {PAGES.map((page) => (
            <Link key={page.to} href={page.to} className={styles.homeCard}>
              <h2>{page.title}</h2>
              <p>{page.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
