import React from 'react';
import { graphql } from 'gatsby';
import Seo from '../components/seo';
import LocalizeLink from '../components/localizedLink/localizedLink';

import './404.less';
import Layout from '../components/layout/404Layout/404Layout';

const NotFoundPage = ({ data, pageContext }) => {
  const language = data.allFile.edges.filter(edge => edge.node.childI18N)[0]
    .node.childI18N.layout;
  const { locale } = pageContext;

  return (
    <Layout language={language} locale={locale}>
      <Seo title="404: Not found" />
      <div
        style={{
          display: 'flex',
          height: '60vh',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          flexDirection: 'column',
        }}
        className="notfound-wrapper"
      >
        <p>{language.notFound}</p>
        <LocalizeLink locale={locale} to={'/'} className="back">
          {language.backtohome}
        </LocalizeLink>
      </div>
    </Layout>
  );
};

export const Query = graphql`
  query F0FQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childI18N {
            layout {
              notFound
              backtohome
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
              home {
                section1 {
                  desc1
                  desc2
                  link
                }
                section2 {
                  title
                  content
                  link
                }
                section3 {
                  title
                  list {
                    title
                    content
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default NotFoundPage;
