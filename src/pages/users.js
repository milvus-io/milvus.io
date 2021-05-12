import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import { importAllPics } from '../utils/docTemplate.util';
// import '../scss/index.scss';
import Layout from '../components/layout/404Layout/404Layout';

let users = [];
let resources = [];
importAllPics(
  require.context('../images/website/users', false, /\.jpg|.png$/),
  'users',
  users,
  resources
);

const UsersPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section6 } = language.home;
  return (
    <Layout language={language} locale={locale}>
      <SEO title={section6.title} />
      <main className="home-wrapper">
        <section className="section6">
          <h2>{section6.title}</h2>
          <ul>
            {users.map((v, i) => (
              <li key={i}>
                <img src={v.default} alt="milvus user"></img>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
};

export const Query = graphql`
  query UserQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childLayoutJson {
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
                section6 {
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

export default UsersPage;
