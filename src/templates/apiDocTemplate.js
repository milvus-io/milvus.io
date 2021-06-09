import React from 'react';
import Seo from '../components/seo';
import Layout from '../components/docLayout';
import { graphql } from 'gatsby';
import './apiDocTemplate.less';

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
        version={docVersion}
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
          className="api-reference-wrapper"
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
