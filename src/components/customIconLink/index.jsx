import React, { useMemo } from 'react';
import clsx from 'clsx';
import * as styles from './CustomIconLink.module.less';
import Link from 'next/link';

export default function CustomIconLink(props) {
  const {
    href,
    className = '',
    showIcon = true,
    children,
    customIcon,
    isDoc = false,
  } = props;

  const linkTarget = useMemo(() => {
    const isExternal = /^(http|https)/.test(href);
    return isExternal ? '_blank' : '_self';
  }, [href]);

  return (
    <Link
      href={href || ''}
      target={linkTarget}
      rel="noopener noreferrer"
      className={clsx(styles.link, className)}
    >
      {showIcon && (
        <span className={styles.iconWrapper}>
          {customIcon ? (
            { customIcon }
          ) : (
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isDoc ? (
                <>
                  <path
                    d="M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11.9976C10 14.4893 12.317 16.9952 15.1429 16.9952C15.4776 16.9952 16.581 16.9952 16.8571 16.9952C19.6975 16.9952 22 14.7577 22 11.9976C22 9.6192 20.2903 7.62884 18 7.12383C17.6324 7.04278 17.2499 6.99999 16.8571 6.99999"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.84623 1.30028H1.15384L1.15384 0.300279L11.0533 0.300279L11.5533 0.30028L11.5533 0.800279L11.5533 10.6998L10.5533 10.6998L10.5533 2.00738L0.80029 11.7604L0.0931833 11.0533L9.84623 1.30028Z"
                  fill="white"
                />
              )}
            </svg>
          )}
        </span>
      )}
      {children}
    </Link>
  );
}
