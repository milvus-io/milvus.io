import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import * as styles from "./blogListTemplate.module.less";
// import Seo from "../components/seo";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { FILTER_TAG, PAGE_INDEX } from "../consts/index";
import BlogCard from "../components/card/BlogCard";

import Tags from "../components/tags";
import { globalHistory } from "@reach/router";
import Pagination from "@mui/material/Pagination";

const PAGE_SIZE = 6;

const getCurrentPageArray = (list, pageIndex) =>
  list.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE);

const BlogTemplate = ({ data, pageContext }) => {
  const { blogList } = pageContext;
  const { language, t, navigate, originalPath } = useI18next();
  const [currentTag, setCurrentTag] = useState("all");
  const [pageIndex, setPageIndex] = useState(1);
  const featuredBlog = useMemo(() => blogList[0], [blogList]);

  // list of tags
  const tagList = useMemo(() => {
    const resObj = {
      all: "all",
    };
    blogList.forEach((item) => {
      const { tags } = item;
      tags.forEach((subItem) => {
        resObj[subItem] = subItem;
      });
    });
    return Object.keys(resObj);
  }, [blogList]);

  const { renderBlogList, total } = useMemo(() => {
    if (currentTag === "all")
      return {
        total: Math.ceil(blogList.length / PAGE_SIZE),
        renderBlogList: getCurrentPageArray(blogList, pageIndex),
      };
    const list = blogList.filter((v) => v.tags.includes(currentTag));
    return {
      total: Math.ceil(list.length / PAGE_SIZE),
      renderBlogList: getCurrentPageArray(list, pageIndex),
    };
  }, [currentTag, blogList, pageIndex]);

  const filterByTag = useCallback(
    (tag) => {
      setCurrentTag(tag);
      setPageIndex(1);
    },
    [blogList]
  );

  const handleFilter = useCallback(
    (tag, isRestore = true) => {
      navigate(`${originalPath}?page=1#${tag}`);
      isRestore && window.sessionStorage.setItem(FILTER_TAG, tag);
      filterByTag(tag);
    },
    [filterByTag]
  );

  const handlePagination = useCallback(
    (e, page) => {
      window.history.pushState(null, null, `?page=${page}#${currentTag}`);
      window.sessionStorage.setItem(PAGE_INDEX, page);
      setPageIndex(page);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [currentTag]
  );

  useEffect(() => {
    const { search, hash } = globalHistory.location;

    const pageIdx = search.replace(/\?page=/g, "") || 1;
    const tag = hash.replace(/#/g, "") || "all";

    setCurrentTag(tag);
    setPageIndex(parseInt(pageIdx));
  }, []);

  return (
    <Layout t={t}>
      <div className={`${styles.listWrapper} col-12 col-8 col-4`}>
        {/* screen > 1024  */}

        <section className={`${styles.featuredBlog} `}>
          <div className={`${styles.featuredImg}  col-6`}>
            <img src={`https://${featuredBlog.cover}  `} />
          </div>
          <div className={`${styles.featuredBlogContent} col-7`}>
            <p className={styles.tag}>{featuredBlog.tags.join(" ")}</p>
            <Link to={`/blog/${featuredBlog.id}`}>
              <p className={styles.title}>{featuredBlog.title}</p>
            </Link>

            <p className={styles.desc}>{featuredBlog.desc}</p>
          </div>
        </section>
        {/* tablet phone, screen <= 1024  */}
        <BlogCard
          className={styles.mobileFeatured}
          locale={language}
          title={featuredBlog.title}
          date={featuredBlog.date}
          cover={`https://${featuredBlog.cover}`}
          desc={featuredBlog.desc}
          tags={featuredBlog.tags}
          path={`${featuredBlog.id}`}
        />

        <section className={styles.blogList}>
          <p className={styles.title}>More Articles</p>
          <Tags
            list={tagList}
            tagsClass={styles.tagsWrapper}
            genTagClass={(tag) => (currentTag === tag ? styles.active : "")}
            onClick={handleFilter}
          />

          <ul className={styles.blogCards}>
            {renderBlogList.map((v, index) => {
              const { desc, cover, date, tags, title, id } = v;
              return (
                <li key={index} className={styles.blogcard}>
                  <BlogCard
                    locale={language}
                    title={title}
                    date={date}
                    cover={`https://${cover}`}
                    desc={desc}
                    tags={tags}
                    path={`${id}?#${currentTag}`}
                  />
                </li>
              );
            })}
          </ul>
          {/* <Pagination
          total={total}
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          handlePageIndexChange={handlePagination}
        /> */}
          <Pagination
            count={total}
            page={pageIndex}
            size="small"
            onChange={handlePagination}
            className={styles.pagination}
          />
        </section>
      </div>
    </Layout>
  );
};

export default BlogTemplate;

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
