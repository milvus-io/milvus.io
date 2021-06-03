const fs = require('fs');
const HTMLParser = require('node-html-parser');
const path = require('path');

/**
 * use api version to find target doc version
 * @param {object} info version info from walkFile output
 * @param {string} category category name, such as pymilvus, java-sdk
 * @param {string} apiVersion current api version
 * @returns {string} target doc version, will return empty string if no match
 */
const findDocVersion = (info, category, apiVersion) =>
  Object.keys(info)
    .reverse()
    .find(i => info[i] && info[i][category] === apiVersion) || '';

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
    const { name, abspath, doc, linkId, hrefs, category, version } = file;
    const docVersion = findDocVersion(versionInfo, category, version);
    const node = {
      name,
      abspath,
      doc,
      linkId,
      hrefs,
      id: createNodeId(`APIfile-${category}-${version}-${name}`),
      internal: {
        type: 'APIfile',
        contentDigest: createContentDigest(file),
      },
      version,
      category,
      docVersion,
    };
    createNode(node);
  });
};

/**
 * handle html pages under `${parentPath}/${version}` and fromat them
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/pymilvus"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handlePyFiles = (parentPath, version, apiFiles) => {
  const dirPath = `${parentPath}/${version}`;
  try {
    let filesList = fs.readdirSync(dirPath);
    for (let i = 0; i < filesList.length; i++) {
      let filePath = path.join(dirPath, filesList[i]);
      if (filePath.endsWith('.html')) {
        let doc = HTMLParser.parse(fs.readFileSync(filePath));
        // get articleBody node
        const bodyHTML = doc.querySelector(
          '[itemprop=articleBody] > div'
        ).innerHTML;
        // filter out linked element ids
        const linkRegex = /id="[A-Za-z0-9_-]*"/g;
        const linkId = Array.from(bodyHTML.matchAll(linkRegex)).map(link =>
          link[0].slice(4, link[0].length - 1)
        );
        // match href with ids
        const hrefs = [];
        doc.querySelectorAll('a').forEach(node => {
          linkId.forEach(link => {
            if (
              node.outerHTML.indexOf(`#${link}`) > 1 &&
              node.outerHTML.indexOf('headerlink') === -1
            ) {
              hrefs.push(node.outerHTML);
            }
          });
        });
        // remove useless link
        doc.querySelectorAll('.reference.internal').forEach(node => {
          node.parentNode.removeChild(node);
        });
        // generate toc from hrefs and insert it behind of h1 title
        const title = doc.querySelector('[itemprop=articleBody] > div > h1');
        const tocElement = `<ul className="api-reference-toc">${hrefs.reduce(
          (prev, item) => prev + `<li>${item}</li>`,
          ''
        )}</ul>`;
        title.insertAdjacentHTML('afterend', tocElement);
        // only need article body html
        doc = doc.querySelector('[itemprop=articleBody] > div').innerHTML;
        // const version = dirPath.split('/').pop();
        apiFiles.push({
          doc,
          hrefs,
          linkId,
          name: filesList[i],
          abspath: filePath,
          version,
          category: 'pymilvus',
        });
      }
    }
  } catch (e) {
    console.log('Read api files failed');
    throw e;
  }
};

module.exports = {
  generateNodes,
  handlePyFiles,
};
