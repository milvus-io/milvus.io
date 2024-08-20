import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(props) {
  const lang = props.head?.find(item => item.type === 'html')?.props?.lang ?? 'en';
  return (
    <Html lang={lang}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
