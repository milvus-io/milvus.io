import React from 'react';
import * as styles from './index.module.less';
import { useMemo } from 'react';
import { Star, Fork } from './icons';
import clsx from 'clsx';

const GitHubButton = ({
  type = 'star', // star or fork
  href,
  className = '',
  children,
  stat,
}) => {
  const isStar = type === 'star';
  const link = isStar ? href : `${href}/fork`;

  const Icon = isStar ? Star : Fork;

  const formatNum = num => {
    return num >= 1000 ? `${Math.round(num / 100) / 10}k` : num;
  };

  const stats = useMemo(() => {
    const stars = stat.star;
    const forks = stat.forks;

    return {
      star: formatNum(stars),
      fork: formatNum(forks),
    };
  }, [stat]);

  return (
    <div className={`${styles.gitBtnWrapper} ${className}`}>
      <a
        href={link}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span
          className={clsx(styles.iconWrapper, {
            [styles.starIcon]: isStar,
          })}
        >
          <Icon />
        </span>

        <span className={styles.iconText}>{children}</span>

        <span className={styles.stat}>{isStar ? stats.star : stats.fork}</span>
      </a>
    </div>
  );
};

export default GitHubButton;
