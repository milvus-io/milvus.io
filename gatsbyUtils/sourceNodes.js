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
    const {
      name,
      abspath,
      doc,
      linkId,
      hrefs,
      category,
      version,
      labels,
      isDirectory,
    } = file;
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
      labels,
      isDirectory,
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
        const bodyHTML = doc.querySelector('[itemprop=articleBody] > div')
          .innerHTML;
        // filter out linked element ids
        const linkRegex = /id="[A-Za-z0-9_-]*"/g;
        const linkId = Array.from(bodyHTML.matchAll(linkRegex)).map(link =>
          link[0].slice(4, link[0].length - 1)
        );
        // match href with ids
        const hrefs = [];
        [...doc.querySelectorAll('a')].forEach(node => {
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
        [...doc.querySelectorAll('.reference.internal')].forEach(node => {
          node.parentNode.removeChild(node);
        });
        // generate toc from hrefs and insert it behind of h1 title
        const title = doc.querySelector('[itemprop=articleBody] > div > h1');
        const tocElement = `<ul className="api-reference-toc">${hrefs.reduce(
          (prev, item) => prev + `<li>${item}</li>`,
          ''
        )}</ul>`;
        title.insertAdjacentHTML('afterend', tocElement);
        [...doc.querySelectorAll('pre')].forEach(node => {
          node.innerHTML = `<code>${node.innerHTML}</code>`;
        });
        // only need article body html
        doc = doc.querySelector('[itemprop=articleBody] > div').innerHTML;
        apiFiles.push({
          doc,
          hrefs,
          linkId,
          name: filesList[i],
          abspath: filePath,
          version,
          category: 'pymilvus',
          labels: ['api_reference'],
        });
      }
    }
  } catch (e) {
    console.log('Read pymilvus api files failed');
    throw e;
  }
};

/**
 * Find and get the path of all files under the dirPath.
 * @param {string} dirPath Target directory.
 * @param {array} pathList A list of initial results if necessary.
 * @returns A list of initial results and calculated path of all files under the dirPath.
 */
const getAllFilesAbsolutePath = (dirPath, pathList = []) => {
  let filesList = fs.readdirSync(dirPath);
  for (let i = 0; i < filesList.length; i++) {
    // concat current file path: ${parent_path}/${current_file_name}
    let filePath = path.join(dirPath, filesList[i]);
    // get file info by filePath, return a fs.Stats object
    let stats = fs.statSync(filePath);
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
 * Handle html pages under `${parentPath}/${version}` and fromat them.
 * Different from handlePyFiles, pymilvus only has one page but orm has a few.
 * Data: pymilvus:      articleBody > div
 * Data: pymilvus-orm:  articleBody > section
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/pymilvus"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handlePyOrmFiles = (parentPath, version, apiFiles) => {
  const dirPath = `${parentPath}/${version}`;
  try {
    let filesList = getAllFilesAbsolutePath(dirPath);
    for (let i = 0; i < filesList.length; i++) {
      let filePath = filesList[i];
      if (filePath.endsWith('.html')) {
        let doc = HTMLParser.parse(fs.readFileSync(filePath));
        // get articleBody node
        const bodyHTML = doc.querySelector('[itemprop=articleBody] > section')
          .innerHTML;
        // filter out linked element ids
        const linkRegex = /id="[A-Za-z0-9_-]*"/g;
        const linkId = Array.from(bodyHTML.matchAll(linkRegex)).map(link =>
          link[0].slice(4, link[0].length - 1)
        );
        // match href with ids
        const hrefs = [];
        [...doc.querySelectorAll('a')].forEach(node => {
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
        [...doc.querySelectorAll('.reference.internal')].forEach(node => {
          node.parentNode.removeChild(node);
        });
        // generate toc from hrefs and insert it behind of h1 title
        const title = doc.querySelector(
          '[itemprop=articleBody] > section > h1'
        );
        const tocElement = `<ul className="api-reference-toc">${hrefs.reduce(
          (prev, item) => prev + `<li>${item}</li>`,
          ''
        )}</ul>`;
        title.insertAdjacentHTML('afterend', tocElement);
        [...doc.querySelectorAll('pre')].forEach(node => {
          node.innerHTML = `<code>${node.innerHTML}</code>`;
        });
        // only need article body html
        doc = doc.querySelector('[itemprop=articleBody] > section').innerHTML;
        apiFiles.push({
          doc,
          hrefs,
          linkId,
          name: getFileName(filePath),
          abspath: filePath,
          version,
          category: 'pymilvus-orm',
          labels: ['api_reference', 'pymilvus_orm'],
        });
      }
    }
    // Add the directory for api menus, should not be created as a page.
    // Using pymilvus_orm("_" instead of "-") here because of the Function findItem()[src/components/menu/index.jsx#L5]
    filesList.length &&
      apiFiles.push({
        doc: '',
        hrefs: [],
        linkId: [],
        name: 'pymilvus_orm',
        abspath: dirPath,
        version,
        category: 'pymilvus-orm',
        labels: ['api_reference'],
        isDirectory: true,
      });
  } catch (e) {
    console.log('Read pymilvus-orm api files failed');
    throw e;
  }
};

/**
 * Handle html pages under `${parentPath}/${version}` and fromat them.
 * Go docs are generated by godoc.
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/milvus-sdk-go"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handleGoFiles = (parentPath, version, apiFiles) => {
  const dirPath = `${parentPath}/${version}`;
  try {
    let filesList = fs.readdirSync(dirPath);
    for (let i = 0; i < filesList.length; i++) {
      let filePath = path.join(dirPath, filesList[i]);
      if (filePath.endsWith('.html')) {
        let doc = HTMLParser.parse(fs.readFileSync(filePath));
        // get content
        doc = doc.querySelector('#page');
        // remove useless content
        doc.querySelector('#nav')?.remove();
        [...doc.querySelectorAll('script')].forEach(node =>
          node.parentNode.removeChild(node)
        );
        doc.querySelector('#short-nav')?.remove();
        [...doc.querySelectorAll('.collapsed')].forEach(node =>
          node.parentNode.removeChild(node)
        );
        doc.querySelector('#pkg-subdirectories')?.remove();
        doc.querySelector('.pkg-dir')?.remove();
        doc.querySelector('#footer')?.remove();
        // replace <a> tag with text
        [...doc.querySelectorAll('pre')].forEach(node => {
          const innerHTML = node.innerHTML;
          let preEle = HTMLParser.parse(innerHTML);
          [...preEle.querySelectorAll('a')].forEach(e => {
            const textContent = e.textContent;
            textContent && e.replaceWith(textContent);
          });
          const outerHTML = preEle.outerHTML;
          node.innerHTML = `<code>${outerHTML}</code>`;
        });
        const removableAhrefs = [
          ...doc.querySelectorAll('h2'),
          ...doc.querySelectorAll('h3'),
        ];
        removableAhrefs.forEach(node => {
          const ele = node.querySelector('a');
          const textContent = ele?.textContent;
          textContent && ele.replaceWith(textContent);
        });
        doc.querySelector('#pkg-index h3')?.remove();
        doc.querySelector('#pkg-index p')?.remove();
        [...doc.querySelectorAll('h2[title]')].forEach(node => {
          const textContent = node.textContent?.slice(0, -2);
          textContent && node.replaceWith(`<h2>${textContent}</h2>`);
        });
        doc = doc.querySelector('div.container').innerHTML;
        apiFiles.push({
          doc,
          hrefs: [],
          linkId: [],
          name: filesList[i],
          abspath: filePath,
          version,
          category: 'go',
          labels: ['api_reference'],
        });
      }
    }
  } catch (e) {
    console.log('Read milvus-sdk-go files failed');
    throw e;
  }
};

/**
 * Handle html pages under `${parentPath}/${version}` and fromat them.
 * Java docs are generated by javadoc(IntelliJ IDEA).
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/milvus-sdk-java"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handleJavaFiles = (parentPath, version, apiFiles) => {
  const dirPath = `${parentPath}/${version}`;
  const getFileRelativePath = (path, dir) => {
    return path.split(`${dir}/`).pop();
  };
  try {
    let filesList = getAllFilesAbsolutePath(dirPath);
    for (let i = 0; i < filesList.length; i++) {
      let filePath = filesList[i];
      if (filePath.endsWith('.html')) {
        let doc = HTMLParser.parse(fs.readFileSync(filePath));
        // remove see also
        doc.querySelector('.contentContainer .description dl:last-child')?.remove();
        [...doc.querySelectorAll('table')].forEach(element => {
          element.querySelector('caption')?.remove();
        });
        [...doc.querySelectorAll('pre')].forEach(node => {
          node.innerHTML = `<code>${node.innerHTML}</code>`;
        });
        [...doc.querySelectorAll('a')].forEach(node => {
          !node.textContent.split('\n').join('') && node?.remove();
        });
        const title = doc.querySelector('.header .title');
        title?.replaceWith(`<h1 class="title">${title.textContent}</h1>`);
        // only need article body html
        doc = doc.querySelector('body > main').innerHTML;
        getFileRelativePath(filePath, version).includes('exception')
          ? apiFiles.push({
              doc,
              hrefs: [],
              linkId: [],
              name: getFileRelativePath(filePath, version),
              abspath: filePath,
              version,
              category: 'java',
              labels: ['api_reference', 'java', 'exception'],
            })
          : apiFiles.push({
              doc,
              hrefs: [],
              linkId: [],
              name: getFileName(filePath),
              abspath: filePath,
              version,
              category: 'java',
              labels: ['api_reference', 'java'],
            });
      }
    }
    // Add the directory for api menus, should not be created as a page.
    // Using pymilvus_orm("_" instead of "-") here because of the Function findItem()[src/components/menu/index.jsx#L5]
    filesList.length &&
      apiFiles.push({
        doc: '',
        hrefs: [],
        linkId: [],
        name: 'java',
        abspath: dirPath,
        version,
        category: 'java',
        labels: ['api_reference'],
        isDirectory: true,
      }) &&
      apiFiles.push({
        doc: '',
        hrefs: [],
        linkId: [],
        name: 'exception',
        abspath: `${dirPath}/exception`,
        version,
        category: 'java',
        labels: ['api_reference', 'java'],
        isDirectory: true,
      });
  } catch (e) {
    console.log('Read milvus-sdk-java api files failed');
    throw e;
  }
};

module.exports = {
  generateNodes,
  handlePyFiles,
  handlePyOrmFiles,
  handleGoFiles,
  handleJavaFiles,
};
