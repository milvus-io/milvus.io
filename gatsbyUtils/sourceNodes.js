const fs = require('fs');
const path = require('path');
const { Remarkable } = require('remarkable');
/**
 * Use api version to find target doc versions.
 * @param {object} info Version info from walkFile output.
 * @param {string} category category name, such as pymilvus, java-sdk.
 * @param {string} apiVersion Current api version.
 * @returns {array} Target doc versions, will return empty array if no match.
 */
const findDocVersion = (info, category, apiVersion) =>
  Object.keys(info)
    .reverse()
    .filter(i => info[i] && info[i][category] === apiVersion);

/**
 * Find and get the path of all files under the dirPath.
 * @param {string} dirPath Target directory.
 * @param {array} pathList A list of initial results if necessary.
 * @returns A list of initial results and calculated path of all files under the dirPath.
 */
const getAllFilesAbsolutePath = (dirPath, pathList = []) => {
  const filesList = fs.readdirSync(dirPath);
  for (let i = 0; i < filesList.length; i++) {
    // concat current file path: ${parent_path}/${current_file_name}
    const filePath = path.join(dirPath, filesList[i]);
    // get file info by filePath, return a fs.Stats object
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // recursion call
      getAllFilesAbsolutePath(filePath, pathList);
    } else {
      pathList.push(filePath);
    }
  }
  return pathList;
};

/**
 * Get the file name by path name.
 * The path name will be splited by "/" to return the last one.
 * @param {string} path File path to parse.
 * @returns The file name.
 */
const getFileName = (path = '') => path.split('/').pop();

/**
 * Get relative path from absolute path.
 * @param {string} path Absolute path.
 * @param {string} dir Directory name used to split the absolute path.
 * @returns {string} Relative path, such as "example/index.html" and "index.html".
 */
const getFileRelativePath = (path, dir) => {
  return path.split(`${dir}/`).pop();
};

/**
 * generate gatsby node
 * @param {array} files files from handlePyFiles output
 * @param {object} metadata versionInfo and gatsby sourceNodes API createNodeId, createContentDigest and actions.createNode
 */
const generateNodes = (
  files = [],
  { createNodeId, createContentDigest, createNode, versionInfo }
) => {
  files.forEach(file => {
    const {
      name,
      abspath,
      doc,
      category,
      version,
      labels,
      isDirectory,
      title,
      order,
    } = file;
    const docVersion = findDocVersion(versionInfo, category, version);
    const node = {
      name,
      abspath,
      doc,
      id: createNodeId(`APIfile-${category}-${version}-${name}`),
      internal: {
        type: 'APIfile',
        contentDigest: createContentDigest(file),
      },
      version,
      category,
      docVersion,
      labels,
      isDirectory,
      title,
      order,
    };
    createNode(node);
  });
};

/**
 * Generate apiFile object adding to nodes.
 * @param {array} nodes Pages under `${parentPath}/${version}` will be formatted and pushed to nodes
 * @param {object} param2 { parentPath, version, category }
 * parentPath: api category dir path, such as "src/pages/APIReference/pymilvus"
 * version: api version, such as "v1.0.1"
 * category: categoty name, such as "pymilvus", "pymilvus-orm" and "go"
 */
const handleApiFiles = (nodes, { parentPath, version, category }) => {
  const dirPath = `${parentPath}/${version}`;
  const isMetaFileExist = fs.existsSync(`${dirPath}/api_reference_meta.json`);
  const metaDataStr =
    isMetaFileExist &&
    fs.readFileSync(`${dirPath}/api_reference_meta.json`, 'utf8');
  const metaData = isMetaFileExist ? JSON.parse(metaDataStr) : {};
  const cat = category.replace('-', '_');
  try {
    const filesList = getAllFilesAbsolutePath(dirPath);
    // Level: api_reference(root directory) > 2nd level directory > 3rd level directory.
    const thridLevelDirectories = {};
    // Get all HTML files under dirPath.
    const apiFiles = filesList.filter(
      i => i.endsWith('.html') || i.endsWith('.md')
    );
    // If this dirPath has only one page or not, regardless how many directories.
    const isSinglePage = apiFiles.length === 1;
    const converter = new Remarkable();

    for (let i = 0; i < apiFiles.length; i++) {
      const filePath = apiFiles[i];
      const relativePath = getFileRelativePath(filePath, version);

      let doc = fs.readFileSync(filePath, 'utf8');
      // if markdown, parse to html
      if (filePath.endsWith('md')) {
        doc = converter.render(doc);
      }
      const {
        title: docTitle,
        order: docOrder,
        parentMenu = {},
      } = metaData[relativePath] || {};
      // docOrder may be 0.
      const order = typeof docOrder === 'undefined' ? null : docOrder;
      const title = docTitle;
      const parentPath = relativePath.split('/').slice(0, -1).join('/');
      // Record the parentPath as a thrid level directory.
      parentPath && (thridLevelDirectories[parentPath] = parentMenu);
      parentPath
        ? // Handle the pages those have a 3rd level directory and dd a label2/3.
          // Need to remove label2/3 if it's a single page.
          nodes.push({
            doc: doc,
            name: relativePath,
            abspath: filePath,
            version,
            category,
            title,
            order,
            labels: [cat, isSinglePage ? '' : parentPath.replace('-', '_')],
          })
        : nodes.push({
            doc: doc,
            name: getFileName(filePath),
            abspath: filePath,
            version,
            category,
            title,
            order,
            labels: [cat, isSinglePage ? '' : ''],
          });
    }
    // Deduplicate.
    // Add 3rd level directory menu. Should ignore if single page.
    !isSinglePage &&
      nodes.push({
        doc: '',
        name: cat,
        abspath: dirPath,
        version,
        category,
        labels: [],
        isDirectory: true,
        order: category.includes('pymilvus') ? -1 : null,
      }) &&
      Object.keys(thridLevelDirectories).forEach(f => {
        const { name: dirName, order: dirOrder } = thridLevelDirectories[f];
        nodes.push({
          doc: '',
          name: f.replace('-', '_'),
          abspath: `${dirPath}/${f}`,
          version,
          category,
          labels: [cat],
          isDirectory: true,
          order: dirOrder,
          title: dirName || f.replace('-', '_'),
        });
      });
  } catch (e) {
    console.log(`Read ${category} api files failed`);
    throw e;
  }
};

module.exports = {
  generateNodes,
  handleApiFiles,
};
