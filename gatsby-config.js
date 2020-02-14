module.exports = {
  siteMetadata: {
    siteUrl: `https://www.milvus.io`,
    title: `Milvus · An Open Source Vector Similarity Search Engine - 开源向量相似度搜索引擎`,
    description: `An Open Source Vector Similarity Search Engine, 开源向量相似度搜索引擎`,
    author: `@ZILLIZ.com`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    // i18n plugin
    "gatsby-transformer-json",
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
        name: `docs`,
        path: `${__dirname}/src/pages/docs/versions`,
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
              maxWidth: 800,
              wrapperStyle: "display:inline-block; min-width: 22px;width:100%;",
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              maintainCase: true,
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
      resolve: 'gatsby-plugin-zopfli'
    },
    // add Google Analytics gtag.js to a site
    // however this doesn't work, switch to add it in /src/html.js
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        // your google analytics tracking id
        trackingId: `UA-142992812-1`,
        // Puts tracking script in the head instead of the body
        head: true,
        // enable ip anonymization
        anonymize: true,
      },
    },
  ],
}
