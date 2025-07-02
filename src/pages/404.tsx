import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation, Trans } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import Head from 'next/head';
import styles from '@/styles/404.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import BlogCard from '@/components/card/BlogCard';
import { generateAllBlogContentList } from '@/utils/blogs';
import { BlogDataType } from '@/types/blogs';
import CustomButton from '@/components/customButton';
import { RightWholeArrow } from '@/components/icons';
import DevelopSection from '@/parts/home/developSection';
import { useGlobalLocale } from '@/hooks/use-global-locale';

const NotFoundPage = (props: { blogList: BlogDataType[] }) => {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('notFound', { lng: locale });
  const { blogList } = props;

  const router = useRouter();
  const pagePath = router.asPath;

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view_sp',
      page_path: pagePath,
      referrer: document.referrer,
    });
  }, [pagePath]);

  const navigatorCards = [
    {
      name: t('docs'),
      link: '/docs',
    },
    {
      name: t('homepage'),
      link: '/',
    },
    {
      name: t('tutorial'),
      link: '/docs/tutorials-overview.md',
    },
  ];

  return (
    <Layout>
      <main>
        <Head>
          <title>Open Source Vector Database Built for Scale | Milvus</title>
          <meta
            name="description"
            content="Milvus is an open-source vector database with high performance built for GenAI applications."
          />
          <meta
            name="keywords"
            content="Open source vector databases, GenAI, Milvus, RAG, Vector Similarity Search"
          />
        </Head>

        <section
          className={clsx(pageClasses.homeContainer, styles.navContainer)}
        >
          <h1 className={styles.pageTitle}>{t('title')}</h1>
          <p className={styles.abstract}>
            <Trans
              t={t}
              i18nKey="content"
              components={[<br key="splitter"></br>]}
            />
          </p>
          <p className={styles.subtitle}>{t('subtitle')}</p>
          <ul className={styles.navList}>
            {navigatorCards.map(v => (
              <li className="" key={v.name}>
                <CustomButton
                  href={v.link}
                  endIcon={<RightWholeArrow />}
                  variant="outlined"
                  className={styles.navButton}
                >
                  {v.name}
                </CustomButton>
              </li>
            ))}
          </ul>
        </section>
        <section
          className={clsx(pageClasses.homeContainer, styles.exploreContainer)}
        >
          <h2 className="">{t('explore.title')}</h2>
          <p className="">{t('explore.desc')}</p>

          <ul className={styles.blogList}>
            {blogList.map(blog => (
              <li className="" key={blog.frontMatter.id}>
                <BlogCard
                  title={blog.frontMatter.title}
                  desc={blog.frontMatter.desc}
                  tags={[blog.frontMatter.tag]}
                  cover={`https://${blog.frontMatter.cover}`}
                  path={`${blog.frontMatter.id}`}
                  locale={locale}
                />
              </li>
            ))}
          </ul>
          <div className={styles.whatIsMilvusWrapper}>
            <h2 className="">{t('explore.whatIsMilvus.title')}</h2>
            <p className="">{t('explore.whatIsMilvus.desc')}</p>
            <CustomButton
              endIcon={<RightWholeArrow />}
              href="/docs/overview.md"
              className={styles.learnMoreButton}
            >
              {t('explore.whatIsMilvus.learnMore')}
            </CustomButton>
          </div>
        </section>
        <DevelopSection showMeetup={false} />
      </main>
    </Layout>
  );
};
export default NotFoundPage;

export const getStaticProps = async () => {
  const list = generateAllBlogContentList();

  // they want to display the blogs in specific order
  const blogList = [
    list.find(
      v =>
        v.frontMatter.id.trim() ===
        'introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md'
    ),
    list.find(
      v =>
        v.frontMatter.id.trim() ===
        'journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md'
    ),
    list.find(
      v =>
        v.frontMatter.id.trim() ===
        'benchmarks-lie-vector-dbs-deserve-a-real-test.md'
    ),
  ];

  return {
    props: {
      blogList,
    },
  };
};
