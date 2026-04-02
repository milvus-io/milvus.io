import CookieConsent from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import classes from './index.module.css';

export default function CustomCookieConsent() {
  const { t } = useTranslation('common');

  return (
    <CookieConsent
      hideOnAccept
      buttonText={t('cookie.accept')}
      declineButtonText={t('cookie.reject')}
      ariaAcceptLabel={t('cookie.accept')}
      ariaDeclineLabel={t('cookie.reject')}
      enableDeclineButton
      containerClasses={classes.consentContainer}
      contentClasses={classes.contentWrapper}
      buttonWrapperClasses={classes.buttonsWrapper}
      buttonClasses={classes.acceptButton}
      declineButtonClasses={classes.declineButton}
    >
      <p className="font-[600]">{t('cookie.title')}</p>
      <p className="">{t('cookie.consent')}</p>
    </CookieConsent>
  );
}
