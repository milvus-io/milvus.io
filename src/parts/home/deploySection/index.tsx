import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { RightWholeArrow } from '@/components/icons';
import CustomButton from '@/components/customButton';
import { CLOUD_SIGNUP_LINK } from '@/consts';
import Link from 'next/link';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export default function DeploySection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });

  const milvusTypes = [
    {
      title: t('deploySection.lite.title'),
      advantage: t('deploySection.lite.advantage'),
      features: t('deploySection.lite.features', {
        returnObjects: true,
      }) as string[],
      class: classes.liteDb,
      learnMoreLink: '/docs/milvus_lite.md',
      startLink: '/docs/install-overview.md#Milvus-Lite',
    },
    {
      title: t('deploySection.milvusStandalone.title'),
      advantage: t('deploySection.milvusStandalone.advantage'),
      features: t('deploySection.milvusStandalone.features', {
        returnObjects: true,
      }) as string[],
      class: classes.standaloneDb,
      learnMoreLink: '/docs/prerequisite-docker.md',
      startLink: '/docs/install-overview.md#Milvus-Standalone',
    },
    {
      title: t('deploySection.milvusDistributed.title'),
      advantage: t('deploySection.milvusDistributed.advantage'),
      features: t('deploySection.milvusDistributed.features', {
        returnObjects: true,
      }) as string[],
      class: classes.contributedDb,
      learnMoreLink: '/docs/prerequisite-helm.md',
      startLink: '/docs/install-overview.md#Milvus-Distributed',
    },
  ];

  const cloudConfig = {
    title: t('deploySection.cloud.title'),
    advantage: t('deploySection.cloud.advantage'),
    features: t('deploySection.cloud.features', {
      returnObjects: true,
    }) as string[],
    class: classes.cloudDb,
    cta: t('buttons.tryFree'),
    tryLink: `${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_try_free&utm_content=homepage`,
  };

  return (
    <section className={clsx(pageClasses.homeContainer, classes.deploySection)}>
      <h2 className={classes.title}>{t('deploySection.title')}</h2>

      <ul className={classes.dbsWrapper}>
        {milvusTypes.map(type => (
          <li
            key={type.title}
            className={clsx(classes.commonMilvusDb, type.class)}
          >
            <div>
              <h3 className={clsx(classes.dbName)}>{type.title}</h3>
              <div className={classes.dbContent}>
                <p className={classes.dbAdvantage}>{type.advantage}</p>
                <ol className={classes.dbFeatures}>
                  {type.features.map((v: string) => (
                    <li className="" key={v}>
                      {v}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className={classes.buttonsWrapper}>
              <CustomButton
                href={type.learnMoreLink}
                variant="outlined"
                classes={{
                  root: classes.startLinkButton,
                }}
              >
                {t('buttons.getStarted')}
              </CustomButton>

              <CustomButton
                href={type.startLink}
                variant="text"
                classes={{
                  root: classes.linkButton,
                }}
                endIcon={<RightWholeArrow />}
              >
                {t('buttons.learnMore')}
              </CustomButton>
            </div>
          </li>
        ))}
        <li
          key={cloudConfig.title}
          className={clsx(classes.zillizCloud, cloudConfig.class)}
        >
          <div className="">
            <h3 className={clsx(classes.dbName)}>
              <a href="https://zilliz.com/cloud/">{cloudConfig.title}</a>
            </h3>
            <div className={classes.dbContent}>
              <p className={classes.dbAdvantage}>{cloudConfig.advantage}</p>
              <ol className={classes.dbFeatures}>
                {cloudConfig.features.map((v: string) => (
                  <li className="" key={v}>
                    {v}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <CustomButton
            href={cloudConfig.tryLink}
            classes={{
              root: classes.containedLinkButton,
              icon: classes.linkButtonIcon,
            }}
            endIcon={<RightWholeArrow />}
          >
            {cloudConfig.cta}
          </CustomButton>
        </li>
      </ul>
      <p className={classes.learnMore}>
        <Trans
          t={t}
          i18nKey="deploySection.deployModels"
          components={[
            <Link key="doc-link" href="/docs/install-overview.md"></Link>,
          ]}
        />
      </p>
    </section>
  );
}
