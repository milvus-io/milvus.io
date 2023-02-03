import React from 'react';
import * as styles from './index.module.less';
import { useMemo } from 'react';
import { GithubIcon, SlackIcon } from './icons';
import clsx from 'clsx';

const formatNum = num => {
  return num >= 1000 ? `${Math.round(num / 100) / 10}k` : num;
};

const GitHubButton = ({
  type = 'github', // star or slack
  href,
  className = '',
  children,
  count,
}) => {
  const Icon = useMemo(() => {
    switch (type) {
      case 'github':
        return GithubIcon;

      case 'slack':
        return SlackIcon;
      default:
        return GithubIcon;
    }
  }, [type]);

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
        <span className={clsx(styles.iconWrapper)}>
          <Icon />
        </span>
        {children && <span className={styles.iconText}>{children}</span>}

        {amount !== undefined && <span className={styles.stat}>{amount}</span>}
      </a>
    </div>
  );
};

export default GitHubButton;
