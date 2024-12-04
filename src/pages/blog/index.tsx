import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import blogUtils from '../../utils/blog.utils';
import Layout from '../../components/layout/commonLayout';
import BlogCard from '../../components/card/BlogCard';
import Tags from '../../components/tags';
import styles from '../../styles/blog.module.less';
import pageClasses from '../../styles/responsive.module.less';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import CustomButton from '../../components/customButton';
import { RightWholeArrow } from '../../components/icons';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { BlogFrontMatterType } from '@/types/blogs';
import SubscribeNewsletter from '@/components/subscribe';
import Link from 'next/link';

const PAGE_SIZE = 9;
const TITLE = 'Learn Milvus: Insights and Innovations in VectorDB Technology';
const DESC =
  'Learn vector database fundamentals, Milvus features and capabilities, and technical tutorials on managing and optimizing vector search for modern AI apps.';

const TAG_QUERY_KEY = 'blog_tag';
const DEFAULT_TAG = 'all';

const PAGINATION_QUERY_KEY = 'page';
const DEFAULT_PAGE = 1;

const ELLIPSIS = 'ellipsis';
const ELLIPSIS_2 = 'ellipsis2';

const generatePaginationNavigators = (
  currentPage: number,
  totalPages: number
) => {
  if (totalPages <= 4) {
    // [1,2,3,4]
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 2) {
    // [1,2,3,...,5]
    return [1, 2, 3, ELLIPSIS, totalPages];
  }
  if (currentPage <= 3) {
    // [1,2,3,...,5];
    return [1, 2, 3, 4, ELLIPSIS, totalPages];
  }

  if (currentPage === totalPages - 2) {
    // [1,...,4,5,6,7]
    return [
      1,
      ELLIPSIS,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  if (currentPage > totalPages - 2) {
    // [1,...,3,4,5]
    return [1, ELLIPSIS, totalPages - 2, totalPages - 1, totalPages];
  }
  // [1,...,3,4,5,...,7]
  return [
    1,
    ELLIPSIS,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    ELLIPSIS_2,
    totalPages,
  ];
};

const BlogTemplate = (props: {
  locale: string;
  blogList: BlogFrontMatterType[];
}) => {
  const { locale, blogList } = props;

  const router = useRouter();

  const [queryParams, setQueryParams] = useState({
    tag: DEFAULT_TAG,
    page: DEFAULT_PAGE,
  });

  const { featuredBlog, restBlogs } = useMemo(() => {
    // blogs are sorted by time, take the latest recommended blog as the featured blog
    // if no recommended blog, take the latest blog as the featured blog
    const recommendedBlog = blogList.find(v => v.recommend) || blogList[0];
    const restBlogs = blogList.filter(v => v.id !== recommendedBlog.id);
    return {
      featuredBlog: recommendedBlog,
      restBlogs,
    };
  }, [blogList]);

  const handleFilter = (tag: string) => {
    // always reset to the first page when filtering tags
    window.history.pushState(
      {},
      '',
      `/blog?${TAG_QUERY_KEY}=${tag}&${PAGINATION_QUERY_KEY}=${DEFAULT_PAGE}`
    );
    setQueryParams({
      tag,
      page: DEFAULT_PAGE,
    });
  };

  const generatePagination = (page: 1 | -1) => {
    const { tag, page: currentPage } = queryParams;

    if (page === 1 && currentPage === filteredData.totalPages) {
      return '';
    }
    if (page === -1 && currentPage === 1) {
      return '';
    }

    return {
      path: `/blog?${TAG_QUERY_KEY}=${tag}&${PAGINATION_QUERY_KEY}=${
        currentPage + page
      }`,
      previousDisabled: currentPage + page === 1,
      nextDisabled: currentPage + page === filteredData.totalPages,
    };
  };

  // list of tags
  const tagList = useMemo(() => {
    const tagData = {
      all: DEFAULT_TAG,
    };
    blogList.forEach(item => {
      const { tags } = item;
      tags.forEach(subItem => {
        tagData[subItem] = subItem;
      });
    });
    return Object.keys(tagData);
  }, [blogList]);

  const filteredData = useMemo(() => {
    const { tag, page } = queryParams;
    const tagFilteredBlogs =
      tag === DEFAULT_TAG
        ? restBlogs
        : restBlogs.filter(v => v.tags.includes(tag));
    const pageFilteredBlogs = tagFilteredBlogs.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );
    const totalPages = Math.ceil(tagFilteredBlogs.length / PAGE_SIZE);
    const paginationNavigators = generatePaginationNavigators(page, totalPages);
    return {
      blogs: pageFilteredBlogs,
      totalLength: tagFilteredBlogs.length,
      totalPages,
      paginationNavigators,
    };
  }, [queryParams, restBlogs]);

  useEffect(() => {
    const { query } = router;
    const tag = (query[TAG_QUERY_KEY] as string) || DEFAULT_TAG;
    const page = Number(query[PAGINATION_QUERY_KEY]) || DEFAULT_PAGE;

    setQueryParams({
      tag,
      page,
    });
  }, [router]);

  const navigateLinks = useMemo(() => {
    const { tag, page } = queryParams;
    const previousLink =
      page > 1
        ? `/blog?${TAG_QUERY_KEY}=${tag}&${PAGINATION_QUERY_KEY}=${page - 1}`
        : '';
    const previousLinkDisabled = page === 1;
    const nextLink =
      page < filteredData.totalPages
        ? `/blog?${TAG_QUERY_KEY}=${tag}&${PAGINATION_QUERY_KEY}=${page + 1}`
        : '';
    const nextLinkDisabled = page === filteredData.totalPages;
    return {
      previousLink,
      nextLink,
      previousLinkDisabled,
      nextLinkDisabled,
    };
  }, [queryParams, filteredData]);

  const absoluteUrl = `${ABSOLUTE_BASE_URL}/blog`;

  return (
    <Layout>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta property="og:title" content={TITLE}></meta>
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={absoluteUrl} />
        <link rel="alternate" href={absoluteUrl} hrefLang="en" />
      </Head>
      <main>
        <div className={clsx(pageClasses.container, styles.listWrapper)}>
          {/* screen > 1024  */}
          <section className={styles.featuredBlog}>
            <div className={clsx(styles.featuredImg)}>
              <img src={featuredBlog.cover} alt={featuredBlog.title} />
            </div>
            <div className={clsx(styles.featuredBlogContent)}>
              <div className="">
                <p className={styles.tag}>{featuredBlog.tags.join(' ')}</p>
                <Link href={`/blog/${featuredBlog.id}`}>
                  <h2 className={styles.title}>{featuredBlog.title}</h2>
                </Link>

                <p className={styles.desc}>{featuredBlog.desc}</p>
              </div>
              <CustomButton
                endIcon={<RightWholeArrow />}
                variant="text"
                className={styles.readMoreButton}
                href={`/blog/${featuredBlog.id}`}
              >
                Read Now
              </CustomButton>
            </div>
          </section>

          <section className={styles.blogList}>
            <h1 className={styles.hiddenHeading1}>Milvus Blogs</h1>
            <Tags
              list={tagList}
              tagsClass={styles.tagsWrapper}
              genTagClass={(tag: string) =>
                clsx({
                  [styles.active]: queryParams.tag === tag,
                })
              }
              onClick={handleFilter}
            />

            <ul className={styles.blogCards}>
              {filteredData.blogs.map(v => {
                const { desc, cover, date, tags, title, id } = v;
                return (
                  <li key={v.id}>
                    <BlogCard
                      title={title}
                      cover={cover}
                      desc={desc}
                      tags={tags}
                      path={id}
                    />
                  </li>
                );
              })}
            </ul>
            <Pagination className={styles.paginationWrapper}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={navigateLinks.previousLink}
                    disabled={navigateLinks.previousLinkDisabled}
                    className={clsx(styles.paginationLink, {
                      [styles.disabledNavigationLink]:
                        navigateLinks.previousLinkDisabled,
                    })}
                  />
                </PaginationItem>
                {filteredData.paginationNavigators.map((v, i) => {
                  return (
                    <PaginationItem key={v}>
                      {String(v).includes(ELLIPSIS) ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href={`/blog?${TAG_QUERY_KEY}=${queryParams.tag}&${PAGINATION_QUERY_KEY}=${v}`}
                          isActive={v === queryParams.page}
                          className={clsx(styles.paginationLink, {
                            [styles.activePaginationLink]:
                              v === queryParams.page,
                          })}
                        >
                          {v}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href={navigateLinks.nextLink}
                    disabled={navigateLinks.nextLinkDisabled}
                    className={clsx(styles.paginationLink, {
                      [styles.disabledNavigationLink]:
                        navigateLinks.nextLinkDisabled,
                    })}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default BlogTemplate;

export const getStaticProps = () => {
  const list = blogUtils.getAllData();

  return {
    props: {
      locale: 'en',
      blogList: list,
    },
  };
};
