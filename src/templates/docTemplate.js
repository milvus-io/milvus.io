import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/docLayout';
import Seo from '../components/seo';
import { graphql } from 'gatsby';
import 'highlight.js/styles/stackoverflow-light.css';
import './docTemplate.less';
import useAlgolia from '../hooks/use-algolia';
import QueryModal from '../components/query-modal/query-modal';
import { sortVersions } from '../utils/docTemplate.util';
import { NOT_SUPPORTED_VERSION } from '../config';
import HomeTemplate from '../components/homeTemplate/homeTemplate';
import RelatedQuestion from '../components/relatedQuestion';
import { useEmPanel, useFilter, useCodeCopy } from '../hooks/doc-dom-operation';
import { useFormatAnchor, useGenAnchor } from '../hooks/doc-anchor';

const FEEDBACK_INFO = 'feedback_info';

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
    old, // id of markdown
  } = pageContext;
  versions = versions.sort(sortVersions);

  useEffect(() => {
    window?.localStorage?.setItem('docVersion', version);
  }, [version]);

  const [showBack, setShowBack] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isFeedback, setIsFeedback] = useState(false);
  const docRef = useRef(null);

  useEmPanel(setShowModal);
  useGenAnchor(version, editPath);
  useFilter();
  useFormatAnchor();
  useCodeCopy(locale);

  useEffect(() => {
    const isLowVersion =
      sortVersions(version, NOT_SUPPORTED_VERSION) > -1 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('data_migration');
    setShowWarning(isLowVersion);
  }, [version]);

  useEffect(() => {
    // make sure whether this doc has been feedbacked
    const feedbackInfoString = window.localStorage.getItem(FEEDBACK_INFO);
    const feedbackInfo = feedbackInfoString
      ? JSON.parse(feedbackInfoString)
      : [];

    const isFeedback = feedbackInfo.some(item => item.md_id === old);
    setIsFeedback(isFeedback);
  }, [old]);

  const docsearchMeta = useAlgolia(locale, version, !isBlog);

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

  const handleFeedback = val => {
    const feedbackInfoString = window.localStorage.getItem(FEEDBACK_INFO);
    const feedbackInfo = feedbackInfoString
      ? JSON.parse(feedbackInfoString)
      : [];
    if (!isFeedback) {
      feedbackInfo.push({
        md_id: old,
        feedback: val,
      });

      setTimeout(() => {
        setIsFeedback(true);
      }, 3000);
    }
    window.localStorage.setItem(FEEDBACK_INFO, JSON.stringify(feedbackInfo));
    setFeedback(val);
  };

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
      <Seo title={title} lang={locale} version={version} meta={docsearchMeta} />
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
                </div>

                <div className={`feedback-wrapper ${isFeedback ? 'hide' : ''}`}>
                  <div
                    className={`feedback-options ${
                      feedback !== '' ? 'hideOptions' : ''
                    }`}
                  >
                    <span className="text">Is this page helpful?</span>
                    <span
                      className="icon-wrapper hover-like"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleFeedback('like')}
                      onKeyDown={() => handleFeedback('dislike')}
                    >
                      <i className="fas fa-thumbs-up"></i>
                    </span>
                    <span
                      className="icon-wrapper hover-dislike"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleFeedback('dislike')}
                      onKeyDown={() => handleFeedback('dislike')}
                    >
                      <i className="fas fa-thumbs-down"></i>
                    </span>
                  </div>

                  <div
                    className={`is-like-wrapper ${
                      feedback !== '' ? 'active' : ''
                    }`}
                  >
                    {feedback === 'like' ? (
                      <span className="icon-wrapper like">
                        <i className="fas fa-thumbs-up"></i>
                      </span>
                    ) : (
                      <span className="icon-wrapper dislike">
                        <i className="fas fa-thumbs-down"></i>
                      </span>
                    )}
                    <span className="text">Scored Successfully!</span>
                  </div>
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
