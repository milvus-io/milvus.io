import React, { useState, useEffect } from 'react';
import BlogTag from '../../components/blogDetail/blogTag';
import LocalizedLink from '../../components/localizedLink/localizedLink';
import * as styles from './index.module.less';
import { globalHistory } from '@reach/router';

const BlogDetail = ({
  innerHtml,
  author,
  tags,
  banner,
  date,
  title,
  locale,
  blogList,
  id,
}) => {
  const NAV_TEXT = {
    cn: ['博客', '文章', '上一篇', '下一篇', '无'],
    en: ['Blog', 'Article', 'Previous', 'Next', 'None'],
  };

  const [navInfo, setNavInfo] = useState({
    previewBlogPath: '',
    previewBlogTitle: '',
    nextBlogPath: '',
    nextBlogTitle: '',
  });
  const [pageInfo, setPageInfo] = useState({
    pageIdx: 1,
    filterTag: 'all',
  });

  useEffect(() => {
    const { search, hash } = globalHistory.location;
    const pageIdx = search.replace(/\?page=/g, '') || 1;
    const filterTag = hash.replace(/#/g, '') || 'all';
    setPageInfo({
      pageIdx,
      filterTag,
    });
    let filteredList = [];

    filteredList =
      filterTag === 'all'
        ? blogList
        : blogList.filter(i => i.tags.includes(filterTag));

    const index = filteredList.findIndex(i => i.id === id);
    const [previewBlogPath, previewBlogTitle, nextBlogPath, nextBlogTitle] = [
      filteredList[index - 1]?.id,
      filteredList[index - 1]?.title,
      filteredList[index + 1]?.id,
      filteredList[index + 1]?.title,
    ];
    setNavInfo({
      previewBlogPath,
      previewBlogTitle,
      nextBlogPath,
      nextBlogTitle,
    });
  }, [blogList, id]);

  return (
    <div className={styles.blogDetailWrapper}>
      <div
        className={styles.articleHeader}
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.flexBox}>
          <p>{new Date(date).toLocaleDateString()}</p>
          <p>by {author}</p>
        </div>
        <ul className={styles.tagsLine}>
          {tags.map(tag => (
            <li key={tag}>
              <BlogTag name={tag} />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.breadcrumd}>
        <LocalizedLink
          locale={locale}
          to={`/blogs?page=${pageInfo.pageIdx}#${pageInfo.filterTag}`}
          className={styles.breadcrumdLink}
        >
          {NAV_TEXT[locale][0]}
        </LocalizedLink>
        <span className={styles.breadcrumdArrow}>{'>'}</span>
        <span className={styles.breadcrumdItem}>{NAV_TEXT[locale][1]}</span>
      </div>
      <div
        className={styles.articleContent}
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      ></div>
      <div className={styles.navWrapper}>
        <p className={styles.navItem}>
          <span className={styles.text}>{NAV_TEXT[locale][2]}:</span>
          {navInfo.previewBlogPath ? (
            <LocalizedLink
              locale={locale}
              to={`/blogs/${navInfo.previewBlogPath}/?page=${pageInfo.pageIdx}#${pageInfo.filterTag}`}
              className={styles.blogLink}
            >
              {navInfo.previewBlogTitle}
            </LocalizedLink>
          ) : (
            <span className={styles.text}>{NAV_TEXT[locale][4]}</span>
          )}
        </p>
        <p className={styles.navItem}>
          <span className={styles.text}>{NAV_TEXT[locale][3]}:</span>
          {navInfo.nextBlogPath ? (
            <LocalizedLink
              locale={locale}
              to={`/blogs/${navInfo.nextBlogPath}/?page=${pageInfo.pageIdx}#${pageInfo.filterTag}`}
              className={styles.blogLink}
            >
              {navInfo.nextBlogTitle}
            </LocalizedLink>
          ) : (
            <span className={styles.text}>{NAV_TEXT[locale][4]}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default BlogDetail;
