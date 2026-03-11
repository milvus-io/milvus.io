import classes from '@/styles/faq.module.less';
import pageClasses from '@/styles/responsive.module.less';
import styles from '@/styles/blog.module.less';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/commonLayout';
import { generateSimpleLearnAiList } from '@/http/learnAi';
import { LearnAiDetailType } from '@/types/learnAi';
import { useState, useMemo, useEffect } from 'react';
import CustomInput from '@/components/customInput/customInput';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui';
import { generatePaginationNavigators } from '@/utils/format';
import { ELLIPSIS } from '@/consts/blog';
import { useRouter } from 'next/router';

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.918 12.916L15.8346 15.8327"
      stroke="#667176"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16797 9.16602C4.16797 11.9274 6.40654 14.166 9.16797 14.166C10.5511 14.166 11.8031 13.6044 12.7082 12.6968C13.6103 11.7924 14.168 10.5443 14.168 9.16602C14.168 6.40459 11.9294 4.16602 9.16797 4.16602C6.40654 4.16602 4.16797 6.40459 4.16797 9.16602Z"
      stroke="#667176"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DEFAULT_PAGE_SIZE = 99;
const PAGEINDEX_QUERY_KEY = 'page';

const generatePagingHref = (
  curIndex: number,
  index: number,
  totalPages: number
) => {
  if (curIndex === 1 && index === -1) {
    return '';
  }
  if (curIndex === totalPages && index === 1) {
    return '';
  }
  return `/learn-ai-and-vectordb?${PAGEINDEX_QUERY_KEY}=${curIndex + index}`;
};

export default function LearnAi(props: {
  list: Pick<LearnAiDetailType, 'title' | 'url'>[];
}) {
  const { list } = props;
  const { query } = useRouter();
  const currentPageIndex = Number(query[PAGEINDEX_QUERY_KEY] || 1);

  const [searchData, setSearchData] = useState({
    keyword: '',
    filteredList: list,
  });

  const [paginationData, setPaginationData] = useState({
    total: searchData.filteredList.length,
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: currentPageIndex,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword === '') {
      setSearchData({
        keyword: '',
        filteredList: list,
      });
      setPaginationData(v => ({
        ...v,
        total: list.length,
        pageIndex: 1,
      }));
    } else {
      const newList = list.filter(v =>
        v.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchData({
        keyword: keyword,
        filteredList: newList,
      });
      setPaginationData(v => ({
        ...v,
        total: newList.length,
        pageIndex: 1,
      }));
    }

    window.history.pushState(
      null,
      '',
      `/learn-ai-and-vectordb?${PAGEINDEX_QUERY_KEY}=1`
    );
  };

  const handlePaging = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    disabled?: boolean
  ) => {
    e.preventDefault();
    if (disabled) {
      return;
    }
    setPaginationData({
      ...paginationData,
      pageIndex: index,
    });
    window.history.pushState(
      null,
      '',
      `/learn-ai-and-vectordb?${PAGEINDEX_QUERY_KEY}=${index}`
    );
  };

  const { totalPages, navigators, pagingFilterList } = useMemo(() => {
    const dataListLength = searchData.filteredList.length;
    const totalPages =
      dataListLength % DEFAULT_PAGE_SIZE === 0
        ? dataListLength / DEFAULT_PAGE_SIZE
        : Math.ceil(dataListLength / DEFAULT_PAGE_SIZE);

    const pagingFilterList = searchData.filteredList.slice(
      paginationData.pageSize * (paginationData.pageIndex - 1),
      paginationData.pageSize * paginationData.pageIndex
    );

    const navigators = generatePaginationNavigators(
      paginationData.pageIndex,
      totalPages
    );

    return {
      totalPages,
      navigators,
      pagingFilterList,
    };
  }, [searchData.filteredList, paginationData.pageIndex]);

  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      const pageIndex = Number(
        new URL(window.location.href).searchParams.get(PAGEINDEX_QUERY_KEY) || 1
      );
      setPaginationData(v => ({
        ...v,
        pageIndex,
      }));
    };

    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  const { hasPrevious, hasNext } = useMemo(() => {
    const hasPrevious = paginationData.pageIndex > 1;
    const hasNext =
      paginationData.pageIndex < (navigators[navigators.length - 1] as number);
    return { hasPrevious, hasNext };
  }, [paginationData.pageIndex, navigators]);

  return (
    <Layout>
      <main>
        <Head>
          <title>Learn AI | Milvus</title>
          <meta
            name="description"
            content="Learn about AI concepts, vector databases, and modern AI technologies. Explore our comprehensive collection of articles covering everything from basics to advanced topics."
          />
        </Head>

        <section className={clsx(pageClasses.container, classes.pageContainer)}>
          <h1 className="">Learn AI</h1>
          <p className="">
            Explore our comprehensive collection of articles about AI concepts,
            vector databases, and modern AI technologies.
          </p>

          <CustomInput
            value={searchData.keyword}
            onChange={handleInputChange}
            placeholder="Search articles..."
            startIcon={<SearchIcon />}
            classes={{
              root: classes.inputWrapper,
              input: classes.input,
            }}
            fullWidth
          />

          {pagingFilterList.length > 0 ? (
            <ul className={classes.listWrapper}>
              {pagingFilterList.map(v => (
                <li className="" key={v.url}>
                  <Link href={`/learn-ai-and-vectordb/${v.url}`}>{v.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="">
              No results found for &quot;{searchData.keyword}&quot;
            </p>
          )}

          {pagingFilterList.length > 0 ? (
            <Pagination className={styles.paginationWrapper}>
              <PaginationContent className="list-none">
                <PaginationItem>
                  <PaginationPrevious
                    scroll={false}
                    onClick={e => handlePaging(e, paginationData.pageIndex - 1)}
                    href={generatePagingHref(
                      paginationData.pageIndex,
                      -1,
                      totalPages
                    )}
                    disabled={!hasPrevious}
                    className={clsx(styles.paginationLink, {
                      [styles.disabledNavigationLink]: !hasPrevious,
                    })}
                  />
                </PaginationItem>

                {navigators.map((v, i) => {
                  return (
                    <PaginationItem key={v}>
                      {String(v).includes(ELLIPSIS) ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          scroll={false}
                          disabled={paginationData.pageIndex === v}
                          onClick={e =>
                            handlePaging(
                              e,
                              v as number,
                              paginationData.pageIndex === v
                            )
                          }
                          href={`/learn-ai-and-vectordb?${PAGEINDEX_QUERY_KEY}=${v}`}
                          isActive={paginationData.pageIndex === v}
                          className={clsx(styles.paginationLink, {
                            [styles.activePaginationLink]:
                              paginationData.pageIndex === v,
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
                    href={generatePagingHref(
                      paginationData.pageIndex,
                      1,
                      totalPages
                    )}
                    scroll={false}
                    onClick={e => handlePaging(e, paginationData.pageIndex + 1)}
                    disabled={!hasNext}
                    className={clsx(styles.paginationLink, {
                      [styles.disabledNavigationLink]: !hasNext,
                    })}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  try {
    const simpleLearnAiList = await generateSimpleLearnAiList();
    return {
      props: {
        list: simpleLearnAiList,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
