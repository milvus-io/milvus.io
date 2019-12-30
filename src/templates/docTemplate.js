import React, { useEffect } from "react";
import Layout from "../components/docLayout";
import SEO from "../components/seo";
import { graphql } from "gatsby";
import hljs from "highlight.js";
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
    headings,
    allMenus,
    isBlog,
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
  const { frontmatter, html } = markdownRemark;
  const nav = {
    current: "doc"
  };

  useEffect(() => {
    document.querySelectorAll("pre code").forEach(block => {
      hljs.highlightBlock(block);
    });
  }, []);
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
    >
      <SEO title={ `${headings[0].value}`} lang={locale} />
      <div className="doc-post-container">
        <div className="doc-post">
          {/* <h1>{frontmatter.title}</h1> */}
          <div
            className="doc-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        {isBlog ? null : (
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
    </Layout>
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
                about
                doc
                blog
                try
                loading
                noresult
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
                resource {
                  title
                  txt1
                  txt2
                  txt3
                  txt4
                }
                contact {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;
