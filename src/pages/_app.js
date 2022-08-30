import '../styles/global.css';
// css entry, all site's styles are loaded from this file
import '../styles/index.less';
import '../styles/banner.less';
import '../i18n';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
