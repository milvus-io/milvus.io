import React, { useMemo } from 'react';
import LocalizeLink from '../../../localizedLink/localizedLink';
import * as styles from './index.module.less';

const MobileMenuContent = ({
  locale,
  header,
  onChangeLocale,
  to,
  l,
  hideMobileMask,
}) => {
  return useMemo(() => {
    return (
      <i
        className={styles.mobileMenuContent}
        role="button"
        tabIndex={0}
        aria-label="mobile-menu-content"
        onClick={hideMobileMask}
        onKeyDown={hideMobileMask}
      >
        <LocalizeLink
          locale={locale}
          to="/docs/install_milvus.md"
          className={styles.link}
        >
          {header.quick}
        </LocalizeLink>
        <LocalizeLink
          locale={locale}
          to="/docs/benchmarks_azure"
          className={styles.link}
        >
          {header.benchmarks}
        </LocalizeLink>
        <a
          href="https://tutorials.milvus.io"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {header.tutorials}
        </a>

        <LocalizeLink locale={locale} className={styles.link} to="/scenarios">
          {header.solution}
        </LocalizeLink>

        <LocalizeLink
          locale={locale}
          className={styles.link}
          to={'/docs/install_milvus.md'}
        >
          {header.doc}
        </LocalizeLink>
        <LocalizeLink
          locale={locale}
          className={styles.link}
          to={'/blogs/2019-08-26-vector-search-million.md'}
        >
          {header.blog}
        </LocalizeLink>
        <div className={`${styles.btnWrapper} ${styles.link}`}>
          <LocalizeLink
            locale={l}
            to={to}
            className={`${styles.langBtn} ${
              locale === 'en' ? styles.active : ''
            }`}
          >
            <span
              tabIndex={0}
              onKeyDown={onChangeLocale}
              onClick={onChangeLocale}
              role="button"
            >
              English
            </span>
          </LocalizeLink>
          <LocalizeLink
            locale={l}
            to={to}
            className={`${styles.langBtn} ${
              locale === 'cn' ? styles.active : ''
            }`}
          >
            <span
              tabIndex={0}
              onKeyDown={onChangeLocale}
              onClick={onChangeLocale}
              role="button"
            >
              中文
            </span>
          </LocalizeLink>
        </div>
      </i>
    );
  }, [locale, header, l, to, onChangeLocale, hideMobileMask]);
};

export default MobileMenuContent;
