import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import * as styles from './blogTemplate.module.less';
import Seo from '../components/seo';
import Footer from '../components/footer/v2';
import { graphql } from 'gatsby';
import BlogDeatil from '../components/blogDetail';
import BlogCard from '../components/card/blogCard/v2';
import BlogTag from '../components/blogDetail/blogTag';
import Header from '../components/header/v2';
import { useCodeCopy, useFilter } from '../hooks/doc-dom-operation';
import { deepClone } from '../utils';

export const FILTER_TAG = 'filter_tag';
const splitAllBlogs = (list, n) => {
  const temp = deepClone(list);
  const result = [];

  while (temp.length >= n) {
    result.push(temp.splice(0, n));
  }
  result.push(temp);
  return result;
};

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

  const sliceList = splitAllBlogs(blogList, 6);
  const [currentTag, setCurrentTag] = useState('all');
  const [renderList, setRenderList] = useState(blogList);

  const filterTag = useCallback(
    tag => {
      setCurrentTag(tag);
      if (tag === 'all') {
        setRenderList(blogList);
        return;
      }
      setRenderList(blogList.filter(i => i.tags.includes(tag)));
    },
    [blogList]
  );

  const handleFilter = useCallback(
    (tag, isRestore = true) => {
      window.history.pushState(null, null, `#${tag}`);
      isRestore && window.sessionStorage.setItem(FILTER_TAG, tag);
      filterTag(tag);
    },
    [filterTag]
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

  useEffect(() => {
    const scrollHanlder = () => {
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollBottom = scrollHeight - windowHeight - scrollTop;

      if (scrollBottom <= 600) {
        sliceList.length && setRenderList(v => v.concat(sliceList.shift()));
      }
    };
    window.addEventListener('scroll', scrollHanlder, false);

    return () => {
      window.removeEventListener('scroll', scrollHanlder, false);
    };
  }, []);

  return (
    <div className={styles.blogWrapper}>
      <Header locale={locale} />
      <Seo title={seoTitle} lang={locale} description={seoDesc} />

      {isHomePage ? (
        <div className={styles.blogContentWrapper}>
          <h1 className={styles.blogHeader}>Milvus Blogs</h1>
          <ul className={styles.tags}>
            {tagList.map(tag => (
              <li
                role="button"
                tabIndex={0}
                key={tag}
                className={styles.tagItem}
                onClick={() => handleFilter(tag)}
                onKeyDown={() => handleFilter(tag)}
              >
                <BlogTag name={tag} isActive={currentTag === tag} />
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
