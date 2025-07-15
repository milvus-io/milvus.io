import { CLOUD_SIGNUP_LINK } from '@/consts';
import classes from './index.module.less';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import useUtmTrackPath from '@/hooks/use-utm-track-path';

export default function CloudBanner() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });
  const trackPath = useUtmTrackPath();

  const handleRegister = (e: React.MouseEvent<HTMLButtonElement>) => {};

  return (
    <a
      className={classes.bannerContainer}
      href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=top_banner&utm_content=${trackPath}`}
      target="_blank"
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
