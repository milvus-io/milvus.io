import React from 'react';
import Seo from '../components/seo';
import Layout from '../components/layout';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import * as styles from './useCases.module.less';

export default function UsCasesTemplate({ data, pageContext }) {
  const { useCaseList, newestVersion } = pageContext;
  const { language, t, navigate, originalPath } = useI18next();

  console.log('useCaseList--', useCaseList);

  return (
    <Layout t={t} version={newestVersion}>
      <Seo
        title="use case | Milvus"
        lang={language}
        titleTemplate="%s"
        description="use cases of Milvus"
      />
      <h1>use Case</h1>
      <div className="">
        {useCaseList.map(v => (
          <div>{v.name}</div>
        ))}
      </div>
    </Layout>
  );
}

export const useCaseQuery = graphql`
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
  }
`;
