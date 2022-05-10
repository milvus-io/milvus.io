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

module.exports = {
  generateNodes,
};
