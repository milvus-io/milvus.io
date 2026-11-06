import LazyCookieConsent from '@/components/cookieConsent/LazyCookieConsent';
import InkeepChatButtonContainer from '@/components/inkeep/InkeepChatButton';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Head from 'next/head';
import Script from 'next/script';
import Error from './error';
import { StoreProvider } from '@/hooks/use-store';
import { useCloudLinkTracking } from '@/hooks/use-cloud-link-tracking';

import '../i18n/client';
import '../styles/variables.css';
import '../styles/media.css';
import '../styles/fonts.css';
import '../styles/common.css';
import '../styles/docsStyle.css';
import 'katex/dist/katex.min.css';

const ENABLE_ANALYTICS = process.env.NODE_ENV === 'production';

function MyApp({ Component, pageProps }) {
  useCloudLinkTracking();

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
            {/* key allows page-level Head tags to override these defaults */}
            <meta
              name="image"
              property="og:image"
              content="https://assets.zilliz.com/meta_image_milvus_d6510e10e0.png"
              key="og-image"
            />
            <meta name="baidu-site-verification" content="codeva-bAvzh4ipX4" />
            <meta property="og:type" content="WebSite" key="og-type" />
            <meta
              name="keywords"
              content="milvus, vector database, milvus docs, milvus blogs"
            />
          </Head>
          <Component {...pageProps} />
          {ENABLE_ANALYTICS && (
            <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function (w, d, s, l, i) {
                    if (!/^(www\\.)?milvus\\.io$/.test(w.location.hostname)) return;
                    function loadGtm() {
                      w[l] = w[l] || [];
                      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                      j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
                      w[l].push({event: 'consent_update'});
                    }
                    loadGtm();
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
