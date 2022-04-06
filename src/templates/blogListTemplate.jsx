import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
// import Seo from "../components/seo";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { FILTER_TAG } from "../consts/index";
import BlogCard from "../components/card/BlogCard";
import Tags from "../components/tags";
import { globalHistory } from "@reach/router";
import Signup from "../components/signup";
import { CustomizedSnackbars } from "../components/snackBar";
import Seo from "../components/seo";
import { useWindowSize } from "../http/hooks";
import * as styles from "./blogListTemplate.module.less";

const SCROLL_SIZE = 6;
const TITLE = "MIlvus Blog";
const DESC = "MIlvus Blog";

const BlogTemplate = ({ data, pageContext }) => {
  const { blogList } = pageContext;
  const { language, t, navigate, originalPath } = useI18next();
  const [currentTag, setCurrentTag] = useState("all");
  const [scrollIndex, setScrollIndex] = useState(1);
  const currentSize = useWindowSize();

  const isMobile = ["phone"].includes(currentSize);

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

  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    type: "info",
    message: "",
  });

  const handleOpenSnackbar = ({ message, type }) => {
    setSnackbarConfig({
      open: true,
      type,
      message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfig({
      open: false,
      type: "info",
      message: "",
    });
  };
  // list of tags
  const tagList = useMemo(() => {
    const resObj = {
      all: "all",
    };
    blogList.forEach(item => {
      const { tags } = item;
      tags.forEach(subItem => {
        resObj[subItem] = subItem;
      });
    });
    return Object.keys(resObj);
  }, [blogList]);

  const filteredBlogs = useMemo(() => {
    return currentTag === "all"
      ? restBlogs
      : restBlogs.filter(v => v.tags.includes(currentTag));
  }, [currentTag, restBlogs]);

  useEffect(() => {
    const FOOT_HEIGHT = isMobile ? 845 : 675;
    const FOOT_DISTANCE = 80;
    const cb = e => {
      // 浏览器可见区域高度为：
      const viewHeight = document.documentElement.clientHeight;
      // 窗口滚动条高度
      const scrollHeight = document.documentElement.scrollTop;
      // 文档内容实际高度：
      const contentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const scrolllBtmHeight = contentHeight - scrollHeight - viewHeight;
      const maxScrollIndex = Math.ceil(filteredBlogs.length / SCROLL_SIZE);
      if (scrolllBtmHeight < FOOT_HEIGHT + FOOT_DISTANCE) {
        // console.log("---set---", scrollIndex);
        setScrollIndex(v => (v < maxScrollIndex ? (v += 1) : v));
      }
    };
    window.addEventListener("scroll", cb);
    return () => {
      window.removeEventListener("scroll", cb);
    };
  }, [filteredBlogs, scrollIndex, isMobile]);

  const filterByTag = useCallback(tag => {
    setCurrentTag(tag);
  }, []);

  const handleFilter = useCallback(
    (tag, isRestore = true) => {
      navigate(`${originalPath}?#${tag}`);
      isRestore && window.sessionStorage.setItem(FILTER_TAG, tag);
      filterByTag(tag);
    },
    [filterByTag, originalPath, navigate]
  );

  useEffect(() => {
    const { hash } = globalHistory.location;
    const tag = hash.replace(/#/g, "") || "all";

    setCurrentTag(tag);
  }, []);

  return (
    <Layout t={t}>
      <Seo
        title={TITLE}
        lang={language}
        titleTemplate="%s"
        description={DESC}
      />
      <div className={`${styles.listWrapper} col-12 col-8 col-4`}>
        {/* screen > 1024  */}
        <section className={`${styles.featuredBlog} `}>
          <div className={`${styles.featuredImg}  col-6`}>
            <img src={`https://${featuredBlog.cover}`} alt="blog cover" />
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
            genTagClass={tag => (currentTag === tag ? styles.active : "")}
            onClick={handleFilter}
          />

          <ul className={styles.blogCards}>
            {filteredBlogs.map((v, index) => {
              const { desc, cover, date, tags, title, id } = v;
              return (
                <li
                  key={index}
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
                    locale={language}
                    title={title}
                    date={date}
                    cover={`https://${cover}`}
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
      <Signup callback={handleOpenSnackbar} t={t} />
      <CustomizedSnackbars
        open={snackbarConfig.open}
        type={snackbarConfig.type}
        message={snackbarConfig.message}
        handleClose={handleCloseSnackbar}
      />
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
