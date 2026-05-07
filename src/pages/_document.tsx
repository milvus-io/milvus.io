import { Html, Head, Main, NextScript } from 'next/document';
import { resources } from '@/i18n/server';

const FONT_STYLESHEET_HREFS = [
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Geist%20Mono:wght@400;500;600;700&display=swap',
];

const FONT_STYLESHEET_HREFS = [
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Geist%20Mono:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap',
];

export default function Document(props) {
  const pageProps = props.__NEXT_DATA__.props.pageProps || {};
  const lang = pageProps.lang || pageProps.locale || 'en';
  const i18nResources = resources[lang] || resources.en;
  return (
    <Html lang={lang}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var hrefs=${JSON.stringify(
              FONT_STYLESHEET_HREFS
            )};function loadFonts(){hrefs.forEach(function(href){var link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);});}if('requestIdleCallback'in window){requestIdleCallback(loadFonts,{timeout:3000});}else{setTimeout(loadFonts,2000);}}();`,
          }}
        />
        <noscript>
          {FONT_STYLESHEET_HREFS.map(href => (
            <link key={`${href}-noscript`} href={href} rel="stylesheet" />
          ))}
        </noscript>
        {/* KaTeX CSS: non-render-blocking, only needed for pages with math formulas */}
        <link
          rel="stylesheet"
          href="https://assets.zilliz.com/katex/katex.min.css"
          media="print"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://assets.zilliz.com/katex/katex.min.css"
          />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__I18N_RESOURCES__=${JSON.stringify({
              [lang]: i18nResources,
            }).replace(/</g, '\\u003c')};`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
