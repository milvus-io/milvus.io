import React, { useState, useRef, useEffect } from 'react';
import milvusLogo from '../../../images/v2/milvus-logo.svg';
import milvusLogoMobile from '../../../images/v2/milvus-logo-mobile.svg';
import lfai from '../../../images/v2/lfai.svg';
import close from '../../../images/v2/close.svg';
import menu from '../../../images/v2/menu.svg';
import { useMobileScreen } from '../../../hooks';
import MobilePopup from '../components/MobilePopupV2';
import QuestionRobot from '../../questionRobot';
import { useClickOutside } from '../../../hooks';
import * as styles from './index.module.less';
import { globalHistory } from '@reach/router';
import Selector from '../../selector/v2';
import { LANGUAGES, NAVLIST_EN, NAVLIST_CN } from './constants';
import LocalizedLink from '../../localizedLink/localizedLink';

const V2Header = props => {
  const { className = '', locale } = props;
  const navList = locale === 'en' ? NAVLIST_EN : NAVLIST_CN;
  const { isMobile } = useMobileScreen();

  const [maskConfig, setMaskConfig] = useState({
    isOpen: false,
    type: 'close',
  });
  const [path, setPath] = useState('/');
  const container = useRef(null);
  const headContainer = useRef(null);

  const handleToggleMask = ({ isOpen }) => {
    const type = isOpen ? 'menu' : 'close';
    setMaskConfig({
      isOpen,
      type,
    });
  };

  const hideMask = () => {
    setMaskConfig({
      isOpen: false,
      type: '',
    });
  };

  useClickOutside(container, () => {
    hideMask();
  });

  const generateNavigation = (navlist, path, styles) => {
    return (
      <>
        {navlist.map(i => {
          const { label, link, activeKey, subMenu } = i;
          return subMenu && subMenu.length ? (
            <div className={`${styles.navMenuItem}`} key={label}>
              {
                <Selector
                  options={subMenu}
                  locale={locale}
                  path={path}
                  navItemLabel={label}
                  trigger="hover"
                />
              }
            </div>
          ) : (
            <LocalizedLink
              className={`${styles.navItem} ${
                path.includes(activeKey) ? styles.active : ''
              }`}
              to={link}
              key={label}
              locale={locale}
            >
              {label}
            </LocalizedLink>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    const { pathname } = globalHistory.location;
    setPath(pathname);
  }, []);

  return (
    <header className={`${styles.header} ${className}`} ref={headContainer}>
      <div className={styles.firstHeader}>
        <div className={styles.headerContainer} ref={container}>
          <div className={styles.contentWrapper}>
            <div className={styles.logoSection}>
              <LocalizedLink to="/" locale={locale}>
                <img
                  className={styles.milvus}
                  src={isMobile ? milvusLogoMobile : milvusLogo}
                  alt="milvus-logo"
                />
              </LocalizedLink>
              <a
                href="https://lfaidata.foundation/projects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className={styles.lfai} src={lfai} alt="lfai-icon" />
              </a>
            </div>
            {isMobile ? (
              <div className={styles.menuSection}>
                <div className={styles.menuWrapper}>
                  <div
                    className={styles.iconWrapper}
                    data-type={maskConfig.type === 'menu' ? 'close' : 'menu'}
                  >
                    {maskConfig.isOpen ? (
                      <span
                        role="button"
                        tabIndex={-1}
                        onClick={() => handleToggleMask({ isOpen: false })}
                        onKeyDown={() => handleToggleMask({ isOpen: false })}
                      >
                        <img
                          className={styles.btnIcon}
                          src={close}
                          alt="close-icon"
                        />
                      </span>
                    ) : (
                      <span
                        role="button"
                        tabIndex={-1}
                        onClick={() => handleToggleMask({ isOpen: true })}
                        onKeyDown={() => handleToggleMask({ isOpen: true })}
                      >
                        <img
                          className={styles.btnIcon}
                          src={menu}
                          alt="close-icon"
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.navSection}>
                {generateNavigation(navList, path, styles)}
                <a
                  className={styles.navItem}
                  href="https://github.com/milvus-io/milvus/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.iconWrapper}>
                    <i className={`fab fa-github ${styles.navIcon}`}></i>
                  </span>
                </a>
                <div className={styles.navMenuItem}>
                  <Selector
                    options={LANGUAGES}
                    locale={locale}
                    path={path}
                    isLangSelector={true}
                    navItemLabel={
                      <>
                        <span className={styles.iconWrapper}>
                          <i className={`fas fa-globe ${styles.navIcon}`}></i>
                        </span>
                        <span className={styles.uppercase}>{locale}</span>
                      </>
                    }
                  />
                </div>
              </div>
            )}
          </div>
          {isMobile && (
            <MobilePopup
              className={styles.v2Popup}
              open={maskConfig.isOpen}
              hideMask={hideMask}
            >
              <div className={styles.mobileNavSection}>
                {generateNavigation(navList, path, styles)}
                <a
                  className={styles.navItem}
                  href="https://github.com/milvus-io/milvus/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className={`fab fa-github ${styles.navIcon}`}></i>
                </a>
                <div className={styles.navMenuItem}>
                  <Selector
                    options={LANGUAGES}
                    locale={locale}
                    path={path}
                    isLangSelector={true}
                    navItemLabel={
                      <>
                        <span className={styles.iconWrapper}>
                          <i className={`fas fa-globe ${styles.navIcon}`}></i>
                        </span>
                        <span className={styles.uppercase}>{locale}</span>
                      </>
                    }
                  />
                </div>
              </div>
            </MobilePopup>
          )}
        </div>
      </div>
      <QuestionRobot />
    </header>
  );
};

export default V2Header;
