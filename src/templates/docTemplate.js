import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/docLayout';
import SEO from '../components/seo';
import { graphql } from 'gatsby';
import ReactTooltip from 'react-tooltip';
import 'highlight.js/styles/github.css';
// import './docTemplate.scss';
import './docTemplate.less';
import { useMobileScreen } from '../hooks';
import QueryModal from '../components/query-modal/query-modal';
import { getStyleType, sortVersions } from '../utils/docTemplate.util';
import { NOT_SUPPORTED_VERSION } from '../config';
import TextSelectionMenu from '../components/textSelection/TextSelectionMenu';
import SearchResult from '../components/search-result';
import HomeTemplate from '../components/homeTemplate/homeTemplate';
import { useEmPanel, useFilter, useCodeCopy } from '../hooks/doc-dom-operation';
import { useSelectMenu } from '../hooks/select-menu';
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
  } = pageContext;

  versions = versions.sort(sortVersions);

  const { isMobile } = useMobileScreen();

  const type = useMemo(() => getStyleType(version), [version]);
  const [showBack, setShowBack] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = value => {
    setSearchVal(value);
    setIsSearch(true);
  };

  const handleBack = () => {
    setSearchVal('');
    setIsSearch(false);
    // In mobile search input will missing
    document.querySelector('.search') &&
      (document.querySelector('.search').value = '');
  };

  const { options } = useSelectMenu();
  useEmPanel(setShowModal);
  useGenAnchor(version, editPath);
  useFilter();
  useCodeCopy(locale);

  const showWarning = useMemo(
    () =>
      sortVersions(version, NOT_SUPPORTED_VERSION) > -1 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('data_migration'),
    [version]
  );

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

  if (!data.allFile.edges[0]) {
    return null;
  }

  const layout = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childLayoutJson.layout
    : {};
  const v2 = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childLayoutJson.v2
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
      id={frontmatter ? frontmatter.id : 'home'}
      isBenchMark={isBenchmark}
      showDoc={false}
      isBlog={isBlog}
      isHome={isSearch || newHtml === null}
      editPath={editPath}
      header={v2}
      setSearch={handleSearch}
    >
      <SEO title={title} lang={locale} />
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
          {isSearch ? (
            <div
              className={`doc-post-container ${
                type === 'new' ? 'doc-post-container-new' : ''
              }`}
            >
              <SearchResult
                text={searchVal}
                language={locale}
                version={version}
                handleBack={handleBack}
              />
            </div>
          ) : homeData ? (
            <HomeTemplate data={homeData} />
          ) : (
            <div
              className={`doc-post-container ${
                type === 'new' ? 'doc-post-container-new' : ''
              }`}
            >
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
                    dangerouslySetInnerHTML={{ __html: newHtml }}
                  />
                  <ReactTooltip
                    type="info"
                    // place="right"
                    globalEventOff="click"
                    className="md-tooltip"
                  />
                </div>
                <TextSelectionMenu language={layout} options={options} />
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
  query($locale: String, $old: String, $fileAbsolutePath: String) {
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

          childLayoutJson {
            v2 {
              header {
                navlist {
                  label
                  href
                }
              }
            }
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
            }
          }
        }
      }
    }
  }
`;
