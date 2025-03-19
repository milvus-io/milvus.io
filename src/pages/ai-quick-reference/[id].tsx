import classes from '@/styles/faq.module.less';
import pageClasses from '@/styles/responsive.module.less';
import styles from '@/styles/blogDetail.module.less';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import { FAQDetailType, generateSimpleFaqList, getFAQById } from '@/http/faq';
import { useRef } from 'react';
import { GetServerSideProps } from 'next';
import Breadcrumb from '@/components/breadcrumb';
import { markdownToHtml } from '@/utils/common';
import Share from '@/components/share';
import CustomButton from '@/components/customButton';
import { RightWholeArrow } from '@/components/icons';
import { CLOUD_SIGNUP_LINK } from '@/consts';
import blogUtils from '@/utils/blog.utils';
import { LanguageEnum } from '@/types/localization';
import CloudAdvertisementCard from '@/components/card/advCard';
import useUtmTrackPath from '@/hooks/use-utm-track-path';

export default function FaqDetail(props: {
  data: FAQDetailType;
  html: string;
  recommendFaq: Pick<FAQDetailType, 'title' | 'url'>[];
  recommendBlogs: {
    title: string;
    url: string;
    id: string;
    href: string;
  }[];
}) {
  const { t } = useTranslation('faq');
  const { data, html, recommendFaq, recommendBlogs } = props;
  const { id, content, title, description, canonical_rel } = data;

  const docContainer = useRef<HTMLDivElement>(null);
  const trackPath = useUtmTrackPath();

  return (
    <Layout>
      <main>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta
            name="keywords"
            content={`${title}, zilliz，vector databases，milvus, managed vector databases`}
          />
        </Head>
      </main>
      <section className={classes.detailContainer}>
        <div className={clsx(pageClasses.docContainer, styles.upLayout)}>
          <section className={styles.blogHeader}>
            <Breadcrumb
              list={[
                {
                  label: t('detail.name'),
                  href: '/ai-quick-reference',
                },
                {
                  label: title,
                },
              ]}
            />

            <h1 className={styles.title}>{title}</h1>
          </section>

          <section className={styles.blogContent}>
            <div
              className={clsx(
                'doc-style',
                'scroll-padding',
                styles.articleContainer
              )}
              ref={docContainer}
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>

            <div className={styles.anchorsContainer}>
              <CloudAdvertisementCard
                className={classes.advCard}
                customAdvConfig={{
                  advTitle: t('detail.adv.title'),
                  advContent: t('detail.adv.content'),
                  advCtaLabel: t('detail.adv.ctaLabel'),
                  advCtaLink: `${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=right_card&utm_content=${trackPath}`,
                }}
              />

              <div className={classes.shareWrapper}>
                <Share
                  url={canonical_rel}
                  quote={title}
                  desc={description}
                  wrapperClass={styles.share}
                  vertical={false}
                />
              </div>

              <div className={classes.recommendBlogWrapper}>
                <h4 className={classes.title}>{t('detail.recommend')}</h4>
                <ul className={classes.recommendBlogList}>
                  {recommendBlogs.map(item => (
                    <li className="" key={item.title}>
                      <Link href={item.href}>{item.title}</Link>
                    </li>
                  ))}
                  <li className={classes.allBlogBtn}>
                    <Link href="/blog">{t('detail.allBlog')}</Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.mobileShareSection}>
            <p>Like the article? Spread the word</p>
            <Share
              url={canonical_rel}
              quote={title}
              desc={description}
              wrapperClass={styles.share}
              vertical={false}
            />
          </section>
        </div>
        <div
          className={clsx(
            pageClasses.docContainer,
            styles.upLayout,
            classes.recommendSection
          )}
        >
          <h2 className={classes.sectionTitle}>{t('detail.keepReading')}</h2>
          <ul className={classes.listWrapper}>
            {recommendFaq.map(item => (
              <li className="" key={item.url}>
                <Link
                  href={`/ai-quick-reference/${item.url}`}
                  className={classes.linkWrapper}
                >
                  <h3 className={classes.recommendTitle}>{item.title}</h3>
                  <CustomButton
                    endIcon={<RightWholeArrow />}
                    variant="text"
                    className={classes.readMoreBtn}
                  >
                    {t('detail.readMore')}
                  </CustomButton>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const faqDetail = await getFAQById(id);
  const simpleList = await generateSimpleFaqList();

  const locale = LanguageEnum.ENGLISH;
  const blogList = blogUtils.getSimpleList(locale);
  const recentlyBlogs = blogList.filter(
    v =>
      new Date().getTime() - new Date(v.date).getTime() <
      12 * 30 * 24 * 60 * 60 * 1000
  );
  const blogLength = recentlyBlogs.length;
  let blogRandomIndexes: number[] = [];

  while (blogRandomIndexes.length < 5) {
    const index = Math.floor(Math.random() * blogLength);
    if (!blogRandomIndexes.includes(index)) {
      blogRandomIndexes.push(index);
    }
  }
  blogRandomIndexes.sort((a, b) => a - b);
  const content = faqDetail?.content || '';
  const { tree } = markdownToHtml(content);

  const length = simpleList.length;
  let randomIndexes: number[] = [];

  while (randomIndexes.length < 4) {
    const index = Math.floor(Math.random() * length);
    if (!randomIndexes.includes(index)) {
      randomIndexes.push(index);
    }
  }
  randomIndexes.sort((a, b) => a - b);
  return {
    props: {
      data: faqDetail,
      html: tree,
      recommendFaq: randomIndexes.map(index => simpleList[index]),
      recommendBlogs: blogRandomIndexes.map(index => recentlyBlogs[index]),
    },
  };
};
