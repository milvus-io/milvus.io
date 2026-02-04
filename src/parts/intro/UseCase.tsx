import Layout from '@/components/layout/commonLayout';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/useCase.module.less';
import pageClasses from '@/styles/responsive.module.less';
import UseCaseCard from '@/parts/useCase/useCaseCard';
import clsx from 'clsx';
import { Typography } from '@mui/material';
import Masonry from 'react-masonry-css';
import { RightArrow } from '@/components/icons';
import { SHARE_YOUR_STORY_URL } from '@/consts/externalLinks';
import Head from 'next/head';
import { FinalUserCaseType } from '@/types/useCase';
import { LanguageEnum } from '@/types/localization';

type Props = {
  useCaseList: FinalUserCaseType[];
  locale: LanguageEnum;
};

export function UseCase(props: Props) {
  const { useCaseList, locale = LanguageEnum.ENGLISH } = props;
  const { t } = useTranslation('useCase', { lng: locale });

  return (
    <Layout>
      <Head>
        <title>Use cases | Milvus</title>
        <meta
          name="description"
          content="Discover Milvus use cases across various industries to unveil the power of purpose-built vector databases. "
        />
        <meta name="keywords" content="Milvus, vector search, use cases" />
      </Head>
      <main>
        <div className={styles.casePageContainer}>
          <div
            className={clsx(pageClasses.homeContainer, styles.contentContainer)}
          >
            <section className={styles.headerSection}>
              <Typography variant="h2" component="h1">
                {t('title')}
              </Typography>
              <Typography variant="h5" component="p" className={styles.desc}>
                {t('desc')}
              </Typography>
            </section>
            <div className={styles.listSection}>
              {useCaseList.length ? (
                <Masonry
                  breakpointCols={{
                    default: 5,
                    1680: 4,
                    1440: 3,
                    1024: 2,
                    0: 1,
                  }}
                  className={styles.masonryGrid}
                  columnClassName={styles.masonryGridColumn}
                >
                  {useCaseList.map((useCase) => (
                    <UseCaseCard key={useCase.name} useCase={useCase} />
                  ))}
                </Masonry>
              ) : null}
            </div>
          </div>

          <section className={styles.shareSection}>
            <div className={styles.contentWrapper}>
              <h2>{t('shareSection.title')}</h2>
              <p className={styles.desc}>{t('shareSection.desc')}</p>
              <a
                href={SHARE_YOUR_STORY_URL}
                className={styles.linkBtn}
                target="_blank"
                rel="noreferrer"
              >
                {t('shareSection.cta')}
                <RightArrow />
              </a>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
