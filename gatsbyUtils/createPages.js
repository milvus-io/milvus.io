const query = require('./PageQuery.js');
const { findLang } = require('./utils');
const { findVersion } = require('../gatsbyUtils/version');

console.log('--- is preview ---', process.env.IS_PREVIEW);
/**
 * generate all menus nodes from allFile
 * @param {array} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for all menus in doc page
 */
const generateAllMenus = edges => {
  return edges
    .filter(({ node: { childMenu } }) => childMenu !== null)
    .map(({ node: { absolutePath, childMenu } }) => {
      const lang = absolutePath.includes('/en/') ? 'en' : 'cn';
      const isBlog = absolutePath.includes('blog');
      const version = findVersion(absolutePath);
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
 * remove useless md file blog without version
 * @param {*} edges allMarkdownRemark.edges from graphql query response
 * @returns {array} {nodes} for md file with version
 */
const filterMdWithVersion = edges => {
  return edges.filter(({ node: { fileAbsolutePath, frontmatter } }) => {
    const notHome = frontmatter.id && frontmatter.id !== 'home.md';
    if (process.env.IS_PREVIEW === 'preview') {
      const onlyPreview = fileAbsolutePath.includes('/preview/');
      return onlyPreview && notHome;
    }
    return notHome;
  });
};

// converte home.json to md, filter all files and it's corresponding version
const filterHomeMdWithVersion = edges => {
  return edges.reduce((acc, cur) => {
    const {
      node: { fileAbsolutePath, frontmatter, html },
    } = cur;

    if (frontmatter.id === 'home.md') {
      const version = findVersion(fileAbsolutePath);
      const fileLang = findLang(fileAbsolutePath);
      acc.push({
        language: fileLang,
        html,
        path: fileAbsolutePath,
        version,
      });
    }
    return acc;
  }, []);
};

module.exports = {
  query,
  generateAllMenus,
  filterMdWithVersion,
  filterHomeMdWithVersion,
};
