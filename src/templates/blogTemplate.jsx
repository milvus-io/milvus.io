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
import { splitList } from '../utils';
import { FILTER_TAG } from '../constants';
import Pagination from '../components/pagination';

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

  // list that can be viewed after pagination
  const [pageTotalList, setPageTotalList] = useState([]);
  const [pageinationConfig, setPageinationConfig] = useState({
    total: blogList.length,
    pageSize: 9,
  });
  const slicedList = splitList(blogList, pageinationConfig.pageSize);

  const tagList = useMemo(() => {
    if (!isHomePage) return [];
    let tempList = pageTotalList.reduce((acc, cur) => {
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
  }, [pageTotalList, isHomePage]);

  const [currentTag, setCurrentTag] = useState('all');
  // list that used for rendering after filter by tag
  const [renderList, setRenderList] = useState(pageTotalList);

  const filterTag = useCallback(
    tag => {
      setCurrentTag(tag);
      if (tag === 'all') {
        setRenderList(pageTotalList);
        setPageinationConfig({
          total: blogList.length,
          pageSize: 9,
        });
        return;
      }
      setRenderList(pageTotalList.filter(i => i.tags.includes(tag)));
      setPageinationConfig({
        total: pageTotalList.filter(i => i.tags.includes(tag)).length,
        pageSize: 9,
      });
    },
    [pageTotalList, blogList.length]
  );

  const handleFilter = useCallback(
    (tag, isRestore = true) => {
      window.history.pushState(null, null, `#${tag}`);
      isRestore && window.sessionStorage.setItem(FILTER_TAG, tag);
      filterTag(tag);
    },
    [filterTag]
  );

  const handlePageIndexChange = useCallback(
    idx => {
      if (idx < 1 || idx > slicedList.length) return;
      setPageTotalList(slicedList[idx - 1]);
      setRenderList(slicedList[idx - 1]);
    },
    [slicedList]
  );

  useCodeCopy(locale);
  useFilter();

  useEffect(() => {
    const hash = window.sessionStorage.getItem(FILTER_TAG);
    if (hash) {
      isHomePage && handleFilter(hash, false);
    } else {
      isHomePage && window.history.pushState(null, null, '#all');
    }
  }, [isHomePage, handleFilter]);

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
            {renderList.map(item => {
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
            {...pageinationConfig}
            handlePageIndexChange={handlePageIndexChange}
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
