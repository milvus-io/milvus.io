import React from 'react';
import * as styles from './index.module.less';

const IssueCard = props => {
  const {
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
        <a className={styles.button} href={issueHref}>
          Issues
        </a>
        <a className={styles.button} href={guideHref}>
          Guidelines
        </a>
      </div>
    </div>
  );
};
export default IssueCard;
