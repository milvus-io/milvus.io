import React from 'react';
import * as styles from './index.module.less';

const SolutionCard = ({
  img,
  title,
  content,
  href,
  className = '',
  locale
}) => {
  return (
    <a
      className={`${styles.solutionCard} ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.titleBar}>
        {
          img ? (
            <img src={img} alt="icon" className={styles.img} />
          ) : null
        }
        <h3 className={styles.title} lang={locale}>{title}</h3>
      </div>

      <p className={styles.content} lang={locale}>{content}</p>
    </a>
  );
};

export default SolutionCard;