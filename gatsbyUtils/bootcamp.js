// This file is deprecated and will be removed soon
const { findLang, getDefaultLang } = require('./utils');

const getBootcampPath = (fileId, fileLang) => {
  const defaultLang = getDefaultLang();
  return fileLang === defaultLang
    ? `/bootcamp/${fileId}`
    : `${fileLang}/bootcamp/${fileId}`;
};

const filterBootcampHome = edges => {
  return edges
    .filter(
      ({ node: { childBootcamp, absolutePath } }) =>
        childBootcamp !== null && absolutePath.includes('bootcampHome')
    )
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

const filterBootcampMenus = edges => {
  return edges
    .filter(
      ({ node: { childBootcamp } }) =>
        childBootcamp !== null && childBootcamp.menuList !== null
    )
    .map(({ node: { absolutePath, childBootcamp } }) => {
      const lang = absolutePath.includes('/en/') ? 'en' : 'cn';
      const menuList = childBootcamp.menuList || [];
      return {
        lang,
        menuList,
      };
    });
};

const filterBootcampMd = edges => {
  return edges.filter(
    ({ node: { fileAbsolutePath, frontmatter } }) =>
      fileAbsolutePath.includes('bootcampArticles') && frontmatter.id
  );
};

const generateBootcampPages = (
  createPage,
  { nodes: bootcampMd, template: bootcampTemplate, menu: bootcampMenu }
) => {
  bootcampMd.forEach(({ node }) => {
    const {
      fileAbsolutePath,
      html,
      frontmatter: { id: fileId },
    } = node;

    const fileLang = findLang(fileAbsolutePath);
    const path = getBootcampPath(fileId, fileLang);

    createPage({
      path,
      component: bootcampTemplate,
      context: {
        locale: fileLang,
        fileAbsolutePath,
        html,
        headings: node.headings.filter(v => v.depth < 4 && v.depth > 1),
        menuList: bootcampMenu,
        bootcampData: null,
        activePost: fileId,
      },
    });
  });
};

const handleBootcampData = (allMarkdownRemark, allFile) => {
  const bootcampHome = filterBootcampHome(allFile);
  const bootcampMenu = filterBootcampMenus(allFile);
  const bootcampMd = filterBootcampMd(allMarkdownRemark);
  return { bootcampHome, bootcampMenu, bootcampMd };
};

const generateBootcampHome = (
  createPage,
  { nodes: bootcampHome, template: bootcampTemplate }
) => {
  bootcampHome.forEach(({ language, path }) => {
    createPage({
      path: language === 'en' ? '/bootcamp' : `/${language}/bootcamp`,
      component: bootcampTemplate,
      context: {
        locale: language,
        old: 'home',
        fileAbsolutePath: path,
        newHtml: null,
        isVersionWithHome: false,
        activePost: 'bootcamp',
      },
    });
  });
};

module.exports = {
  handleBootcampData,
  generateBootcampHome,
  generateBootcampPages,
};
