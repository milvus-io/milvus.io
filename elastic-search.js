const axios = require('axios');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const cmdParams = minimist(process.argv.slice(2));
const getAllActiveVersions = require('./walkFile');

const getMarkdownInfo = path_abs => {
  const res = {};
  const content = fs.readFileSync(path_abs).toString();
  const regex = /^\-\-\-[\s\S]*\-\-\-/gi;
  const arr = content.match(regex);
  if (arr) {
    const str_var = arr[0].split('---')[1];
    const isWindows = str_var.indexOf('\r\n') > -1;
    str_var.split(isWindows ? '\r\n' : '\n').forEach(str_key_value => {
      if (str_key_value) {
        const [key, value] = str_key_value.split(':');
        res[key.trim()] = value.trim();
      }
    });
  }
  return {
    content,
    info: res,
  };
};

const BASE_URL = `${process.env.ES_URL || 'http://127.0.0.1:1337'}`;

const CREATE_INDEX_URL = `${BASE_URL}/strapi-plugin-elasticsearch/create-update-index`;
const DELETE_INDEX_URL = `${BASE_URL}/strapi-plugin-elasticsearch/delete-index`;

const updateElastic = async filePath => {
  const remove_variable_regx = /^\-\-\-[\s\S]*\-\-\-/gi;
  const { content, info } = getMarkdownInfo(filePath);
  if (!info.id) return content;
  // it should be unique
  const remove_html_tags_regx = /\<.*?\>/gi;
  const version_regx = /(?<=master\/)(.*)(?=\/site)/i;
  const contentWithoutHtmlTag = content.replace(remove_html_tags_regx, '');
  const contentWithoutVariables = contentWithoutHtmlTag.replace(
    remove_variable_regx,
    ''
  );
  const match = filePath.match(version_regx);
  const version = match && match[0];
  const language = filePath.includes('/en/') ? 'en' : 'cn';

  if (!version) return;
  const indexName =
    language === 'en' ? `milvus-docs-${version}` : `milvus-docs-${version}-cn`;

  try {
    // fileid -> name and id. need unique
    const res = await axios.post(CREATE_INDEX_URL, {
      content: contentWithoutVariables,
      fileId: info.id,
      index: indexName,
    });
    console.log(`---- update ${indexName} ${info.id} index done ----`);
    return res;
  } catch (error) {
    throw error;
  }
};

async function walkFiles(dirPath, fileObj = {}) {
  let filesList = fs.readdirSync(dirPath);
  for (let i = 0; i < filesList.length; i++) {
    let filePath = path.join(dirPath, filesList[i]);
    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      if (filePath.includes('fragments')) {
        continue;
      }
      walkFiles(filePath, fileObj);
    } else {
      await updateElastic(filePath);
    }
  }
  return fileObj;
}

const versionInfo = getAllActiveVersions('src/pages/docs/versions');
const versions = Object.keys(versionInfo);
const AUTH = process.env.ES_DEL_AUTH;

const deleteAllIndexes = async () => {
  return new Promise(async (res, rej) => {
    for (let i = 0; i < versions.length; i++) {
      if (versions[i].includes('.')) {
        await axios.post(DELETE_INDEX_URL, {
          index: `milvus-docs-${versions[i]}`,
          auth: AUTH,
        });
        await axios.post(DELETE_INDEX_URL, {
          index: `milvus-docs-${versions[i]}-cn`,
          auth: AUTH,
        });
      }
    }
    res('done');
  });
};
console.log('----------delete start--------');

deleteAllIndexes().then(() => {
  console.log('----------delete done--------');

  walkFiles('src/pages/docs/versions/master');
  console.log('----------all done-----------');
});
