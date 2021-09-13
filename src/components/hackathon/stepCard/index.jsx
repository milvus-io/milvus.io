import React from 'react';
import * as styles from './index.module.less';

const StepCard = props => {
  const {
    title,
    content,
    stepNum,
    iconType = 'anchor',
    href = '#issue_list',
    className = '',
  } = props;

  return (
    <a className={`${styles.stepCardWrapper} ${className}`} href={href}>
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

        <p className={styles.content}>{content}</p>
      </div>
    </a>
  );
};
export default StepCard;
