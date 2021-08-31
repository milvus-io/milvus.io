const fs = require('fs');
const path = require('path');

/**
 * @param dirPath the root dir
 * @returns {'master':{version: '0.4.0',released: 'yes/no'}}
 */
function walkFiles(dirPath, fileObj = {}) {
  let filesList = fs.readdirSync(dirPath);
  for (let i = 0; i < filesList.length; i++) {
    //拼接当前文件的路径(上一层路径+当前file的名字)
    let filePath = path.join(dirPath, filesList[i]);
    //根据文件路径获取文件信息，返回一个fs.Stats对象
    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      //递归调用
      walkFiles(filePath, fileObj);
    } else {
      switch (filesList[i]) {
        // extract doc version
        case 'version.json':
          handleCfgFile(fileObj, { dirPath, filePath });
          break;
        // extract api versions
        case 'Variables.json':
          handleCfgFile(fileObj, { dirPath, filePath, isVariables: true });
          break;
        default:
          break;
      }
    }
  }
  return fileObj;
}

/**
 * read directory and generate versions result
 * @param {obejct} fileObj versions result from file name:
 * {'v1.1.0': { pymilvus: 'v1.1.0', version: 'v1.1.0', released: 'yes' },
 * master: { version: 'v2.0.0', released: 'no' }}
 * @param {object} param1 { dirPath, filePath, isVariables }
 */
const handleCfgFile = (fileObj, { dirPath, filePath, isVariables }) => {
  const paths = dirPath.split('/');
  const parent = paths[paths.length - 1];
  const doc = fs.readFileSync(filePath);
  const content = JSON.parse(doc.toString());
  let result = content;
  if (isVariables) {
    const pymilvus =
      content?.milvus_python_sdk_version &&
      `v${content?.milvus_python_sdk_version}`;
    const go =
      content?.milvus_go_sdk_version && `v${content?.milvus_go_sdk_version}`;
    const java =
      content?.milvus_java_sdk_version &&
      `v${content?.milvus_java_sdk_version}`;
    const node =
      content?.milvus_node_sdk_version &&
      content?.milvus_node_sdk_version >= '1.0.14' &&
      `v${content?.milvus_node_sdk_version}`;
    result = { pymilvus, go, java, node };
  }
  fileObj[parent] = fileObj[parent]
    ? { ...fileObj[parent], ...result }
    : result;
};

module.exports = walkFiles;
