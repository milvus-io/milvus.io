import { Html, Head, Main, NextScript } from 'next/document';
import { resources } from '@/i18n/server';

export default function Document(props) {
  const pageProps = props.__NEXT_DATA__.props.pageProps || {};
  const lang = pageProps.lang || pageProps.locale || 'en';
  const i18nResources = resources[lang] || resources.en;
  return (
    <Html lang={lang}>
      <Head>
        <link
          rel="preload"
          href="/fonts/geist/geist-v5-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/geist/geist-mono-v5-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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
