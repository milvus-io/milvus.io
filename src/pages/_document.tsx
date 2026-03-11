import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(props) {
  const lang = props.__NEXT_DATA__.props.pageProps.lang || 'en';
  return (
    <Html lang={lang}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Non-render-blocking font loading: media="print" causes the browser
            to download stylesheets without blocking paint. The inline script
            flips them to media="all" after first paint. display=swap in the
            URLs ensures text remains visible with fallback fonts. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          media="print"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist%20Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          media="print"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap"
          rel="stylesheet"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `requestAnimationFrame(function(){document.querySelectorAll('link[rel="stylesheet"][media="print"]').forEach(function(l){l.media="all"})})`,
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist%20Mono:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://assets.zilliz.com/katex/katex.min.css"
          />
        </noscript>
        {/* KaTeX CSS: non-render-blocking, only needed for pages with math formulas */}
        <link
          rel="stylesheet"
          href="https://assets.zilliz.com/katex/katex.min.css"
          media="print"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
