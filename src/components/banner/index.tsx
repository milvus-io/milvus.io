import { CLOUD_SIGNUP_LINK } from '@/consts';
import classes from './index.module.less';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import useUtmTrackPath from '@/hooks/use-utm-track-path';

export default function CloudBanner() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });
  const trackPath = useUtmTrackPath();

  return (
    <div className={classes.bannerContainer}>
      <p className={classes.bannerText}>
        <Trans
          t={t}
          i18nKey="banner"
          components={[
            <a
              href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=top_banner&utm_content=${trackPath}`}
              key="zilliz-cloud"
            ></a>,
          ]}
        />
      </p>
    </div>
  );
}
