import React from 'react';
import * as styles from './index.module.less';

const SolutionCard = ({
  img,
  title,
  content,
  href,
  className = '',
  liveDemo = '',
}) => {
  const handleClick = () => {
    window.open(href, {
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  };
  return (
    <div
      tabIndex={0}
      role="button"
      className={`${styles.solutionCard} ${className}`}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <div className={styles.titleBar}>
        <h3 className={styles.title}>{title}</h3>
        {img ? <img src={img} alt="icon" className={styles.img} /> : null}
      </div>

      <p className={styles.content}>{content}</p>
      {liveDemo && (
        <a href={liveDemo} target="_blank" rel="noopener noreferrer">
          Live Demo
        </a>
      )}
    </div>
  );
};

export default SolutionCard;
