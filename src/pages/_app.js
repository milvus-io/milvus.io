import '../styles/global.css';
// css entry, all site's styles are loaded from this file
import '../styles/index.less';
import '../i18n';
import 'highlight.js/styles/stackoverflow-light.css';
import '@docsearch/css';
import 'instantsearch.css/themes/reset.css';
import '../styles/fonts.css';

import Head from 'next/head';

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
    </>
  );
}

export default MyApp;
