import React, { useState, useEffect, useMemo } from 'react';
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

const PAGE_SIZE = 9;

const getCurrentPageArray = (list, pageIndex) =>
  list.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE);

const BlogTemplate = ({ data, pageContext }) => {
  const { footer } = data.allFile.edges.filter(edge => edge.node.childI18N)[0]
    .node.childI18N.v2;
  const [seoTitle, seoDesc] = ['Milvus Blogs', 'Milvus Blogs'];

  const {
    isHomePage,
    blogList,
    locale,
    newHtml,
    author,
    date,
    tags,
    banner,
    title,
    id,
  } = pageContext;
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
    if (!isHomePage) return [];
    let tempList = blogList.reduce((acc, cur) => {
      return acc.concat(cur.tags);
    }, []);

    return tempList.reduce(
      (acc, cur) => {
        if (!acc.includes(cur)) {
          acc.push(cur);
        }
        return acc;
      },
      ['all']
    );
  }, [blogList, isHomePage]);

  const filterByTag = tag => {
    setCurrentTag(tag);
    window.sessionStorage.setItem(FILTER_TAG, tag);
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
  };

  const filterByPageIndex = idx => {
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
  };

  const handleFilter = (tag, isRestore = true) => {
    window.history.pushState(null, null, `?page=1#${tag}`);
    isRestore && window.sessionStorage.setItem(FILTER_TAG, tag);
    filterByTag(tag);
  };

  const handlePagination = (idx, isRestore = true) => {
    window.history.pushState(null, null, `?page=${idx}#${currentTag}`);
    isRestore && window.sessionStorage.setItem(PAGE_INDEX, idx);
    filterByPageIndex(idx);
  };

  useCodeCopy(locale);
  useFilter();

  useEffect(() => {
    isHomePage && window.history.pushState(null, null, '?page=1#all');
    isHomePage && window.sessionStorage.setItem(FILTER_TAG, 'all');
    isHomePage && window.sessionStorage.setItem(PAGE_INDEX, 1);

    // const search = window.sessionStorage.getItem(FILTER_TAG) || 1,
    //   hash = window.sessionStorage.getItem(PAGE_INDEX) || "all";
    // handleFilter(hash, false);
    // handlePagination(search, false);
    // window.history.pushState(null, null, `?page=${search}#${hash}`);
  }, [isHomePage]);

  return (
    <div className={styles.blogWrapper}>
      <Header locale={locale} />
      <Seo title={seoTitle} lang={locale} description={seoDesc} />

      {isHomePage ? (
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
                    cover={cover.publicURL}
                    desc={desc}
                    tags={tags}
                    path={id}
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
          banner={banner.publicURL}
          date={date}
          title={title}
          locale={locale}
          tag={currentTag}
          blogList={blogList}
          id={id}
        />
      )}
      <div className={styles.footerWrapper}>
        <Footer local={locale} footer={footer} />
      </div>
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
