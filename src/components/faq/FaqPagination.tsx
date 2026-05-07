import Link from 'next/link';
import clsx from 'clsx';
import styles from '@/styles/blog.module.css';
import { ELLIPSIS } from '@/consts/blog';
import { generatePaginationNavigators } from '@/utils/format';

const PAGEINDEX_QUERY_KEY = 'page';

const ChevronLeft = () => (
  <svg
    className="h-4 w-4"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="h-4 w-4"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreHorizontal = () => (
  <svg
    className="h-4 w-4"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      fill="currentColor"
    />
    <path
      d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
      fill="currentColor"
    />
    <path
      d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
      fill="currentColor"
    />
  </svg>
);

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
  return `/ai-quick-reference?${PAGEINDEX_QUERY_KEY}=${curIndex + index}`;
};

export default function FaqPagination({
  pageIndex,
  totalPages,
  onPageChange,
}: {
  pageIndex: number;
  totalPages: number;
  onPageChange: (e: React.MouseEvent<HTMLAnchorElement>, page: number) => void;
}) {
  const navigators = generatePaginationNavigators(pageIndex, totalPages);
  const hasPrevious = pageIndex > 1;
  const hasNext = pageIndex < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={clsx(
        'mx-auto flex w-full justify-center',
        styles.paginationWrapper
      )}
    >
      <ul className="flex flex-row items-center gap-1 list-none">
        <li>
          {hasPrevious ? (
            <Link
              aria-label="Go to previous page"
              scroll={false}
              onClick={e => onPageChange(e, pageIndex - 1)}
              href={generatePagingHref(pageIndex, -1, totalPages)}
              className={clsx('gap-1 pl-2.5', styles.paginationLink)}
            >
              <ChevronLeft />
            </Link>
          ) : (
            <button
              aria-label="Go to previous page"
              disabled
              className={clsx(
                'w-[32px] h-[32px] p-0 m-0 flex items-center justify-center',
                styles.paginationLink,
                styles.disabledNavigationLink
              )}
            >
              <ChevronLeft />
            </button>
          )}
        </li>

        {navigators.map(v => (
          <li key={v}>
            {String(v).includes(ELLIPSIS) ? (
              <span
                aria-hidden
                className="flex h-9 w-9 items-end p-[6px] justify-center"
              >
                <MoreHorizontal />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <Link
                scroll={false}
                onClick={e => onPageChange(e, v as number)}
                href={`/ai-quick-reference?${PAGEINDEX_QUERY_KEY}=${v}`}
                aria-current={pageIndex === v ? 'page' : undefined}
                className={clsx(styles.paginationLink, {
                  [styles.activePaginationLink]: pageIndex === v,
                })}
              >
                {v}
              </Link>
            )}
          </li>
        ))}

        <li>
          {hasNext ? (
            <Link
              aria-label="Go to next page"
              href={generatePagingHref(pageIndex, 1, totalPages)}
              scroll={false}
              onClick={e => onPageChange(e, pageIndex + 1)}
              className={clsx('gap-1 pr-2.5', styles.paginationLink)}
            >
              <ChevronRight />
            </Link>
          ) : (
            <button
              aria-label="Go to next page"
              disabled
              className={clsx(
                'w-[32px] h-[32px] p-0 m-0 flex items-center justify-center',
                styles.paginationLink,
                styles.disabledNavigationLink
              )}
            >
              <ChevronRight />
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
