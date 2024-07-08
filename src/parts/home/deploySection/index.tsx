import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { RightWholeArrow } from '@/components/icons';
import CustomButton from '@/components/customButton';
import { CLOUD_SIGNUP_LINK } from '@/consts';
import Link from 'next/link';

export default function DeploySection() {
  const { t } = useTranslation('home');

  const milvusTypes = [
    {
      title: t('deploySection.lite.title'),
      advantage: t('deploySection.lite.advantage'),
      features: t('deploySection.lite.features', {
        returnObjects: true,
      }),
      cta: t('buttons.getStarted'),
      class: classes.liteDb,
      href: '/docs/milvus_lite.md',
    },
    {
      title: t('deploySection.milvusStandalone.title'),
      advantage: t('deploySection.milvusStandalone.advantage'),
      features: t('deploySection.milvusStandalone.features', {
        returnObjects: true,
      }),
      class: classes.standaloneDb,
      cta: t('buttons.getStarted'),
      href: '/docs/prerequisite-docker.md',
    },
    {
      title: t('deploySection.milvusDistributed.title'),
      advantage: t('deploySection.milvusDistributed.advantage'),
      features: t('deploySection.milvusDistributed.features', {
        returnObjects: true,
      }),
      class: classes.contributedDb,
      cta: t('buttons.getStarted'),
      href: '/docs/prerequisite-helm.md',
    },
  ];

  const cloudConfig = {
    title: t('deploySection.cloud.title'),
    advantage: t('deploySection.cloud.advantage'),
    features: t('deploySection.cloud.features', {
      returnObjects: true,
    }),
    class: classes.cloudDb,
    cta: t('buttons.tryFree'),
    href: CLOUD_SIGNUP_LINK,
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

            <CustomButton
              href={type.href}
              variant="text"
              classes={{
                root: classes.linkButton,
              }}
              endIcon={<RightWholeArrow />}
            >
              {type.cta}
            </CustomButton>
          </li>
        ))}
        <li
          key={cloudConfig.title}
          className={clsx(classes.zillizCloud, cloudConfig.class)}
        >
          <div className="">
            <h3 className={clsx(classes.dbName)}>{cloudConfig.title}</h3>
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
            href={cloudConfig.href}
            variant="contained"
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
          i18nKey="deploySection.deployModes"
          components={[<Link key="doc-link" href="/docs/quickstart.md"></Link>]}
        />
      </p>
    </section>
  );
}
