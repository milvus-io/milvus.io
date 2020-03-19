import React, { useEffect } from "react";
import Layout from "../components/docLayout";
import SEO from "../components/seo";
import { graphql } from "gatsby";
import hljs from "highlight.js";
import LocalizeLink from '../components/localizedLink/localizedLink'
// import sql from "highlight.js/lib/languages/sql"
// import bash from "highlight.js/lib/languages/bash"
import "highlight.js/styles/atom-one-dark.css";
import "./docTemplate.scss";
// hljs.registerLanguage("sql", sql)
// hljs.registerLanguage("bash", bash)

export default function Template({
  data,
  pageContext // this prop will be injected by the GraphQL query below.
}) {
  const {
    locale,
    version,
    versions,
    headings = [],
    allMenus,
    isBlog,
    isBenchmark = false,
    editPath
  } = pageContext;
  const layout = data.allFile.edges[0].node.childLayoutJson.layout;
  const menuList = allMenus.find(
    v =>
      v.absolutePath.includes(version) &&
      isBlog === v.isBlog &&
      locale === v.lang
  );
  const { markdownRemark } = data; // data.markdownRemark holds our post data
  let { frontmatter, html } = markdownRemark;
  const nav = {
    current: "doc"
  };
  const iframeUrl = isBenchmark ? `/benchmarks/${frontmatter.id.split('_')[1]}/index.html` : ""
  const idRegex = /id=".*?"/g;
  if (locale === 'cn') {
    html = html.replace(idRegex, match => match.replace(/[？|、|，]/g, ''))
  }

  useEffect(() => {
    document.querySelectorAll("pre code").forEach(block => {
      hljs.highlightBlock(block);
    });
  }, []);
  const handleRefresh = () => {
    window.location.reload()
  }
  return (
    <Layout
      language={layout}
      locale={locale}
      nav={nav}
      pageContext={pageContext}
      menuList={menuList}
      version={version}
      headings={headings}
      versions={versions}
      id={frontmatter.id}
      isBenchMark={isBenchmark}

    >
      <SEO title={`${headings[0] && headings[0].value}`} lang={locale} />
      {
        isBenchmark ? (
          <div style={{ position: "relative" }}>
            <iframe id="inlineFrameExample"
              title="test"
              width="100%"
              height="2000px"
              src={iframeUrl}></iframe>
            <i
              className="fas iframe-icon fa-arrow-left"
              onClick={handleRefresh}
            ></i>

          </div>
        ) : (
            <div className="doc-post-container">
              <div className="doc-post">
                <div
                  className="doc-post-content"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
              {isBlog || isBenchmark ? null : (
                <a
                  className="edit-page-link button"
                  href={`https://github.com/milvus-io/docs/tree/${version}/site/${
                    locale === "en" ? "en" : "zh-CN"
                    }/${editPath}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <i className="far fa-edit"></i> &nbsp; Edit
                </a>
              )}
            </div>
          )
      }

    </Layout >
  );
}

export const pageQuery = graphql`
  query($locale: String, $old: String, $fileAbsolutePath: String) {
    markdownRemark(
      fileAbsolutePath: { eq: $fileAbsolutePath }
      frontmatter: { id: { eq: $old } }
    ) {
      html
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
            layout {
              header {
                why
                gui
                solution
                about
                doc
                blog
                try
                loading
                noresult
                tutorial
              }
              footer {
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
                tool{
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
              }
            }
          }
        }
      }
    }
  }
`;
