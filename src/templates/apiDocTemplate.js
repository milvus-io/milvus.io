import React from 'react';
import Seo from '../components/seo';
import Layout from '../components/docLayout';
import { graphql } from 'gatsby';
import './apiDocTemplate.less';
import { useCodeCopy } from '../hooks/doc-dom-operation';
import useAlgolia from '../hooks/use-algolia';



export default function Template({ data, pageContext }) {
  let {
    doc,
    name,
    allApiMenus,
    allMenus,
    version,
    locale,
    docVersions,
    docVersion,
    category,
    newestVersion,
  } = pageContext;

  // https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
  // Specify supported languages to fix Java doc code layout.
  const hljsCfg = {
    languages: ['java', 'go', 'python', 'javascript'],
  };

  useCodeCopy(locale, hljsCfg);
  useAlgolia(locale, docVersion);

  const layout = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childI18N.layout
    : {};

  const menuList = allMenus.find(
    v => v.absolutePath.includes(docVersion) && v.lang === locale
  );

  const nav = {
    current: 'doc',
  };

  return (
    <>
      <Layout
        language={layout}
        pageContext={pageContext}
        locale={locale}
        nav={nav}
        current="doc"
        menuList={menuList}
        version={docVersion || 'master'}
        headings={[]}
        versions={docVersions}
        newestVersion={newestVersion}
        id={name}
        isBenchMark={false}
        showDoc={false}
        isBlog={false}
        isHome={false}
        editPath=""
        isApiReference
        allApiMenus={allApiMenus}
      >
        <Seo
          title={`API Reference: ${category}`}
          lang={locale}
          version={version}
        />
        <div
          className={`api-reference-wrapper doc-post-container ${category}`}
          dangerouslySetInnerHTML={{ __html: doc }}
        ></div>
      </Layout>
    </>
  );
}

export const Query = graphql`
  query APIDocQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
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
