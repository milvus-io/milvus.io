import React from 'react';
import styles from '@/styles/intro.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import Layout from '@/components/layout/commonLayout';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import { DISCORD_INVITE_URL, MEETUP_URL } from '@/consts/externalLinks';
import Link from 'next/link';
import { ABSOLUTE_BASE_URL } from '@/consts';

interface Key {
  title: string;
  content: string;
}

export default function WhatIsMilvus() {
  const { t } = useTranslation('intro');

  const usedForKeys = t('useFor.keys', {
    returnObjects: true,
  }) as Key[];

  const milvusIsAVdbKeys = t('milvusIsAVdb.features', {
    returnObjects: true,
  }) as string[];

  const differenceKeys = t('difference.keys', {
    returnObjects: true,
  }) as Key[];

  const nutShellKeys1 = [
    <li key="sub2FeatureF1">
      <h4>
        The Root Coordinator:&nbsp;&nbsp;
        <span className={styles.thinText}>
          managing data-related tasks and global timestamps
        </span>
      </h4>
    </li>,
    <li key="sub2FeatureF2">
      <h4>
        The Query Coordinator:&nbsp;&nbsp;
        <span className={styles.thinText}>
          overseeing query nodes for search operations
        </span>
      </h4>
    </li>,
    <li key="sub2FeatureF3">
      <h4>
        The Data Coordinator:&nbsp;&nbsp;
        <span className={styles.thinText}>
          handling data nodes and metadata
        </span>
      </h4>
    </li>,
    <li key="sub2FeatureF4">
      <h4>
        The Index Coordinator:&nbsp;&nbsp;
        <span className={styles.thinText}>
          maintaining index nodes and metadata
        </span>
      </h4>
    </li>,
  ];
  const nutShellKeys2 = [
    <li key="sub4FeatureF1">
      <h4>
        Meta store:&nbsp;&nbsp;
        <span className={styles.thinText}>
          using etcd for metadata snapshots and system health checks
        </span>
      </h4>
    </li>,
    <li key="sub4FeatureF2">
      <h4>
        Log broker:&nbsp;&nbsp;
        <span className={styles.thinText}>
          for streaming data persistence and recovery, utilizing Pulsar or
          RocksDB
        </span>
      </h4>
    </li>,
    <li key="sub4FeatureF3">
      <h4>
        Object storage:&nbsp;&nbsp;
        <span className={styles.thinText}>
          storing log snapshots, index files, and query results, with support
          for services like AWS S3, Azure Blob Storage, and MinIO
        </span>
      </h4>
    </li>,
  ];

  return (
    <Layout>
      <Head>
        <title>
          Milvus, a highly performant distributed vector database for AI apps
        </title>
        <meta
          name="description"
          content="All you need to know about vector embedding, vector search, and why Milvus is a purpose-built vector database to ensure high performance, resilience and versatility for production AI apps."
        />
        <meta
          name="keywords"
          content="Milvus, Vector Database, Vector Search"
        />
        <link
          rel="alternate"
          href={`${ABSOLUTE_BASE_URL}/intro`}
          hrefLang="en"
        />
      </Head>

      <main>
        <section className={styles.headerSection}>
          <div className={clsx(pageClasses.homeContainer, styles.innerSection)}>
            <h1 className="">{t('title')}</h1>
            <p className={styles.desc}>{t('desc')}</p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={clsx(styles.paragraphWrapper, styles.miniGap)}>
            <h2 className="">{t('embedding.title')}</h2>
            <p className="">{t('embedding.desc1')}</p>
            <p className="">{t('embedding.desc2')}</p>
          </div>
          <div className={styles.imageWrapper}>
            <img
              src="/images/embedding.png"
              alt="What are vector embeddings?"
            />
          </div>

          <div className={styles.paragraphWrapper}>
            <h2>{t('useFor.title')}</h2>
            <p className="">{t('useFor.content')}</p>

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
            <h2 className="">{t('milvusIsAVdb.title')}</h2>
            <p className="">{t('milvusIsAVdb.desc1')}</p>
            <p className="">{t('milvusIsAVdb.desc2')}</p>
            <ul className="">
              {milvusIsAVdbKeys.map(v => (
                <li className="" key={v}>
                  <h4 className="">{v}</h4>
                </li>
              ))}
            </ul>
            <p className="">{t('milvusIsAVdb.desc3')}</p>

            <h3 className="">{t('milvusIsAVdb.vdbVsVsl.title')}</h3>
            <p className="">{t('milvusIsAVdb.vdbVsVsl.content1')}</p>
            <p className="">{t('milvusIsAVdb.vdbVsVsl.content2')}</p>

            <h3 className="">{t('milvusIsAVdb.vdbVsVsp.title')}</h3>
            <p className="">{t('milvusIsAVdb.vdbVsVsp.content1')}</p>
            <p className="">{t('milvusIsAVdb.vdbVsVsp.content2')}</p>
          </div>

          <div className={styles.paragraphWrapper}>
            <h2 className="">{t('difference.title')}</h2>
            <p className="">{t('difference.desc')}</p>
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
            <h2 className="">{t('workInNutshell.title')}</h2>
            <p className="">{t('workInNutshell.content')}</p>

            <h3 className="">{t('workInNutshell.sub1.title')}</h3>
            <p className="">{t('workInNutshell.sub1.content')}</p>

            <h3 className="">{t('workInNutshell.sub2.title')}</h3>
            <p className="">{t('workInNutshell.sub2.content')}</p>
            <ul className="">{nutShellKeys1.map(v => v)}</ul>

            <h3 className="">{t('workInNutshell.sub3.title')}</h3>
            <p className="">{t('workInNutshell.sub3.content')}</p>

            <h3 className="">{t('workInNutshell.sub4.title')}</h3>
            <p className="">{t('workInNutshell.sub4.content')}</p>
            <ul className="">{nutShellKeys2.map(v => v)}</ul>
          </div>
          <div className={styles.imageWrapper}>
            <img
              src="https://milvus.io/docs/v2.5.x/assets/highly-decoupled-architecture.png"
              alt="Milvus Architecture Overview"
            />
          </div>

          <div className={styles.paragraphWrapper}>
            <h2 className="">{t('whereToGo.title')}</h2>
            <ul className="">
              <li className="">
                To get hands-on experience with Milvus, follow the &nbsp;
                <Link href="/blog/how-to-get-started-with-milvus.md">
                  get started guide
                </Link>
                .
              </li>
              <li className="">
                To understand Milvus in more detail, read the&nbsp;
                <Link href="/docs">Documentation</Link>. 
              </li>
              <li className="">
                Browse through the&nbsp;
                <Link href="/use-cases">Use Cases</Link>&nbsp;to learn how other
                users in our worldwide community are getting value from Milvus.
              </li>
            </ul>
            <p className="">
              Join a local&nbsp;
              <a href={MEETUP_URL} target="_blank" rel="noreferrer">
                Unstructured Data
              </a>
              &nbsp; meetup and our&nbsp;
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
