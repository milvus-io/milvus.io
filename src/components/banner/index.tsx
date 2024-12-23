import { CLOUD_SIGNUP_LINK } from '@/consts';
import classes from './index.module.less';
import { useTranslation, Trans } from 'react-i18next';

export default function CloudBanner() {
  const { t } = useTranslation('home');

  return (
    <div className={classes.bannerContainer}>
      <p className={classes.bannerText}>
        <Trans
          t={t}
          i18nKey="banner"
          components={[<a href={CLOUD_SIGNUP_LINK} key="zilliz-cloud"></a>]}
        />
      </p>
    </div>
  );
}
