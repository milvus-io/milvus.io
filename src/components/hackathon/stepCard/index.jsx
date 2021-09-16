import React from 'react';
import * as styles from './index.module.less';
import LocalizedLink from '../../localizedLink/localizedLink';

const StepCard = props => {
  const {
    locale,
    title,
    content,
    stepNum,
    iconType = 'anchor',
    href = '#issue_list',
    className = '',
  } = props;

  return (
    <LocalizedLink
      className={`${styles.stepCardWrapper} ${className}`}
      to={href}
      locale={locale}
    >
      <div className={styles.numberWrapper}>
        <div className={styles.numberContent}>{stepNum}</div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.titleBar}>
          <h4 className="title">{title}</h4>
          {iconType === 'external' ? (
            <i className="fas fa-external-link-alt"></i>
          ) : (
            <i className="far fa-arrow-alt-circle-down"></i>
          )}
        </div>

        <p>{content}</p>
      </div>
    </LocalizedLink>
  );
};
export default StepCard;
