import React from 'react';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../../components/layout';
import Footer from '../../components/footer';
import Seo from '../../components/seo';
import { RedocStandalone } from 'redoc';
import NotFoundPage from '../404';

export default function RestfulAPI({ data, pageContext }) {
  const { t } = useI18next();

  const jsonString = data.allApIfile?.nodes[0]?.doc;
  if (!jsonString) {
    return <NotFoundPage />;
  }
  const json = JSON.parse(data.allApIfile.nodes[0].doc);

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader">
      <Seo
        title="Restful API reference for Milvus "
        titleTemplate="%s"
        lang="en"
        meta={[]}
        description="Milvus Restful API reference"
      />
      <div className="">
        <RedocStandalone
          spec={json}
          options={{
            nativeScrollbars: true,
            theme: { colors: { primary: { main: '#5468ff' } } },
          }}
        />
      </div>

      <Footer t={t} darkMode={false} className="doc-right-footer" />
    </Layout>
  );
}

export const restfulQuery = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
    allVersion(filter: { released: { eq: "yes" } }) {
      nodes {
        version
      }
    }
    allApIfile(filter: { category: { eq: "restful" } }) {
      nodes {
        doc
        category
        name
      }
    }
  }
`;
