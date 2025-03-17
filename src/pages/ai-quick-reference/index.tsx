import classes from '@/styles/faq.module.less';
import pageClasses from '@/styles/responsive.module.less';
import styles from '@/styles/blog.module.less';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import { FAQDetailType, generateSimpleFaqList } from '@/http/faq';
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

export default function AiFaq(props: {
  list: Pick<FAQDetailType, 'title' | 'url'>[];
}) {
  const { t } = useTranslation('faq');
  const { list } = props;

  const [keywords, setKeyWords] = useState('');
  const [filteredList, setFilteredList] = useState(list);

  const [paginationData, setPaginationData] = useState({
    total: filteredList.length,
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWords(e.target.value);
  };

  const handlePaging = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    e.preventDefault();

    setPaginationData({
      ...paginationData,
      pageIndex: index,
    });
  };

  const navigators = useMemo(() => {
    const totalPages =
      filteredList.length % DEFAULT_PAGE_SIZE === 0
        ? filteredList.length / DEFAULT_PAGE_SIZE
        : Math.ceil(filteredList.length / DEFAULT_PAGE_SIZE);

    return generatePaginationNavigators(paginationData.pageIndex, totalPages);
  }, [filteredList, paginationData.pageIndex]);

  const { hasPrevious, hasNext } = useMemo(() => {
    const hasPrevious = paginationData.pageIndex > 1;
    const hasNext =
      paginationData.pageIndex < (navigators[navigators.length - 1] as number);
    return { hasPrevious, hasNext };
  }, [paginationData.pageIndex, navigators]);

  const pagingFilterList = useMemo(() => {
    return filteredList.slice(
      paginationData.pageSize * (paginationData.pageIndex - 1),
      paginationData.pageSize * paginationData.pageIndex
    );
  }, [filteredList, paginationData.pageIndex]);

  useEffect(() => {
    const keyword = keywords.trim();
    if (keyword === '') {
      setFilteredList(list);
    } else {
      setFilteredList(
        list.filter(v => v.title.toLowerCase().includes(keywords.toLowerCase()))
      );
    }
  }, [keywords, list]);

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
            value={keywords}
            onChange={handleInputChange}
            placeholder={t('search')}
            startIcon={<SearchIcon />}
            classes={{
              root: classes.inputWrapper,
              input: classes.input,
            }}
            fullWidth
          />

          <ul className={classes.listWrapper}>
            {pagingFilterList.map(v => (
              <li className="" key={v.url}>
                <Link href={`/ai-quick-reference/${v.url}`}>{v.title}</Link>
              </li>
            ))}
          </ul>

          <Pagination className={styles.paginationWrapper}>
            <PaginationContent className="list-none">
              <PaginationItem>
                <PaginationPrevious
                  scroll={false}
                  onClick={e => handlePaging(e, paginationData.pageIndex - 1)}
                  href="#"
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
                        onClick={e => handlePaging(e, v as number)}
                        href="#"
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
                  href="#"
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
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const simpleFaqList = await generateSimpleFaqList();
  return {
    props: {
      list: simpleFaqList,
    },
  };
};
