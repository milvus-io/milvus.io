import React from 'react';
import * as styles from './index.module.less';
import LocalizedLink from '../../localizedLink/localizedLink';

const IssueCard = props => {
  const {
    locale,
    icon,
    category,
    description,
    issueHref = '/#',
    guideHref = '/#',
    className = '',
  } = props;

  return (
    <div className={`${styles.issueCardWrapper} ${className}`}>
      <div className={styles.itemWrapper}>
        <img src={icon} alt="" />
        <p className={styles.cate}>{category}</p>
      </div>
      <div className={styles.itemWrapper}>
        <p className={styles.desc}>{description}</p>
      </div>
      <div className={styles.btnWrapper}>
        {issueHref && (
          <LocalizedLink
            className={styles.button}
            to={issueHref}
            locale={locale}
          >
            Issues
          </LocalizedLink>
        )}
        {guideHref && (
          <LocalizedLink
            className={styles.button}
            to={guideHref}
            locale={locale}
          >
            Guidelines
          </LocalizedLink>
        )}
      </div>
    </div>
  );
};
export default IssueCard;
