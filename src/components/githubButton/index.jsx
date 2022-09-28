import React from 'react';
import * as styles from './index.module.less';
import { useMemo } from 'react';
import { Star, Fork } from '../icons';
import clsx from 'clsx';

const formatNum = num => {
  return num >= 1000 ? `${Math.round(num / 100) / 10}k` : num;
};

const GitHubButton = ({
  type = 'star', // star or fork
  href,
  className = '',
  children,
  count,
}) => {
  const isStar = type === 'star';
  const Icon = isStar ? Star : Fork;

  const amount = useMemo(() => {
    return formatNum(count);
  }, [count]);

  return (
    <div className={`${styles.gitBtnWrapper} ${className}`}>
      <a
        href={href}
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

        <span className={styles.stat}>{amount}</span>
      </a>
    </div>
  );
};

export default GitHubButton;
