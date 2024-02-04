import React from 'react';
import * as styles from './index.module.less';
import Link from 'next/link';
import clsx from 'clsx';

const SolutionCard = ({
  img,
  title,
  content,
  href,
  className = '',
  liveDemo = '',
}) => {
  return (
    <Link
      href={href}
      tabIndex={0}
      className={clsx(styles.solutionCard, className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
        <div className={styles.titleBar}>
          <h3 className={styles.title}>{title}</h3>
          {img ? <img src={img} alt="icon" className={styles.img} /> : null}
        </div>

        <p className={styles.content}>{content}</p>
      </div>

      {liveDemo && <Link href={liveDemo}>Live Demo</Link>}
    </Link>
  );
};

export default SolutionCard;
