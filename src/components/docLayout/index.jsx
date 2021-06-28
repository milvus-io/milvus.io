import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../sidebar/sidebar';
import Footer from '../footer/footer';
import NewHeader from '../header/v2/index';
import * as styles from './index.module.less';

const DocLayout = props => {
  const {
    pageContext,
    language,
    children,
    locale,
    menuList,
    id,
    newestVersion,
    versions,
    version,
    headings,
    wrapperClass = styles.docWrapper,
    isBenchMark = false,
    isBlog,
    isHome,
    editPath,
    allApiMenus,
    isApiReference = false,
  } = props;

  const { isVersionWithHome = null } = pageContext;

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

  // sidebar props
  const menuConfig = menuList && {
    menuList: [
      {
        lang: menuList.lang,
        menuList: menuList.menuList,
      },
    ],
    activePost: id.split('-')[0],
    isBlog: menuList.isBlog,
    formatVersion: version === 'master' ? newestVersion : version,
  };

  const searchConfig = {
    placeholder: language.header.search,
  };

  const versionConfig = {
    homeTitle: language.menu.home,
    version,
    // filter master version
    versions: versions.filter(v => v !== 'master'),
  };

  const generateAnchorMenu = (headings, className) => {
    return headings.map(v => {
      /* eslint-disable-next-line */
      const normalVal = v.value.replace(/[.｜,｜/｜'｜?｜？｜、|，|(|)]/g, '');
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

  return (
    <div className={styles.layoutWrapper}>
      <NewHeader locale={locale} />

      <main className={wrapperClass}>
        {!isBlog && (
          <Sidebar
            locale={locale}
            showVersions={true}
            wrapperClass={styles.menuContainer}
            allApiMenus={allApiMenus}
            menuConfig={menuConfig}
            searchConfig={searchConfig}
            versionConfig={versionConfig}
            isVersionWithHome={isVersionWithHome}
          />
        )}
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
            className={`${styles.anchorWrapper} ${isHome ? styles.home : ''}`}
          >
            <section>
              {!isHome && (
                <>
                  <div className={styles.buttonContainer}>
                    {isBlog || isBenchMark || isApiReference ? null : (
                      <a
                        className={styles.btnAnchor}
                        href={`https://github.com/milvus-io/docs/edit/master/${version}/site/${
                          locale === 'en' ? 'en' : 'zh-CN'
                        }/${editPath}`}
                      >
                        <span className={styles.btnIconWrapper}>
                          <i
                            className={`fas fa-pencil-alt ${styles.btnIcon}`}
                          ></i>
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
          </div>
        )}

        {showToTopButton ? (
          <div
            className={styles.btnToTop}
            role="button"
            onClick={onToTopClick}
            onKeyDown={onToTopClick}
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
            >
              <path
                d="M14.6663 10.9445L7.99967 4.27783L1.33301 10.9445"
                stroke="#4FC4F9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M-6.55672e-08 0.75C-2.93554e-08 0.335786 0.335786 2.93554e-08 0.75 6.5567e-08L15.25 1.3332e-06C15.6642 1.36941e-06 16 0.335788 16 0.750001C16 1.16421 15.6642 1.5 15.25 1.5L0.75 1.5C0.335786 1.5 -1.01779e-07 1.16421 -6.55672e-08 0.75Z"
                fill="#4FC4F9"
              />
            </svg>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default DocLayout;
