import React, { useState, useRef, useMemo, useEffect } from 'react';
import milvusLogo from '../../../images/v2/milvus-logo.svg';
import milvusLogoMobile from '../../../images/v2/milvus-logo-mobile.svg';
import lfai from '../../../images/logo/lfai.svg';
import close from '../../../images/v2/close.svg';
import search from '../../../images/v2/search.svg';
import menu from '../../../images/v2/menu.svg';
import { useMobileScreen } from '../../../hooks';
import { sortVersions } from '../../../utils/docTemplate.util';
import MobilePopup from '../components/MobilePopupV2';
import { Link } from 'gatsby';
import Search from '../components/Search/Search';
import Menu from '../components/Menu/Menu';
import { useClickOutside } from '../../../hooks';
import * as styles from './index.module.less';
import { globalHistory } from '@reach/router';

const V2Header = ({
  versions,
  version,
  setVersion = () => { },
  type = 'home',
  onSearchChange,
  className = '',
}) => {
  const { pathname } = globalHistory.location;
  const { isMobile } = useMobileScreen();
  const versionList = useMemo(
    () => versions.slice().sort((a, b) => sortVersions(a, b)),
    [versions]
  );

  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState('');
  const container = useRef(null);
  const headContainer = useRef(null);

  const navList = [
    {
      label: 'What is milvus?',
      link: '/docs/overview.md',
      isExternal: false,
    },
    {
      label: 'Documentation',
      link: `/docs/home`,
      isExternal: false,
    },
    {
      label: 'Blog',
      link: 'https://blog.milvus.io/',
      isExternal: true,
    },
    {
      label: 'Github',
      link: 'https://github.com/milvus-io/milvus/',
      isExternal: true,
    },
  ];

  const handleOpenMask = e => {
    const { type } = e.target.dataset;
    setOpen(!open);
    setOpenType(type);
  };

  const hideMask = () => {
    setOpen(false);
  };

  const handleSelected = val => {
    setVersion(val);

    window.location.href = `/docs/${val}/overview.md`;
  };

  const handleSearch = value => {
    onSearchChange(value);
    hideMask();
  };

  useClickOutside(container, () => {
    hideMask();
  });

  return (
    <section className={`${styles.header} ${className}`} ref={headContainer}>
      <div className={styles.headerContainer} ref={container}>
        {!isMobile ? (
          <div className={styles.contentWrapper}>
            <div className={styles.logoSection}>
              <Link to="/">
                <img
                  className={styles.milvus}
                  src={milvusLogo}
                  alt="milvus-logo"
                />
              </Link>
              <a
                href="https://lfaidata.foundation/projects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className={styles.lfai} src={lfai} alt="lfai-icon" />
              </a>
            </div>
            <div className={styles.navSection}>
              {navList.map(i => {
                const { label, link, isExternal } = i;
                return isExternal ? (
                  <a
                    className={styles.navItem}
                    href={link} key={label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    className={`${styles.navItem} ${pathname === link ? styles.active : ''}`}
                    to={link}
                    key={label}
                  >
                    {label}
                  </Link>
                );
              })}
              {/* <div className={styles.dropDown}>
                <V2Selector
                  selected={version}
                  options={versions}
                  setSelected={handleSelected}
                />
              </div> */}
            </div>
          </div>
        ) : (
          <div className={styles.mobileHeaderWrapper}>
            <div className={styles.logoSection}>
              <Link to="/v2">
                <img
                  className={styles.milvus}
                  src={milvusLogoMobile}
                  alt="milvus-logo"
                />
              </Link>
              <a
                href="https://lfaidata.foundation/projects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className={styles.lfai} src={lfai} alt="lfai-icon" />
              </a>
            </div>
            <div className={styles.menuSection}>
              <div
                className={styles.menuWrapper}
                role="button"
                tabIndex={-1}
                onClick={handleOpenMask}
                onKeyDown={handleOpenMask}
              >
                {type === 'doc' && (
                  <div className={styles.iconWrapper} data-type="search">
                    <img
                      className="btn-icon"
                      src={open && openType === 'search' ? close : search}
                      alt="menu-search-icon"
                    />
                  </div>
                )}
                <div
                  className={styles.iconWrapper}
                  data-type={open && openType === 'menu' ? 'close' : 'menu'}
                >
                  <img
                    className={styles.btnIcon}
                    src={open && openType === 'menu' ? close : menu}
                    alt="close-icon"
                  />
                </div>
              </div>
            </div>
            <MobilePopup
              className={styles.v2Popup}
              open={open}
              hideMask={hideMask}
            >
              {openType === 'menu' ? (
                <Menu
                  version={version}
                  options={versionList}
                  setSelected={handleSelected}
                  navList={navList}
                />
              ) : (
                <Search handleSearch={handleSearch} />
              )}
            </MobilePopup>
          </div>
        )}
      </div>
    </section>
  );
};

export default V2Header;
