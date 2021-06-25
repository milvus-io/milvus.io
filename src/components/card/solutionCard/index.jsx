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
  return (
    <a
      className={`${styles.solutionCard} ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.titleBar}>
        <h3 className={styles.title}>{title}</h3>
        {img ? <img src={img} alt="icon" className={styles.img} /> : null}
      </div>

      <p className={styles.content}>{content}</p>
      {liveDemo ? (
        <a href={liveDemo} target="_blank" rel="noopener noreferrer">
          Live Demo
        </a>
      ) : null}
    </a>
  );
};

export default SolutionCard;
