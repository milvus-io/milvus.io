import CookieConsent from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import classes from './index.module.less';

export default function CustomCookieConsent() {
  const { t } = useTranslation('common');

  return (
    <CookieConsent
      hideOnAccept
      buttonText={t('cookie.accept')}
      declineButtonText={t('cookie.reject')}
      enableDeclineButton
      containerClasses={classes.consentContainer}
      contentClasses={classes.contentWrapper}
      buttonWrapperClasses={classes.buttonsWrapper}
      buttonClasses={classes.acceptButton}
      declineButtonClasses={classes.declineButton}
    >
      <h3 className="">{t('cookie.title')}</h3>
      <p className="">{t('cookie.consent')}</p>
    </CookieConsent>
  );
}
