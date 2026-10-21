import CookieConsent from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import classes from './index.module.css';
import clsx from 'clsx';
import { useRouter } from 'next/router';

export default function CustomCookieConsent() {
  const { t } = useTranslation('common');
  const isReferenceDetail = useRouter().pathname === '/ai-quick-reference/[id]';

  return (
    <CookieConsent
      hideOnAccept
      buttonText={t('cookie.accept')}
      declineButtonText={t('cookie.reject')}
      ariaAcceptLabel={t('cookie.accept')}
      ariaDeclineLabel={t('cookie.reject')}
      enableDeclineButton
      containerClasses={clsx(classes.consentContainer, {
        [classes.referenceConsent]: isReferenceDetail,
      })}
      contentClasses={classes.contentWrapper}
      buttonWrapperClasses={classes.buttonsWrapper}
      buttonClasses={classes.acceptButton}
      declineButtonClasses={classes.declineButton}
    >
      <div className={isReferenceDetail ? classes.fullNotice : undefined}>
        <p className="font-[600]">{t('cookie.title')}</p>
        <p>{t('cookie.consent')}</p>
      </div>
      {isReferenceDetail && (
        <details className={classes.mobileNotice}>
          <summary>{t('cookie.title')}</summary>
          <p>{t('cookie.consent')}</p>
        </details>
      )}
    </CookieConsent>
  );
}
