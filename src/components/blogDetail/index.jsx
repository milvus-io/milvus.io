import React, { useState, useEffect } from 'react';
import BlogTag from '../../components/blogDetail/blogTag';
import LocalizedLink from '../../components/localizedLink/localizedLink';
import * as styles from './index.module.less';
import { globalHistory } from '@reach/router';
import NavButton from './navButton';
import Footer from '../footer/footer';

const BlogDetail = ({
  innerHtml,
  author,
  tags,
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
  const [showToTopButton, setShowToTopButton] = useState(false);

  const onToTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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

  useEffect(() => {
    onToTopClick();
    let currentPos = 0;

    const cb = function () {
      const container = document.querySelector('html');
      const direction = container.scrollTop - currentPos > 0 ? 'down' : 'up';
      currentPos = container.scrollTop;
      const showButton = direction === 'up' && currentPos;

      setShowToTopButton(showButton);
    };
    window.addEventListener('scroll', cb);

    return () => {
      window.removeEventListener('scroll', cb);
    };
  }, []);

  return (
    <div className={styles.blogDetailWrapper}>
      <div className={styles.articleHeader}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.flexBox}>
          <p>{new Date(date).toLocaleDateString()}</p>
          <p>by {author}</p>
        </div>
        <ul className={styles.tagsLine}>
          {tags.map(tag => (
            <li key={tag}>
              <LocalizedLink locale={locale} to={`/blog?page=1#${tag}`}>
                <BlogTag name={tag} className={styles.tags} />
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.breadcrumd}>
        <LocalizedLink
          locale={locale}
          to={`/blog?page=${pageInfo.pageIdx}#${pageInfo.filterTag}`}
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
        <NavButton
          pageInfo={pageInfo}
          nav="previous"
          link={navInfo.previewBlogPath}
          title={navInfo.previewBlogTitle}
          locale={locale}
        />
        <NavButton
          pageInfo={pageInfo}
          nav="next"
          link={navInfo.nextBlogPath}
          title={navInfo.nextBlogTitle}
          locale={locale}
        />
      </div>

      <Footer locale={locale} style={{ marginTop: '64px' }} />
      {showToTopButton ? (
        <div
          className="btn-to-top"
          role="button"
          onClick={onToTopClick}
          onKeyDown={onToTopClick}
          tabIndex={0}
        >
          <svg
            width="32"
            height="32"
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="svg-inline--fa fa-arrow-to-top fa-w-12 fa-2x"
          >
            <path
              fill="currentColor"
              d="M24 32h336c13.3 0 24 10.7 24 24v24c0 13.3-10.7 24-24 24H24C10.7 104 0 93.3 0 80V56c0-13.3 10.7-24 24-24zm66.4 280.5l65.6-65.6V456c0 13.3 10.7 24 24 24h24c13.3 0 24-10.7 24-24V246.9l65.6 65.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L209 126.1c-9.4-9.4-24.6-9.4-33.9 0L39.5 261.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0z"
            ></path>
          </svg>
        </div>
      ) : null}
    </div>
  );
};

export default BlogDetail;
