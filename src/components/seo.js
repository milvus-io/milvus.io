/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';

import Head from 'next/head';

function SEO({
  description,
  lang,
  meta,
  title,
  titleTemplate = '',
  version,
  link,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
}

export default SEO;
