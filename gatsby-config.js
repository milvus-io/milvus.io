let gatsbyConfigs = {
  siteMetadata: {
    siteUrl: `https://www.milvus.io`,
    title: ` · An Open Source Similarity Search Engine for Embeddings`,
    description: `Milvus is an open source similarity search engine for embeddings, it is powered by Faiss, NMSLIB and Annoy, it is easy-to-use, highly reliable, scalable, robust, and blazing fast.`,
    author: `@ZILLIZ.com`,
  },
  plugins: [
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    // i18n plugin
    'gatsby-transformer-json',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/i18n/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogs`,
        path: `${__dirname}/src/pages/blogs/versions`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 650,
              wrapperStyle:
                'display:inline-block; min-width: 22px;height: auto;width:100%;margin-top:32px',
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              offsetY: `100`,
              maintainCase: true,
              enableCustomId: true,
              isIconAfterHeader: true,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `blog`,
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`, `md`],
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        // background_color: `#663399`,
        // theme_color: `#329ef7`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-zopfli',
    },
  ],
};

// ignore some versions will make building faster in dev.
if (process.env.NODE_ENV == 'development') {
  gatsbyConfigs.plugins.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `docs`,
      path: `${__dirname}/src/pages/docs/versions`,
      ignore: [
        `**/v0.6.0/*`,
        `**/v0.7.0/*`,
        `**/v0.7.1/*`,
        `**/v0.8.0/*`,
        `**/v0.8.1/*`,
        `**/v0.9.0/*`,
        `**/v0.9.1/*`,
        `**/v0.10.0/*`,
        `**/v0.10.1/*`,
        `**/v0.10.2/*`,
        `**/v0.10.3/*`,
        `**/v0.10.4/*`,
        `**/v0.10.5/*`,
        `**/v0.10.6/*`,
        // `**/v0.11.0/*`,
      ],
    },
  });
} else {
  gatsbyConfigs.plugins.push(
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/src/pages/docs/versions`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-MXCV5ZM',

        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,

        // Defaults to null
        defaultDataLayer: { platform: 'gatsby' },
        // Specify optional GTM environment details.
        dataLayerName: 'gatsby',
      },
    },
    {
      resolve: '@sentry/gatsby',
      options: {
        dsn:
          'https://36e69bc11fe746ea937f02ebce9cecf6@o474539.ingest.sentry.io/5756477',
        sampleRate: 0.7,
      },
    }
  );
}

module.exports = gatsbyConfigs;
