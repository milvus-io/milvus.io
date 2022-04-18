import React, { useMemo, useEffect } from "react";
import Giscus from "@giscus/react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/layout";
import Tags from "../components/tags";
import BlogCard from "../components/card/BlogCard";
import dayjs from "dayjs";
import Share from "../components/share";
import Seo from "../components/seo";
import * as styles from "./blogTemplate.module.less";

export default function Template({ data, pageContext }) {
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
  } = pageContext;

  const { language, t, navigate } = useI18next();
  const html = useMemo(() => newHtml.replace(/<h1.*<\/h1>/, ""), [newHtml]);
  const shareUrl = useMemo(() => `https://milvus.io/blog/${id}`, [id]);

  const dateTime = useMemo(() => dayjs(date).format("MMMM DD, YYYY"), [date]);
  const moreBlogs = useMemo(
    () =>
      blogList
        .filter(v => v.tags.some(tag => tags.includes(tag) && v.id !== id))
        .slice(0, 3),
    [blogList, id, tags]
  );
  // for seo
  // const canonicalLink = origin
  //   ? {
  //       rel: "canonical",
  //       href: `https://${origin}`,
  //     }
  //   : {};

  const handleTagClick = tag => {
    navigate(`/blog?page=1#${tag}`);
  };

  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    const reg = /(https|http)(\S*)(jpg|jpeg|png)/;
    imgs.forEach(img => {
      const srcAttr = img.getAttribute("src");
      if (reg.test(srcAttr)) {
        const parentNode = img.parentNode;
        parentNode.style.margin = "20px auto";
        const title = img.getAttribute("title") || img.getAttribute("alt");
        const captionEle = document.createElement("figcaption");
        captionEle.className = "gatsby-resp-image-figcaption";
        captionEle.innerText = title;
        parentNode.appendChild(captionEle);
      }
    });
  }, []);

  return (
    <Layout t={t}>
      <Seo
        title={title}
        titleTemplate="%s"
        lang={language}
        description={desc}
      />
      <section className={`${styles.blogWrapper} col-12 col-8 col-4`}>
        <p className={`${styles.authorDate} `}>
          <span>{dateTime}</span>
          {author && <span>by {author}</span>}
        </p>
        <h1 className={styles.title}>{title}</h1>

        <Tags
          list={tags}
          tagsClass={`${styles.tags} col-8`}
          onClick={handleTagClick}
        />

        <section className={`${styles.shareContainer} col-8`}>
          <Share
            url={shareUrl}
            quote={title}
            desc={desc}
            image={`https://${cover}`}
            wrapperClass={styles.share}
            vertical={true}
          />
        </section>

        <section className={`${styles.desc} col-8`}>
          <span className={styles.line}></span>
          <span>{desc}</span>
        </section>

        <div
          className={`${styles.articleContent} doc-style col-8`}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
        <div className={`${styles.articleContent} col-8`}>
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
      <section className={`${styles.shareSection} col-8`}>
        <p>Like the article? Spread the word</p>
        <Share
          url={shareUrl}
          quote={title}
          desc={desc}
          image={`https://${cover}`}
          wrapperClass={styles.share}
          vertical={false}
        />
      </section>
      <section className={`${styles.moreBlog} col-12 col-8 col-4`}>
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
  }
`;
