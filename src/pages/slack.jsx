import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import Seo from '../components/seo';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import slackImg from '../images/slack/slack.svg';
import * as styles from './index.module.less';

export default function Slack({ data, pageContext }) {
  const { t } = useI18next();
  const { allVersion } = data;
  const { locale } = pageContext;

  const title = 'Milvus Slack Community';
  const description =
    'Want to connect with other Milvus users to share ideas, get advice and updates on the latest Milvus releases? Join our Slack community! Fill out the form to request access. ';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialHubspotForm = async () => {
      if ('hbspt' in window) {
        await window.hbspt.forms.create({
          region: 'na1',
          portalId: '24054828',
          formId: '589ded90-8b81-45df-97ce-eecd5e3ed974',
          target: '#hubspot-form',
        });
        setLoading(false);
      } else {
        setTimeout(initialHubspotForm, 500);
      }
    };

    initialHubspotForm();
  }, []);

  return (
    <Layout t={t} version={allVersion}>
      <Seo
        title={title}
        lang={locale}
        description={description}
        script={[
          {
            charset: 'utf-8',
            type: 'text/javascript',
            src: '//js.hsforms.net/forms/embed/v2.js',
          },
        ]}
      />
      <main className={styles.slackContainer}>
        <div className={styles.contentContainer}>
          <img src={slackImg} alt="Slack Logo" />

          <h1>{t('v3trans.slack.title')}</h1>
          <h2>{t('v3trans.slack.desc')}</h2>
          <div className={styles.formWrapper}>
            {loading ? <p className={styles.prompt}>Loading...</p> : null}
            <div id="hubspot-form"></div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export const query = graphql`
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
