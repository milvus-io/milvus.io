import React from 'react';
import PropTypes from 'prop-types';
import FontUrl1 from '../static/fonts/Brinnan-Bold.woff2';
import FontUrl2 from '../static/fonts/Inter-Bold.woff2';
import FontUrl3 from '../static/fonts/Inter-SemiBold.woff2';
import FontUrl4 from '../static/fonts/Inter-Medium.woff2';
import FontUrl5 from '../static/fonts/Inter-Regular.woff2';
import FontUrl6 from '../static/fonts/Brinnan-Bold.woff2';

const fonts = {
  'SourceCodePro-Regular': FontUrl1,
  'Inter-Bold': FontUrl2,
  'Inter-SemiBold': FontUrl3,
  'Inter-Medium': FontUrl4,
  'Inter-Regular': FontUrl5,
  'Brinnan-Bold': FontUrl6,
};
const generatePreloadLink = () => (
  <>
    {Object.keys(fonts).map(fontName => (
      <link
        key={`${fontName}-link`}
        rel="preload"
        href={fonts[fontName]}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    ))}
  </>
);

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        ></link>
        {generatePreloadLink()}
        {/* <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC&family=Roboto&family=Source+Code+Pro&display=swap" rel="stylesheet" /> */}
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        <script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>

        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
