import { LocalizedAnchor } from '@/components/localizedLinks';
import Layout from '@/components/layout/commonLayout';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/useCase.module.css';
import pageClasses from '@/styles/responsive.module.css';
import UseCaseCard from '@/parts/useCase/useCaseCard';
import clsx from 'clsx';
import Masonry from 'react-masonry-css';
import { RightArrow } from '@/components/icons';
import { SHARE_YOUR_STORY_URL } from '@/consts/externalLinks';
import Head from 'next/head';
import { FinalUserCaseType } from '@/types/useCase';
import { LanguageEnum } from '@/types/localization';
import { ABSOLUTE_BASE_URL } from '@/consts';
import JsonLd from '@/components/JsonLd';
import { buildSchema } from '@/schema';

type Props = {
  useCaseList: FinalUserCaseType[];
  locale: LanguageEnum;
};

export function UseCase(props: Props) {
  const { useCaseList, locale = LanguageEnum.ENGLISH } = props;
  const { t } = useTranslation('useCase', { lng: locale });

  const homeUrl =
    locale === LanguageEnum.ENGLISH
      ? ABSOLUTE_BASE_URL
      : `${ABSOLUTE_BASE_URL}/${locale}`;
  const pageUrl =
    locale === LanguageEnum.ENGLISH
      ? `${ABSOLUTE_BASE_URL}/use-cases`
      : `${ABSOLUTE_BASE_URL}/${locale}/use-cases`;
  const ldSchemas = [
    buildSchema('collectionPage', {
      absoluteUrl: pageUrl,
      name: t('title') || 'Milvus Use Cases',
      desc:
        t('desc') ||
        'Discover Milvus use cases across various industries to unveil the power of purpose-built vector databases.',
      inLanguage: locale,
      items: (useCaseList || [])
        .filter(item => item?.name)
        .map(item => ({
          name: item.name,
          url: item.link || undefined,
          description: item.description || undefined,
        })),
    }),
    buildSchema('breadcrumb', [
      { name: 'Home', url: homeUrl },
      { name: t('title') || 'Use cases', url: pageUrl },
    ]),
  ];

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
      <JsonLd schema={ldSchemas} />
      <main>
        <div className={styles.casePageContainer}>
          <div
            className={clsx(pageClasses.homeContainer, styles.contentContainer)}
          >
            <section className={styles.headerSection}>
              <h1>{t('title')}</h1>
              <p className={styles.desc}>{t('desc')}</p>
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
              <LocalizedAnchor
                href={SHARE_YOUR_STORY_URL}
                className={styles.linkBtn}
                target="_blank"
                rel="noopener"
              >
                {t('shareSection.cta')}
                <RightArrow />
              </LocalizedAnchor>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
