import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/docLayout';
import Seo from '../components/seo';
import { graphql } from 'gatsby';
import ReactTooltip from 'react-tooltip';
import 'highlight.js/styles/stackoverflow-light.css';
import './docTemplate.less';
import { useMobileScreen } from '../hooks';
import useAlgolia from '../hooks/use-algolia';
import QueryModal from '../components/query-modal/query-modal';
import { sortVersions } from '../utils/docTemplate.util';
import { NOT_SUPPORTED_VERSION } from '../config';
import HomeTemplate from '../components/homeTemplate/homeTemplate';
import RelatedQuestion from '../components/relatedQuestion';
import { useEmPanel, useFilter, useCodeCopy } from '../hooks/doc-dom-operation';
import { useGenAnchor } from '../hooks/doc-anchor';

export default function Template({
  data,
  pageContext, // this prop will be injected by the GraphQL query below.
}) {
  let {
    locale,
    version,
    versions,
    headings = [],
    allMenus,
    isBlog,
    isBenchmark = false,
    editPath,
    newHtml,
    homeData,
    allApiMenus,
    newestVersion,
    relatedKey,
  } = pageContext;
  versions = versions.sort(sortVersions);

  const { isMobile } = useMobileScreen();

  const [showBack, setShowBack] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const docRef = useRef(null);

  useEmPanel(setShowModal);
  useGenAnchor(version, editPath);
  useFilter();
  useCodeCopy(locale);

  useEffect(() => {
    const isLowVersion =
      sortVersions(version, NOT_SUPPORTED_VERSION) > -1 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('data_migration');
    setShowWarning(isLowVersion);
  }, [version]);

  useEffect(() => {
    if (!isMobile) return;
    const cb = e => {
      if (e.target.dataset.tip) {
        ReactTooltip.show(e.target);
      }
    };
    window.addEventListener('click', cb);
    return () => {
      window.removeEventListener('click', cb);
    };
  }, [isMobile]);

  useAlgolia(locale, version);

  if (!data.allFile.edges[0]) {
    return null;
  }

  const layout = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childI18N.layout
    : {};

  const menuList = allMenus.find(
    v =>
      v.absolutePath.includes(version) &&
      isBlog === v.isBlog &&
      locale === v.lang
  );

  const { markdownRemark } = data; // data.markdownRemark holds our post data

  let { frontmatter } = markdownRemark || {};

  const nav = {
    current: 'doc',
  };
  const iframeUrl = isBenchmark
    ? `/benchmarks/${frontmatter.id.split('_')[1]}/index.html`
    : '';
  const idRegex = /id=".*?"/g;
  if (locale === 'cn') {
    if (newHtml) {
      newHtml = newHtml.replace(idRegex, match =>
        // eslint-disable-next-line
        match.replace(/[？|、|，]/g, '')
      );
    }
  }

  const ifrmLoad = () => {
    const ifrmContainer = document.querySelector('.iframe-container');
    const ifrm = document.querySelector('#benchmarkIframe');
    // const size = ifrm.contentWindow.document.body.getBoundingClientRect();
    ifrm.style.height = '100%';
    ifrmContainer.style.height = '100%';
    setShowBack(!/index\.html/.test(ifrm.contentWindow.location.href));
  };
  const handleRefresh = () => {
    const ifrm = document.querySelector('#benchmarkIframe');
    if (ifrm) {
      ifrm.contentWindow.location.href = ifrm.src;
    }
  };

  const title = isBenchmark
    ? `Milvus benchmark`
    : newHtml === null
    ? `Milvus home`
    : `${headings[0] && headings[0].value}`;

  const onOverlayClick = () => setShowModal(false);

  return (
    <Layout
      language={layout}
      locale={locale}
      nav={nav}
      current="doc"
      pageContext={pageContext}
      menuList={menuList}
      version={version}
      headings={headings.filter((h, i) => i > 0)}
      versions={versions}
      newestVersion={newestVersion}
      id={frontmatter ? frontmatter.id : 'home'}
      isBenchMark={isBenchmark}
      showDoc={false}
      isBlog={isBlog}
      isHome={newHtml === null}
      editPath={editPath}
      allApiMenus={allApiMenus}
    >
      <Seo title={title} lang={locale} version={version} />
      {isBenchmark ? (
        <div className="iframe-container">
          {showBack && (
            <i
              tabIndex={0}
              onKeyDown={handleRefresh}
              role="button"
              aria-label="Back"
              className="fas iframe-icon fa-arrow-left"
              onClick={handleRefresh}
            ></i>
          )}
          <iframe
            id="benchmarkIframe"
            title="test"
            width="100%"
            src={iframeUrl}
            onLoad={ifrmLoad}
          ></iframe>
        </div>
      ) : (
        <>
          {homeData ? (
            <HomeTemplate data={homeData} version={version} />
          ) : (
            <div className="doc-post-container">
              <>
                {showWarning && (
                  <div className="alert warning">
                    {locale === 'en'
                      ? 'This version is no longer supported. For more information about migrating your data, see'
                      : '该版本不再维护。如需进行数据迁移，请先参考'}
                    <a
                      href={
                        locale === 'en'
                          ? `/docs/data_migration.md`
                          : `/cn/docs/data_migration.md`
                      }
                      alt="sign up milvus"
                      rel="noreferrer noopener"
                      style={{
                        margin: '0 6px',
                      }}
                    >
                      {locale === 'en'
                        ? 'Compatibility Information.'
                        : '兼容性信息。'}
                    </a>
                  </div>
                )}
                <div className="doc-post">
                  <div
                    className="doc-post-content"
                    ref={docRef}
                    dangerouslySetInnerHTML={{ __html: newHtml }}
                  />
                  <RelatedQuestion relatedKey={relatedKey} layout={layout} />
                  <ReactTooltip
                    type="info"
                    // place="right"
                    globalEventOff="click"
                    className="md-tooltip"
                  />
                </div>
              </>
            </div>
          )}
        </>
      )}

      {showModal ? (
        <div>
          <div
            className="overlay"
            tabIndex="0"
            role="button"
            aria-label="close dialog"
            onKeyDown={onOverlayClick}
            onClick={onOverlayClick}
          ></div>
          <QueryModal locale={locale} setShowModal={setShowModal} />
        </div>
      ) : null}
    </Layout>
  );
}

export const pageQuery = graphql`
  query ($locale: String, $old: String, $fileAbsolutePath: String) {
    markdownRemark(
      fileAbsolutePath: { eq: $fileAbsolutePath }
      frontmatter: { id: { eq: $old } }
    ) {
      frontmatter {
        id
        title
      }
    }
    allFile(
      filter: {
        name: { eq: $locale }
        relativeDirectory: { regex: "/(?:layout)/" }
      }
    ) {
      edges {
        node {
          relativeDirectory

          childI18N {
            layout {
              header {
                quick
                benchmarks
                why
                gui
                tutorials
                solution
                about
                doc
                blog
                try
                loading
                noresult
                tutorial
                search
                bootcamp
              }
              footer {
                faq {
                  contact {
                    slack {
                      label
                      link
                    }
                    github {
                      label
                      link
                    }
                    follow {
                      label
                    }
                    dialog {
                      desc
                      placeholder1
                      placeholder2
                      submit
                      title
                      invalid
                    }
                    title
                  }
                  question {
                    title
                  }
                }
                editBtn {
                  label
                }
                questionBtn {
                  label
                  link
                }
                issueBtn {
                  label
                  link
                }
                docIssueBtn {
                  label
                  link
                }
                product {
                  title
                  txt1
                  txt2
                }
                doc {
                  title
                  txt1
                  txt2
                  txt3
                }
                tool {
                  title
                  txt1
                }
                resource {
                  title
                  txt1
                  txt2
                  txt3
                  txt4
                }
                contact {
                  title
                  wechat
                }
                content
              }
              selectMenu {
                comment
                github
                sendBtn
                cancelBtn
                placeholder
              }
              menu {
                home
              }
            }
          }
        }
      }
    }
  }
`;
