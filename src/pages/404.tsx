import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import Head from 'next/head';
import styles from '@/styles/404.module.less';
import { ABSOLUTE_BASE_URL } from '@/consts';

const NotFoundPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <main>
        <Head>
          <title>404: Not Found</title>
          <meta
            name="description"
            content="Oops, the page you were looking for doesn't seem to exist!Please check the URL you entered or try navigating back to our homepage."
          />
          <link
            rel="alternate"
            href={`${ABSOLUTE_BASE_URL}/404`}
            hrefLang="en"
          />
        </Head>

        <div className={styles.notFoundContainer}>
          <div className={styles.notFountCenterWrapper}>
            <div className={styles.notFoundTitlebar}>
              <h1 className={styles.notFoundTitle}>{t('v3trans.404.title')}</h1>
            </div>

            <p className={styles.notFoundContent}>{t('v3trans.404.desc1')}</p>
            <p className={styles.notFoundContent}>{t('v3trans.404.desc2')}</p>
            <Link
              href={'/'}
              className={styles.notFoundButton}
              children={
                <>
                  <FontAwesomeIcon icon={faChevronLeft} />
                  <span>{t('v3trans.404.gobtn')}</span>
                </>
              }
            />
          </div>
        </div>
      </main>
    </Layout>
  );
};
export default NotFoundPage;
