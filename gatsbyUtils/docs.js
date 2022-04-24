const { checkIsblog, generateDefaultBlogCover } = require('./blog');
const { findVersion, findLang, generatePath } = require('./utils');

const getNewestVersionHomePath = locale => {
  const map = {
    en: `/docs`,
    cn: `/${locale}/docs`,
  };
  return map[locale];
};

const getNormalVersionHomePath = (version, locale) => {
  const map = {
    en: `/docs/${version}`,
    cn: `/${locale}/docs/${version}`,
  };
  return map[locale];
};

const generateDocHomeWidthMd = (
  createPage,
  {
    nodes,
    blogs: blogMD,
    template: docTemplate,
    allMenus,
    allApiMenus,
    versions,
    newestVersion,
    versionInfo,
  }
) => {
  // generate newest blog
  const list = blogMD.map(({ node }) => {
    const fileAbsolutePath = node.fileAbsolutePath;
    const fileLang = findLang(fileAbsolutePath);

    const [date, tag = '', title, desc, id, cover] = [
      node.frontmatter.date,
      node.frontmatter.tag,
      node.frontmatter.title,
      node.frontmatter.desc,
      node.frontmatter.id,
      node.frontmatter.cover,
    ];

    return {
      date,
      tags: tag ? tag.split(',') : [],
      desc: desc || '',
      title,
      id,
      cover: cover || generateDefaultBlogCover(date),
      fileLang,
      fileAbsolutePath,
    };
  });

  const getTwoNewestBlog = lang => {
    return list
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(i => i.fileLang === lang)
      .slice(0, 2);
  };

  const formatDocHomeHtml = (html, homePath) => {
    const regex = /\<a (\S*)\>/g;
    const newHtml = html.replace(regex, link => {
      const [start, originPath, end] = link.split('"');
      const formatPath =
        originPath.charAt(0) === '#' ||
        originPath.charAt(0) === '/' ||
        originPath.includes('http')
          ? originPath
          : `${homePath}/${originPath}`;
      return [start, formatPath, end].join('"');
    });
    return newHtml;
  };

  nodes.forEach(({ language, html, path, version }) => {
    const isBlog = checkIsblog(path);
    const editPath = path.split(language === 'en' ? '/en/' : '/zh-CN/')[1];

    if (version === newestVersion) {
      const homePath = getNewestVersionHomePath(language);
      createPage({
        path: homePath,
        component: docTemplate,
        context: {
          homeData: formatDocHomeHtml(html, homePath, version),
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
          newestBlog: getTwoNewestBlog(language),
          homePath,
          versionInfo,
        },
      });
    }

    const homePath = getNormalVersionHomePath(version, language);
    createPage({
      path: homePath,
      component: docTemplate,
      context: {
        homeData: formatDocHomeHtml(html, homePath, version),
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
        newestBlog: getTwoNewestBlog(language),
        homePath,
        versionInfo,
      },
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
    versionInfo,
  }
) => {
  legalMd.forEach(({ node }) => {
    const fileAbsolutePath = node.fileAbsolutePath;
    const isBlog = checkIsblog(fileAbsolutePath);
    const fileId = node.frontmatter?.id;
    const relatedKey = node.frontmatter.related_key;
    const summary = node.frontmatter.summary || '';
    const group = node.frontmatter.group || '';
    const version = findVersion(fileAbsolutePath) || 'master';

    const fileLang = findLang(fileAbsolutePath);
    const editPath = fileAbsolutePath.split(
      fileLang === 'en' ? '/en/' : '/zh-CN/'
    )[1];
    const localizedPath = generatePath(fileId, fileLang, version, isBlog, true);

    const newHtml = node.html;

    // the newest doc version is master so we need to make route without version.
    // for easy link to the newest doc
    if (version === newestVersion) {
      const masterPath = generatePath(
        fileId,
        fileLang,
        isBlog ? false : 'master',
        isBlog
      );
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
          relatedKey,
          summary,
          group,
          versionInfo,
        }, // additional data can be passed via context
      });
    }

    // normal pages
    createPage({
      path: localizedPath,
      component: docTemplate,
      context: {
        locale: fileLang,
        version: version,
        versions: Array.from(versions),
        old: fileId,
        headings: node.headings.filter(v => v.depth < 4 && v.depth >= 1),
        fileAbsolutePath,
        localizedPath,
        newestVersion,
        isBlog,
        editPath,
        allMenus,
        newHtml,
        homeData: null,
        isVersionWithHome: versionsWithHome.includes(version),
        allApiMenus,
        relatedKey,
        summary,
        group,
        versionInfo,
      }, // additional data can be passed via context
    });
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

const getVersionsWithHome = homeData => {
  return homeData.map(data => data.version);
};

module.exports = {
  getVersionsWithHome,
  generateAllDocPages,
  generateDocHomeWidthMd,
  generateHomeData,
};
