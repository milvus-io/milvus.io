import React, { useRef } from 'react';
import Seo from '../components/seo';
import Layout from '../components/layout';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import * as styles from './useCases.module.less';
import UseCaseCard from './parts/useCaseCard';
import clsx from 'clsx';
import { Typography } from '@mui/material';
import { Masonry } from 'gestalt';
import json from './mock.json';
import 'gestalt/dist/gestalt.css';

const MIN = 100;
const MAX = 380;
const DESCRIPTION =
  "Mozart leverages Milvus for Stylepedia's image search system, utilizing its capability for real-time, large-scale vector similarity searches across billions of datasets for garment detection, feature extraction, and refined post-processing, enhancing user experiences with functions like searching for similar clothing items, outfit suggestions, and personalized fashion recommendations.";

export default function UsCasesTemplate({ data, pageContext }) {
  const { useCaseList, newestVersion } = pageContext;
  const { language, t } = useI18next();

  const scrollContainer = useRef(null);

  const mockData = json.map(v => {
    const random = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    return {
      ...v,
      description: v.description
        ? v.description
        : DESCRIPTION.substring(0, random),
    };
  });

  console.log(mockData.length);

  return (
    <Layout t={t} version={newestVersion}>
      <Seo
        title="use case | Milvus"
        lang={language}
        titleTemplate="%s"
        description="use cases of Milvus"
      />
      <div className={styles.casePageContainer} ref={scrollContainer}>
        <div className={clsx(styles.contentContainer, 'col-4 col-8 col-12')}>
          <section className={styles.headerSection}>
            <Typography variant="h2" component="h1">
              Use cases
            </Typography>
            <Typography variant="h5" component="p" className={styles.desc}>
              Discover how Milvus helps enterprises build AI apps to drive their
              businesses
            </Typography>
          </section>
          <div className={styles.listSection}>
            {mockData.length ? (
              <Masonry
                columnWidth={280}
                virtualize={true}
                comp={({ data }) => <UseCaseCard useCase={data} />}
                items={mockData}
                gutterWidth={30}
                scrollContainer={() => scrollContainer.current}
                minCols={2}
              ></Masonry>
            ) : null}
          </div>
        </div>
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
