import React from "react";

import Layout from "../components/layout/layout";
import SEO from "../components/seo";

const NotFoundPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;

  return (
    <Layout language={language} locale={locale}>
      <SEO title="404: Not found" />
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
};

export const Query = graphql`
  query F0FQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
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
                section4 {
                  title
                  list
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
