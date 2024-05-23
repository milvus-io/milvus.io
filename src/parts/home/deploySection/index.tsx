import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { RightWholeArrow } from '@/components/icons';
import CustomLink from '@/components/customLink';
import { CLOUD_SIGNUP_LINK } from '@/consts';

export default function DeploySection() {
  const { t } = useTranslation('home');

  const milvusLiteFeatures: string[] = t('deploySection.lite.features', {
    returnObjects: true,
  });
  const milvusFeatures: string[] = t('deploySection.milvus.features', {
    returnObjects: true,
  });
  const zillzCloudFeatures: string[] = t('deploySection.cloud.features', {
    returnObjects: true,
  });

  return (
    <section className={clsx(pageClasses.homeContainer, classes.deploySection)}>
      <h2 className={classes.title}>{t('deploySection.title')}</h2>

      <div className={classes.dbsWrapper}>
        <div className={classes.milvusDbs}>
          <div className={clsx(classes.commonMilvusDb)}>
            <h3 className={clsx(classes.dbName, classes.liteTitle)}>
              {t('deploySection.lite.title')}
            </h3>
            <div className={classes.dbContent}>
              <p className={classes.dbAdvantage}>
                {t('deploySection.lite.advantage')}
              </p>
              <ul className={classes.dbFeatures}>
                {milvusLiteFeatures.map(v => (
                  <li className="" key={v}>
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            <CustomLink
              href=""
              classes={{
                root: classes.linkButton,
              }}
              variant="text"
              endIcon={<RightWholeArrow />}
            >
              {t('buttons.getStarted')}
            </CustomLink>
          </div>
          <div className={clsx(classes.commonMilvusDb)}>
            <h3 className={clsx(classes.dbName, classes.milvusTitle)}>
              {t('deploySection.milvus.title')}
            </h3>

            <div className={classes.dbContent}>
              <p className={classes.dbAdvantage}>
                {t('deploySection.milvus.advantage')}
              </p>
              <ul className={classes.dbFeatures}>
                {milvusFeatures.map(v => (
                  <li className="" key={v}>
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            <CustomLink
              href=""
              classes={{
                root: classes.linkButton,
              }}
              variant="text"
              endIcon={<RightWholeArrow />}
            >
              {t('buttons.learnMore')}
            </CustomLink>
          </div>
        </div>
        <div className={clsx(classes.cloud, classes.commonMilvusDb)}>
          <h3 className={classes.dbName}>{t('deploySection.cloud.title')}</h3>

          <div className={classes.dbContent}>
            <p className={classes.dbAdvantage}>
              {t('deploySection.cloud.advantage')}
            </p>
            <ul className={classes.dbFeatures}>
              {zillzCloudFeatures.map(v => (
                <li className="" key={v}>
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <CustomLink
            href={CLOUD_SIGNUP_LINK}
            variant="text"
            classes={{
              root: classes.linkButton,
            }}
            endIcon={<RightWholeArrow />}
          >
            {t('buttons.tryFree')}
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
