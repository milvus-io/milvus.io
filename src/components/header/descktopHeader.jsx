import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import classes from './desktopHeader.module.less';
import pageClasses from '../../styles/responsive.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { LogoSection, ActionBar } from './Logos';

export default function DesktopHeader(props) {
  const { darkMode = false } = props;
  const theme = darkMode ? 'dark' : 'light';

  const toolRef = useRef(null);
  const tutRef = useRef(null);
  const headerContainerRef = useRef(null);

  const [isDesktopTutOpen, setIsDesktopTutOpen] = useState(false);
  const [isDesktopToolOpen, setIsDesktopToolOpen] = useState(false);
  const [isDarkLogo, setIsDarkLogo] = useState(theme === 'dark');

  const handleMenuLinkClick = e => {
    const link = e.target?.children[0];
    if (link && link.tagName.toLowerCase() === 'a') {
      e.preventDefault();
      e.stopPropagation();
      link.click();
      setIsDesktopTutOpen(false);
    }
  };

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
      <div className={clsx(pageClasses.container, classes.desktopHeader)}>
        <LogoSection lightMode={!isDarkLogo} />
        <div className={classes.headerNavBar}>
          <div className={classes.leftSection}>
            <ul className={classes.menuList}>
              <li>
                <a href="/docs" className={classes.menuItem}>
                  Docs
                </a>
              </li>
              <li>
                <button
                  ref={tutRef}
                  className={classes.menuItem}
                  onClick={() => setIsDesktopTutOpen(true)}
                >
                  Tutorials
                </button>
              </li>
              <li>
                <button
                  ref={toolRef}
                  className={classes.menuItem}
                  onClick={() => setIsDesktopToolOpen(true)}
                >
                  Tools
                </button>
              </li>
              <li>
                <a href="/blog" className={classes.menuItem}>
                  Blog
                </a>
              </li>
              <li>
                <a href="/community" className={classes.menuItem}>
                  Community
                </a>
              </li>
            </ul>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={tutRef.current}
              open={isDesktopTutOpen}
              onClose={() => {
                setIsDesktopTutOpen(false);
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://codelabs.milvus.io/"
                  className={classes.menuLink}
                >
                  Codelabs
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a href="/bootcamp" className={classes.menuLink}>
                  Bootcamp
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a href="/milvus-demos" className={classes.menuLink}>
                  Demos
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://www.youtube.com/c/MilvusVectorDatabase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.menuLink}
                >
                  Video
                </a>
              </MenuItem>
            </Menu>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={toolRef.current}
              open={isDesktopToolOpen}
              onClose={() => {
                setIsDesktopToolOpen(false);
              }}
            >
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://github.com/zilliztech/attu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.menuLink}
                >
                  Attu
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://github.com/zilliztech/milvus_cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.menuLink}
                >
                  Milvus CLI
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a href="/tools/sizing" className={classes.menuLink}>
                  Sizing Tool
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://github.com/zilliztech/milvus-backup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.menuLink}
                >
                  Milvus Backup
                </a>
              </MenuItem>
            </Menu>
          </div>

          <div className={classes.rightSection}>
            <ActionBar />
            <Link href={`https://cloud.zilliz.com/signup`} target="_blank">
              <button className={classes.startBtn}>
                Try Managed Milvus <span>FREE</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12 3.5L18.364 9.86396L12 16.2279"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path d="M18 10H1" stroke="white" strokeWidth="2" />
                </svg>
              </button>
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
