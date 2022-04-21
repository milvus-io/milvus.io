const path = require("path");
const fs = require("fs");
const ReadVersionJson = require("./walkFile");
const express = require("express");
const {
  query,
  generateAllMenus,
  filterMdWithVersion,
  filterHomeMdWithVersion,
} = require("./gatsbyUtils/createPages");
const {
  generateAllDocPages,
  generateDocHomeWidthMd,
  generateHomeData,
  getVersionsWithHome,
} = require("./gatsbyUtils/docs");
const {
  generateCommunityPages,
  handleCommunityData,
  generateCommunityHome,
} = require("./gatsbyUtils/community");
const {
  handleBootcampData,
  generateBootcampHome,
  generateBootcampPages,
} = require("./gatsbyUtils/bootcamp");
const {
  generateApiMenus,
  generateApiReferencePages,
} = require("./gatsbyUtils/api");
const {
  generateBlogArticlePage,
  filterMDwidthBlog,
} = require("./gatsbyUtils/blog");
const sourceNodesUtils = require("./gatsbyUtils/sourceNodes");

const env = process.env.IS_PREVIEW;
// const env = 'preview';
const getNewestVersion = versionInfo => {
  const keys = Object.keys(versionInfo).filter(
    v =>
      v !== "master" && (versionInfo[v].released === "yes" || env === "preview")
  );
  return keys.reduce((pre, cur) => {
    const curVersion = cur
      .substring(1)
      .split(".")
      .map(v => Number(v));
    const preVersion = pre
      .substring(1)
      .split(".")
      .map(v => Number(v));

    if (curVersion[0] !== preVersion[0]) {
      pre = curVersion[0] < preVersion[0] ? pre : cur;
    } else if (curVersion[1] !== preVersion[1]) {
      pre = curVersion[1] < preVersion[1] ? pre : cur;
    } else if (curVersion[2] !== preVersion[2]) {
      pre = curVersion[2] < preVersion[2] ? pre : cur;
    } else {
      pre = cur;
    }

    return pre;
  }, "v0.0.0");
};
exports.onCreateDevServer = ({ app }) => {
  app.use(express.static("public"));
};

// the version is same for different lang, so we only need one
const DOC_ROOT = "src/pages/docs/versions";
const versionInfo = ReadVersionJson(DOC_ROOT);
const newestVersion = getNewestVersion(versionInfo);
const versions = [];

versionInfo.preview = {
  ...versionInfo.preview,
  version: "preview",
  released: env === "preview" ? "yes" : "no",
};

Object.keys(versionInfo).forEach(v => {
  if (versionInfo[v].released === "yes") {
    versions.push(v);
  }
});

// add versioninfo file for generate sitemap filter option
fs.writeFile(
  `${DOC_ROOT}/versionInfo.json`,
  JSON.stringify(Object.values(versionInfo), null, 2),
  err => {
    if (err) throw err;
  }
);

/* create static pages from page folder */
// exports.onCreatePage = ({ page, actions }) => {
//   const { createPage, deletePage } = actions;
//   return new Promise((resolve) => {
//     deletePage(page);
//     Object.keys(locales).map((lang) => {
//       let localizedPath = locales[lang].default
//         ? page.path
//         : locales[lang].path + page.path;
//       if (page.path.includes("tool") && !page.path.includes(".md")) {
//         let toolName = page.path.split("-")[1];
//         toolName = toolName.substring(0, toolName.length - 1);
//         localizedPath = locales[lang].default
//           ? `/tools/${toolName}`
//           : `${locales[lang].path}/tools/${toolName}`;
//       }

//       return createPage({
//         ...page,
//         path: localizedPath,
//         context: {
//           locale: lang,
//           newestVersion,
//           versions,
//         },
//       });
//     });
//     resolve();
//   });
// };

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
  const { generateNodes, handleApiFiles } = sourceNodesUtils;

  const dirPath = `src/pages/docs/versions/master/API_Reference`;
  // read categories, such as pymilvus and pymilvus-orm
  const categories = fs.readdirSync(dirPath);
  const nodes = [];
  for (const category of categories) {
    const path = `${dirPath}/${category}`;
    const versions = fs.readdirSync(path);
    switch (category) {
      case "pymilvus":
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: "pymilvus",
          });
        }
        break;
      case "milvus-sdk-go":
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: "go",
          });
        }
        break;
      case "milvus-sdk-java":
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: "java",
          });
        }
        break;
      case "milvus-sdk-node":
        for (const version of versions) {
          handleApiFiles(nodes, {
            parentPath: path,
            version,
            category: "node",
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
  const docTemplate = path.resolve(`src/templates/docTemplate.js`);
  const communityTemplate = path.resolve(`src/templates/communityTemplate.jsx`);
  const bootcampTemplate = path.resolve(`src/templates/bootcamp.jsx`);
  const blogTemplate = path.resolve(`src/templates/blogTemplate.jsx`);
  const blogListTemplate = path.resolve(`src/templates/blogListTemplate.jsx`);

  return graphql(query).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    // get all menuStructures
    const allMenus = generateAllMenus(result.data.allFile.edges);
    // get new doc index page data
    const homeData = generateHomeData(result.data.allFile.edges);
    const { bootcampHome, bootcampMenu, bootcampMd } = handleBootcampData(
      result.data.allMarkdownRemark.edges,
      result.data.allFile.edges
    );
    const versionsWithHome = getVersionsWithHome(homeData);
    // filter useless md file blog has't version
    const legalMd = filterMdWithVersion(result.data.allMarkdownRemark.edges);
    const blogMD = filterMDwidthBlog(result.data.allMarkdownRemark.edges);
    const homeMd = filterHomeMdWithVersion(result.data.allMarkdownRemark.edges);
    // get community page data: articles md, menu and home json
    const { communityMd, communityMenu, communityHome } = handleCommunityData(
      result.data.allMarkdownRemark.edges,
      result.data.allFile.edges
    );

    generateCommunityPages(createPage, {
      nodes: communityMd,
      template: communityTemplate,
      menu: communityMenu,
    });
    generateCommunityHome(createPage, {
      nodes: communityHome,
      template: communityTemplate,
      menu: communityMenu,
    });

    generateBootcampPages(createPage, {
      nodes: bootcampMd,
      template: bootcampTemplate,
      menu: bootcampMenu,
    });

    generateBootcampHome(createPage, {
      nodes: bootcampHome,
      template: bootcampTemplate,
      menu: bootcampMenu,
    });

    const allApiMenus = generateApiMenus(result.data.allApIfile.nodes);
    const apiDocTemplate = path.resolve(`src/templates/apiDocTemplate.js`);
    generateApiReferencePages(createPage, {
      nodes: result.data.allApIfile.nodes,
      template: apiDocTemplate,
      allMenus,
      allApiMenus,
      versions,
      newestVersion,
    });
    generateBlogArticlePage(createPage, {
      nodes: blogMD,
      template: blogTemplate,
      listTemplate: blogListTemplate,
    });

    generateDocHomeWidthMd(createPage, {
      nodes: homeMd,
      blogs: blogMD,
      template: docTemplate,
      allMenus,
      allApiMenus,
      versions,
      newestVersion,
      versionInfo,
    });

    generateAllDocPages(createPage, {
      nodes: legalMd,
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

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();
  const miniCssExtractPlugin = config.plugins.find(
    plugin => plugin.constructor.name === "MiniCssExtractPlugin"
  );
  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.ignoreOrder = true;
  }

  const cssMinimizerPlugin = config.optimization?.minimizer?.find(plugin => {
    return plugin.constructor.name === "CssMinimizerPlugin";
  });
  if (cssMinimizerPlugin) {
    // const preset = cssMinimizerPlugin.options?.minimizerOptions?.preset;
    cssMinimizerPlugin.options.minimizerOptions = {
      //! Fix me if there is better config
      // refert to https://github.com/webpack-contrib/css-minimizer-webpack-plugin/blob/master/README.md
      // and https://cssnano.co/docs/optimisations/
      preset: require.resolve("cssnano-preset-lite"),
    };
  }
  actions.replaceWebpackConfig(config);
};
