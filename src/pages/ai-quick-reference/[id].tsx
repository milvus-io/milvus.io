import classes from '@/styles/faq.module.less';
import pageClasses from '@/styles/responsive.module.less';
import styles from '@/styles/blogDetail.module.less';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import { generateSimpleFaqList, getFAQById } from '@/http/faq';
import { DemoTypeEnum, FAQDetailType } from '@/types/faq';
import { useMemo, useRef } from 'react';
import { GetServerSideProps } from 'next';
import Breadcrumb from '@/components/breadcrumb';
import { markdownToHtml } from '@/utils/common';
import Share from '@/components/share';
import CustomButton from '@/components/customButton';
import { RightArrow, RightWholeArrow } from '@/components/icons';
import { CLOUD_SIGNUP_LINK } from '@/consts';
import blogUtils from '@/utils/blog.utils';
import { LanguageEnum } from '@/types/localization';
import CloudAdvertisementCard from '@/components/card/advCard';
import useUtmTrackPath from '@/hooks/use-utm-track-path';
import DemoCard from '@/components/card/DemoCard';
import {
  DEMO_HYBRID_SEARCH_URL,
  DEMO_MULTIMODAL_SEARCH_URL,
} from '@/consts/externalLinks';
import { InkeepCustomTriggerWrapper } from '@/components/inkeep/inkeepChat';
import LLMActions, { PageAction, OptionItem } from '@/components/LLMActions';
import { CopyIcon } from '@/components/icons';
import { OpenAIIcon, ClaudeAIIcon } from '@/components/icons/AI';

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
  const { t } = useTranslation(['faq', 'demo']);
  const { data, recommendFaq, recommendBlogs, previousUrl, nextUrl } =
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

  const { tree: html } = markdownToHtml(content);

  const DEMOS = [
    {
      name: t('demo:demos.askAi.title'),
      desc: t('demo:demos.askAi.desc'),
      cover: '/images/demos/ask-ai.png',
      renderButton1: () => (
        <InkeepCustomTriggerWrapper>
          <CustomButton className="" variant="outlined">
            {t('demos.askAi.ctaLabel1')}
          </CustomButton>
        </InkeepCustomTriggerWrapper>
      ),
      renderButton2: () => (
        <CustomButton
          href="https://zilliz.com/blog/how-inkeep-and-milvus-built-rag-driven-ai-assisstant-for-smarter-interaction"
          variant="text"
          endIcon={<RightWholeArrow />}
        >
          {t('demos.askAi.ctaLabel2')}
        </CustomButton>
      ),
      lowerCaseName: 'ask-ai',
      id: DemoTypeEnum.Rag,
    },
    {
      name: t('demo:demos.multimodal.title'),
      desc: t('demo:demos.multimodal.desc'),
      href: DEMO_MULTIMODAL_SEARCH_URL,
      cover: '/images/demos/multimodal-image-search.png',
      lowerCaseName: 'multimodal image search',
      id: DemoTypeEnum.imageSearch,
    },
    {
      name: t('demo:demos.hybridSearch.title'),
      desc: t('demo:demos.hybridSearch.desc'),
      href: DEMO_HYBRID_SEARCH_URL,
      cover: '/images/demos/hybrid-search.png',
      // videoSrc: 'https://www.youtube.com/watch?v=UvhL2vVZ-f4',
      lowerCaseName: 'hybrid search',
      id: DemoTypeEnum.HybridSearch,
    },
  ];

  const demoCardData = useMemo(() => {
    return DEMOS.find(item => item.id === demo);
  }, [demo, DEMOS]);

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
              {demo && (
                <div className="">
                  <p className="mb-[24px] text-black2">{demoDescription}</p>
                  <DemoCard
                    {...demoCardData}
                    handelOpenDialog={() => {
                      return;
                    }}
                    classes={{
                      root: classes.demoCardRoot,
                      name: classes.demoCardName,
                      desc: classes.demoCardDesc,
                      button: classes.demoCardButton,
                    }}
                  />
                </div>
              )}
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

              <p className="text-transparent text-[12px] mt-[24px]">
                {t('faq:announcement')}
              </p>
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
                    <Link href="/blog">{t('faq:detail.allBlog')}</Link>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  try {
    const { item } = await getFAQById(id);
    const currentArticleIndex = item?.curIndex || 0;

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
        data: item,
        recommendFaq: randomIndexes.map(index => simpleList[index]),
        recommendBlogs: blogRandomIndexes.map(index => recentlyBlogs[index]),
        previousUrl: simpleList[currentArticleIndex - 1]?.url || '',
        nextUrl: simpleList[currentArticleIndex + 1]?.url || '',
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
