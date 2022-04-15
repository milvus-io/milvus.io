const query = require("./PageQuery.js");
const { findVersion, findLang } = require("./utils");
const env = process.env.IS_PREVIEW;

/**
 * generate all menus nodes from allFile
 * @param {array} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for all menus in doc page
 */
const generateAllMenus = edges => {
  return edges
    .filter(({ node: { childMenu } }) => childMenu !== null)
    .map(({ node: { absolutePath, childMenu } }) => {
      const lang = absolutePath.includes("/en/") ? "en" : "cn";
      const isBlog = absolutePath.includes("blog");
      const version = findVersion(absolutePath) || "master";
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
    /**
     * Filter correct md file by version.
     * Drop md file with no version or older than v1.0.0 (except v0.x).
     * @param {string} path File absolute path.
     * @returns {boolean} If this md should be dropped or not.
     */
    const filterVersion = path => {
      const mdVersion = findVersion(path);
      if (mdVersion?.startsWith("v0.") && !mdVersion?.startsWith("v0.x"))
        return false;
      return !!mdVersion;
    };
    return (
      (filterVersion(fileAbsolutePath) ||
        fileAbsolutePath.includes("/docs/versions/master/common") ||
        (fileAbsolutePath.includes("/docs/versions/master/preview/") &&
          env === "preview") ||
        fileAbsolutePath.includes("communityArticles") ||
        fileAbsolutePath.includes("bootcampArticles") ||
        fileAbsolutePath.includes("/docs/versions/benchmarks/")) &&
      frontmatter.id &&
      frontmatter.id !== "home.md"
    );
  });
};

// converte home.json to md, filter all files and it's corresponding version
const filterHomeMdWithVersion = edges => {
  const filterVersion = path => {
    const mdVersion = findVersion(path);
    if (mdVersion?.startsWith("v0.") && !mdVersion?.startsWith("v0.x"))
      return false;
    return !!mdVersion;
  };

  return edges.reduce((acc, cur) => {
    const {
      node: { fileAbsolutePath, frontmatter, html },
    } = cur;

    if (filterVersion(fileAbsolutePath) && frontmatter.id === "home.md") {
      const version = findVersion(fileAbsolutePath) || "master";
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
