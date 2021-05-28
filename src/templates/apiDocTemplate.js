import React, { useState, useEffect } from 'react';
import Layout from '../components/docLayout';
import Seo from '../components/seo';
import Header from '../components/header/header.js';
import { graphql } from 'gatsby';

export default function Template({ data, pageContext }) {
  let { abspath, doc, linkId, name } = pageContext;

  const layout = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childLayoutJson.layout
    : {};
  const nav = {
    current: 'api',
  };
  const menuList = {};

  return (
    <>
      <Header language={layout} current="api" locale="en" showDoc={false} />
      <aside className="left-nav"></aside>
      <main className="api-reference-wrapper">
        <div dangerouslySetInnerHTML={{ __html: doc }} />
      </main>
      {/* {linkId.map(element => <a href={`#${element}`}>element</a>)} */}
    </>
  );
}

export const Query = graphql`
  query APIDocQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childLayoutJson {
            layout {
              notFound
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
              }
            }
          }
        }
      }
    }
  }
`;
