import '../styles/common.css';
import '../styles/docsStyle.less';
import '../i18n';
import 'highlight.js/styles/stackoverflow-light.css';
import '@docsearch/css';
import 'instantsearch.css/themes/reset.css';
import Script from 'next/script';
import Head from 'next/head';
import CustomCookieConsent from '@/components/cookieConsent';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-32x32.png" />
        <meta
          name="image"
          property="og:image"
          content="https://assets.zilliz.com/meta_image_milvus_d6510e10e0.png"
        />
        <meta property="og:type" content="WebSite" />
      </Head>
      <Component {...pageProps} />
      <Script
        dangerouslySetInnerHTML={{
          __html: `(function (w, d, s, l, i) {
                    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                    j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
                })(window, document, 'script', 'dataLayer', 'G-V1G3KQ048M');`,
        }}
        id="google-tag-manager"
        defer
      />
      <Script
        src="https://tag.clearbitscripts.com/v1/pk_9b83069276f2350591e46955085ee5a8/tags.js"
        referrerPolicy="strict-origin-when-cross-origin"
        defer
      ></Script>
      <Script
        src="//js.hsforms.net/forms/embed/v2.js"
        type="text/javascript"
        charSet="utf-8"
        defer
      ></Script>
      <CustomCookieConsent />
    </>
  );
}

export default MyApp;
