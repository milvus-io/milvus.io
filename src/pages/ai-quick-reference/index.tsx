import classes from '@/styles/faq.module.css';
import pageClasses from '@/styles/responsive.module.css';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import { generateSimpleFaqList } from '@/http/faq';
import { FAQDetailType } from '@/types/faq';
import { useState, useMemo, useEffect, useCallback } from 'react';
import CustomInput from '@/components/customInput/customInput';
import FaqPagination from '@/components/faq/FaqPagination';

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
const API_ROUTE = '/api/ai-quick-reference';

type FaqListItem = Pick<FAQDetailType, 'title' | 'url'>;

type FaqListResponse = {
  list: FaqListItem[];
  total: number;
  pageIndex: number;
  pageSize: number;
};

const normalizePageIndex = (page: unknown, total: number) => {
  const pageIndex = Number(Array.isArray(page) ? page[0] : page || 1);
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  if (!Number.isFinite(pageIndex) || pageIndex < 1) {
    return 1;
  }

  return Math.min(Math.floor(pageIndex), totalPages);
};

export default function AiFaq(props: {
  list: FaqListItem[];
  total: number;
  pageIndex: number;
}) {
  const { t } = useTranslation('faq');
  const { list, total, pageIndex } = props;
  const currentPageIndex = pageIndex;

  const [searchData, setSearchData] = useState<{
    keyword: string;
    list: FaqListItem[];
    isLoading: boolean;
  }>({
    keyword: '',
    list,
    isLoading: false,
  });

  const [paginationData, setPaginationData] = useState({
    total,
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: currentPageIndex,
  });

  const fetchFaqPage = useCallback(async (pageIndex: number, keyword = '') => {
    setSearchData(v => ({
      ...v,
      isLoading: true,
    }));

    try {
      const params = new URLSearchParams({
        [PAGEINDEX_QUERY_KEY]: String(pageIndex),
      });

      if (keyword) {
        params.set('keyword', keyword);
      }

      const response = await fetch(`${API_ROUTE}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch AI Quick Reference list');
      }

      const data: FaqListResponse = await response.json();
      setSearchData(v => ({
        keyword: v.keyword,
        list: data.list,
        isLoading: false,
      }));
      setPaginationData({
        total: data.total,
        pageSize: data.pageSize,
        pageIndex: data.pageIndex,
      });
    } catch (error) {
      setSearchData(v => ({
        ...v,
        isLoading: false,
      }));
      console.error(error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const trimmedKeyword = keyword.trim();

    setSearchData(v => ({
      ...v,
      keyword,
    }));
    window.history.pushState(
      null,
      '',
      `/ai-quick-reference?${PAGEINDEX_QUERY_KEY}=1`
    );
    fetchFaqPage(1, trimmedKeyword);
  };

  const handlePaging = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    e.preventDefault();
    if (index === paginationData.pageIndex) {
      return;
    }
    setPaginationData({
      ...paginationData,
      pageIndex: index,
    });
    window.history.pushState(
      null,
      '',
      `/ai-quick-reference?${PAGEINDEX_QUERY_KEY}=${index}`
    );
    fetchFaqPage(index, searchData.keyword.trim());
  };

  const { totalPages, pagingFilterList } = useMemo(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(paginationData.total / paginationData.pageSize)
    );

    return {
      totalPages,
      pagingFilterList: searchData.list,
    };
  }, [searchData.list, paginationData.total, paginationData.pageSize]);

  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      const pageIndex = Number(
        new URL(window.location.href).searchParams.get(PAGEINDEX_QUERY_KEY) || 1
      );
      fetchFaqPage(pageIndex, searchData.keyword.trim());
    };

    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, [fetchFaqPage, searchData.keyword]);

  return (
    <Layout>
      <main>
        <Head>
          <title>AI Quick Reference | Milvus</title>
          <meta
            name="description"
            content="Looking for fast answers or a quick refresher on AI-related topics? The AI Quick Reference has everything you need—straightforward explanations, practical solutions, and insights on the latest trends."
          />
        </Head>

        <section className={clsx(pageClasses.container, classes.pageContainer)}>
          <h1 className="">{t('title')}</h1>
          <p className="">{t('desc')}</p>

          <CustomInput
            value={searchData.keyword}
            onChange={handleInputChange}
            placeholder={t('search')}
            startIcon={<SearchIcon />}
            classes={{
              root: classes.inputWrapper,
              input: classes.input,
            }}
            fullWidth
          />

          {searchData.isLoading ? (
            <p className="">{t('loading', { defaultValue: 'Loading...' })}</p>
          ) : pagingFilterList.length > 0 ? (
            <ul className={classes.listWrapper}>
              {pagingFilterList.map(v => (
                <li className="" key={v.url}>
                  <Link href={`/ai-quick-reference/${v.url}`}>{v.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="">{t('noData', { keyword: searchData.keyword })}</p>
          )}

          {!searchData.isLoading && pagingFilterList.length > 0 ? (
            <FaqPagination
              pageIndex={paginationData.pageIndex}
              totalPages={totalPages}
              onPageChange={handlePaging}
            />
          ) : null}
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = async ({ query, res }) => {
  try {
    const simpleFaqList = await generateSimpleFaqList();
    const pageIndex = normalizePageIndex(
      query?.[PAGEINDEX_QUERY_KEY],
      simpleFaqList.length
    );
    const start = DEFAULT_PAGE_SIZE * (pageIndex - 1);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=604800'
    );

    return {
      props: {
        list: simpleFaqList.slice(start, start + DEFAULT_PAGE_SIZE),
        total: simpleFaqList.length,
        pageIndex,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
