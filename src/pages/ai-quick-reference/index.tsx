import classes from '@/styles/faq.module.css';
import pageClasses from '@/styles/responsive.module.css';
import clsx from 'clsx';
import Head from 'next/head';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { referenceListPath, referencePageIndex } from '@/utils/ai-reference-query';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import { generateSimpleFaqList } from '@/http/faq';
import { FAQDetailType } from '@/types/faq';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import CustomInput from '@/components/customInput/customInput';
import FaqPagination from '@/components/faq/FaqPagination';
import topics from '../../../content/ai-quick-reference/topics.json';
import { AI_REFERENCE_PAGE_SIZE as DEFAULT_PAGE_SIZE } from '@/consts/faq';

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

const PAGEINDEX_QUERY_KEY = 'page';
const API_ROUTE = '/api/ai-quick-reference';

type FaqListItem = Pick<FAQDetailType, 'title' | 'url' | 'topic'>;

type FaqListResponse = {
  list: FaqListItem[];
  total: number;
  pageIndex: number;
  pageSize: number;
};

export default function AiFaq(props: {
  list: FaqListItem[];
  total: number;
  pageIndex: number;
  topic: string;
  keyword: string;
}) {
  const { t } = useTranslation('faq');
  const { list, total, pageIndex, topic, keyword } = props;
  const currentPageIndex = pageIndex;
  const searchRequest = useRef(0);

  const [searchData, setSearchData] = useState<{
    keyword: string;
    list: FaqListItem[];
    isLoading: boolean;
  }>({
    keyword,
    list,
    isLoading: false,
  });

  const [paginationData, setPaginationData] = useState({
    total,
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: currentPageIndex,
  });

  const fetchFaqPage = useCallback(
    async (pageIndex: number, keyword = '') => {
      const request = ++searchRequest.current;
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
        if (topic) params.set('topic', topic);

        const response = await fetch(`${API_ROUTE}?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch AI Quick Reference list');
        }

        const data: FaqListResponse = await response.json();
        if (request !== searchRequest.current) return;
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
        if (request !== searchRequest.current) return;
        setSearchData(v => ({
          ...v,
          isLoading: false,
        }));
        console.error(error);
      }
    },
    [topic]
  );

  const pageUrl = (page: number, search = '') => referenceListPath(page, topic, search);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const trimmedKeyword = keyword.trim();

    setSearchData(v => ({
      ...v,
      keyword,
    }));
    window.history.pushState(null, '', pageUrl(1, trimmedKeyword));
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
      pageUrl(index, searchData.keyword.trim())
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
      const keyword =
        new URL(window.location.href).searchParams.get('keyword') || '';
      setSearchData(v => ({ ...v, keyword }));
      fetchFaqPage(pageIndex, keyword);
    };

    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, [fetchFaqPage, searchData.keyword]);

  return (
    <Layout
      disableLangSelector
      disableSelfHreflang
      canonicalUrl={`${ABSOLUTE_BASE_URL}${pageUrl(paginationData.pageIndex, searchData.keyword)}`}
    >
      <main>
        <Head>
          <title>{`AI Quick Reference${topic ? `: ${topics.find(item => item.id === topic)?.label}` : ''}${paginationData.pageIndex > 1 ? ` — Page ${paginationData.pageIndex}` : ''} | Milvus`}</title>
          {searchData.keyword.trim() && <meta name="robots" content="noindex, follow" />}
          <meta name="description" content={t('desc')} />
        </Head>

        <section className={clsx(pageClasses.container, classes.pageContainer)}>
          <h1 className="">{t('title')}</h1>
          <p className="">{t('desc')}</p>

          <nav aria-label="Reference topics" className={classes.topicNav}>
            <a
              href="/ai-quick-reference"
              aria-current={!topic ? 'page' : undefined}
            >
              {t('allTopics')}
            </a>
            {topics.map(item => (
              <a
                key={item.id}
                href={`/ai-quick-reference?topic=${item.id}`}
                aria-current={topic === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

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
              pageHref={page => pageUrl(page, searchData.keyword)}
            />
          ) : null}
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = async ({ query, res }) => {
  try {
    if (['topic', 'keyword'].some(key => query?.[key] !== undefined && typeof query[key] !== 'string'))
      return { notFound: true };
    const topic = String(query?.topic || '');
    if (topic && !topics.some(item => item.id === topic))
      return { notFound: true };
    const keyword = String(query?.keyword || '').trim();
    const simpleFaqList = (await generateSimpleFaqList()).filter(
      item =>
        (!topic || item.topic === topic) &&
        (!keyword || item.title.toLowerCase().includes(keyword.toLowerCase()))
    );
    const pageIndex = referencePageIndex(
      query?.[PAGEINDEX_QUERY_KEY],
      simpleFaqList.length,
      DEFAULT_PAGE_SIZE
    );
    if (pageIndex === null) return { notFound: true };
    if (keyword) res.setHeader('X-Robots-Tag', 'noindex, follow');
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
        topic,
        keyword,
      },
    };
  } catch (error) {
    // Catalog failures are operational errors, not a removed hub page.
    throw error;
  }
};
