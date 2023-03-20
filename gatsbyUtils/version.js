const path = require('path');
// find version
const ReadVersionJson = require('../walkFile');
const DOC_ROOT = path.join(__dirname, `../src/pages/docs/versions`);
const versionInfo = ReadVersionJson(DOC_ROOT);

const getNewestVersion = versionInfo => {
  const keys = Object.keys(versionInfo).filter(
    v =>
      v !== 'master' &&
      !v.includes('beta') &&
      (versionInfo[v].released === 'yes' ||
        process.env.IS_PREVIEW === 'preview')
  );
  return keys.reduce((pre, cur) => {
    const curVersion = cur
      .substring(1)
      .split('.')
      .map(v => Number(v));
    const preVersion = pre
      .substring(1)
      .split('.')
      .map(v => Number(v));

    if (curVersion[0] !== preVersion[0]) {
      pre = curVersion[0] < preVersion[0] ? pre : cur;
    } else if (curVersion[1] !== preVersion[1]) {
      pre = curVersion[1] < preVersion[1] ? pre : cur;
    } else if (curVersion[2] !== preVersion[2]) {
      pre = curVersion[2] < preVersion[2] ? pre : cur;
    } else {
      pre = cur;
    }

    return pre;
  }, 'v0.0.0');
};

const newestVersion = getNewestVersion(versionInfo);

let versions = [];

Object.keys(versionInfo).forEach(v => {
  if (versionInfo[v].released === 'yes' && v !== 'preview') {
    versions.push(v);
  }
});

if (process.env.IS_PREVIEW === 'preview') {
  versions = [versionInfo.preview.version];
}

const findVersion = str => {
  const tags = str.split('/').filter(part => part.startsWith('v'));
  const tag =
    process.env.IS_PREVIEW === 'preview' && str.includes('preview')
      ? 'preview'
      : tags[1];

  const result = versionInfo[tag] && versionInfo[tag].version;

  return result;
};

module.exports = {
  versionInfo,
  newestVersion,
  versions,
  findVersion,
};
