const path = require('path');
const fs = require('fs');
const ReadVersionJson = require('./walkFile');
const locales = require('./src/constants/locales');
const DOC_LANG_FOLDERS = ['/en/', '/zh-CN/'];
// const benchmarksMenu = require('./benchmark-menu');
const express = require('express');
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

/* create pages dynamically from submodule data */
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // templates
  const docTemplate = path.resolve(`src/templates/docTemplate.js`);
  const communityTemplate = path.resolve(`src/templates/community.js`);

  // const markdownQueryResult = await graphql(`
  //   {
  //     allMarkdownRemark(
  //       filter: { fileAbsolutePath: { regex: "/(?:site|blog)/" } }
  //     ) {
  //       edges {
  //         node {
  //           headings {
  //             value
  //             depth
  //           }
  //           frontmatter {
  //             id
  //             keywords
  //           }
  //           fileAbsolutePath
  //           html
  //         }
  //       }
  //     }
  //   }
  // `);
  // if (markdownQueryResult.errors) {
  //   console.error(markdownQueryResult.errors);
  //   throw markdownQueryResult.errors;
  // }

  // const jsonQueryResult = await graphql(`
  //   {
  //     allFile(
  //       filter: { relativeDirectory: { regex: "/(?:menuStructure|home)/" } }
  //     ) {
  //       edges {
  //         node {
  //           absolutePath
  //           childMenuStructureJson {
  //             menuList {
  //               id
  //               title
  //               lang
  //               label1
  //               label2
  //               label3
  //               order
  //               isMenu
  //               outLink
  //             }
  //           }
  //           childrenHomeJson {
  //             section1 {
  //               title
  //               items {
  //                 title
  //                 key
  //                 btnLabel
  //                 link
  //               }
  //             }
  //             section2 {
  //               title
  //               desc
  //             }
  //             section3 {
  //               title
  //               items {
  //                 label
  //                 list {
  //                   link
  //                   text
  //                 }
  //               }
  //             }
  //             section4 {
  //               title
  //               items {
  //                 time
  //                 title
  //                 abstract
  //                 imgSrc
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `);
  // if (jsonQueryResult.errors) {
  //   console.error(jsonQueryResult.errors);
  //   throw jsonQueryResult.errors;
  // }

  // get all menuStructures

  // isMenu outLink can be add when need to use
  return graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(?:site|blog)/" } }
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
      allFile(
        filter: {
          absolutePath: { regex: "/(?:menuStructure|home)/" }
          extension: { eq: "json" }
        }
      ) {
        edges {
          node {
            absolutePath
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
                title
                items {
                  btnLabel
                  key
                  link
                  title
                }
              }
              section2 {
                title
                desc
              }
              section3 {
                title
                items {
                  label
                  list {
                    link
                    text
                  }
                }
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

    // get all menuStructures
    const allMenus = result.data.allFile.edges
      .filter(({ node: { childMenu } }) => childMenu !== null)
      .map(({ node: { absolutePath, childMenu } }) => {
        let lang = absolutePath.includes('/en/') ? 'en' : 'cn';
        const isBlog = absolutePath.includes('blog');
        const version = findVersion(absolutePath) || 'master';
        const menuStructureList = (childMenu && [...childMenu.menuList]) || [];
        // const benchmarkMenuList =
        //   lang === 'en'
        //     ? benchmarksMenu.benchmarksMenuListEN
        //     : benchmarksMenu.benchmarksMenuListCN;
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

        const data = childDocHome;
        return {
          language,
          data,
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

    // we generate path by menu structure
    const generatePath = (
      id,
      lang,
      version,
      isBlog,
      needLocal = true,
      isBenchmark
    ) => {
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
          lang === defaultLang
            ? `/docs/${version}/`
            : `${lang}/docs/${version}/`;
      } else {
        // for master branch version -> false
        localizedPath = lang === defaultLang ? `/docs/` : `${lang}/docs/`;
      }

      return needLocal ? `${localizedPath}${id}` : `${id}`;
    };

    const getCommunityPath = (fileId, fileLang) => {
      return fileLang === defaultLang
        ? `/community/${fileId}`
        : `${fileLang}/community/${fileId}`;
    };

    const defaultLang = Object.keys(locales).find(
      lang => locales[lang].default
    );

    // -----  for global search begin -----
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

    const fileData = flatten(legalMd);
    fs.writeFile(
      `${__dirname}/src/search.json`,
      JSON.stringify(fileData),
      err => {
        if (err) throw err;
        console.log("It's saved!");
      }
    );
    // -----  for global search end -----

    // create doc home page
    homeData.forEach(({ language, data, path }) => {
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
          version: newestVersion,
          old: 'home',
          fileAbsolutePath: path,
          isBlog,
          editPath,
          allMenus,
          newHtml: null,
        },
      });
    });

    console.log('====== after doc home create page');

    return legalMd.forEach(({ node }) => {
      const fileAbsolutePath = node.fileAbsolutePath;
      const fileId = node.frontmatter.id;
      let version = findVersion(fileAbsolutePath) || 'master';

      const fileLang = findLang(fileAbsolutePath);
      const isCommunityPage = fileAbsolutePath.includes('communityArticles');

      const editPath = fileAbsolutePath.split(
        fileLang === 'en' ? '/en/' : '/zh-CN/'
      )[1];
      const isBlog = checkIsblog(fileAbsolutePath);
      const isBenchmark = checkIsBenchmark(fileAbsolutePath);
      const localizedPath = !isCommunityPage
        ? generatePath(fileId, fileLang, version, isBlog, true, isBenchmark)
        : getCommunityPath(fileId, fileLang);

      const newHtml = node.html;

      // if (isCommunityPage) {
      //   console.log(
      //     '===== community page info',
      //     localizedPath,
      //     `language: ${fileLang}\n`,
      //     newHtml
      //   );
      // }

      // the newest doc version is master so we need to make route without version.
      // for easy link to the newest doc
      if (version === newestVersion && !isCommunityPage) {
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
          }, // additional data can be passed via context
        });
      }

      //  normal pages
      return !isCommunityPage
        ? createPage({
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
            }, // additional data can be passed via context
          })
        : null;
      // createPage({
      //     path: localizedPath,
      //     component: communityTemplate,
      //     context: {
      //       // locale: fileLang,
      //       fileAbsolutePath: path,
      //       // newHtml,
      //     },
      //   });
    });
  });
};

const checkIsblog = path => path.includes('blog');
const checkIsBenchmark = path => path.includes('benchmarks');
