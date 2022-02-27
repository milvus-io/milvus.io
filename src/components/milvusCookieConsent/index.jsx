// import '../styles/components/milvusCookieConsent.scss'
import React from "react";
import CookieConsent from "react-cookie-consent";
import "./index.module.less";


const MilvusCookieConsent = () => {
    return (
        <section className="milvus-Cookie-Consent">
            <CookieConsent
                location="bottom"
                buttonText="Accept"
                enableDeclineButton
                declineButtonText="Decline"
                containerClasses="CookieConsent"
                contentClasses="content"
                buttonWrapperClasses="button-wrapper"
                cookieName="gatsby-gdpr-google-analytics"
                buttonClasses="accept-button"
                declineButtonClasses="decline-button"
                expires={150}
            >
                <p>
                    This website stores cookies on your computer. These cookies are used
                    to collect information about how you interact with our website and
                    allow us to remember you. We use this information in order to improve
                    and customize your browsing experience and for analytics and metrics
                    about our visitors both on this website and other media. To find out
                    more about the cookies we use, see our Cookie Policy.
                </p>
                <p>
                    If you decline, your information won’t be tracked when you visit this
                    website. In this case, a single cookie will be used in your browser to
                    remember your preference.
                </p>
            </CookieConsent>
        </section>
    )
}

export default MilvusCookieConsent;
