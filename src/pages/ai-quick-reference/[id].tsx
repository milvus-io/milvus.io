import classes from '@/styles/faq.module.css';
import pageClasses from '@/styles/responsive.module.css';
import styles from '@/styles/blogDetail.module.css';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout/commonLayout';
import { generateSimpleFaqList, getFAQById } from '@/http/faq';
import { DemoTypeEnum, FAQDetailType } from '@/types/faq';
import { useRef } from 'react';
import { GetServerSideProps } from 'next';
import Breadcrumb from '@/components/breadcrumb';
import { markdownToHtml } from '@/utils/markdown';
import Share from '@/components/share';
import CustomButton from '@/components/customButton';
import { RightArrow, RightWholeArrow } from '@/components/icons';
import { CLOUD_SIGNUP_LINK } from '@/consts';
import CloudAdvertisementCard from '@/components/card/advCard';
import useUtmTrackPath from '@/hooks/use-utm-track-path';
import LLMActions, { PageAction, OptionItem } from '@/components/LLMActions';
import { CopyIcon } from '@/components/icons';
import { OpenAIIcon, ClaudeAIIcon } from '@/components/icons/AI';
import JsonLd from '@/components/JsonLd';
import { buildSchema } from '@/schema';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { selectRelated, publication } from '@/server/ai-reference-catalog';

const FaqDemoCard = dynamic(() => import('@/components/faq/FaqDemoCard'));

const faqPageOptions: OptionItem[] = [
  {
    value: PageAction.CopyPage,
    labelKey: 'pageActions.copyPage.label',
    descKey: 'pageActions.copyPage.desc',
    icon: <CopyIcon />,
  },
  {
    value: PageAction.ChatGPT,
    labelKey: 'pageActions.chatGPT.label',
    descKey: 'pageActions.chatGPT.desc',
    icon: <OpenAIIcon />,
  },
  {
    value: PageAction.ChatClaude,
    labelKey: 'pageActions.chatClaude.label',
    descKey: 'pageActions.chatClaude.desc',
    icon: <ClaudeAIIcon />,
  },
];

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
  previousUrl?: string;
  nextUrl?: string;
  demo?: DemoTypeEnum;
  demoDescription?: string;
}) {
  const { t } = useTranslation('faq');
  const { data, html, recommendFaq, recommendBlogs, previousUrl, nextUrl } =
    props;
  const {
    id,
    content,
    title,
    description,
    canonical_rel,
    demo,
    demoDescription,
  } = data;

  const docContainer = useRef<HTMLDivElement>(null);
  const trackPath = useUtmTrackPath();

  // FAQPage is for AI search / machine understanding (no longer a Google rich
  // result). The page title is the question; the description is its answer.
  const faqLabel = t('faq:detail.name');
  const ldSchemas = [
    description
      ? buildSchema('faq', {
          absoluteUrl: canonical_rel,
          faqItems: [{ question: title, answerPlainText: description }],
        })
      : null,
    buildSchema('breadcrumb', [
      { name: 'Home', url: ABSOLUTE_BASE_URL },
      { name: faqLabel, url: `${ABSOLUTE_BASE_URL}/ai-quick-reference` },
      { name: title, url: canonical_rel },
    ]),
  ];

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
        <JsonLd schema={ldSchemas} />
      </main>
      <section className={classes.detailContainer}>
        <div className={clsx(pageClasses.docContainer, styles.upLayout)}>
          <section className={styles.blogHeader}>
            <div className={styles.pageHeaderContainer}>
              <Breadcrumb
                list={[
                  {
                    label: t('faq:detail.name'),
                    href: '/ai-quick-reference',
                  },
                  {
                    label: title,
                  },
                ]}
              />
              <LLMActions options={faqPageOptions} mdContent={content} />
            </div>

            <h1 className={styles.title}>{title}</h1>
          </section>

          <section className={styles.blogContent}>
            <div>
              <article
                className={clsx(
                  'doc-style',
                  'scroll-padding',
                  styles.articleContainer
                )}
                ref={docContainer}
                dangerouslySetInnerHTML={{ __html: html }}
              ></article>
              {demo ? (
                <FaqDemoCard demo={demo} demoDescription={demoDescription} />
              ) : null}
              <div className={classes.navButtonsWrapper}>
                <div className="">
                  {previousUrl && (
                    <CustomButton
                      variant="outlined"
                      href={previousUrl}
                      className={clsx(classes.navButton, classes.previousBtn)}
                      startIcon={<RightArrow />}
                    >
                      {t('faq:nav.previous')}
                    </CustomButton>
                  )}
                </div>
                <div className="">
                  {nextUrl && (
                    <CustomButton
                      variant="outlined"
                      href={nextUrl}
                      className={classes.navButton}
                      endIcon={<RightArrow />}
                    >
                      {t('faq:nav.next')}
                    </CustomButton>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.anchorsContainer}>
              <CloudAdvertisementCard
                className={classes.advCard}
                customAdvConfig={{
                  advTitle: t('faq:detail.adv.title'),
                  advContent: t('faq:detail.adv.content'),
                  advCtaLabel: t('faq:detail.adv.ctaLabel'),
                  advCtaLink: `${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_right_card&utm_content=${trackPath}`,
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
                <h4 className={classes.title}>{t('faq:detail.recommend')}</h4>
                <ul className={classes.recommendBlogList}>
                  {recommendBlogs.map(item => (
                    <li className="" key={item.title}>
                      <Link href={item.href}>{item.title}</Link>
                    </li>
                  ))}
                  <li className={classes.allBlogBtn}>
                    <Link href="/docs">{t('faq:detail.allBlog')}</Link>
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
          <h2 className={classes.sectionTitle}>
            {t('faq:detail.keepReading')}
          </h2>
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
                    {t('faq:detail.readMore')}
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const id = params?.id as string;
  const record = publication[id];
  if (record?.status === 'merged') {
    return {
      redirect: {
        destination: `/ai-quick-reference/${record.target}`,
        permanent: true,
      },
    };
  }
  if (!record || record.status !== 'source-checked') return { notFound: true };
  try {
    const { item } = await getFAQById(id);
    const { tree: html } = markdownToHtml(item.content);

    const simpleList = await generateSimpleFaqList();
    const inTopic = simpleList.filter(faq => faq.topic === item.topic);
    const topicIndex = inTopic.findIndex(faq => faq.url === item.url);
    const previousSlug = inTopic[topicIndex - 1]?.url;
    const nextSlug = inTopic[topicIndex + 1]?.url;
    const previousUrl = previousSlug
      ? `/ai-quick-reference/${previousSlug}`
      : '';
    const nextUrl = nextSlug ? `/ai-quick-reference/${nextSlug}` : '';

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=604800'
    );

    return {
      props: {
        data: item,
        html,
        recommendFaq: selectRelated(simpleList, item.url, item.topic),
        recommendBlogs: record.guides.map(guide => ({
          title: guide.label,
          href: guide.url,
          url: guide.url,
          id: guide.url,
        })),
        previousUrl,
        nextUrl,
      },
    };
  } catch (error) {
    // A known published URL must not become a 404 because content loading or
    // validation failed. Let Next return a server error for operational faults.
    throw error;
  }
};
