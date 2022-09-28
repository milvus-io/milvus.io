import React, { useMemo, useEffect } from 'react';
import Giscus from '@giscus/react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout';
import Tags from '../../components/tags';
import BlogCard from '../../components/card/BlogCard';
import dayjs from 'dayjs';
import Share from '../../components/share';
import * as styles from '../../styles/blog.module.less';
import blogUtils from '../../utils/blog.utils';
import { markdownToHtml } from '../../utils/common';
import clsx from 'clsx';

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
  } = props;

  const { t } = useTranslation('common');
  const html = useMemo(() => newHtml.replace(/<h1.*<\/h1>/, ''), [newHtml]);
  const shareUrl = useMemo(() => `https://milvus.io/blog/${id}`, [id]);

  const dateTime = useMemo(() => dayjs(date).format('MMMM DD, YYYY'), [date]);
  const moreBlogs = useMemo(
    () =>
      blogList
        .filter(v => v.tags.some(tag => tags.includes(tag) && v.id !== id))
        .slice(0, 3),
    [blogList, id, tags]
  );

  const handleTagClick = tag => {
    navigate(`/blog?page=1#${tag}`);
  };

  return (
    <Layout t={t}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={shareUrl} />
      </Head>
      <main>
        <section className={clsx('col-12 col-8 col-4', styles.blogWrapper)}>
          <p className={styles.authorDate}>
            <span>{dateTime}</span>
            {author && <span>by {author}</span>}
          </p>
          <h1 className={styles.title}>{title}</h1>

          <Tags
            list={tags}
            tagsClass={clsx('col-8', styles.tags)}
            onClick={handleTagClick}
          />

          <section className={clsx('col-8', styles.shareContainer)}>
            <Share
              url={shareUrl}
              quote={title}
              desc={desc}
              image={cover}
              wrapperClass={styles.share}
              vertical={true}
            />
          </section>

          <section className={clsx('col-8', styles.desc)}>
            <span className={styles.line}></span>
            <span>{desc}</span>
          </section>

          <div
            className={clsx('doc-style col-8', styles.articleContent)}
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
          <div className={clsx('col-8', styles.articleContent)}>
            <Giscus
              id="comments"
              repo="milvus-io/community"
              repoId="MDEwOlJlcG9zaXRvcnkyMjcwMTEyMDI="
              category="General"
              categoryId="DIC_kwDODYfqgs4B_yDj"
              mapping="title"
              term="Welcome to Milvus.io"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme="light"
              lang="en"
              loading="lazy"
            />
          </div>
        </section>
        <section className={clsx('col-8', styles.shareSection)}>
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
        <section className={clsx('col-12 col-8 col-4', styles.moreBlog)}>
          <h2>Keep Reading</h2>
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
      </main>
    </Layout>
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

  const { tree } = await markdownToHtml(content, {
    showAnchor: false,
    version: 'blog',
  });

  return {
    props: {
      locale,
      blogList: allData,
      newHtml: tree,
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
