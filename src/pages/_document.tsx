import { Html, Head, Main, NextScript } from 'next/document';

const fontUrls = [
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Geist%20Mono:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap',
];

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
        {/* Font loading: preload stylesheets to start downloading immediately,
            then load them non-render-blocking via media="print" + onload swap.
            display=swap in the URL ensures text is visible with fallback fonts. */}
        {fontUrls.map(url => (
          <link key={url} rel="preload" as="style" href={url} />
        ))}
        {fontUrls.map(url => (
          <link
            key={url}
            href={url}
            rel="stylesheet"
            media="print"
            // @ts-expect-error onLoad string is valid HTML but not typed in React
            onLoad="this.media='all'"
          />
        ))}
        <noscript>
          {fontUrls.map(url => (
            <link key={url} href={url} rel="stylesheet" />
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
