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
          {ENABLE_ANALYTICS && (
            <Script
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','pt39h');`,
              }}
              id="x-conversion-tracking"
            />
          )}
          {ENABLE_ANALYTICS && (
            <Script
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_jneinvigvgpa",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_jneinvigvgpa');rdt('track', 'PageVisit');`,
              }}
              id="reddit-pixel"
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
