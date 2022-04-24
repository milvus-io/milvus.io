/**
 * Generate a prettier title from menu's category or name.
 * @param { object } param0 { category, name, isDirectory = false, labels = [] }
 * @returns A prettier title.
 */
const generateTitle = ({
  title,
  category,
  name,
  isDirectory = false,
  labels = [],
}) => {
  /**
   * Capitalize string.
   * "home" => "Hone"
   * "exception/index" => "Index"
   * @param {string} s String will be capitalized.
   * @returns {string} Capitalized string.
   */
  const capitalize = s => {
    if (typeof s !== 'string') return '';
    const resultList = s
      .split(' ')
      .map(i => i.charAt(0).toUpperCase() + i.slice(1));
    return resultList.join(' ');
  };
  if (title) return capitalize(title);
  const titleMapping = {
    pymilvus: 'Python',
    'pymilvus-orm': 'Python (ORM)',
    go: 'Go',
    java: 'Java',
    node: 'Node',
  };
  const [, label2 = ''] = labels;
  // Return name if the menu is a 3rd level menu(such as: API => java => exception)
  // Return category name if the menu is a 1st or 2nd level menu(such as: API, API => java)
  const prettierCategory = label2
    ? capitalize(name)
    : titleMapping[category] || capitalize(category);
  // return prettier category name if directory
  if (isDirectory) return prettierCategory;
  // handle new md api
  const _name = name.endsWith('.md')
    ? name.split('.md')[0]?.split('.')?.pop()
    : name.split('.htm')[0]?.split('.')?.pop();

  switch (category) {
    // return prettier category name if single page
    // case 'pymilvus':
    case 'go':
      return name.endsWith('.htm') ? prettierCategory : _name.split('/').pop();
    case 'node':
      return _name.split('/').pop();
    // return 3rd level items prettier name
    default:
      return name.endsWith('.htm')
        ? capitalize(name.split('.htm')[0])
        : _name.split('/').pop();
  }
};

/**
 * generate full api menus for doc template and api doc template
 * left menus are composed with home, api menus and all other menus
 * @param {array} nodes api menus nodes from allApIfile.nodes
 * @returns {array} filtered and formatted api menus
 */
const generateApiMenus = nodes => {
  /**
   * Calculate the order of menu item. 0 is default.
   * @param {object} param0 Data to calculate item order.
   * @returns {number} Order.(-1 is first of all, then 0, 1, 2 ...)
   */
  const calculateOrder = ({ category, name = '', order }) => {
    // java > package-tree.html & package-summary.html should be first.
    if (category === 'java' && name.includes('package-')) return -1;
    return order;
  };

  // menus
  const menus = {};
  nodes.forEach(item => {
    const {
      name,
      category,
      version,
      docVersion,
      labels,
      isDirectory,
      title,
      order,
    } = item;
    // create category
    menus[category] = menus[category] || {};
    // create version
    menus[category][version] = menus[category][version] || [];

    const [label1 = '', label2 = '', label3 = ''] = labels;
    const menuItem = {
      // Use "_" instead of "-" in both api menu's id and api page's name.
      // Due to a search algorithm use the word splited by "-".
      // https://github.com/milvus-io/www.milvus.io/blob/4e60f5f08e8e2b3ed02a352c4cc6ea28488b8d33/src/components/menu/index.jsx#L9
      // https://github.com/milvus-io/www.milvus.io/blob/ef727f7abcfe95c93df139a7f332ddf03eae962d/src/components/docLayout/index.jsx#L116
      // "id" should be same with "name" in generateApiReferencePages
      id: isDirectory
        ? name.replace('-', '_')
        : `${category.replace('-', '_')}_${name.replace('-', '_')}`,
      title: generateTitle({ title, name, category, isDirectory, labels }),
      lang: null,
      label1,
      label2,
      label3,
      order: calculateOrder({ category, name, order }),
      isMenu: isDirectory,
      outLink: null,
      isApiReference: true,
      url: `/api-reference/${category}/${version}/${name}`,
      category,
      apiVersion: version,
      docVersion,
    };
    menus[category][version].push(menuItem);
  });

  return menus;
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
  }
) => {
  const filteredVersions = Array.from(versions).filter(
    i => i && i !== 'master'
  );
  nodes.forEach(
    ({ abspath, doc, name, version, category, docVersion, isDirectory }) => {
      // Should ignore if the node is a directory.
      if (isDirectory) return;
      // Create default language page.
      // Use "_" instead of "-" in both api menu's id and api page's name.
      // Due to a search algorithm use the word splited by "-".
      // https://github.com/milvus-io/www.milvus.io/blob/4e60f5f08e8e2b3ed02a352c4cc6ea28488b8d33/src/components/menu/index.jsx#L9
      // https://github.com/milvus-io/www.milvus.io/blob/ef727f7abcfe95c93df139a7f332ddf03eae962d/src/components/docLayout/index.jsx#L116
      // "name" should be same with "id" in generateApiMenus
      const pageName = `${category.replace('-', '_')}_${name.replace(
        '-',
        '_'
      )}`;
      createPage({
        path: `/api-reference/${category}/${version}/${name}`,
        component: apiDocTemplate,
        context: {
          locale: 'en',
          abspath,
          doc,
          name: pageName,
          pId: name,
          allApiMenus,
          allMenus,
          version,
          docVersion,
          docVersions: filteredVersions,
          category,
          newestVersion,
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
          name: pageName,
          pId: name,
          allApiMenus,
          allMenus,
          version,
          docVersion,
          docVersions: filteredVersions,
          category,
          newestVersion,
        },
      });
    }
  );
};

const API_QUERY = `
{
  allApIfile {
    nodes {
      abspath
      name
      doc
      version
      category
      docVersion
      labels
      isDirectory
      title
      order
    }
  }
}
`;

module.exports = {
  API_QUERY,
  generateApiMenus,
  generateApiReferencePages,
};
