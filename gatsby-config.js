const gatsbyConfigs = {
  siteMetadata: {
    siteUrl: `https://milvus.io`,
    title: `· Open Source Vector Database built for scalable similarity search`,
    description: `Milvus is the world's most advanced open-source vector database, built for developing and maintaining AI applications. Powered by Faiss, NMSLIB, and Annoy, the platform supports real-time vector similarity search on massive, trillion-scale datasets.`,
    author: `@ZILLIZ.com`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://milvus.io",
        sitemap: "https://milvus.io/sitemap-index.xml",
        policy: [
          {
            userAgent: "*",
            allow: "/",
            disallow: [
              "/cn/404",
              "/cn/blogs/",
              "/docs/Changelog",
              "/docs/v0*.md$",
              "/gui",
              "/tools/sizing",
            ],
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    "gatsby-plugin-less",
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: ({ node }) => {
          switch (node.sourceInstanceName) {
            case "blogs":
              if (node.relativePath.includes("menuStructure")) {
                return `menu`;
              }
              break;
            case "docs":
              if (
                node.relativePath.includes("versionInfo") ||
                node.relativePath.includes("version")
              ) {
                return `version`;
              }
              if (node.relativePath.includes("home")) {
                return `docHome`;
              }
              if (node.relativePath.includes("menuStructure")) {
                return `menu`;
              }
              if (node.relativePath.includes("community")) {
                return `community`;
              }
              if (node.relativePath.includes("bootcamp")) {
                return `bootcamp`;
              }
              if (node.relativePath.includes("users")) {
                return `users`;
              }
              return `json`;
            default:
              return `json`;
          }
        },
        ignore: [`${__dirname}/src/i18n/*`],
      },
    },
    // i18n json data
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `i18n`,
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
              showCaptions: ["title"],
              quality: 100,
              backgroundColor: "transparent",
              maxWidth: 1000,
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "noreferrer",
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              offsetY: `100`,
              maintainCase: true,
              enableCustomId: true,
              isIconAfterHeader: true,
              className: "icon-wrapper",
              icon: `<svg aria-hidden="true" focusable="false" height="20" version="1.1" viewBox="0 0 16 16" width="16"><path fill="#0093c6" fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
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
    {
      resolve: `gatsby-plugin-sharp`,
    },
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
    `gatsby-plugin-remove-fingerprints`,
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `i18n`,
        languages: [`en`, `cn`],
        defaultLanguage: `en`,
        // if you are using Helmet, you must include siteUrl, and make sure you add http:https
        siteUrl: `https://milvus.io/`,
        // you can pass any i18next options
        i18nextOptions: {
          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
          // keySeparator: false,
          nsSeparator: false,
          defaultNS: "milvus",
          ns: ["milvus"],
        },
        redirect: false,
        // pages: [
        //   {
        //     matchPath: '/docs',
        //     languages: ['en']
        //   }
        // ]
        pages: [
          // {
          //   matchPath: '/:lang?/blog/:uid',
          //   getLanguageFromPath: true,
          //   excludeLanguages: ['es']
          // },
          // {
          //   matchPath: "/",
          //   // getLanguageFromPath: true,
          //   languages: ["en", "cn"],
          // },
          {
            matchPath: "/:lang?/(docs|blog|api-reference|community)(.*)",
            getLanguageFromPath: true,
            excludeLanguages: ["cn"],
            // languages: ["en", "cn"],
          },
        ],
      },
    },
  ],
};

// ignore some versions will make building faster in dev.
if (process.env.NODE_ENV == "development") {
  gatsbyConfigs.plugins.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `docs`,
      path: `${__dirname}/src/pages/docs/versions`,
      ignore: [
        `**/v0.6*`,
        `**/v0.7*`,
        `**/v0.8*`,
        `**/v0.9*`,
        `**/v0.1*`,
        `**/v0.2.0`,
      ],
    },
  });
} else {
  gatsbyConfigs.plugins.push(
    // {
    //   resolve: "gatsby-plugin-google-analytics",
    //   options: {
    //     trackingId: "UA-142992812-1",
    //   },
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/src/pages/docs/versions`,
        ignore: [`**/v0.6*`, `**/v0.7*`, `**/v0.8*`, `**/v0.9*`, `**/v0.1*`],
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-MXCV5ZM",

        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,

        // Defaults to null
        defaultDataLayer: { platform: "gatsby" },
        // Specify optional GTM environment details.
        dataLayerName: "gatsby",
      },
    },
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: "https://36e69bc11fe746ea937f02ebce9cecf6@o474539.ingest.sentry.io/5756477",
        sampleRate: 0.7,
      },
    },
    {
      resolve: "gatsby-plugin-zopfli",
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/",
        query: `{
          allSitePage {
            nodes {
              path
            }
          }
          allSite {
            edges {
              node {
                siteMetadata {
                  siteUrl
                }
              }
            }
          }
          allVersion {
            nodes {
              released
              version
            }
          }
        }`,
        resolveSiteUrl: ({ allSite }) => {
          return allSite.edges[0].node.siteMetadata.siteUrl;
        },
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allVersion: { nodes: versions },
        }) => {
          const res = allPages.reduce((acc, cur) => {
            // filter out docs with version info with released value is no
            const path = cur.path;
            if (versions.every(ver => path.indexOf(ver.version) === -1)) {
              if (path.endsWith("/") && path.length > 1) {
                cur.path = path.slice(0, path.length - 1);
              }
              acc.push(cur);
            }
            return acc;
          }, []);
          return res;
        },
      },
    }
  );
}

module.exports = gatsbyConfigs;
