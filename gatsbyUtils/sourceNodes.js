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
 * Use doc2html function and data from param2 to format html,
 * and generate apiFile object adding to apiFiles.
 * @param {function} doc2html (document) => { docHTML, hrefs = [], linkId = [] }
 * @param {array} apiFiles Pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 * @param {object} param2 { parentPath, version, category }
 * parentPath: api category dir path, such as "src/pages/APIReference/pymilvus"
 * version: api version, such as "v1.0.1"
 * category: categoty name, such as "pymilvus", "pymilvus-orm" and "go"
 */
const handleApiFiles = (
  doc2html,
  apiFiles,
  { parentPath, version, category }
) => {
  const dirPath = `${parentPath}/${version}`;
  try {
    let filesList = getAllFilesAbsolutePath(dirPath);
    // Level: api_reference(root directory) > 2nd level directory > 3rd level directory.
    const thridLevelDirectoryList = [];
    // Get all HTML files under dirPath.
    const htmlFiles = filesList.filter(i => i.endsWith('.html'));
    // If this dirPath has only one page or not, regardless how many directories.
    const isSinglePage = htmlFiles.length === 1;
    for (let i = 0; i < htmlFiles.length; i++) {
      let filePath = htmlFiles[i];
      let doc = HTMLParser.parse(fs.readFileSync(filePath));
      // Use custom doc2html function to generate docHTML and other data.
      const { docHTML, title = '', order = -2 } = doc2html(doc);
      const relativePath = getFileRelativePath(filePath, version);
      const parentPath = relativePath.split('/').slice(0, -1).join('/');
      // Record the parentPath as a thrid level directory.
      parentPath && thridLevelDirectoryList.push(parentPath);
      parentPath
        ? // Handle the pages those have a 3rd level directory and dd a label2/3.
          // Need to remove label2/3 if it's a single page.
          apiFiles.push({
            doc: docHTML,
            name: getFileRelativePath(filePath, version),
            abspath: filePath,
            version,
            category,
            title,
            order,
            labels: [
              'api_reference',
              isSinglePage ? '' : category.replace('-', '_'),
              isSinglePage ? '' : parentPath.replace('-', '_'),
            ],
          })
        : apiFiles.push({
            doc: docHTML,
            name: getFileName(filePath),
            abspath: filePath,
            version,
            category,
            title,
            order,
            labels: [
              'api_reference',
              isSinglePage ? '' : category.replace('-', '_'),
            ],
          });
    }
    // Deduplicate.
    const uniq = [...new Set(thridLevelDirectoryList)];
    // Add 3rd level directory menu. Should ignore if single page.
    !isSinglePage &&
      apiFiles.push({
        doc: '',
        name: category.replace('-', '_'),
        abspath: dirPath,
        version,
        category,
        labels: ['api_reference'],
        isDirectory: true,
      }) &&
      uniq.forEach(f =>
        apiFiles.push({
          doc: '',
          name: f.replace('-', '_'),
          abspath: `${dirPath}/${f}`,
          version,
          category,
          labels: ['api_reference', category.replace('-', '_')],
          isDirectory: true,
        })
      );
  } catch (e) {
    console.log(`Read ${category} api files failed`);
    throw e;
  }
};

/**
 * handle html pages under `${parentPath}/${version}` and fromat them
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/pymilvus"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handlePyFiles = (parentPath, version, apiFiles) => {
  const calculateOrder = toctree => {
    for (let i = 0; i < toctree.length; i++) {
      const isCurrent = toctree[i]?.getAttribute('class')?.includes('current');
      if (isCurrent) return i;
    }
    return toctree.length;
  };
  const doc2html = doc => {
    const bodyHTML = doc.querySelector(
      '[itemprop=articleBody] > div'
    ).innerHTML;
    // remove useless link
    [...doc.querySelectorAll('.reference.internal .viewcode-link')].forEach(
      node => {
        node.parentNode.parentNode.removeChild(node.parentNode);
      }
    );
    const leftNav = doc.querySelectorAll('.toctree-l1');
    const title = doc?.querySelector('h1')?.textContent?.slice(0, -1);
    const order = calculateOrder([...leftNav]);
    // Add <code> for <pre> content.
    [...doc.querySelectorAll('pre')].forEach(node => {
      const preNode = HTMLParser.parse(node.innerHTML);
      // Remove all unescaped HTML, here's <span>, which cause highlight warning.
      // https://github.com/highlightjs/highlight.js/issues/2886
      [...preNode.querySelectorAll('span')].forEach(span => {
        const spanText = span.textContent;
        span.replaceWith(spanText);
      });
      node.innerHTML = `<code>${preNode.outerHTML}</code>`;
    });
    // only need article body html
    doc = doc.querySelector('[itemprop=articleBody] > div').innerHTML;
    return { docHTML: doc, title, order };
  };
  handleApiFiles(doc2html, apiFiles, {
    parentPath,
    version,
    category: 'pymilvus',
  });
};

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
  const doc2html = doc => {
    const bodyHTML = doc.querySelector(
      '[itemprop=articleBody] > section'
    ).innerHTML;
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
    const title = doc.querySelector('[itemprop=articleBody] > section > h1');
    const tocElement = `<ul className="api-reference-toc">${hrefs.reduce(
      (prev, item) => prev + `<li>${item}</li>`,
      ''
    )}</ul>`;
    title.insertAdjacentHTML('afterend', tocElement);
    // Add <code> for <pre> content.
    [...doc.querySelectorAll('pre')].forEach(node => {
      const preNode = HTMLParser.parse(node.innerHTML);
      // Remove all unescaped HTML, here's <span>, which cause highlight warning.
      // https://github.com/highlightjs/highlight.js/issues/2886
      [...preNode.querySelectorAll('span')].forEach(span => {
        const spanText = span.textContent;
        span.replaceWith(spanText);
      });
      node.innerHTML = `<code>${preNode.outerHTML}</code>`;
    });
    // only need article body html
    doc = doc.querySelector('[itemprop=articleBody] > section').innerHTML;
    return { docHTML: doc, hrefs, linkId };
  };
  handleApiFiles(doc2html, apiFiles, {
    parentPath,
    version,
    category: 'pymilvus-orm',
  });
};

/**
 * Handle html pages under `${parentPath}/${version}` and fromat them.
 * Go docs are generated by godoc.
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/milvus-sdk-go"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handleGoFiles = (parentPath, version, apiFiles) => {
  const doc2html = doc => {
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
    // Add <code> for <pre> content.
    [...doc.querySelectorAll('pre')].forEach(node => {
      const preNode = HTMLParser.parse(node.innerHTML);
      // replace <a> tag with text
      [...preNode.querySelectorAll('a')].forEach(e => {
        const textContent = e.textContent;
        textContent && e.replaceWith(textContent);
      });
      [...preNode.querySelectorAll('span')].forEach(span => {
        const spanText = span.textContent;
        span.replaceWith(spanText);
      });
      node.innerHTML = `<code>${preNode.outerHTML}</code>`;
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
    return { docHTML: doc };
  };
  handleApiFiles(doc2html, apiFiles, {
    parentPath,
    version,
    category: 'go',
  });
};

/**
 * Handle html pages under `${parentPath}/${version}` and fromat them.
 * Java docs are generated by javadoc(IntelliJ IDEA).
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/milvus-sdk-java"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handleJavaFiles = (parentPath, version, apiFiles) => {
  const doc2html = doc => {
    // remove see also
    doc.querySelector('.contentContainer .description dl:last-child')?.remove();
    [...doc.querySelectorAll('table')].forEach(element => {
      element.querySelector('caption')?.remove();
    });
    // Add <code> for <pre> content.
    [...doc.querySelectorAll('pre')].forEach(node => {
      const preNode = HTMLParser.parse(node.innerHTML);
      // replace <a> tag with text
      [...preNode.querySelectorAll('a')].forEach(e => {
        const textContent = e.textContent;
        textContent && e.replaceWith(textContent);
      });
      [...preNode.querySelectorAll('span')].forEach(span => {
        const spanText = span.textContent;
        span.replaceWith(spanText);
      });
      node.innerHTML = `<code>${preNode.outerHTML}</code>`;
    });
    [...doc.querySelectorAll('a')].forEach(node => {
      !node.textContent.split('\n').join('') && node?.remove();
    });
    const title = doc.querySelector('.header .title');
    title?.replaceWith(`<h1 class="title">${title.textContent}</h1>`);
    const packageHierarchyLabel = doc.querySelector(
      '.header .packageHierarchyLabel'
    );
    // remove packageHierarchyLabel and it's description if exists
    if (packageHierarchyLabel) {
      doc.querySelector('.header span')?.remove();
      doc.querySelector('.header ul')?.remove();
      packageHierarchyLabel.remove();
    }
    // only need article body html
    doc = doc.querySelector('body > main').innerHTML;
    return { docHTML: doc };
  };
  handleApiFiles(doc2html, apiFiles, {
    parentPath,
    version,
    category: 'java',
  });
};

/**
 * Handle html pages under `${parentPath}/${version}` and fromat them.
 * Node docs are generated by typedoc.
 * @param {string} parentPath api category dir path, such as "src/pages/APIReference/milvus-sdk-node"
 * @param {string} version api version, such as "v1.0.1"
 * @param {array} apiFiles pages under `${parentPath}/${version}` will be formatted and pushed to apiFiles
 */
const handleNodeFiles = (parentPath, version, apiFiles) => {
  const doc2html = doc => {
    // only need article body html
    doc = doc.querySelector('.container-main  .col-content').innerHTML;
    return { docHTML: doc };
  };
  handleApiFiles(doc2html, apiFiles, {
    parentPath,
    version,
    category: 'node',
  });
};

module.exports = {
  generateNodes,
  handlePyFiles,
  handlePyOrmFiles,
  handleGoFiles,
  handleJavaFiles,
  handleNodeFiles,
};
