import LazyCookieConsent from '@/components/cookieConsent/LazyCookieConsent';
import InkeepChatButtonContainer from '@/components/inkeep/InkeepChatButton';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Head from 'next/head';
import Script from 'next/script';
import Error from './error';
import { StoreProvider } from '@/hooks/use-store';

import '../i18n/client';
import '../styles/variables.css';
import '../styles/media.css';
import '../styles/fonts.css';
import '../styles/common.css';
import '../styles/docsStyle.css';

const ENABLE_ANALYTICS = process.env.NODE_ENV === 'production';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary
      errorComponent={({ error, reset }) => (
        <Error error={error} reset={reset} />
      )}
    >
      <StoreProvider>
        <>
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <meta
              name="image"
              property="og:image"
              content="https://assets.zilliz.com/meta_image_milvus_d6510e10e0.png"
            />
            <meta name="baidu-site-verification" content="codeva-bAvzh4ipX4" />
            <meta property="og:type" content="WebSite" />
            <meta
              name="keywords"
              content="milvus, vector database, milvus docs, milvus blogs"
            />
          </Head>
          <Component {...pageProps} />
          {ENABLE_ANALYTICS && (
            <Script
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `(function (w, d, s, l, i) {
                    function loadGtm() {
                      w[l] = w[l] || [];
                      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                      j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
                      w[l].push({event: 'consent_update'});
                    }
                    if ('requestIdleCallback' in w) {
                      requestIdleCallback(function () { setTimeout(loadGtm, 3000); }, { timeout: 5000 });
                    } else {
                      setTimeout(loadGtm, 5000);
                    }
                })(window, document, 'script', 'dataLayer', 'GTM-5WPVTGSN');`,
              }}
              id="google-tag-manager"
            />
          )}
          <InkeepChatButtonContainer />
          <LazyCookieConsent />
        </>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
