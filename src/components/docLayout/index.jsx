import React, { useState, useEffect, useRef, useMemo } from 'react';
import Menu from '../menu';
import Header from '../header/header';
import Footer from '../footer/footer';
import NewHeader from '../header/v2/index';
// import AskMilvus from "../../images/ask_milvus.png";
import { getStyleType } from '../../utils/docTemplate.util';
import * as styles from './index.module.less';

const DocLayout = props => {
  const {
    language,
    children,
    locale,
    menuList,
    id,
    versions,
    version,
    headings,
    current,
    wrapperClass = styles.docWrapper,
    isBenchMark = false,
    showDoc = true,
    isBlog,
    isHome,
    editPath,
    header,
    setSearch,
  } = props;
  const formatHeadings =
    headings &&
    headings.reduce((pre, cur) => {
      const copyCur = JSON.parse(JSON.stringify(cur));
      const preHead = pre[pre.length - 1];
      if (preHead && preHead.depth < cur.depth) {
        pre[pre.length - 1].children.push(cur);
      } else {
        copyCur.children = [];
        pre = [...pre, copyCur];
      }
      return pre;
    }, []);
  const [hash, setHash] = useState(null);
  const docContainer = useRef(null);
  const [showToTopButton, setShowToTopButton] = useState(false);
  const [showMenuMask, setShowMenuMask] = useState(false);

  // const effectVariable =
  //   typeof window !== 'undefined' ? [window.location.hash] : [];
  // useEffect(() => {
  //   if (window) {
  //     const hash = window.location.hash.slice(1);
  //     setHash(window.decodeURI(hash));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, effectVariable);

  // check menu type based on whether version is 2.0
  // here use v1 as test
  const menuType = useMemo(() => getStyleType(version), [version]);

  // star reference
  const star = useRef(null);
  useEffect(() => {
    if (!window) {
      return;
    }
    if (!star.current) {
      return;
    }
    const repoUrl = `https://api.github.com/repos/milvus-io/milvus`;
    let latest = window.localStorage.getItem('milvus.io.stargazers');
    const latestFetchTime = window.localStorage.getItem(
      'milvus.io.stargazers_fetch_time'
    );

    if (
      !latestFetchTime ||
      Date.now() - latestFetchTime > 60000 * 60 ||
      !latest
    ) {
      // get
      fetch(repoUrl)
        .then(response => response.json())
        .then(data => {
          if (data) {
            if (data.stargazers_count >= latest) {
              console.log(data.stargazers_count);
              window.localStorage.setItem(
                'milvus.io.stargazers',
                data.stargazers_count
              );
              window.localStorage.setItem(
                'milvus.io.stargazers_fetch_time',
                Date.now()
              );
              star.current.innerHTML = `${data.stargazers_count}`;
            }
          }
        });
    } else {
      star.current.innerHTML = ` ${latest}`;
    }
  }, []);

  useEffect(() => {
    let currentPos = 0;

    const cb = function () {
      const container = document.querySelector('html');
      const direction = container.scrollTop - currentPos > 0 ? 'down' : 'up';
      currentPos = container.scrollTop;
      const showButton = direction === 'up' && currentPos;

      setShowToTopButton(showButton);
    };
    window.addEventListener('scroll', cb);

    return () => {
      window.removeEventListener('scroll', cb);
    };
  }, []);

  const generateAnchorMenu = (headings, className) => {
    return headings.map(v => {
      /* eslint-disable-next-line */
      const normalVal = v.value.replace(/[.｜,｜\/｜\'｜\?｜？｜、|，]/g, '');
      const anchor = normalVal.split(' ').join('-');
      let childDom = null;
      if (v.children && v.children.length) {
        childDom = generateAnchorMenu(v.children, styles.childItem);
      }
      return (
        <div className={`item ${className}`} key={v.value}>
          <a
            href={`#${anchor}`}
            title={v.value}
            className={`${styles.anchor} ${anchor === hash ? 'active' : ''}`}
            onClick={() => setHash(anchor)}
          >
            {v.value}
          </a>
          {childDom}
        </div>
      );
    });
  };

  const onToTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSearchChange = value => {
    if (menuType === 'new') {
      setSearch(value);
    }
  };

  return (
    <div className={styles.layoutWrapper}>
      {menuType === 'new' ? (
        <NewHeader
          header={header.header}
          locale={locale}
          versions={versions}
          version={version}
          type="doc"
          onSearchChange={handleSearchChange}
        />
      ) : (
        <Header
          language={language}
          current={current}
          locale={locale}
          showDoc={showDoc}
        />
      )}

      <main className={wrapperClass}>
        <Menu
          menuList={menuList}
          versions={versions}
          activeDoc={id.split('-')[0]}
          version={version}
          locale={locale}
          isBenchMark={isBenchMark}
          type={menuType}
          language={language}
          onSearchChange={handleSearchChange}
          setShowMask={setShowMenuMask}
          wrapperClass={styles.menuContainer}
        ></Menu>
        <div
          className={`${styles.innerContainer} ${
            isHome ? styles.innerContainerHome : ''
          } ${isBenchMark ? styles.fullWidth : ''}`}
          ref={docContainer}
        >
          {children}
          {!isBenchMark && (
            <Footer locale={locale} style={{ background: '#fff' }}></Footer>
          )}
        </div>
        {formatHeadings && !isBenchMark && (
          <div
            className={`${styles.anchorWrapper} ${
              menuType === 'new' ? styles.anchorWrapperNew : ''
            } ${isHome ? styles.home : ''}`}
          >
            {menuType === 'old' ? (
              <section>
                <div className={styles.buttonContainer}>
                  {isBlog || isBenchMark ? null : (
                    <a
                      className={styles.btnAnchor}
                      href={`https://github.com/milvus-io/docs/edit/master/${version}/site/${
                        locale === 'en' ? 'en' : 'zh-CN'
                      }/${editPath}`}
                    >
                      <span className={styles.btnIconWrapper}>
                        <i className={`far fa-edit ${styles.btnIcon}`}></i>
                      </span>

                      {language.footer.editBtn.label}
                    </a>
                  )}
                  <a
                    className={styles.btnAnchor}
                    href={language.footer.docIssueBtn.link}
                  >
                    <span className={styles.btnIconWrapper}>
                      <i className={`fab fa-github ${styles.btnIcon}`}></i>
                    </span>
                    {language.footer.docIssueBtn.label}
                  </a>
                  <a
                    className={styles.btnAnchor}
                    id="btn-bug"
                    href={language.footer.issueBtn.link}
                  >
                    <span className={styles.btnIconWrapper}>
                      <i className={`fas fa-bug ${styles.btnIcon}`}></i>
                    </span>

                    {language.footer.issueBtn.label}
                  </a>

                  <a
                    className={styles.btnAnchor}
                    id="btn-question"
                    href={language.footer.questionBtn.link}
                  >
                    <span className={styles.btnIconWrapper}>
                      <i className={`fab fa-slack-hash ${styles.btnIcon}`}></i>
                    </span>

                    {language.footer.questionBtn.label}
                  </a>
                </div>

                {/* filter faq page */}
                {!id.includes('faq')
                  ? generateAnchorMenu(formatHeadings, styles.parentItem)
                  : null}

                {/* <a href="https://www.linkedin.com/events/6699523192530309120/">
                <div className={styles.event}>
                  <h4>Upcoming Event</h4>
                  <img width="180" src={AskMilvus} alt="Ask Milvus"></img>
                </div>
                click <strong>here</strong> to register
              </a> */}
              </section>
            ) : (
              <section>
                {!isHome && (
                  <>
                    <div className={styles.buttonContainerNew}>
                      {isBlog || isBenchMark ? null : (
                        <a
                          className={styles.btnAnchor}
                          href={`https://github.com/milvus-io/docs/edit/master/${version}/site/${
                            locale === 'en' ? 'en' : 'zh-CN'
                          }/${editPath}`}
                        >
                          <span className={styles.btnIconWrapper}>
                            <i className={`far fa-edit ${styles.btnIcon}`}></i>
                          </span>

                          {language.footer.editBtn.label}
                        </a>
                      )}
                      <a
                        className={styles.btnAnchor}
                        href={language.footer.docIssueBtn.link}
                      >
                        <span className={styles.btnIconWrapper}>
                          <i className={`fab fa-github ${styles.btnIcon}`}></i>
                        </span>
                        {language.footer.docIssueBtn.label}
                      </a>
                      <a
                        className={styles.btnAnchor}
                        id="btn-bug"
                        href={language.footer.issueBtn.link}
                      >
                        <span className={styles.btnIconWrapper}>
                          <i className={`fas fa-bug ${styles.btnIcon}`}></i>
                        </span>

                        {language.footer.issueBtn.label}
                      </a>

                      <a
                        className={styles.btnAnchor}
                        id="btn-question"
                        href={language.footer.questionBtn.link}
                      >
                        <span className={styles.btnIconWrapper}>
                          <i
                            className={`fab fa-slack-hash ${styles.btnIcon}`}
                          ></i>
                        </span>

                        {language.footer.questionBtn.label}
                      </a>
                    </div>

                    {formatHeadings.length > 0 && (
                      <div className={styles.anchorTitle}>
                        {language.footer.content}
                      </div>
                    )}
                    {/* filter faq page */}
                    {!id.includes('faq')
                      ? generateAnchorMenu(formatHeadings, styles.parentItem)
                      : null}
                  </>
                )}
              </section>
            )}
          </div>
        )}

        {showMenuMask ? (
          <MenuDialog
            menuList={menuList}
            versions={versions}
            activeDoc={id.split('-')[0]}
            version={version}
            locale={locale}
            isBenchMark={isBenchMark}
            type={menuType}
            language={language}
            onSearchChange={handleSearchChange}
            showMenuMask={showMenuMask}
          />
        ) : null}

        {showToTopButton ? (
          <div
            className={styles.btnToTop}
            role="button"
            onClick={onToTopClick}
            onKeyDown={onToTopClick}
            tabIndex={0}
          >
            <svg
              width="16"
              height="16"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="svg-inline--fa fa-arrow-to-top fa-w-12 fa-2x"
            >
              <path
                fill="currentColor"
                d="M24 32h336c13.3 0 24 10.7 24 24v24c0 13.3-10.7 24-24 24H24C10.7 104 0 93.3 0 80V56c0-13.3 10.7-24 24-24zm66.4 280.5l65.6-65.6V456c0 13.3 10.7 24 24 24h24c13.3 0 24-10.7 24-24V246.9l65.6 65.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L209 126.1c-9.4-9.4-24.6-9.4-33.9 0L39.5 261.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0z"
              ></path>
            </svg>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default DocLayout;

const MenuDialog = ({
  menuList,
  versions,
  activeDoc,
  version,
  locale,
  isBenchMark,
  type,
  language,
  onSearchChange,
}) => {
  useEffect(() => {
    const scrollEls = document.querySelectorAll('.can-scroll');
    [].forEach.call(scrollEls, el => {
      let initialY = 0;
      el.addEventListener('touchstart', e => {
        if (e.targetTouches.length === 1) {
          initialY = e.targetTouches[0].clientY;
        }
      });
      el.addEventListener('touchmove', e => {
        if (e.targetTouches.length === 1) {
          const clientY = e.targetTouches[0].clientY - initialY;
          if (
            el.scrollTop + el.clientHeight >= el.scrollHeight &&
            clientY < 0
          ) {
            return e.preventDefault();
          }
          if (el.scrollTop <= 0 && clientY > 0) {
            return e.preventDefault();
          }
        }
      });
    });

    const handleScroll = e => {
      const isInclude = Array.prototype.some.call(scrollEls, el =>
        el.contains(e.target)
      );
      if (isInclude) {
        return true;
      }
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('touchmove', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  return (
    <div className="mobile-menu-wrapper-new show">
      <Menu
        menuList={menuList}
        versions={versions}
        activeDoc={activeDoc}
        version={version}
        locale={locale}
        isBenchMark={isBenchMark}
        type={type}
        language={language}
        onSearchChange={onSearchChange}
      ></Menu>
    </div>
  );
};
