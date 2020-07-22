const fs = require("fs");
const path = require("path");

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
      if (filesList[i] === "version.json") {
        const paths = dirPath.split("/");
        const parent = paths[paths.length - 1];
        const doc = fs.readFileSync(filePath);
        const content = JSON.parse(doc.toString());
        fileObj[parent] = content;
      }
    }
  }
  return fileObj;
}

module.exports = walkFiles;
