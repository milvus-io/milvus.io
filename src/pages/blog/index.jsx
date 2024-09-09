import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';
import blogUtils from '../../utils/blog.utils';
import Layout from '../../components/layout/commonLayout';
import BlogCard from '../../components/card/BlogCard';
import Tags from '../../components/tags';
import { useWindowSize } from '../../http/hooks';
import * as styles from '../../styles/blog.module.less';
import pageClasses from '../../styles/responsive.module.less';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import CustomButton from '../../components/customButton';
import { RightWholeArrow } from '../../components/icons';

const SCROLL_SIZE = 6;
const TITLE = 'Milvus Blog';
const DESC = 'Milvus Blog';

const TAG_QUERY_KEY = 'tag';
const DEFAULT_TAG = 'all';

const BlogTemplate = props => {
  const { locale, blogList } = props;

  const { t } = useTranslation('common');
  const router = useRouter();
  const [currentTag, setCurrentTag] = useState(DEFAULT_TAG);
  const [scrollIndex, setScrollIndex] = useState(1);
  const currentSize = useWindowSize();

  const isMobile = ['phone'].includes(currentSize);

  const { featuredBlog, restBlogs } = useMemo(() => {
    let [restBlogs, featuredBlog] = [[], null];

    let isDetectRecommend = false;
    blogList.forEach(i => {
      if (i.isRecommend && !isDetectRecommend) {
        // bloglist is sorted by time,
        // if there is more than one recommended blog, take the newest one
        featuredBlog = i;
        isDetectRecommend = true;
      } else {
        restBlogs.push(i);
      }
    });

    if (!featuredBlog) {
      featuredBlog = blogList[0];
      restBlogs = blogList.slice(1);
    }

    return {
      featuredBlog,
      restBlogs,
    };
  }, [blogList]);

  // list of tags
  const tagList = useMemo(() => {
    const tagData = {
      all: 'all',
    };
    blogList.forEach(item => {
      const { tags } = item;
      tags.forEach(subItem => {
        tagData[subItem] = subItem;
      });
    });
    return Object.keys(tagData);
  }, [blogList]);

  const filteredBlogs = useMemo(() => {
    return currentTag === 'all'
      ? restBlogs
      : restBlogs.filter(v => v.tags.includes(currentTag));
  }, [currentTag, restBlogs]);

  useEffect(() => {
    const FOOT_HEIGHT = isMobile ? 845 : 675;
    const FOOT_DISTANCE = 80;
    const cb = e => {
      const viewHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollTop;
      const contentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const scrollBtmHeight = contentHeight - scrollHeight - viewHeight;
      const maxScrollIndex = Math.ceil(filteredBlogs.length / SCROLL_SIZE);
      if (scrollBtmHeight < FOOT_HEIGHT + FOOT_DISTANCE) {
        // console.log("---set---", scrollIndex);
        setScrollIndex(v => (v < maxScrollIndex ? (v += 1) : v));
      }
    };
    window.addEventListener('scroll', cb);
    return () => {
      window.removeEventListener('scroll', cb);
    };
  }, [filteredBlogs, scrollIndex, isMobile]);

  const handleFilter = (tag, isRestore = true) => {
    router.push(`/blog?tag=${tag}`);
    // isRestore && window.sessionStorage.setItem(FILTER_TAG, tag);
    setCurrentTag(tag);
  };

  useEffect(() => {
    const { asPath } = router;
    const queryString = asPath.split('?')[1] ?? '';
    const curQueryTag = new URLSearchParams(queryString).get(TAG_QUERY_KEY);
    setCurrentTag(curQueryTag || DEFAULT_TAG);
  }, []);

  const absoluteUrl = `${ABSOLUTE_BASE_URL}/blog`;

  return (
    <Layout t={t}>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta property="og:title" content={TITLE}></meta>
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={absoluteUrl} />
        <link rel="alternate" href={absoluteUrl} hrefLang="en" />
      </Head>
      <main>
        <div className={clsx(pageClasses.container, styles.listWrapper)}>
          {/* screen > 1024  */}
          <section className={styles.featuredBlog}>
            <div className={clsx(styles.featuredImg)}>
              <img src={featuredBlog.cover} alt={featuredBlog.title} />
            </div>
            <div className={clsx(styles.featuredBlogContent)}>
              <div className="">
                <p className={styles.tag}>{featuredBlog.tags.join(' ')}</p>
                <h2 className={styles.title}>{featuredBlog.title}</h2>
                <p className={styles.desc}>{featuredBlog.desc}</p>
              </div>
              <CustomButton
                endIcon={<RightWholeArrow />}
                variant="text"
                className={styles.readMoreButton}
                href={featuredBlog.href}
              >
                Read Now
              </CustomButton>
            </div>
          </section>

          <section className={styles.blogList}>
            <h1 className={styles.hiddenHeading1}>Milvus Blogs</h1>
            <Tags
              list={tagList}
              tagsClass={styles.tagsWrapper}
              genTagClass={tag => (currentTag === tag ? styles.active : '')}
              onClick={handleFilter}
            />

            <ul className={styles.blogCards}>
              {filteredBlogs.map((v, index) => {
                const { desc, cover, date, tags, title, id } = v;
                return (
                  <li
                    key={v.id}
                    className={`${
                      index < SCROLL_SIZE * scrollIndex
                        ? styles.fadeInup
                        : styles.cardItem
                    }`}
                  >
                    <BlogCard
                      className={`${
                        index < SCROLL_SIZE * scrollIndex
                          ? styles.fadeInup
                          : styles.cardItem
                      }`}
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
      </main>
    </Layout>
  );
};

export default BlogTemplate;

export const getStaticProps = () => {
  const list = blogUtils.getAllData();

  return {
    props: {
      locale: 'en',
      blogList: list,
    },
  };
};
