import React from 'react';
import * as styles from './index.module.less';
import LocalizedLink from '../../components/localizedLink/localizedLink';

const NavButton = props => {
  const { nav, title, link, pageInfo, locale } = props;

  const generateNavContent = nav => {
    return nav === 'previous' ? (
      <>
        <i className="fas fa-chevron-left"></i>
        <span className={styles.previousLink}>{title}</span>
      </>
    ) : (
      <>
        <span className={styles.nextLink}>{title}</span>
        <i className="fas fa-chevron-right"></i>
      </>
    );
  };

  return (
    <div className={styles.linkButtonWrapper}>
      {link ? (
        <LocalizedLink
          locale={locale}
          to={`/blog/${link}/?page=${pageInfo.pageIdx}#${pageInfo.filterTag}`}
          className={styles.titleWrapper}
          children={generateNavContent(nav)}
        />
      ) : null}
    </div>
  );
};

export default NavButton;
