import React, { useMemo, useEffect, useRef } from 'react';
// import Giscus from '@giscus/react';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import Tags from '../components/tags';
import BlogCard from '../components/card/BlogCard';
import dayjs from 'dayjs';
import Share from '../components/share';
import Seo from '../components/seo';
import { findLatestVersion } from '../utils';
import './docsStyle.less';
import * as styles from './blogTemplate.module.less';
import BlogAnchorSection from '../components/blogToc';
import clsx from 'clsx';

const pattern = /[!@#$%^&*(),.?":{}|<>~`\[\]\\\/;=+_']+/g;

export default function Template({ data, pageContext }) {
  const { allVersion } = data;

  const {
    blogList,
    newHtml,
    author,
    date,
    tags,
    // origin,
    title,
    id,
    desc,
    cover,
    headings,
    canonicalUrl,
    metaTitle,
  } = pageContext;

  // h2 only
  const tocHeadings = useMemo(() => {
    return headings
      .filter(v => v.depth === 2)
      .map(v => {
        const { value, depth } = v;

        let href = value.replaceAll(pattern, '');
        href = href.replaceAll(' ', '-');

        // remove special symbol in the end of string
        while (href.charAt(href.length - 1) === '-') {
          href = href.slice(0, -1);
        }

        return {
          label: value,
          href,
          isActive: false,
          depth,
        };
      });
  }, [headings]);

  const docContainer = useRef(null);
  const { language, t, navigate } = useI18next();
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
    navigate(`/blog?#${tag}`);
  };

  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const reg = /(https|http)(\S*)(jpg|jpeg|png)/;
    imgs.forEach(img => {
      const srcAttr = img.getAttribute('src');
      if (reg.test(srcAttr)) {
        const parentNode = img.parentNode;
        parentNode.style.margin = '20px auto';
        const title = img.getAttribute('title') || img.getAttribute('alt');
        const captionEle = document.createElement('figcaption');
        captionEle.className = 'gatsby-resp-image-figcaption';
        captionEle.innerText = title;
        parentNode.appendChild(captionEle);
      }
    });
  }, []);

  const version = findLatestVersion(allVersion.nodes);
  const description = desc || title;
  return (
    <Layout t={t} version={version}>
      <Seo
        title={metaTitle}
        titleTemplate="%s"
        lang={language}
        description={description}
        link={{
          rel: 'canonical',
          href: canonicalUrl,
        }}
      />
      <main className={clsx(styles.blogDetailContainer, 'col-12')}>
        <section className={styles.blogWrapper}>
          <p className={`${styles.authorDate} `}>
            <span>{dateTime}</span>
            {author && <span>by {author}</span>}
          </p>
          <h1 className={styles.title}>{title}</h1>

          <Tags list={tags} tagsClass={styles.tags} onClick={handleTagClick} />

          {/* {desc && (
            <section className={styles.desc}>
              <span className={styles.line}></span>
              <span>{desc}</span>
            </section>
          )} */}

          <section className={styles.contentContainer}>
            <div
              className={`${styles.articleContent} doc-style`}
              dangerouslySetInnerHTML={{ __html: html }}
              ref={docContainer}
            ></div>

            <BlogAnchorSection
              anchors={tocHeadings}
              shareUrl={shareUrl}
              title={title}
              description={description}
              container={docContainer}
              imgUrl={`https://${cover}`}
              id={id}
              classes={{
                root: styles.anchorContainer,
              }}
            />
          </section>

          {/* <div className={`${styles.articleContent} col-8`}>
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
        </div> */}
        </section>
        <section className={styles.shareSection}>
          <p>Like the article? Spread the word</p>
          <Share
            url={shareUrl}
            quote={title}
            desc={description}
            image={`https://${cover}`}
            wrapperClass={styles.share}
            vertical={false}
          />
        </section>
        <section className={styles.moreBlog}>
          <h2>Keep Reading</h2>
          <ul className={styles.blogCards}>
            {moreBlogs.map((v, index) => {
              const { desc, cover, date, tags, title, id } = v;
              return (
                <li key={index}>
                  <BlogCard
                    locale={language}
                    title={title}
                    date={date}
                    cover={`https://${cover}`}
                    desc={desc}
                    tags={tags}
                    path={`${id}`}
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

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
    allVersion(filter: { released: { eq: "yes" } }) {
      nodes {
        version
      }
    }
  }
`;
