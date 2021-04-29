import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import LocalizeLink from '../localizedLink/localizedLink';
import Logo from '../../images/logo/milvus-horizontal-color.svg';
import MobilLogo from '../../images/logo/logo.svg';
import LfaiLogo from '../../images/logo/lfai.svg';
import './header.scss';
import { globalHistory } from '@reach/router';
import { useMobileScreen } from '../../hooks';
import { SearchForWeb, SearchForMobile } from '../search';
import MobilePopUp from './components/MobilePopUp';
import MobileSearchContent from './components/MobileSearchContent';
import MobileMenuContent from './components/MobileMenuContent';

const Header = ({ language, locale, current = '', showDoc = true }) => {
  const { header } = language;
  const screenWidth = useMobileScreen();
  const [mobileNav, setMobileNav] = useState(null);
  const [lanList, setLanList] = useState(false);
  const [isSHowMobileMask, setIsShowMobileMask] = useState(false);
  const [actionType, setActionType] = useState('');
  const popupRef = useRef(null);
  const mobileContainerRef = useRef(null);

  const l = locale === 'cn' ? 'en' : 'cn';
  const to = globalHistory.location.pathname
    .replace('/en/', '/')
    .replace('/cn/', '/');
  const blogHref =
    locale === 'cn'
      ? 'http://zilliz.blog.csdn.net'
      : 'https://medium.com/unstructured-data-service';
  useEffect(() => {
    window.addEventListener('click', () => {
      setMobileNav(false);
      setLanList(false);
    });
  }, []);

  const onChangeLocale = () => {
    window.localStorage.setItem('milvus.io.setlanguage', true);
  };

  const showMobileMask = ({ actionType }) => {
    setIsShowMobileMask(true);
    setActionType(actionType);
    popupRef.current.classList.add('activited');
  };
  const hideMobileMask = () => {
    setIsShowMobileMask(false);
    popupRef.current.classList.remove('activited');
  };

  const useClickOutside = (ref, handler, events) => {
    if (!events) events = [`mousedown`, `touchstart`];
    const detectClickOutside = event => {
      !ref.current.contains(event.target) && handler(event);
    };
    useEffect(() => {
      for (const event of events)
        document.addEventListener(event, detectClickOutside);
      return () => {
        for (const event of events)
          document.removeEventListener(event, detectClickOutside);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };
  useClickOutside(mobileContainerRef, () => {
    hideMobileMask();
  });

  return (
    <>
      <div className="full-header-wrapper" ref={mobileContainerRef}>
        <header className="header-wrapper">
          <div className="logo-wrapper">
            <LocalizeLink locale={locale} to={'/'}>
              <img
                style={{ height: screenWidth > 1000 ? '3rem' : '26px' }}
                src={screenWidth > 1000 ? Logo : MobilLogo}
                alt="Milvos Logo"
              ></img>
            </LocalizeLink>
            <a
              href="https://lfai.foundation/projects/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={LfaiLogo} alt="Lfai" className="lfai"></img>
            </a>
          </div>

          {screenWidth > 1000 ? (
            <div className="right">
              <LocalizeLink
                locale={locale}
                to="/docs/install_milvus.md"
                className="link"
              >
                {header.quick}
              </LocalizeLink>

              <LocalizeLink
                locale={locale}
                className="link"
                to={'/docs/benchmarks_azure'}
              >
                {header.benchmarks}
              </LocalizeLink>
              <a
                href={`https://tutorials.milvus.io${
                  locale === 'cn' ? `/cn/` : ''
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {header.tutorials}
              </a>

              <LocalizeLink
                locale={locale}
                className={`link ${current === 'scenarios' ? 'current' : ''}`}
                to="/scenarios"
              >
                {header.solution}
              </LocalizeLink>
              {showDoc && (
                <LocalizeLink
                  locale={locale}
                  className={`link ${current === 'doc' ? 'current' : ''}`}
                  to={'/docs/overview.md'}
                >
                  {header.doc}
                </LocalizeLink>
              )}

              <a
                href={blogHref}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {header.blog}
              </a>

              <SearchForWeb
                language={header}
                locale={locale}
                hideMobileMask={hideMobileMask}
              ></SearchForWeb>
              <span
                role="button"
                tabIndex={0}
                className="language"
                onKeyDown={() => {
                  setLanList(!lanList);
                }}
                onClick={e => {
                  e.stopPropagation();
                  setLanList(!lanList);
                }}
              >
                {locale === 'cn' ? '中' : 'En'}
                {lanList && (
                  <div className="language-list">
                    <LocalizeLink
                      locale={l}
                      to={to}
                      className={locale === 'en' ? 'active' : ''}
                    >
                      <span
                        tabIndex={0}
                        onKeyDown={onChangeLocale}
                        onClick={onChangeLocale}
                        role="button"
                      >
                        English
                      </span>
                    </LocalizeLink>
                    <LocalizeLink
                      locale={l}
                      to={to}
                      className={locale === 'cn' ? 'active' : ''}
                    >
                      <span
                        tabIndex={0}
                        onKeyDown={onChangeLocale}
                        onClick={onChangeLocale}
                        role="button"
                      >
                        中文
                      </span>
                    </LocalizeLink>
                  </div>
                )}
              </span>
            </div>
          ) : (
            <div className="right-mobile">
              {!isSHowMobileMask && (
                <SearchForMobile
                  language={header}
                  locale={locale}
                  showMobileMask={showMobileMask}
                  hideMobileMask={hideMobileMask}
                ></SearchForMobile>
              )}
              {!isSHowMobileMask ? (
                <i
                  className="fas fa-bars font-icon"
                  aria-label="menu-button"
                  role="button"
                  tabIndex={0}
                  onClick={() => showMobileMask({ actionType: 'menu' })}
                  onKeyDown={() => showMobileMask({ actionType: 'menu' })}
                ></i>
              ) : (
                <i
                  className="fas fa-times font-icon"
                  aria-label="close-button"
                  role="button"
                  tabIndex={0}
                  onClick={hideMobileMask}
                  onKeyDown={hideMobileMask}
                ></i>
              )}
            </div>
          )}
          {/* 下滑的框框 */}
          <MobilePopUp ref={popupRef}>
            {actionType === 'menu' ? (
              <MobileMenuContent
                locale={locale}
                header={header}
                to={to}
                l={l}
                onChangeLocale={onChangeLocale}
                hideMobileMask={hideMobileMask}
              />
            ) : (
              <MobileSearchContent
                locale={locale}
                language={header}
                hideMobileMask={hideMobileMask}
              />
            )}
          </MobilePopUp>
        </header>
      </div>
      <div className={`mobile-nav ${mobileNav && 'open'}`}>
        <LocalizeLink
          locale={locale}
          to="/docs/install_milvus.md"
          className="link"
        >
          {header.quick}
        </LocalizeLink>
        <a
          href="https://tutorials.milvus.io"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {header.tutorials}
        </a>

        <LocalizeLink locale={locale} className="link" to="/scenarios">
          {header.solution}
        </LocalizeLink>

        <LocalizeLink
          locale={locale}
          className="link"
          to={'/docs/install_milvus.md'}
        >
          {header.doc}
        </LocalizeLink>
        <LocalizeLink
          locale={locale}
          className="link"
          to={'/blogs/2019-08-26-vector-search-million.md'}
        >
          {header.blog}
        </LocalizeLink>
      </div>
    </>
  );
};

Header.propTypes = {
  language: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Header;
