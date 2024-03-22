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
import 'gestalt/dist/gestalt.css';
import { RightArrow } from '../components/icons';
import { SHARE_YOUR_STORY_URL } from '../consts';

export default function UsCasesTemplate({ data, pageContext }) {
  const { useCaseList, newestVersion } = pageContext;
  const { language, t } = useI18next();

  const scrollContainer = useRef(null);

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
            {useCaseList.length ? (
              <Masonry
                items={useCaseList}
                columnWidth={280}
                renderItem={({ data }) => <UseCaseCard useCase={data} />}
                gutterWidth={30}
                scrollContainer={scrollContainer.current}
                virtualize
                minCols={1}
              />
            ) : null}
          </div>
        </div>

        <section className={styles.shareSection}>
          <div className={styles.contentWrapper}>
            <h2>Share Your Story with Us!</h2>
            <p className={styles.desc}>
              Have you built something cool using Milvus or Zilliz Cloud? We
              want to hear all about it. You’ll get a free Zilliz hoody for
              sharing your project made with Milvus or Zilliz.
            </p>
            <a
              href={SHARE_YOUR_STORY_URL}
              className={styles.linkBtn}
              target="_blank"
              rel="noreferrer"
            >
              Submit My Story
              <RightArrow />
            </a>
          </div>
        </section>
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
