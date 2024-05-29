import React, { useMemo, useEffect, useRef } from 'react';
import Giscus from '@giscus/react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout/commonLayout';
import Tags from '../../components/tags';
import BlogCard from '../../components/card/BlogCard';
import dayjs from 'dayjs';
import Share from '../../components/share';
import styles from '../../styles/blogDetail.module.less';
import blogUtils from '../../utils/blog.utils';
import { markdownToHtml } from '../../utils/common';
import clsx from 'clsx';
import BlogAnchorSection from '../../parts/blogs/blogAnchors';
import pageClasses from '../../styles/responsive.module.less';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { useCopyCode } from '../../hooks/enhanceCodeBlock';

export default function Template(props) {
  const {
    locale,
    blogList,
    newHtml,
    author,
    date,
    tags,
    title,
    id,
    desc,
    cover,
    anchorList,
    codeList,
  } = props;

  const docContainer = useRef(null);
  const { t } = useTranslation('common');

  const html = useMemo(() => newHtml.replace(/<h1.*<\/h1>/, ''), [newHtml]);
  const shareUrl = useMemo(() => `${ABSOLUTE_BASE_URL}/blog/${id}`, [id]);

  const dateTime = useMemo(() => dayjs(date).format('MMMM DD, YYYY'), [date]);
  const moreBlogs = useMemo(
    () =>
      blogList
        .filter(v => v.tags.some(tag => tags.includes(tag) && v.id !== id))
        .slice(0, 3),
    [blogList, id, tags]
  );

  useCopyCode(codeList);

  const handleTagClick = tag => {
    navigate(`/blog?page=1#${tag}`);
  };

  return (
    <main>
      <Layout t={t}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={desc} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={desc} />
          <meta property="og:url" content={shareUrl} />
          <meta property="og:image" content={`https://${cover}`} />
        </Head>
        <div>
          <div className={clsx(pageClasses.docContainer, styles.upLayout)}>
            <section className={styles.blogHeader}>
              <p className={styles.authorDate}>
                <span>{dateTime}</span>
                {author && <span>by {author}</span>}
              </p>
              <h1 className={styles.title}>{title}</h1>

              <Tags
                list={tags}
                tagsClass={styles.tags}
                onClick={handleTagClick}
              />
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
                <BlogAnchorSection
                  anchors={anchorList}
                  shareUrl={shareUrl}
                  title={title}
                  description={desc}
                  container={docContainer}
                  imgUrl={`https://${cover}`}
                  id={id}
                  classes={{
                    root: styles.anchorContainer,
                  }}
                />
              </div>
            </section>

            <section className={styles.mobileShareSection}>
              <p>Like the article? Spread the word</p>
              <Share
                url={shareUrl}
                quote={title}
                desc={desc}
                image={cover}
                wrapperClass={styles.share}
                vertical={false}
              />
            </section>
          </div>

          <section className={clsx(pageClasses.container, styles.bottomLayout)}>
            <h2 className={styles.title}>Keep Reading</h2>
            <ul className={styles.blogCards}>
              {moreBlogs.map((v, index) => {
                const { desc, cover, date, tags, title, id } = v;
                return (
                  <li key={index}>
                    <BlogCard
                      locale={locale}
                      title={title}
                      date={date}
                      cover={cover}
                      desc={desc}
                      tags={tags}
                      path={id}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </Layout>
    </main>
  );
}

export const getStaticPaths = () => {
  const paths = blogUtils.getRouter();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ locale = 'en', params }) => {
  const { id } = params;
  const allData = blogUtils.getAllData();

  const { content, ...rest } = allData.find(v => v.id === id);

  const { tree, codeList, anchorList } = await markdownToHtml(content, {
    showAnchor: true,
    version: 'blog',
  });

  return {
    props: {
      locale,
      blogList: allData,
      newHtml: tree,
      anchorList,
      codeList,
      ...rest,
      // author,
      // date,
      // tags,
      // // origin,
      // title,
      // id,
      // desc,
      // cover,
    },
  };
};
