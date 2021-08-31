import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import {
  useEmPanel,
  useFilter,
  useCodeCopy,
  useMultipleCodeFilter,
} from '../hooks/doc-dom-operation';
import { useFormatAnchor, useGenAnchor } from '../hooks/doc-anchor';
import ScoredFeedback from '../components/scoredFeedback';
import { getGithubCommits } from '../http/http';
import dayjs from 'dayjs';
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
  const [commitInfo, setCommitInfo] = useState({
    message: '',
    date: '',
    commitUrl: '',
    source: '',
  });

  const docRef = useRef(null);
  const commitPath = useMemo(() => {
    return locale === 'en' ? `site/en/${editPath}` : `site/zh-CN/${editPath}`;
  }, [locale, editPath]);

  useEffect(() => {
    if (isBenchmark || isBlog) return;

    const fetchData = async () => {
      const res = await getGithubCommits(commitPath, version);
      if (res.status === 200) {
        const lastCommit = res.data[0];
        const message = lastCommit.commit.message.split('\n')[0];
        const date = lastCommit.commit.committer.date;
        const commitUrl = lastCommit.html_url;
        const formatDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
        const source = `https://github.com/milvus-io/milvus-docs/blob/${version}/${commitPath}`;
        setCommitInfo({ commitUrl, date: formatDate, source, message });
      }
    };
    fetchData();
  }, [commitPath, version, isBenchmark, isBlog]);

  useEmPanel(setShowModal);
  useGenAnchor(version, editPath);
  useFilter();
  useFormatAnchor();
  useCodeCopy(locale);
  useMultipleCodeFilter();

  useEffect(() => {
    const isLowVersion =
      sortVersions(version, NOT_SUPPORTED_VERSION) > -1 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('data_migration');
    setShowWarning(isLowVersion);
  }, [version]);

  const docsearchMeta = useAlgolia(locale, version, !isBlog);

  if (!data.allFile.edges[0]) {
    return null;
  }

  const layout = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childI18N.layout
    : {};

  const { feedback, commit: commitTrans } = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childI18N.v2
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
                          ? `/docs/migrate_overview.md`
                          : `/cn/docs/migrate_overview.md`
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
                <div className="commit-info-wrapper">
                  {commitInfo.message && (
                    <>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={commitInfo.source}
                      >
                        {old}
                      </a>
                      <span>
                        {commitTrans} {commitInfo.date}:{' '}
                      </span>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={commitInfo.commitUrl}
                      >
                        {commitInfo.message}
                      </a>
                    </>
                  )}
                </div>
                <ScoredFeedback feedbackText={feedback} old={old} />
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
            v2 {
              feedback {
                text1
                text2
              }
              commit
            }
          }
        }
      }
    }
  }
`;
