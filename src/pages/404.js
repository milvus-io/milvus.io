import React from 'react';
import { graphql } from 'gatsby';
import Seo from '../components/seo';
import notFound from '../images/v2/404.svg';
import notFound_mobile from '../images/v2/404-mobile.svg';
import bird from '../images/v2/bird.svg';
import bird_mobile from '../images/v2/bird-mobile.svg';
import './404.less';
import Layout from '../components/layout/404Layout/404Layout';
import Button from '../components/button';
import { useMobileScreen } from '../hooks';

const NotFoundPage = ({ data, pageContext }) => {
  const language = data.allFile.edges.filter(edge => edge.node.childI18N)[0]
    .node.childI18N.layout;
  const { locale } = pageContext;
  const { isMobile } = useMobileScreen();

  return (
    <Layout language={language} locale={locale}>
      <Seo title="404: Not found" />
      <div className="notfound-container">
        <div className="notfount-center-wrapper">
          <img src={isMobile ? notFound_mobile : notFound} alt="not found" />
          <div className="notfound-titlebar">
            <h1 className="notfound-title">Uoops...something went wrong!</h1>
            <img
              className="notfound-icon"
              src={isMobile ? bird_mobile : bird}
              alt="milvus icon"
            />
          </div>

          <p className="notfound-content">
            Looks like you’ve wandered off too far!
          </p>
          <p className="notfound-content">
            We can’t find the page you are looking for:(
          </p>
          <Button
            locale={locale}
            link={'/'}
            className="notfound-button"
            children={
              <>
                <i className="fas fa-chevron-left"></i>
                <span>Go to home page</span>
              </>
            }
          />
        </div>
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
