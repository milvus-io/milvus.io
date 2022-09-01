import '../styles/global.css';
// css entry, all site's styles are loaded from this file
import '../styles/index.less';
import '../styles/banner.less';
import '../i18n';
import 'highlight.js/styles/stackoverflow-light.css';
import '@zilliz/zui/dist/core/ZChart2/ZChart2.css';
import '@docsearch/css';
import 'instantsearch.css/themes/reset.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
