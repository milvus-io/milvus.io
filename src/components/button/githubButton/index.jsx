import React, { useEffect, useState } from 'react';
import { getGithubStatis } from '../../../http/http';
import * as styles from './index.module.less';

const GitHubButton = ({
  type = 'star', // star fork
  href,
  className = '',
  children,
}) => {
  const iconClass = type === 'star' ? 'fab fa-github' : 'fas fa-code-branch';
  const link = type === 'star' ? href : `${href}/fork`;
  const sublink =
    type === 'star' ? `${href}/stargazers` : `${href}/network/members`;
  const [stat, setStat] = useState({
    star: 0,
    forks: 0,
  });

  useEffect(() => {
    (async function getData() {
      try {
        const { forks_count, stargazers_count } = await getGithubStatis();
        setStat({
          star: stargazers_count,
          forks: forks_count,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className={`${styles.gitBtnWrapper} ${className}`}>
      <a href={link} className={styles.link}>
        <div className={styles.iconWrapper}>
          <i className={iconClass}></i>
        </div>
        <span>{children}</span>
      </a>
      {stat.star !== 0 && (
        <a href={sublink} className={`${styles.link} ${styles.num}`}>
          <span>{type === 'star' ? stat.star : stat.forks}</span>
        </a>
      )}
    </div>
  );
};

export default GitHubButton;
