const { findLang, getDefaultLang } = require("./utils");

const getCommunityPath = (fileId, fileLang) => {
  const defaultLang = getDefaultLang();
  return fileLang === defaultLang
    ? `/community/${fileId}`
    : `${fileLang}/community/${fileId}`;
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
      fileAbsolutePath.includes("communityArticles") && frontmatter.id
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
      const lang = absolutePath.includes("/en/") ? "en" : "cn";
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
 * @param {*} edges allMarkdownRemark.edges from graphql query response
 * @returns  {array} {nodes} for community home
 */
const filterCommunityHome = edges => {
  return edges.filter(
    ({ node: { fileAbsolutePath, frontmatter } }) =>
      frontmatter.id && fileAbsolutePath.includes("communityHome")
  );
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
  const communityHome = filterCommunityHome(allMarkdownRemark);
  return { communityMd, communityMenu, communityHome };
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
    const editPath = fileAbsolutePath.split(
      fileLang === "en" ? "/en/" : "/zh-CN/"
    )[1];

    createPage({
      path,
      component: communityTemplate,
      context: {
        locale: fileLang,
        fileAbsolutePath,
        html,
        headings: node.headings.filter(v => v.depth < 4 && v.depth >= 1),
        menuList: communityMenu,
        homeData: null,
        activePost: fileId,
        editPath,
        isCommunity: true,
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
  communityHome.forEach(({ node }) => {
    const {
      fileAbsolutePath,
      frontmatter: { id: fileId },
      html,
    } = node;
    const fileLang = findLang(fileAbsolutePath);
    createPage({
      path: fileLang === "en" ? "/community" : `/${fileLang}/community`,
      component: communityTemplate,
      context: {
        locale: fileLang,
        fileAbsolutePath,
        html,
        headings: [],
        menuList: communityMenu,
        activePost: fileId,
        editPath: null,
        isCommunity: true,
      },
    });
  });
};

module.exports = {
  generateCommunityHome,
  handleCommunityData,
  generateCommunityPages,
};
