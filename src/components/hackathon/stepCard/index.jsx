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
    href = '',
    className = '',
  } = props;

  const generateContent = (title, stepNum, content, styles) => {
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      {href.includes('#') ? (
        <a
          className={`${styles.stepCardWrapper} ${className}`}
          href={href}
          locale={locale}
          target="_self"
        >
          {generateContent(title, stepNum, content, styles)}
        </a>
      ) : (
        <LocalizedLink
          className={`${styles.stepCardWrapper} ${className}`}
          to={href}
          locale={locale}
        >
          {generateContent(title, stepNum, content, styles)}
        </LocalizedLink>
      )}
    </>
  );
};
export default StepCard;
