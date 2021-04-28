const axios = require('axios');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const cmdParams = minimist(process.argv.slice(2));

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

const CREATE_INDEX_URL = `${
  process.env.ES_URL ||
  'http://127.0.0.1:1337/strapi-plugin-elasticsearch/create-update-index'
}`;

// const esClient = new Client({
//   node: process.env.ES_URL || "http://127.0.0.1:9200",
//   auth: {
//     username: process.env.ES_USER,
//     password: process.env.ES_PASS
//   },
// });

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
  console.log('---all done---');
  return fileObj;
}

walkFiles('src/pages/docs/versions/master');
