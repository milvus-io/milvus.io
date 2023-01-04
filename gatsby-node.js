const path = require('path');
const fs = require('fs');
const express = require('express');
const {
  query,
  generateAllMenus,
  filterMdWithVersion,
  filterHomeMdWithVersion,
} = require('./gatsbyUtils/createPages');
const {
  generateAllDocPages,
  generateDocHomeWidthMd,
  generateHomeData,
  getVersionsWithHome,
} = require('./gatsbyUtils/docs');
const {
  generateCommunityPages,
  handleCommunityData,
  generateCommunityHome,
} = require('./gatsbyUtils/community');
const {
  handleApiFiles,
  generateApiMenus,
  generateApiReferencePages,
} = require('./gatsbyUtils/api');
const {
  generateBlogArticlePage,
  filterMDwidthBlog,
} = require('./gatsbyUtils/blog');
const sourceNodesUtils = require('./gatsbyUtils/sourceNodes');
const {
  versionInfo,
  newestVersion,
  versions,
} = require('./gatsbyUtils/version');

exports.onCreateDevServer = ({ app }) => {
  app.use(express.static('public'));
};

// the version is same for different lang, so we only need one
const DOC_ROOT = 'src/pages/docs/versions';

// add versioninfo file for generate sitemap filter option
fs.writeFile(
  `${DOC_ROOT}/versionInfo.json`,
  JSON.stringify(Object.values(versionInfo), null, 2),
  err => {
    if (err) throw err;
  }
);

// create cunstom schema for frontmatter
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      id: String
      date: String
      tag: String
      title: String
      desc: String
      cover: String
      origin: String
      isPublish: Boolean
      author: String
      recommend: Boolean
      group: String
    }
  `;
  createTypes(typeDefs);
};

// APIReference page: generate source for api reference html
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  const { generateNodes } = sourceNodesUtils;

  const dirPath = `src/pages/docs/versions/master/API_Reference`;
  // read categories, such as pymilvus and pymilvus-orm
  const categories = fs.readdirSync(dirPath);
  const nodes = [];
  for (const category of categories) {
    const path = `${dirPath}/${category}`;
    const versions = fs.readdirSync(path);
    switch (category) {
      case 'pymilvus':
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: 'pymilvus',
          });
        }
        break;
      case 'milvus-sdk-go':
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: 'go',
          });
        }
        break;
      case 'milvus-sdk-java':
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: 'java',
          });
        }
        break;
      case 'milvus-sdk-node':
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: 'node',
          });
        }
        break;
      case 'milvus-sdk-restful':
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: 'restful',
          });
        }
        break;
      default:
        break;
    }
  }
  generateNodes(nodes, {
    createNodeId,
    createContentDigest,
    createNode,
    versionInfo,
  });
};

/* create pages dynamically from submodule data */
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  // templates
  const docTemplate = path.resolve(`src/templates/docTemplate.jsx`);
  const communityTemplate = path.resolve(`src/templates/communityTemplate.jsx`);
  const blogTemplate = path.resolve(`src/templates/blogTemplate.jsx`);
  const blogListTemplate = path.resolve(`src/templates/blogListTemplate.jsx`);
  const apiDocTemplate = path.resolve(`src/templates/apiDocTemplate.jsx`);

  return graphql(query).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    // prepare data
    // get all menuStructures
    const allMenus = generateAllMenus(result.data.allFile.edges);
    // get new doc index page data
    const homeData = generateHomeData(result.data.allFile.edges);
    // get api menus
    const allApiMenus = generateApiMenus(result.data.allApIfile.nodes);
    // get version with home
    const versionsWithHome = getVersionsWithHome(homeData);
    // filter useless md file blog has't version
    const docNodes = filterMdWithVersion(result.data.allMarkdownRemark.edges);
    const blogNodes = filterMDwidthBlog(result.data.allMarkdownRemark.edges);
    const homeNodes = filterHomeMdWithVersion(
      result.data.allMarkdownRemark.edges
    );

    // get community page data: articles md, menu and home json
    const { communityNodes, communityMenu, communityHome } =
      handleCommunityData(
        result.data.allMarkdownRemark.edges,
        result.data.allFile.edges
      );

    // generate pages
    generateCommunityPages(createPage, {
      nodes: communityNodes,
      template: communityTemplate,
      menu: communityMenu,
    });
    generateCommunityHome(createPage, {
      nodes: communityHome,
      template: communityTemplate,
      menu: communityMenu,
    });
    generateApiReferencePages(createPage, {
      nodes: result.data.allApIfile.nodes,
      template: apiDocTemplate,
      allMenus,
      allApiMenus,
      versions,
      newestVersion,
    });
    generateBlogArticlePage(createPage, {
      nodes: blogNodes,
      template: blogTemplate,
      listTemplate: blogListTemplate,
    });
    generateDocHomeWidthMd(createPage, {
      nodes: homeNodes,
      blogs: blogNodes,
      template: docTemplate,
      allMenus,
      allApiMenus,
      versions,
      newestVersion,
      versionInfo,
    });
    generateAllDocPages(createPage, {
      nodes: docNodes,
      template: docTemplate,
      newestVersion,
      versionsWithHome,
      versions,
      allMenus,
      allApiMenus,
      versionInfo,
    });
  });
};

exports.onCreateWebpackConfig = ({ actions, getConfig, stage }) => {
  const config = getConfig();
  const miniCssExtractPlugin = config.plugins.find(
    plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
  );
  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.ignoreOrder = true;
  }

  const cssMinimizerPlugin = config.optimization?.minimizer?.find(plugin => {
    return plugin.constructor.name === 'CssMinimizerPlugin';
  });
  if (cssMinimizerPlugin) {
    // const preset = cssMinimizerPlugin.options?.minimizerOptions?.preset;
    cssMinimizerPlugin.options.minimizerOptions = {
      //! Fix me if there is better config
      // refert to https://github.com/webpack-contrib/css-minimizer-webpack-plugin/blob/master/README.md
      // and https://cssnano.co/docs/optimisations/
      preset: require.resolve('cssnano-preset-lite'),
    };
  }

  actions.replaceWebpackConfig(config);

  if (stage === `build-javascript`) {
    actions.setWebpackConfig({
      optimization: {
        runtimeChunk: {
          name: `webpack-runtime`,
        },
        splitChunks: {
          name: false,
          cacheGroups: {
            styles: {
              name: `styles`,
              test: /\.(css|less)$/,
              chunks: `initial`,
              enforce: true,
            },
          },
        },
      },
    });
  }
};
