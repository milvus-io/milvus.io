import CustomCookieConsent from '@/components/cookieConsent';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Head from 'next/head';
import Script from 'next/script';
import Error from './error';
import { HubspotProvider } from 'next-hubspot';
import { StoreProvider } from '@/hooks/use-store';

import '../i18n';
import '../styles/common.css';
import '../styles/docsStyle.less';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary
      errorComponent={({ error, reset }) => (
        <Error error={error} reset={reset} />
      )}
    >
      <StoreProvider>
        <HubspotProvider>
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
          <Component cl {...pageProps} />
          <Script
            dangerouslySetInnerHTML={{
              __html: `(function (w, d, s, l, i) {
                    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                    j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
                    w[l].push({event: 'consent_update'});
                })(window, document, 'script', 'dataLayer', 'GTM-5WPVTGSN');`,
            }}
            id="google-tag-manager"
            defer
          />
          <CustomCookieConsent />
        </HubspotProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
