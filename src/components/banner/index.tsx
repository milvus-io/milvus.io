import { CLOUD_SIGNUP_LINK } from '@/consts';
import classes from './index.module.less';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export default function CloudBanner() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });

  return (
    <div className={classes.bannerContainer}>
      <p className={classes.bannerText}>
        <Trans
          t={t}
          i18nKey="banner"
          components={[
            <a
              href={`${CLOUD_SIGNUP_LINK}?utm_source=partner&utm_medium=referral&utm_campaign=2024_12_23_top_banner_milvusio`}
              key="zilliz-cloud"
            ></a>,
          ]}
        />
      </p>
    </div>
  );
}
