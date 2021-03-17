import React, { useMemo } from 'react';
import LocalizeLink from '../../../localizedLink/localizedLink';
import './index.scss';

const MobileMenuContent = ({ locale, header, onChangeLocale, to, l, hideMobileMask }) => {

  return useMemo(() => {
    return (
      <i className="mobile-menu-content"
        role="button"
        tabIndex={0}
        aria-label="mobile-menu-content"
        onClick={hideMobileMask}
        onKeyDown={hideMobileMask}
      >
        <LocalizeLink
          locale={locale}
          to="/docs/install_milvus.md"
          className="link"
        >
          {header.quick}
        </LocalizeLink>
        <a
          href="https://tutorials.milvus.io"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {header.tutorials}
        </a>

        <LocalizeLink locale={locale} className="link" to="/scenarios">
          {header.solution}
        </LocalizeLink>

        <LocalizeLink
          locale={locale}
          className="link"
          to={'/docs/install_milvus.md'}
        >
          {header.doc}
        </LocalizeLink>
        <LocalizeLink
          locale={locale}
          className="link"
          to={'/blogs/2019-08-26-vector-search-million.md'}
        >
          {header.blog}
        </LocalizeLink>
        <div className="btn-wrapper link">
          <LocalizeLink
            locale={l}
            to={to}
            className={`langBtn ${locale === 'en' ? 'active' : ''}`}
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
            className={`langBtn ${locale === 'cn' ? 'active' : ''}`}
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
