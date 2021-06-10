const locales = require('../src/constants/locales');
const fs = require('fs');
const env = process.env.IS_PREVIEW;
// const env = 'preview';

// createPages: graphql query
const query = `
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
      labels
      isDirectory
    }
  }
  allFile(
    filter: {
      relativeDirectory: { regex: "/(?:menuStructure|home|community|bootcamp)/" }
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
        childBootcamp {
          description
          section1 {
            title
            content {
              id
              link
              title
            }
          }
          section2 {
            content {
              desc
              id
              link
              title
            }
            title
          }
          section3 {
            content {
              desc
              iconType
              id
              link
              title
            }
            title
          }
          title
        }
      }
    }
  }
}
`;

const DOC_LANG_FOLDERS = ['/en/', '/zh-CN/'];

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

const checkIsblog = path => path.includes('blog');

const checkIsBenchmark = path => path.includes('benchmarks');

const getDefaultLang = () =>
  Object.keys(locales).find(lang => locales[lang].default);

const getCommunityPath = (fileId, fileLang) => {
  const defaultLang = getDefaultLang();
  return fileLang === defaultLang
    ? `/community/${fileId}`
    : `${fileLang}/community/${fileId}`;
};

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

const getVersionsWithHome = homeData => {
  return homeData.map(data => data.version);
};

const getNewestVersionHomePath = (locale, path) => {
  const tempPath = path || 'home';
  const map = {
    en: `/docs/${tempPath}`,
    cn: `/${locale}/docs/${tempPath}`,
  };
  return map[locale];
};

const getNormalVersionHomePath = (version, locale, path) => {
  const tempPath = path || 'home';
  const map = {
    en: `/docs/${version}/${tempPath}`,
    cn: `/${locale}/docs/${version}/${tempPath}`,
  };
  return map[locale];
};

/**
 * generate all menus nodes from allFile
 * @param {array} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for all menus in doc page
 */
const generateAllMenus = edges => {
  return edges
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
};

/**
 * generate home data nodes from allFile
 * @param {array} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for home data in doc page
 */
const generateHomeData = edges => {
  return edges
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
};

const generateBootcampData = edegs => {
  return edegs
    .filter(({ node: { childBootcamp } }) => childBootcamp !== null)
    .map(({ node: { absolutePath, childBootcamp } }) => {
      const language = absolutePath.includes('/en') ? 'en' : 'cn';
      const data = childBootcamp;
      return {
        language,
        data,
        path: absolutePath,
      };
    });
};

/**
 * remove useless md file blog without version
 * @param {*} edges allMarkdownRemark.edges from graphql query response
 * @returns {array} {nodes} for md file with version
 */
const filterMdWithVersion = edges => {
  return edges.filter(({ node: { fileAbsolutePath, frontmatter } }) => {
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
  });
};

/**
 * filter out community menus from allMarkdownRemark
 * get community page data: articles md
 * @param {array} edges allMarkdownRemark.edges from graphql query response
 * @returns {array} {nodes} for community md file
 */
const filterCommunityMd = edges => {
  return edges.filter(
    ({ node: { fileAbsolutePath, frontmatter } }) =>
      fileAbsolutePath.includes('communityArticles') && frontmatter.id
  );
};

/**
 * filter out community menus from allFile
 * get community page data: menu
 * @param {*} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for community menus
 */
const filterCommunityMenus = edges => {
  return edges
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
};

/**
 * filter out community menus from allFile
 * get community page data: home
 * @param {*} edges allFile.edges from graphql query response
 * @returns  {array} {nodes} for community home
 */
const filterCommunityHome = edges => {
  return edges
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
};

/**
 * get community page data: articles md, menu and home json
 * @param {array} allMarkdownRemark allMarkdownRemark.edges from graphql query response
 * @param {array} allFile allFile.edges from graphql query response
 * @returns {object} { communityMd, communityMenu, communityHome }
 */
const handleCommunityData = (allMarkdownRemark, allFile) => {
  const communityMd = filterCommunityMd(allMarkdownRemark);
  const communityMenu = filterCommunityMenus(allFile);
  const communityHome = filterCommunityHome(allFile);
  return { communityMd, communityMenu, communityHome };
};

/**
 * generate global search file
 * `${rootDirName}/src/search.json`
 * @param {*} markdown md nodes
 * @param {*} newestVersion latest doc version
 * @param {*} rootDirName root path for search.json location
 */
const initGlobalSearch = (markdown, newestVersion, rootDirName) => {
  const flatten = arr =>
    arr
      .map(({ node: { frontmatter, fileAbsolutePath, headings } }) => {
        const fileLang = findLang(fileAbsolutePath);
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
    `${rootDirName}/src/search.json`,
    JSON.stringify(fileData),
    err => {
      if (err) throw err;
      console.log("It's saved!");
    }
  );
};

/**
 * create community pages
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template and menu
 */
const generateCommunityPages = (
  createPage,
  { nodes: communityMd, template: communityTemplate, menu: communityMenu }
) => {
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
};

/**
 * create community home
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template and menu
 */
const generateCommunityHome = (
  createPage,
  { nodes: communityHome, template: communityTemplate, menu: communityMenu }
) => {
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
};

/**
 * Generate a prettier title from menu's category or name.
 * @param { object } param0 { category, name, isDirectory = false }
 * @returns A prettier title.
 */
const generateTitle = ({ category, name, isDirectory = false }) => {
  const capitalize = s => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const titleMapping = {
    pymilvus: 'Milvus Python SDK',
    'pymilvus-orm': 'Milvus Python SDK (ORM)',
    go: 'Milvus Go SDK',
  };
  let prettierCategory = titleMapping[category] || capitalize(category);
  // return prettier category name if directory
  if (isDirectory) return prettierCategory;
  switch (category) {
    // return prettier category name if single page
    case 'pymilvus':
    case 'go':
      return prettierCategory;
    // return 3rd level items prettier name
    default:
      return capitalize(name.split('.htm')[0]);
  }
};

/**
 * generate full api menus for doc template and api doc template
 * left menus are composed with home, api menus and all other menus
 * @param {array} nodes api menus nodes from allApIfile.nodes
 * @returns {array} filtered and formatted api menus
 */
const generateApiMenus = nodes => {
  return nodes.reduce(
    (prev, item) => {
      // docVersion may be empty string
      const { name, category, version, docVersion, labels, isDirectory } = item;
      const [label1 = 'api_reference', label2 = '', label3 = ''] = labels;
      const menuItem = {
        id: name,
        title: generateTitle({ name, category, isDirectory }),
        lang: null,
        label1,
        label2,
        label3,
        order: 0,
        isMenu: isDirectory,
        outLink: null,
        isApiReference: true,
        url: `/api-reference/${category}/${version}/${name}`,
        category,
        apiVersion: version,
        docVersion,
      };
      return [...prev, menuItem];
    },
    // initial item is the first level menu: api_reference
    [
      {
        id: 'api_reference',
        title: 'NEW API Reference',
        lang: null,
        label1: '',
        label2: '',
        label3: '',
        order: -1,
        isMenu: true,
        outLink: null,
      },
    ]
  );
};

/**
 * create api reference pages
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template, allMenus, allApiMenus, versions and newestVersion
 */
const generateApiReferencePages = (
  createPage,
  {
    nodes,
    template: apiDocTemplate,
    allMenus,
    allApiMenus,
    versions,
    newestVersion,
    versionsWithHome,
  }
) => {
  nodes.forEach(
    ({
      abspath,
      doc,
      linkId,
      name,
      hrefs,
      version,
      category,
      docVersion,
      isDirectory,
    }) => {
      // Should ignore if the node is a directory.
      if (isDirectory) return;
      // Create default language page.
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
          newestVersion,
          isVersionWithHome: versionsWithHome.includes(version),
        },
      });
      // Temporarily create cn page.
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
          newestVersion,
          isVersionWithHome: versionsWithHome.includes(version),
        },
      });
    }
  );
};

/**
 * create doc home
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template, allMenus, allApiMenus, versions and newestVersion
 */
const generateDocHome = (
  createPage,
  {
    nodes: homeData,
    template: docTemplate,
    allMenus,
    allApiMenus,
    versions,
    newestVersion,
  }
) => {
  homeData.forEach(({ language, data, path, version }) => {
    const isBlog = checkIsblog(path);
    const editPath = path.split(language === 'en' ? '/en/' : '/zh-CN/')[1];

    if (version === newestVersion) {
      const homePath = getNewestVersionHomePath(language);
      createPage({
        path: homePath,
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
          allApiMenus,
          isVersionWithHome: true,
        },
      });
    }

    const homePath = getNormalVersionHomePath(version, language);
    createPage({
      path: homePath,
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
        isVersionWithHome: true,
      },
    });
  });
};

const generateBootcamp = (
  createPage,
  {
    nodes: bootcampData,
    template: docTemplate,
    allMenus,
    allApiMenus,
    versions,
    newestVersion,
    versionsWithHome,
  }
) => {
  versions.map(version => {
    return bootcampData.forEach(({ language, data, path }) => {
      const isBlog = checkIsblog(path);
      const editPath = path.split(language === 'en' ? '/en/' : '/zh-CN/')[1];

      if (version === newestVersion) {
        const bootcampPath = getNewestVersionHomePath(language, 'bootcamp');
        createPage({
          path: bootcampPath,
          component: docTemplate,
          context: {
            bootcampData: data,
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
            allApiMenus,
            isVersionWithHome: versionsWithHome.includes(version),
          },
        });
      }

      const bootcampPath = getNormalVersionHomePath(
        version,
        language,
        'bootcamp'
      );
      createPage({
        path: bootcampPath,
        component: docTemplate,
        context: {
          bootcampData: data,
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
          isVersionWithHome: versionsWithHome.includes(version),
        },
      });
    });
  });
};

/**
 * create doc pages from markdown nodes
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template, allMenus, allApiMenus, versions and newestVersion
 */
const generateAllDocPages = (
  createPage,
  {
    nodes: legalMd,
    template: docTemplate,
    newestVersion,
    versions,
    versionsWithHome,
    allMenus,
    allApiMenus,
  }
) => {
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
          isVersionWithHome: versionsWithHome.includes(newestVersion),
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
        isVersionWithHome: versionsWithHome.includes(version),
        allApiMenus,
      }, // additional data can be passed via context
    });
  });
};

module.exports = {
  query,
  findLang,
  getVersionsWithHome,
  generateAllMenus,
  generateHomeData,
  generateBootcampData,
  filterMdWithVersion,
  handleCommunityData,
  initGlobalSearch,
  generateCommunityPages,
  generateCommunityHome,
  generateApiMenus,
  generateApiReferencePages,
  generateDocHome,
  generateBootcamp,
  generateAllDocPages,
};
