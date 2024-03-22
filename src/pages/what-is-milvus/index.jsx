import React from 'react';
import * as styles from './index.module.less';
import clsx from 'clsx';
import Layout from '../../components/layout';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Seo from '../../components/seo';
import { graphql } from 'gatsby';
import embeddingImg from '../../images/embedding.png';
import architecture from '../../images/milvus-architecture-overview.png';
import { DISCORD_INVITE_URL, MEETUP_URL } from '../../consts';
import { Link } from 'gatsby';

export const milvusPageQuery = graphql`
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

export default function WhatIsMilvus({ data, pageContext }) {
  const { t, language } = useI18next();

  const usedForKeys = t('v3trans.whatIsMilvus.useFor.keys', {
    returnObjects: true,
  });

  const milvusIsAVdbKeys = t('v3trans.whatIsMilvus.milvusIsAVdb.features', {
    returnObjects: true,
  });

  const differenceKeys = t('v3trans.whatIsMilvus.difference.keys', {
    returnObjects: true,
  });

  const nutShellKeys1 = t('v3trans.whatIsMilvus.workInNutshell.sub2.features', {
    returnObjects: true,
  });
  const nutShellKeys2 = t('v3trans.whatIsMilvus.workInNutshell.sub4.features', {
    returnObjects: true,
  });

  return (
    <Layout t={t}>
      <Seo
        title="What is Milvus"
        lang={language}
        description="What is Mulvus"
        titleTemplate="%s"
      />
      <main>
        <section className={styles.headerSection}>
          <div className={clsx(styles.innerSection, 'col-4 col-8 col-12')}>
            <h1 className="">{t('v3trans.whatIsMilvus.title')}</h1>
            <p className={styles.desc}>{t('v3trans.whatIsMilvus.desc')}</p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={clsx(styles.paragraphWrapper, styles.miniGap)}>
            <h2 className="">{t('v3trans.whatIsMilvus.embedding.title')}</h2>
            <p className="">{t('v3trans.whatIsMilvus.embedding.desc1')}</p>
            <p className="">{t('v3trans.whatIsMilvus.embedding.desc2')}</p>
          </div>
          <div className={styles.imageWrapper}>
            <img src={embeddingImg} alt="What are vector embeddings?" />
          </div>

          <div className={styles.paragraphWrapper}>
            <h2>{t('v3trans.whatIsMilvus.useFor.title')}</h2>
            <p className="">{t('v3trans.whatIsMilvus.useFor.content')}</p>

            <ul className="">
              {usedForKeys.map(v => (
                <li className="" key={v.title}>
                  <h4 className="">{v.title}</h4>
                  <p className="">{v.content}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.paragraphWrapper}>
            <h2 className="">{t('v3trans.whatIsMilvus.milvusIsAVdb.title')}</h2>
            <p className="">{t('v3trans.whatIsMilvus.milvusIsAVdb.desc1')}</p>
            <p className="">{t('v3trans.whatIsMilvus.milvusIsAVdb.desc2')}</p>
            <ul className="">
              {milvusIsAVdbKeys.map(v => (
                <li className="" key={v}>
                  <h4 className="">{v}</h4>
                </li>
              ))}
            </ul>
            <p className="">{t('v3trans.whatIsMilvus.milvusIsAVdb.desc3')}</p>

            <h3 className="">
              {t('v3trans.whatIsMilvus.milvusIsAVdb.vdbVsVsl.title')}
            </h3>
            <p className="">
              {t('v3trans.whatIsMilvus.milvusIsAVdb.vdbVsVsl.content1')}
            </p>
            <p className="">
              {t('v3trans.whatIsMilvus.milvusIsAVdb.vdbVsVsl.content2')}
            </p>

            <h3 className="">
              {t('v3trans.whatIsMilvus.milvusIsAVdb.vdbVsVsp.title')}
            </h3>
            <p className="">
              {t('v3trans.whatIsMilvus.milvusIsAVdb.vdbVsVsp.content1')}
            </p>
            <p className="">
              {t('v3trans.whatIsMilvus.milvusIsAVdb.vdbVsVsp.content1')}
            </p>
          </div>

          <div className={styles.paragraphWrapper}>
            <h2 className="">{t('v3trans.whatIsMilvus.difference.title')}</h2>
            <p className="">{t('v3trans.whatIsMilvus.difference.desc')}</p>
            <ul className="">
              {differenceKeys.map(v => (
                <li className="" key={v.title}>
                  <h4 className="">{v.title}</h4>
                  <p className="">{v.content}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={clsx(styles.paragraphWrapper, styles.miniGap)}>
            <h2 className="">
              {t('v3trans.whatIsMilvus.workInNutshell.title')}
            </h2>
            <p className="">
              {t('v3trans.whatIsMilvus.workInNutshell.content')}
            </p>

            <h3 className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub1.title')}
            </h3>
            <p className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub1.content')}
            </p>

            <h3 className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub2.title')}
            </h3>
            <p className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub2.content')}
            </p>
            <ul className="">
              {nutShellKeys1.map(v => (
                <li className="" key={v}>
                  <h4>{v}</h4>
                </li>
              ))}
            </ul>

            <h3 className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub3.title')}
            </h3>
            <p className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub3.content')}
            </p>

            <h3 className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub4.title')}
            </h3>
            <p className="">
              {t('v3trans.whatIsMilvus.workInNutshell.sub4.content')}
            </p>
            <ul className="">
              {nutShellKeys2.map(v => (
                <li className="" key={v}>
                  <h4>{v}</h4>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.imageWrapper}>
            <img src={architecture} alt="Milvus Architecture Overview" />
          </div>

          <div className={styles.paragraphWrapper}>
            <h2 className="">{t('v3trans.whatIsMilvus.whereToGo.title')}</h2>
            <ul className="">
              <li className="">
                To get hands-on experience with Milvus, follow the &nbsp;&nbsp;
                <Link to="/blog/how-to-get-started-with-milvus.md">
                  get started guide
                </Link>
                .
              </li>
              <li className="">
                To understand Milvus in more detail, read the&nbsp;&nbsp;
                <Link to="/docs">Documentation</Link>. 
              </li>
              <li className="">
                Browse through the&nbsp;&nbsp;
                <Link to="/use-cases">Use Cases</Link>&nbsp;&nbsp;to learn how
                other users in our worldwide community are getting value from
                Milvus.
              </li>
            </ul>
            <p className="">
              Join a local&nbsp;&nbsp;
              <a href={MEETUP_URL} target="_blank" rel="noreferrer">
                Unstructured Data
              </a>
              &nbsp;&nbsp; meetup and our&nbsp;&nbsp;
              <a href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer">
                Discord
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
