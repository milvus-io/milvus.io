import { CLOUD_SIGNUP_LINK } from '@/consts';
import classes from './index.module.css';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import useUtmTrackPath from '@/hooks/use-utm-track-path';

export default function CloudBanner() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });
  const trackPath = useUtmTrackPath();

  const utmContent = trackPath ? `&utm_content=${trackPath}` : '';

  return (
    <a
      className={classes.bannerContainer}
      href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_top_banner${utmContent}`}
      target="_blank"
      suppressHydrationWarning
    >
      <button className={classes.bannerText} role="link">
        {t('bannerText')}
      </button>
      <button className={classes.bannerButton} role="link">
        {t('bannerButton')}
      </button>
    </a>
  );
}
