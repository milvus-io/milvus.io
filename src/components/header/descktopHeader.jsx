import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import classes from './desktopHeader.module.less';
import pageClasses from '../../styles/responsive.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { LogoSection, ActionBar } from './Logos';

export default function DesktopHeader(props) {
  const { darkMode = false, className } = props;
  const theme = darkMode ? 'dark' : 'light';

  const toolRef = useRef(null);
  const tutRef = useRef(null);
  const headerContainerRef = useRef(null);

  const [isDarkLogo, setIsDarkLogo] = useState(theme === 'dark');

  useEffect(() => {
    const target = headerContainerRef.current;
    if (theme === 'light' || typeof window === 'undefined' || !target) {
      return;
    }
    const onScroll = e => {
      const scrollTop = window.document.documentElement.scrollTop;
      if (scrollTop > 90) {
        target.classList.add(classes.lightHeaderContainer);
        target.classList.remove(classes.darkHeaderContainer);
        setIsDarkLogo(false);
      }
      if (scrollTop < 90) {
        target.classList.add(classes.darkHeaderContainer);
        target.classList.remove(classes.lightHeaderContainer);
        setIsDarkLogo(true);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [theme, headerContainerRef.current]);

  return (
    <div
      className={clsx(classes.commonHeaderContainer, {
        [classes.lightHeaderContainer]: theme === 'light',
        [classes.darkHeaderContainer]: theme === 'dark',
      })}
      ref={headerContainerRef}
    >
      <div
        className={clsx(
          pageClasses.container,
          classes.desktopHeader,
          className
        )}
      >
        <LogoSection lightMode={!isDarkLogo} />
        <div className={classes.headerNavBar}>
          <div className={classes.leftSection}>
            <ul className={classes.menuList}>
              <li>
                <Link href="/docs" className={classes.menuItem}>
                  Docs
                </Link>
              </li>
              <li>
                <div className={classes.subMenuWrapper}>
                  <button ref={tutRef} className={classes.menuItem}>
                    Tutorials
                  </button>
                  <ul className={classes.subMenuList}>
                    <li>
                      <Link
                        href="https://codelabs.milvus.io/"
                        className={classes.subMenuLink}
                        target="_blank"
                      >
                        Codelabs
                      </Link>
                    </li>
                    <li>
                      <Link href="/bootcamp" className={classes.subMenuLink}>
                        Bootcamp
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/milvus-demos"
                        className={classes.subMenuLink}
                      >
                        Demos
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="https://www.youtube.com/c/MilvusVectorDatabase"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.subMenuLink}
                      >
                        Video
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className={classes.subMenuWrapper}>
                  <button ref={toolRef} className={classes.menuItem}>
                    Tools
                  </button>

                  <ul className={classes.subMenuList}>
                    <li>
                      <Link
                        href="https://github.com/zilliztech/attu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.subMenuLink}
                      >
                        Attu
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="https://github.com/zilliztech/milvus_cli"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.subMenuLink}
                      >
                        Milvus CLI
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/tools/sizing"
                        className={classes.subMenuLink}
                      >
                        Sizing Tool
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://github.com/zilliztech/milvus-backup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.subMenuLink}
                      >
                        Milvus Backup
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link href="/blog" className={classes.menuItem}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/community" className={classes.menuItem}>
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div className={classes.rightSection}>
            <ActionBar />
            <Link
              href={`https://cloud.zilliz.com/signup`}
              target="_blank"
              className={classes.startBtn}
            >
              Try Managed Milvus <span>FREE</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12 3.5L18.364 9.86396L12 16.2279"
                  stroke="white"
                  strokeWidth="2"
                />
                <path d="M18 10H1" stroke="white" strokeWidth="2" />
              </svg>
            </Link>
          </div>
        </div>
        {/* <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={clsx(classes.hamburg, {
          [classes.active]: isMenuOpen,
        })}
      >
        <span className={classes.top}></span>
        <span className={classes.middle}></span>
        <span className={classes.bottom}></span>
      </button> */}
      </div>
    </div>
  );
}
