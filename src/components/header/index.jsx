import React, { useState, useRef, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GitHubButton from '../githubButton';
import MilvusCookieConsent from '../milvusCookieConsent';
import { getGithubStatis } from '../../http';
import classes from './index.module.less';
import pageClasses from '../../styles/responsive.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import DesktopHeader from './descktopHeader';
import MobileHeader from './mobileHeader';

const Header = ({
  darkMode = false,
  t = v => v,
  className = '',
  version = '',
}) => {
  const [isLightHeader, setIsLightHeader] = useState(!darkMode);

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

  const headerRef = useRef(null);

  useEffect(() => {
    (async function () {
      try {
        const { forks_count, stargazers_count } = await getGithubStatis();
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

  useEffect(() => {
    if (!darkMode) {
      return;
    }
    const onScroll = e => {
      const scrollTop = e.target.documentElement.scrollTop;
      setIsLightHeader(scrollTop > 90);
      if (scrollTop < 78) {
        headerRef.current.classList.remove(classes.hideHeader);
        headerRef.current.classList.remove(classes.posFixed);
        headerRef.current.classList.remove(classes.showHeader);
      }
      if (scrollTop > 78 && scrollTop < 90) {
        headerRef.current.classList.add(classes.hideHeader);
      }
      if (scrollTop > 90) {
        headerRef.current.classList.add(classes.posFixed);
        headerRef.current.classList.add(classes.showHeader);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLightHeader, darkMode]);

  const LogoSection = props => {
    const { lightMode = true } = props;

    const foundationLogo = lightMode
      ? '/images/lf_logo_light.svg'
      : '/images/lf_logo_dark.svg';

    return (
      <div className={classes.logoSection}>
        <Link href="/">
          <img src="/images/milvus_logo.svg" alt="milvus-logo" />
        </Link>
        <Divider
          variant="middle"
          sx={{
            margin: '0 13px',
            opacity: '0.3',
            border: '1px solid #d1d1d1',
            transform: 'scaleX(0.5)',
            '@media(max-width: 1024px)': {
              margin: '0 10px',
            },
            '@media(max-width: 744px)': {
              margin: '0 6px',
            },
          }}
        />

        <a
          href="https://lfaidata.foundation/projects/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', lineHeight: 0 }}
        >
          <img src={foundationLogo} alt="LFAI" />
        </a>
      </div>
    );
  };

  const ActionBar = props => {
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

  return (
    <>
      <header
        className={clsx(
          classes.header,
          className,
          `${isLightHeader ? classes.light : ''} ${
            !darkMode ? classes.posSticky : ''
          }`
        )}
        ref={headerRef}
      >
        <DesktopHeader
          actionBar={<ActionBar />}
          logoSection={<LogoSection lightMode={isLightHeader} />}
        />
        <MobileHeader actionBar={<ActionBar />} logoSection={<LogoSection />} />
      </header>
      <MilvusCookieConsent />
    </>
  );
};

export default Header;
