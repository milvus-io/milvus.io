import React from "react";

import Layout from "../components/layout/404Layout";
import SEO from "../components/seo";
import "./404.scss";
const NotFoundPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;

  return (
    <Layout language={language} locale={locale}>
      <SEO title="404: Not found" />
      <div
        style={{
          display: "flex",
          height: "60vh",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px"
        }}
      >
        <p>{language.notFound}</p>
      </div>
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
              notFound
              header {
                about
                doc
                blog
                try
                tutorials
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
