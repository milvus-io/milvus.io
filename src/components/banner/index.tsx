import { CLOUD_SIGNUP_LINK } from '@/consts';
import classes from './index.module.less';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import useUtmTrackPath from '@/hooks/use-utm-track-path';
import Link from 'next/link';

export default function CloudBanner() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });
  const trackPath = useUtmTrackPath();

  return (
    <Link
      className={classes.bannerContainer}
      href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=top_banner&utm_content=${trackPath}`}
    >
      <p className={classes.bannerText}>{t('banner')}</p>
      <button className={classes.bannerButton}>{t('bannerButton')}</button>
    </Link>
  );
}
