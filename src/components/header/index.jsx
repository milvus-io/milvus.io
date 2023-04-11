import React, { useState, useRef, useEffect } from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import milvusLogo from '../../images/milvus_logo.svg';
import GitHubButton from '../githubButton';
import MilvusCookieConsent from '../milvusCookieConsent';
import { getGithubStatis } from '../../http';
import * as styles from './index.module.less';

const Header = ({
  darkMode = false,
  t = v => v,
  className = '',
  version = '',
}) => {
  const { language, languages, originalPath } = useI18next();
  const [isLightHeader, setIsLightHeader] = useState(!darkMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTutOpen, setIsTutOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isDesktopTutOpen, setIsDesktopTutOpen] = useState(false);
  const [isDesktopToolOpen, setIsDesktopToolOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
  const isLangOpen = Boolean(anchorEl);
  const toolRef = useRef(null);
  const tutRef = useRef(null);
  const headerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);

  // resizable
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;

      setIsDesktop(width > 1024);
    });
    observer.observe(document.documentElement);
    return () => {
      observer.unobserve(document.documentElement);
    };
  });

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
            show: false,
          },
          fork: {
            count: 0,
            show: false,
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
        headerRef.current.classList.remove(styles.hideHeader);
        headerRef.current.classList.remove(styles.posFixed);
        headerRef.current.classList.remove(styles.showHeader);
      }
      if (scrollTop > 78 && scrollTop < 90) {
        headerRef.current.classList.add(styles.hideHeader);
      }
      if (scrollTop > 90) {
        headerRef.current.classList.add(styles.posFixed);
        headerRef.current.classList.add(styles.showHeader);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLightHeader, darkMode]);

  // const handleLangClick = event => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleLangClose = () => {
    setAnchorEl(null);
  };

  const openTutorial = open => {
    let isOpen = open;
    if (isOpen === undefined) {
      isOpen = !isTutOpen;
    }
    setIsTutOpen(isOpen);
  };

  const openTool = open => {
    let isOpen = open;
    if (isOpen === undefined) {
      isOpen = !isToolOpen;
    }
    setIsToolOpen(isOpen);
  };

  const handleMenuLinkClick = e => {
    const link = e.target?.children[0];
    if (link && link.tagName.toLowerCase() === 'a') {
      e.preventDefault();
      e.stopPropagation();
      link.click();
      setIsDesktopTutOpen(false);
    }
  };

  const logoSection = (
    <div className={styles.logoSection}>
      <Link to="/">
        <img src={milvusLogo} alt="milvus-logo" />
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
        <span className={styles.lfaiLogo} />
      </a>
    </div>
  );

  const actionBar = (
    <div className={styles.actionBar}>
      <div className={styles.gitBtnsWrapper}>
        {stat.star.show && (
          <GitHubButton
            count={stat.star.count}
            type="star"
            href="https://github.com/milvus-io/milvus"
          >Stars</GitHubButton>
        )}
        <GitHubButton
          type="slack"
          href="https://join.slack.com/t/milvusio/shared_invite/zt-1slimkif6-8uWK0XPL8adve6vSD4jSwg"
        >Join Slack</GitHubButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={isLangOpen}
        onClose={handleLangClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {languages.map(lng => {
          return (
            <MenuItem key={lng} value={lng} onClick={handleLangClose}>
              <Link
                className={styles.menuLink}
                to={originalPath}
                language={lng}
              >
                {lng === 'en' ? 'English' : '中文'}
              </Link>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );

  const header = (
    <header
      className={`${styles.header} ${
        isLightHeader ? styles.light : ''
      } ${className} ${!darkMode ? styles.posSticky : ''}`}
      ref={headerRef}
    >
      <div className={`${styles.headerContainer} headerContainer`}>
        {logoSection}
        <div className={styles.desktopHeaderBar}>
          <div className={styles.leftSection}>
            <ul className={`${styles.menu}`}>
              <li>
                <Link to="/docs" className={styles.menuItem}>
                  {t('v3trans.main.nav.docs')}
                </Link>
              </li>
              <li>
                <button
                  ref={tutRef}
                  className={styles.menuItem}
                  onClick={() => setIsDesktopTutOpen(true)}
                >
                  {t('v3trans.main.nav.tutorials')}
                </button>
              </li>
              <li>
                <button
                  ref={toolRef}
                  className={styles.menuItem}
                  onClick={() => setIsDesktopToolOpen(true)}
                >
                  {t('v3trans.main.nav.tools')}
                </button>
              </li>
              <li>
                <Link to="/blog" className={styles.menuItem}>
                  {t('v3trans.main.nav.blog')}
                </Link>
              </li>
              <li>
                <Link to="/community" className={styles.menuItem}>
                  {t('v3trans.main.nav.community')}
                </Link>
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
                <Link
                  to="https://codelabs.milvus.io/"
                  className={styles.menuLink}
                >
                  Codelabs
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <Link to="/bootcamp" className={styles.menuLink}>
                  {t('v3trans.main.nav.bootcamp')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <Link to="/milvus-demos" className={styles.menuLink}>
                  Demos
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://www.youtube.com/c/MilvusVectorDatabase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.menuLink}
                >
                  {t('v3trans.main.nav.video')}
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
                  className={styles.menuLink}
                >
                  Attu
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://github.com/zilliztech/milvus_cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.menuLink}
                >
                  Milvus CLI
                </a>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <Link to="/tools/sizing" className={styles.menuLink}>
                  Sizing Tool
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuLinkClick}>
                <a
                  href="https://github.com/zilliztech/milvus-backup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.menuLink}
                >
                  Milvus Backup
                </a>
              </MenuItem>
            </Menu>
          </div>

          <div className={styles.rightSection}>
            {isDesktop && actionBar}
            <Link to={`https://cloud.zilliz.com`} target="_blank">
              <button className={styles.startBtn}>
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
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`${styles.hamburg} ${isMenuOpen ? styles.active : ''}`}
        >
          <span className={styles.top}></span>
          <span className={styles.middle}></span>
          <span className={styles.bottom}></span>
        </button>
      </div>
      {!isDesktop && (
        <div className={`${styles.overlay}  ${isMenuOpen ? styles.open : ''}`}>
          <nav className={`${styles.nav} col-4 col-8 col-12`}>
            <List
              sx={{ width: '100%' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <Link to="/docs" className={styles.menuLink}>
                <ListItemButton>
                  <ListItemText primary={t('v3trans.main.nav.docs')} />
                  <ExpandMore className={styles.turnLeft} />
                </ListItemButton>
              </Link>

              <Divider variant="middle" />

              <ListItemButton
                onClick={() => {
                  openTutorial(!isTutOpen);
                }}
              >
                <ListItemText primary={t('v3trans.main.nav.tutorials')} />
                {isTutOpen ? (
                  <ExpandMore />
                ) : (
                  <ExpandMore className={styles.turnLeft} />
                )}
              </ListItemButton>

              <Collapse in={isTutOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemText
                    primary={
                      <>
                        <Link to="/bootcamp" className={styles.mobileMenuLink}>
                          {t('v3trans.main.nav.bootcamp')}
                        </Link>
                        <Link
                          to="/milvus-demos"
                          className={styles.mobileMenuLink}
                        >
                          {t('v3trans.main.nav.demo')}
                        </Link>
                        <a
                          href="https://www.youtube.com/c/MilvusVectorDatabase"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.mobileMenuLink}
                        >
                          {t('v3trans.main.nav.video')}
                        </a>
                      </>
                    }
                  />
                </List>
              </Collapse>

              <Divider variant="middle" />

              <ListItemButton
                onClick={() => {
                  openTool(!isToolOpen);
                }}
              >
                <ListItemText primary={t('v3trans.main.nav.tools')} />
                {isToolOpen ? (
                  <ExpandMore />
                ) : (
                  <ExpandMore className={styles.turnLeft} />
                )}
              </ListItemButton>

              <Collapse in={isToolOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemText
                    primary={
                      <>
                        <a
                          href="https://github.com/zilliztech/attu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.mobileMenuLink}
                        >
                          Attu
                        </a>
                        <a
                          href="https://github.com/zilliztech/milvus_cli"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.mobileMenuLink}
                        >
                          Milvus_CLI
                        </a>
                        <Link
                          to="/tools/sizing"
                          className={styles.mobileMenuLink}
                        >
                          Sizing Tool
                        </Link>
                      </>
                    }
                  />
                </List>
              </Collapse>

              <Divider variant="middle" />

              <Link to="/blog" className={styles.menuLink}>
                <ListItemButton>
                  <ListItemText primary={t('v3trans.main.nav.blog')} />
                  <ExpandMore className={styles.turnLeft} />
                </ListItemButton>
              </Link>

              <Divider variant="middle" />

              <Link to="/community" className={styles.menuLink}>
                <ListItemButton>
                  <ListItemText primary={t('v3trans.main.nav.community')} />
                  <ExpandMore className={styles.turnLeft} />
                </ListItemButton>
              </Link>

              <Divider variant="middle" />
            </List>

            {actionBar}

            <Divider
              variant="fullwidth"
              sx={{ position: 'absolute', bottom: '78px', width: '100%' }}
            />
            <Link to={`https://cloud.zilliz.com`}>
              <button className={styles.startBtn}>
                Try Managed Milvus <span>FREE</span>
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );

  return (
    <>
      {header}
      {language !== 'cn' && <MilvusCookieConsent />}
    </>
  );
};

export default Header;
