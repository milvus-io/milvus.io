const path = require('path');
const fs = require('fs');
const ReadVersionJson = require('./walkFile');
const locales = require('./src/constants/locales');
const DOC_LANG_FOLDERS = ['/en/', '/zh-CN/'];
const express = require('express');
const HTMLParser = require('node-html-parser');
const env = process.env.IS_PREVIEW;
// const env = 'preview';
console.log('========env========', env);
const getNewestVersion = versionInfo => {
  const keys = Object.keys(versionInfo).filter(
    v =>
      v !== 'master' && (versionInfo[v].released === 'yes' || env === 'preview')
  );
  return keys.reduce((pre, cur) => {
    const curVersion = cur
      .substring(1)
      .split('.')
      .map(v => Number(v));
    const preVersion = pre
      .substring(1)
      .split('.')
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
  }, 'v0.0.0');
};
exports.onCreateDevServer = ({ app }) => {
  app.use(express.static('public'));
};

// the version is same for different lang, so we only need one
const DOC_ROOT = 'src/pages/docs/versions';
const versionInfo = ReadVersionJson(DOC_ROOT);
const newestVersion = getNewestVersion(versionInfo);
const versions = [];

versionInfo.preview = {
  version: 'preview',
  released: 'no',
};

Object.keys(versionInfo).forEach(v => {
  if (versionInfo[v].released === 'yes' || env === 'preview') {
    versions.push(v);
  }
});
console.log(versionInfo);

// add versioninfo file for generate sitemap filter option
fs.writeFile(
  `${DOC_ROOT}/versionInfo.json`,
  JSON.stringify(Object.values(versionInfo), null, 2),
  err => {
    if (err) throw err;
    console.log('versionInfo file write to file', versionInfo);
  }
);

/* create static pages from page folder */
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  return new Promise(resolve => {
    deletePage(page);
    Object.keys(locales).map(lang => {
      let localizedPath = locales[lang].default
        ? page.path
        : locales[lang].path + page.path;
      if (page.path.includes('tool')) {
        let toolName = page.path.split('-')[1];
        toolName = toolName.substring(0, toolName.length - 1);
        localizedPath = `/tools/${toolName}`;
      }

      return createPage({
        ...page,
        path: localizedPath,
        context: {
          locale: lang,
          newestVersion,
          versions,
        },
      });
    });
    resolve();
  });
};

// APIReference page: generate source for api reference html
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  /**
   * use api version to find target doc version
   * @param {object} info version info from walkFile output
   * @param {string} category category name, such as pymilvus, java-sdk
   * @param {string} apiVersion current api version
   * @returns {string} target doc version, will return empty string if no match
   */
  const findDocVersion = (info, category, apiVersion) =>
    Object.keys(info)
      .reverse()
      .find(i => info[i] && info[i][category] === apiVersion) || '';
  /**
   * generate gatsby node
   * @param {array} files files from handlePyFiles output
   */
  const generateNodes = (files = []) => {
    files.forEach(file => {
      const { name, abspath, doc, linkId, hrefs, category, version } = file;
      const docVersion = findDocVersion(versionInfo, category, version);
      const node = {
        name,
        abspath,
        doc,
        linkId,
        hrefs,
        id: createNodeId(`APIfile-${category}-${version}-${name}`),
        internal: {
          type: 'APIfile',
          contentDigest: createContentDigest(file),
        },
        version,
        category,
        docVersion,
      };
      actions.createNode(node);
    });
  };
  /**
   * handle html pages under `${parentPath}/${version}` and fromat them
   * @param {string} parentPath api category dir path, such as "src/pages/APIReference/pymilvus"
   * @param {string} version api version, such as "v1.0.1"
   * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
   */
  const handlePyFiles = (parentPath, version, apiFiles) => {
    const dirPath = `${parentPath}/${version}`;
    try {
      let filesList = fs.readdirSync(dirPath);
      for (let i = 0; i < filesList.length; i++) {
        let filePath = path.join(dirPath, filesList[i]);
        if (filePath.endsWith('.html')) {
          let doc = HTMLParser.parse(fs.readFileSync(filePath));
          // get articleBody node
          const bodyHTML = doc.querySelector(
            '[itemprop=articleBody] > div'
          ).innerHTML;
          // filter out linked element ids
          const linkRegex = /id="[A-Za-z0-9_-]*"/g;
          const linkId = Array.from(bodyHTML.matchAll(linkRegex)).map(link =>
            link[0].slice(4, link[0].length - 1)
          );
          // match href with ids
          const hrefs = [];
          doc.querySelectorAll('a').forEach(node => {
            linkId.forEach(link => {
              if (
                node.outerHTML.indexOf(`#${link}`) > 1 &&
                node.outerHTML.indexOf('headerlink') === -1
              ) {
                hrefs.push(node.outerHTML);
              }
            });
          });
          // remove useless link
          doc.querySelectorAll('.reference.internal').forEach(node => {
            node.parentNode.removeChild(node);
          });
          // generate toc from hrefs and insert it behind of h1 title
          const title = doc.querySelector('[itemprop=articleBody] > div > h1');
          const tocElement = `<ul className="api-reference-toc">${hrefs.reduce(
            (prev, item) => prev + `<li>${item}</li>`,
            ''
          )}</ul>`;
          title.insertAdjacentHTML('afterend', tocElement);
          // only need article body html
          doc = doc.querySelector('[itemprop=articleBody] > div').innerHTML;
          // const version = dirPath.split('/').pop();
          apiFiles.push({
            doc,
            hrefs,
            linkId,
            name: filesList[i],
            abspath: filePath,
            version,
            category: 'pymilvus',
          });
        }
      }
    } catch (e) {
      console.log('Read api files failed');
      throw e;
    }
  };
  // const dirPath = `src/pages/APIReference/pymilvus/v1.0.1`;
  const dirPath = `src/pages/docs/versions/master/APIReference`;
  // read categories, such as pymilvus and java-sdk
  const categories = fs.readdirSync(dirPath);
  const nodes = [];
  for (let category of categories) {
    if (category === 'pymilvus') {
      const path = `${dirPath}/${category}`;
      const versions = fs.readdirSync(path);

      for (let version of versions) {
        handlePyFiles(path, version, nodes);
      }
    }
  }
  generateNodes(nodes);
};

// exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
//   if (stage === "build-html") {
//     actions.setWebpackConfig({
//       module: {
//         rules: [
//           {
//             test: /APIReference/,
//             use: loaders.null(),
//           },
//         ],
//       },
//     })
//   }
// }

/*
 * utils to support generate html page from markdown or json dynamically
 */
const findVersion = str => {
  // version: v.1.0.0 | v0.x
  const regx = /versions\/master\/([v\dx\.]*)/;
  const match = str.match(regx);
  return match
    ? match[1]
      ? match[1]
      : env === 'preview' && str.includes('preview')
      ? 'preview'
      : match[1]
    : '';
};

const findLang = path => {
  return DOC_LANG_FOLDERS.reduce((pre, cur) => {
    if (path.includes(cur)) {
      pre = cur === '/en/' ? 'en' : 'cn';
    }
    return pre;
  }, '');
};

const getDefaultLang = () =>
  Object.keys(locales).find(lang => locales[lang].default);

// we generate path by menu structure
const generatePath = (
  id,
  lang,
  version,
  isBlog,
  needLocal = true,
  isBenchmark
) => {
  const defaultLang = getDefaultLang();
  if (isBenchmark) {
    return lang === defaultLang ? `/docs/${id}` : `${lang}/docs/${id}`;
  }
  if (isBlog) {
    if (!needLocal) return `/blogs/${id}`;
    return lang === defaultLang ? `/blogs/${id}` : `${lang}/blogs/${id}`;
  }

  let localizedPath = '';
  if (version && version !== 'master') {
    localizedPath =
      lang === defaultLang ? `/docs/${version}/` : `${lang}/docs/${version}/`;
  } else {
    // for master branch version -> false
    localizedPath = lang === defaultLang ? `/docs/` : `${lang}/docs/`;
  }

  return needLocal ? `${localizedPath}${id}` : `${id}`;
};

const getCommunityPath = (fileId, fileLang) => {
  const defaultLang = getDefaultLang();
  return fileLang === defaultLang
    ? `/community/${fileId}`
    : `${fileLang}/community/${fileId}`;
};

const initGlobalSearch = markdown => {
  const flatten = arr =>
    arr
      .map(({ node: { frontmatter, fileAbsolutePath, headings } }) => {
        const fileLang = findLang(fileAbsolutePath);

        // const version = newestVersion || 'master'; //findVersion(fileAbsolutePath) || "master";
        const version = findVersion(fileAbsolutePath) || 'master';
        const headingVals = headings.map(v => v.value);
        const isBlog = checkIsblog(fileAbsolutePath);
        const isBenchmark = checkIsBenchmark(fileAbsolutePath);
        const keywords = frontmatter.keywords
          ? frontmatter.keywords.split(',')
          : [];
        if (keywords.length) {
          console.log(keywords);
        }
        return {
          ...frontmatter,
          fileLang,
          version,
          path: generatePath(
            frontmatter.id,
            fileLang,
            version,
            isBlog,
            false,
            isBenchmark
          ),
          // the value we need compare with search query
          values: [...headingVals, frontmatter.id, ...keywords],
        };
      })
      .filter(data => data.version === newestVersion);

  const fileData = flatten(markdown);
  fs.writeFile(
    `${__dirname}/src/search.json`,
    JSON.stringify(fileData),
    err => {
      if (err) throw err;
      console.log("It's saved!");
    }
  );
};

const checkIsblog = path => path.includes('blog');
const checkIsBenchmark = path => path.includes('benchmarks');

/* create pages dynamically from submodule data */
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // templates
  const docTemplate = path.resolve(`src/templates/docTemplate.js`);
  const communityTemplate = path.resolve(`src/templates/community.jsx`);

  return graphql(`
    {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/(?:site|blog|communityArticles)/" }
        }
      ) {
        edges {
          node {
            headings {
              value
              depth
            }
            frontmatter {
              id
              keywords
            }
            fileAbsolutePath
            html
          }
        }
      }
      allApIfile {
        nodes {
          linkId
          abspath
          name
          doc
          hrefs
          version
          category
          docVersion
        }
      }
      allFile(
        filter: {
          relativeDirectory: { regex: "/(?:menuStructure|home|community)/" }
          extension: { eq: "json" }
        }
      ) {
        edges {
          node {
            absolutePath
            childCommunity {
              menuList {
                id
                isMenu
                label1
                label2
                label3
                order
                title
              }
              contributeSection {
                desc
                title
              }
              contributorSection {
                title
                list {
                  avatar {
                    publicURL
                  }
                  link
                  login
                }
              }
              heroSection {
                list {
                  desc
                  link
                  title
                  type
                }
                title
              }
              mailingSection {
                title
                list {
                  link
                  title
                }
              }
              repoSection {
                list {
                  desc
                  link
                  title
                }
                title
              }
            }
            childMenu {
              menuList {
                id
                isMenu
                label1
                label2
                label3
                lang
                order
                outLink
                title
              }
            }
            childDocHome {
              section1 {
                items {
                  btnLabel
                  key
                  link
                  title
                }
                title
              }
              section2 {
                desc
                title
              }
              section3 {
                items {
                  label
                  list {
                    link
                    text
                  }
                }
                title
              }
              section4 {
                items {
                  abstract
                  imgSrc
                  time
                  title
                }
                title
              }
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    // get all menuStructures
    const allMenus = result.data.allFile.edges
      .filter(({ node: { childMenu } }) => childMenu !== null)
      .map(({ node: { absolutePath, childMenu } }) => {
        let lang = absolutePath.includes('/en/') ? 'en' : 'cn';
        const isBlog = absolutePath.includes('blog');
        const version = findVersion(absolutePath) || 'master';
        const menuStructureList = (childMenu && [...childMenu.menuList]) || [];
        const menuList = [...menuStructureList];
        return {
          lang,
          version,
          isBlog,
          menuList,
          absolutePath,
        };
      });

    // get new doc index page data
    const homeData = result.data.allFile.edges
      .filter(({ node: { childDocHome } }) => childDocHome !== null)
      .map(({ node: { absolutePath, childDocHome } }) => {
        const language = absolutePath.includes('/en') ? 'en' : 'cn';
        const version = findVersion(absolutePath) || 'master';

        const data = childDocHome;
        return {
          language,
          data,
          version,
          path: absolutePath,
        };
      });

    // filter useless md file blog has't version
    const legalMd = result.data.allMarkdownRemark.edges.filter(
      ({ node: { fileAbsolutePath, frontmatter } }) => {
        return (
          (!!findVersion(fileAbsolutePath) ||
            fileAbsolutePath.includes('/docs/versions/master/common') ||
            fileAbsolutePath.includes('/blog/zh-CN') ||
            (fileAbsolutePath.includes('/docs/versions/master/preview/') &&
              env === 'preview') ||
            fileAbsolutePath.includes('communityArticles') ||
            fileAbsolutePath.includes('/docs/versions/benchmarks/')) &&
          frontmatter.id
        );
      }
    );

    // get community page data: articles md, menu and home json
    const communityMd = result.data.allMarkdownRemark.edges.filter(
      ({ node: { fileAbsolutePath, frontmatter } }) =>
        fileAbsolutePath.includes('communityArticles') && frontmatter.id
    );

    const communityMenu = result.data.allFile.edges
      .filter(
        ({ node: { childCommunity } }) =>
          childCommunity !== null && childCommunity.menuList !== null
      )
      .map(({ node: { absolutePath, childCommunity } }) => {
        const lang = absolutePath.includes('/en/') ? 'en' : 'cn';
        const menuList = childCommunity.menuList || [];
        return {
          lang,
          menuList,
        };
      });

    const communityHome = result.data.allFile.edges
      .filter(
        ({ node: { childCommunity, absolutePath } }) =>
          childCommunity !== null && absolutePath.includes('communityHome')
      )
      .map(({ node: { absolutePath, childCommunity } }) => {
        const language = absolutePath.includes('/en') ? 'en' : 'cn';
        const data = childCommunity;
        return {
          language,
          data,
          path: absolutePath,
        };
      });

    initGlobalSearch(legalMd);

    // create community articles
    communityMd.forEach(({ node }) => {
      const {
        fileAbsolutePath,
        html,
        frontmatter: { id: fileId },
      } = node;

      const fileLang = findLang(fileAbsolutePath);
      const path = getCommunityPath(fileId, fileLang);

      createPage({
        path,
        component: communityTemplate,
        context: {
          locale: fileLang,
          fileAbsolutePath,
          html,
          headings: node.headings.filter(v => v.depth < 4 && v.depth > 1),
          menuList: communityMenu,
          homeData: null,
          activePost: fileId,
        },
      });
    });

    // create community home
    communityHome.forEach(({ language, data, path }) => {
      createPage({
        path: language === 'en' ? '/community' : `/${language}/community`,
        component: communityTemplate,
        context: {
          locale: language,
          fileAbsolutePath: path,
          homeData: data,
          html: null,
          headings: [],
          menuList: communityMenu,
          activePost: 'community',
        },
      });
    });

    // APIReference page: create api reference page
    // generate full api menus for doc template and api doc template
    const allApiMenus = result.data.allApIfile.nodes.reduce((prev, item) => {
      // docVersion may be empty string
      const { name, category, version, docVersion } = item;
      const menuItem = {
        id: name,
        title: category,
        lang: null,
        label1: 'api_reference',
        label2: '',
        label3: '',
        order: 0,
        isMenu: null,
        outLink: null,
        isApiReference: true,
        url: `/api-reference/${category}/${version}/${name}`,
        category,
        apiVersion: version,
        docVersion,
      };
      return [...prev, menuItem];
    }, []);
    const apiDocTemplate = path.resolve(`src/templates/apiDocTemplate.js`);
    result.data.allApIfile.nodes.forEach(
      ({
        abspath,
        doc,
        linkId,
        name,
        hrefs,
        version,
        category,
        docVersion,
      }) => {
        createPage({
          path: `/api-reference/${category}/${version}/${name}`,
          component: apiDocTemplate,
          context: {
            locale: 'en',
            abspath,
            doc,
            linkId,
            hrefs,
            name,
            allApiMenus,
            allMenus,
            version,
            docVersion,
            docVersions: Array.from(versions),
            category,
          },
        });
        createPage({
          path: `/cn/api-reference/${category}/${version}/${name}`,
          component: apiDocTemplate,
          context: {
            locale: 'cn',
            abspath,
            doc,
            linkId,
            hrefs,
            name,
            allApiMenus,
            allMenus,
            version,
            docVersion,
            docVersions: Array.from(versions),
            category,
          },
        });
      }
    );

    // create doc home page
    homeData.forEach(({ language, data, path, version }) => {
      const isBlog = checkIsblog(path);
      const editPath = path.split(language === 'en' ? '/en/' : '/zh-CN/')[1];

      createPage({
        path: language === 'en' ? '/docs/home' : `/${language}/docs/home`,
        component: docTemplate,
        context: {
          homeData: data,
          locale: language,
          versions: Array.from(versions),
          newestVersion,
          version,
          old: 'home',
          fileAbsolutePath: path,
          isBlog,
          editPath,
          allMenus,
          newHtml: null,
          allApiMenus,
        },
      });
    });

    // create Milvus docs
    legalMd.forEach(({ node }) => {
      const fileAbsolutePath = node.fileAbsolutePath;
      const fileId = node.frontmatter.id;
      let version = findVersion(fileAbsolutePath) || 'master';

      const fileLang = findLang(fileAbsolutePath);
      const editPath = fileAbsolutePath.split(
        fileLang === 'en' ? '/en/' : '/zh-CN/'
      )[1];
      const isBlog = checkIsblog(fileAbsolutePath);
      const isBenchmark = checkIsBenchmark(fileAbsolutePath);
      const localizedPath = generatePath(
        fileId,
        fileLang,
        version,
        isBlog,
        true,
        isBenchmark
      );

      const newHtml = node.html;

      // the newest doc version is master so we need to make route without version.
      // for easy link to the newest doc
      if (version === newestVersion) {
        const masterPath = isBenchmark
          ? `/docs/$${fileId}`
          : generatePath(fileId, fileLang, isBlog ? false : 'master', isBlog);
        createPage({
          path: masterPath,
          component: docTemplate,
          context: {
            locale: fileLang,
            version: newestVersion, // get master version
            versions: Array.from(versions),
            newestVersion,
            old: fileId,
            headings: node.headings.filter(v => v.depth < 4 && v.depth >= 1),
            fileAbsolutePath,
            localizedPath,
            isBlog,
            editPath,
            allMenus,
            newHtml,
            homeData: null,
            allApiMenus,
          }, // additional data can be passed via context
        });
      }

      // normal pages
      createPage({
        path: localizedPath,
        component: docTemplate,
        context: {
          locale: fileLang,
          version: isBenchmark ? newestVersion : version,
          versions: Array.from(versions),
          old: fileId,
          headings: node.headings.filter(v => v.depth < 4 && v.depth >= 1),
          fileAbsolutePath,
          localizedPath,
          newestVersion,
          isBlog,
          editPath,
          allMenus,
          isBenchmark,
          newHtml,
          homeData: null,
          allApiMenus,
        }, // additional data can be passed via context
      });
    });
  });
};

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();
  const miniCssExtractPlugin = config.plugins.find(
    plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
  );
  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.ignoreOrder = true;
  }
  actions.replaceWebpackConfig(config);
};
