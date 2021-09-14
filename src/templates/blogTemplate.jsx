import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as styles from './blogTemplate.module.less';
import Seo from '../components/seo';
import Footer from '../components/footer/v2';
import { graphql } from 'gatsby';
import BlogDeatil from '../components/blogDetail';
import BlogCard from '../components/card/blogCard/v2';
import BlogTag from '../components/blogDetail/blogTag';
import Header from '../components/header/v2';
import { useCodeCopy, useFilter } from '../hooks/doc-dom-operation';
import { FILTER_TAG, PAGE_INDEX } from '../constants';
import Pagination from '../components/pagination';
import { globalHistory } from '@reach/router';

const PAGE_SIZE = 9;

const getCurrentPageArray = (list, pageIndex) =>
  list.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE);

const BlogTemplate = ({ data, pageContext }) => {
  const { footer } = data.allFile.edges.filter(edge => edge.node.childI18N)[0]
    .node.childI18N.v2;
  const {
    isBlogListPage,
    blogList,
    locale,
    newHtml,
    author,
    date,
    tags,
    origin,
    title,
    id,
  } = pageContext;
  const [seoTitle, seoDesc] = ['Milvus Blogs', title || 'Milvus Blogs'];
  const canonicalLink = origin
    ? {
        rel: 'canonical',
        href: `https://${origin}`,
      }
    : {};
  const [pageIndex, setPageIndex] = useState(1);
  // currentPageList: blog list of currrent page
  const [currentPageList, setCurrentPageList] = useState(
    getCurrentPageArray(blogList, pageIndex)
  );
  const [currentTag, setCurrentTag] = useState('all');
  const [paginationConfig, setPaginationConfig] = useState({
    total: blogList.length,
    pageSize: PAGE_SIZE,
    pageIndex,
  });
  // array filtered by tags
  const [filteredArray, setFilteredArray] = useState(blogList);
  // list of tags
  const tagList = useMemo(() => {
    if (!isBlogListPage) return [];

    const resObj = {
      all: 'all',
    };
    blogList.forEach(item => {
      const { tags } = item;
      tags.forEach(subItem => (resObj[subItem] = subItem));
    });
    return Object.keys(resObj);
  }, [blogList, isBlogListPage]);

  const filterByTag = useCallback(
    tag => {
      setCurrentTag(tag);
      if (tag === 'all') {
        setCurrentPageList(getCurrentPageArray(blogList, 1));
        setPageIndex(1);
        setPaginationConfig({
          total: blogList.length,
          pageSize: PAGE_SIZE,
          pageIndex: 1,
        });
        return;
      }
      const filteredArray = blogList.filter(i => i.tags.includes(tag));
      setFilteredArray(filteredArray);
      setPageIndex(1);
      setCurrentPageList(getCurrentPageArray(filteredArray, 1));
      setPaginationConfig({
        total: filteredArray.length,
        pageSize: PAGE_SIZE,
        pageIndex: 1,
      });
    },
    [blogList]
  );

  const filterByPageIndex = useCallback(
    idx => {
      if (currentTag === 'all') {
        setCurrentPageList(getCurrentPageArray(blogList, idx));
        setPaginationConfig({
          total: blogList.length,
          pageSize: PAGE_SIZE,
          pageIndex: idx,
        });
      } else {
        setCurrentPageList(getCurrentPageArray(filteredArray, idx));
        setPaginationConfig({
          total: filteredArray.length,
          pageSize: PAGE_SIZE,
          pageIndex: idx,
        });
      }
      setPageIndex(idx);
      window.sessionStorage.setItem(PAGE_INDEX, idx);
      window.history.pushState(null, null, `?page=${idx}#${currentTag}`);
    },
    [blogList, filteredArray, currentTag]
  );

  const handleFilter = useCallback(
    (tag, isRestore = true) => {
      window.history.pushState(null, null, `?page=1#${tag}`);
      isRestore && window.sessionStorage.setItem(FILTER_TAG, tag);
      filterByTag(tag);
    },
    [filterByTag]
  );

  const handlePagination = useCallback(
    (idx, isRestore = true) => {
      window.history.pushState(null, null, `?page=${idx}#${currentTag}`);
      isRestore && window.sessionStorage.setItem(PAGE_INDEX, idx);
      filterByPageIndex(idx);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    [filterByPageIndex, currentTag]
  );

  useCodeCopy(locale);
  useFilter();

  useEffect(() => {
    const { search, hash } = globalHistory.location;
    if (!isBlogListPage) {
      return;
    }
    const pageIdx = search.replace(/\?page=/g, '') || 1;
    const tag = hash.replace(/#/g, '') || 'all';

    setCurrentTag(tag);
    setPageIndex(parseInt(pageIdx));
    if (tag === 'all') {
      setCurrentPageList(getCurrentPageArray(blogList, parseInt(pageIdx)));
      setPaginationConfig({
        total: blogList.length,
        pageSize: PAGE_SIZE,
        pageIndex: parseInt(pageIdx),
      });
      return;
    }
    const filteredArray = blogList.filter(i => i.tags.includes(tag));
    setFilteredArray(filteredArray);
    setCurrentPageList(getCurrentPageArray(filteredArray, parseInt(pageIdx)));
    setPaginationConfig({
      total: filteredArray.length,
      pageSize: PAGE_SIZE,
      pageIndex: parseInt(pageIdx),
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.blogWrapper}>
      <Header locale={locale} />
      <Seo
        title={seoTitle}
        lang={locale}
        description={seoDesc}
        link={canonicalLink}
      />
      {isBlogListPage ? (
        <div className={styles.blogContentWrapper}>
          <h1 className={styles.blogHeader}>Milvus Blogs</h1>
          <ul className={styles.tags}>
            {tagList.map(tag => (
              <li key={tag}>
                <span
                  role="button"
                  tabIndex={0}
                  className={styles.tagItem}
                  onClick={() => handleFilter(tag)}
                  onKeyDown={() => handleFilter(tag)}
                >
                  <BlogTag name={tag} isActive={currentTag === tag} />
                </span>
              </li>
            ))}
          </ul>
          <ul className={styles.content}>
            {currentPageList.map(item => {
              const { desc, cover, date, tags, id, title } = item;
              return (
                <li key={item.id}>
                  <BlogCard
                    locale={locale}
                    title={title}
                    date={date}
                    cover={`https://${cover}`}
                    desc={desc}
                    tags={tags}
                    path={`${id}?page=${pageIndex}#${currentTag}`}
                  />
                </li>
              );
            })}
          </ul>
          <Pagination
            {...paginationConfig}
            handlePageIndexChange={handlePagination}
          />
        </div>
      ) : (
        <BlogDeatil
          innerHtml={newHtml}
          author={author}
          tags={tags}
          date={date}
          title={title}
          locale={locale}
          blogList={blogList}
          id={id}
        />
      )}
      {isBlogListPage && (
        <div className={styles.footerWrapper}>
          <Footer local={locale} footer={footer} />
        </div>
      )}
    </div>
  );
};

export default BlogTemplate;

export const Query = graphql`
  query BlogHomeQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childI18N {
            v2 {
              footer {
                list {
                  title
                  text
                  href
                  label
                  icons {
                    href
                    name
                  }
                }
                licence {
                  text1 {
                    label
                    link
                  }
                  text2 {
                    label
                    link
                  }
                  text3 {
                    label
                    link
                  }
                  list {
                    label
                    link
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
