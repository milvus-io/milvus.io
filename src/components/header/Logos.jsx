import classes from './index.module.less';
import clsx from 'clsx';
import Link from 'next/link';
import GitHubButton from '../githubButton';
import { useState, useEffect } from 'react';
import { getGithubStatics } from '@/http/milvus';

export const LogoSection = props => {
  const foundationLogo = '/images/lf_logo.png';
  return (
    <div className={classes.logoSection}>
      <Link href="/" className="inline-flex items-center">
        <img src="/images/milvus_logo.svg" height={24} alt="milvus-logo" />
      </Link>
      <div className="w-[1px] h-[20px] bg-black3 mx-[8px]" />
      <span className="inline-flex items-center justify-center">
        <img src={foundationLogo} height={20} alt="LFAI" />
      </span>
    </div>
  );
};

export const ActionBar = props => {
  const [stat, setStat] = useState({
    star: {
      count: 0,
      show: true,
    },
    fork: {
      count: 0,
      show: true,
    },
  });

  useEffect(() => {
    (async function () {
      try {
        const { forks_count, stargazers_count } = await getGithubStatics();
        setStat({
          star: {
            count: stargazers_count,
            show: true,
          },
          fork: {
            count: forks_count,
            show: true,
          },
        });
      } catch (error) {
        setStat({
          star: {
            count: 0,
            show: true,
          },
          fork: {
            count: 0,
            show: true,
          },
        });
      }
    })();
  }, []);

  return (
    <div className={clsx(classes.gitBtnWrapper, props.className)}>
      {stat.star.show && (
        <GitHubButton
          count={stat.star.count}
          type="star"
          href="https://github.com/milvus-io/milvus"
        >
          Stars
        </GitHubButton>
      )}
    </div>
  );
};
