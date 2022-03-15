import React from "react";
import CookieConsent from "react-cookie-consent";
import * as styles from "./milvusCookieConsent.module.less";
import { useLocation } from "@reach/router";
import { initializeAndTrack } from "gatsby-plugin-gdpr-cookies";

function isBrowser() {
  return typeof window !== "undefined";
}

function getValue(key, defaultValue) {
  return isBrowser() && window.localStorage.getItem(key)
    ? JSON.parse(window.localStorage.getItem(key))
    : defaultValue;
}

function setValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function useStickyState(defaultValue, key) {
  const [value, setter] = React.useState(() => {
    return getValue(key, defaultValue);
  });

  React.useEffect(() => {
    setValue(key, value);
  }, [key, value]);

  return [value, setter];
}

const MilvusCookieConsent = () => {
  const location = useLocation();
  if (isBrowser()) {
    initializeAndTrack(location);
  }

  const [bannerHidden, setBannerHidden] = useStickyState(
    false,
    "consentCookieHidden"
  );

  const EnableAnalytics = () => {
    document.cookie = "gatsby-gdpr-google-analytics=true";
    setBannerHidden(true);
  };

  return (
    <>
      {!bannerHidden && (
        <CookieConsent
          buttonText="Accept"
          disableStyles
          containerClasses={styles.cookieContainer}
          buttonClasses={styles.button}
          buttonWrapperClasses={styles.buttonWrapper}
          expires={150}
          onAccept={() => {
            // alert("consent accepted");
            EnableAnalytics();
          }}
        >
          <div className={styles.textContainer}>
            <p className={styles.headerContent}>How we use cookies</p>
            <p className={styles.textContent}>
              By continuing to browse or by clicking ‘Accept’, you agree to the
              storing of cookies on your device to enhance your site experience
              and for analytical purposes. To learn more about how we use the
              cookies, please see our cookies policy.
            </p>
          </div>
        </CookieConsent>
      )}
    </>
  );
};

export default MilvusCookieConsent;
