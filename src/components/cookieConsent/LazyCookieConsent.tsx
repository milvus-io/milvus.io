import { ComponentType, useEffect, useState } from 'react';

const COOKIE_CONSENT_NAME = 'CookieConsent';

export default function LazyCookieConsent() {
  const [ConsentComponent, setConsentComponent] =
    useState<ComponentType | null>(null);

  useEffect(() => {
    if (document.cookie.includes(`${COOKIE_CONSENT_NAME}=`)) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      import('./index')
        .then(mod => {
          setConsentComponent(() => mod.default);
        })
        .catch(error => console.error('Failed to load cookie consent:', error));
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return ConsentComponent ? <ConsentComponent /> : null;
}
