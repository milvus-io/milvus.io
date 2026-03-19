import classes from '@/styles/faq.module.css';
import pageClasses from '@/styles/responsive.module.css';
import styles from '@/styles/blogDetail.module.css';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/commonLayout';
import { getLearnAiById, generateSimpleLearnAiList } from '@/http/learnAi';
import { LearnAiDetailType } from '@/types/learnAi';
import { useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import Breadcrumb from '@/components/breadcrumb';
import { markdownToHtml, copyToCommand } from '@/utils/common';
import Share from '@/components/share';
import CustomButton from '@/components/customButton';
import { RightWholeArrow } from '@/components/icons';
import BlogAnchorSection from '@/parts/blogs/blogAnchors';
import LLMActions, { PageAction, OptionItem } from '@/components/LLMActions';
import { CopyIcon, checkIconTpl, linkIconTpl } from '@/components/icons';
import { OpenAIIcon, ClaudeAIIcon } from '@/components/icons/AI';
import 'highlight.js/styles/atom-one-dark.css';

const learnAiPageOptions: OptionItem[] = [
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

export default function LearnAiDetail(props: {
  data: LearnAiDetailType;
  html: string;
  anchorList: { label: string; href: string; }[];
  recommendArticles: Pick<LearnAiDetailType, 'title' | 'url'>[];
  previousUrl?: string;
  nextUrl?: string;
}) {
  const { data, html, anchorList, recommendArticles, previousUrl, nextUrl } =
    props;
  const { content, title, description, canonical_rel, meta_keywords } = data;

  const docContainer = useRef<HTMLDivElement>(null);
  const pageHref = useRef('');

  const metaTitle = `${title} | Milvus`;
  const formattedDesc = description ? description.replaceAll(/\"/g, '\\"') : '';

  const ldJson = `{"@context": "http://schema.org", "@id": "${canonical_rel}", "@type": "Article", "headline": "${title}", "description": "${formattedDesc}", "name": "${title}", "url": "${canonical_rel}"}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const anchors = Array.from(document.querySelectorAll('.anchor-icon'));
      const baseHref = window.location.href.split('#')[0];

      anchors.forEach(anchor => {
        anchor.addEventListener(
          'click',
          e => {
            if (!e.currentTarget) {
              return;
            }
            const {
              dataset: { href },
            } = e.currentTarget as HTMLAnchorElement;
            pageHref.current = `${baseHref}${href}`;
            copyToCommand(pageHref.current);

            anchor.innerHTML = checkIconTpl;

            setTimeout(() => {
              anchor.innerHTML = linkIconTpl;
            }, 3000);
          },
          false
        );
      });
    }
  }, [data.id]);

  return (
    <Layout>
      <main>
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={meta_keywords} />
          <link rel="canonical" href={canonical_rel} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: ldJson }}
          ></script>
        </Head>
      </main>
      <section className={classes.detailContainer}>
        <div className={clsx(pageClasses.docContainer, styles.upLayout)}>
          <section className={styles.blogHeader}>
            <div className={styles.pageHeaderContainer}>
              <Breadcrumb
                list={[
                  {
                    label: 'Learn AI',
                    href: '/learn-ai-and-vectordb',
                  },
                  {
                    label: title,
                  },
                ]}
              />
              <LLMActions options={learnAiPageOptions} mdContent={content} />
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
            </div>

            <div className={styles.anchorsContainer}>
              <BlogAnchorSection
                anchors={anchorList}
                shareUrl={canonical_rel}
                title={title}
                description={description}
                container={docContainer}
                id={data.id}
                classes={{
                  root: '',
                }}
              />
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
          <h2 className={classes.sectionTitle}>Keep Reading</h2>
          <ul className={classes.listWrapper}>
            {recommendArticles.map(item => (
              <li className="" key={item.url}>
                <Link
                  href={`/learn-ai-and-vectordb/${item.url}`}
                  className={classes.linkWrapper}
                >
                  <h3 className={classes.recommendTitle}>{item.title}</h3>
                  <CustomButton
                    endIcon={<RightWholeArrow />}
                    variant="text"
                    className={classes.readMoreBtn}
                  >
                    Read More
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
    const { item, list } = await getLearnAiById(id);
    const currentArticleIndex = item?.curIndex || 0;

    const simpleList = await generateSimpleLearnAiList();

    const {
      tree: html,
      anchorList = [],
    } = markdownToHtml(item.content, {
      showAnchor: true,
      version: 'blog',
      useLatex: true,
    });

    const filteredAnchorList = anchorList.filter(
      (a: { label: string; }) => a.label !== item.title
    );

    // Pick up to 4 random articles excluding current
    const otherArticles = simpleList.filter(a => a.url !== id);
    const shuffled = otherArticles.sort(() => Math.random() - 0.5);
    const recommendArticles = shuffled.slice(0, 4);

    return {
      props: {
        data: item,
        html,
        anchorList: filteredAnchorList,
        recommendArticles,
        previousUrl: simpleList[currentArticleIndex - 1]?.url
          ? `/learn-ai-and-vectordb/${simpleList[currentArticleIndex - 1].url}`
          : '',
        nextUrl: simpleList[currentArticleIndex + 1]?.url
          ? `/learn-ai-and-vectordb/${simpleList[currentArticleIndex + 1].url}`
          : '',
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
