const fs = require('fs');
const path = require('path');

const { EN_DIR, CACHE_DIR, CHANGES_DIR } = require('./const');

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item, index) => {
    if (Array.isArray(item) && Array.isArray(arr2[index])) {
      return arraysAreEqual(item, arr2[index]);
    } else if (typeof item === 'object' && typeof arr2[index] === 'object') {
      return JSON.stringify(item) === JSON.stringify(arr2[index]);
    }
    return item === arr2[index];
  });
}

function findDifferences(oldObj = {}, newObj, prefix = '') {
  const changes = {
    added: {},
    modified: {},
    deleted: {},
  };

  for (const key in newObj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (!(key in oldObj)) {
      if (typeof newObj[key] === 'object' && !Array.isArray(newObj[key])) {
        const nestedChanges = findDifferences({}, newObj[key], fullKey);
        Object.assign(changes.added, nestedChanges.added);
      } else {
        changes.added[fullKey] = newObj[key];
      }
    } else if (Array.isArray(newObj[key])) {
      if (
        !Array.isArray(oldObj[key]) ||
        !arraysAreEqual(oldObj[key], newObj[key])
      ) {
        for (let i = 0; i < newObj[key].length; i++) {
          const nestedChanges = findDifferences(
            oldObj[key][i],
            newObj[key][i],
            `${fullKey}.${i}`
          );
          Object.assign(changes.added, nestedChanges.added);
          Object.assign(changes.modified, nestedChanges.modified);
          Object.assign(changes.deleted, nestedChanges.deleted);
        }
      }
    } else if (typeof newObj[key] === 'object') {
      const nestedChanges = findDifferences(oldObj[key], newObj[key], fullKey);
      Object.assign(changes.added, nestedChanges.added);
      Object.assign(changes.modified, nestedChanges.modified);
      Object.assign(changes.deleted, nestedChanges.deleted);
    } else if (oldObj[key] !== newObj[key]) {
      changes.modified[fullKey] = newObj[key];
    }
  }

  for (const key in oldObj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in newObj)) {
      changes.deleted[fullKey] = oldObj[key];
    }
  }

  return changes;
}

function copyEnToBackup() {
  console.info('copy file from en to backup...');
  fs.readdirSync(EN_DIR).forEach(file => {
    if (path.extname(file) === '.json') {
      const source = path.join(EN_DIR, file);
      const target = path.join(CACHE_DIR, file);
      fs.copyFileSync(source, target);
    }
  });
  console.info('copy file done.');
}

function saveChanges(filename, changes) {
  const changedPath = path.join(CHANGES_DIR, filename);
  console.log('save changes to: ', CHANGES_DIR, filename);
  fs.writeFileSync(changedPath, JSON.stringify(changes, null, 2));
}

function handleFileChanges(relativePath) {
  const filePath = path.join(EN_DIR, relativePath);
  const cacheFilePath = path.join(CACHE_DIR, relativePath);
  const changesFilePath = path.join(CHANGES_DIR, relativePath);

  let enContent = {};
  try {
    const enContentString = fs.readFileSync(filePath, 'utf-8');
    enContent = JSON.parse(enContentString || '{}');
  } catch (err) {
    console.error(`Error parsing JSON file: ${filePath}`);
    return;
  }

  let cacheContent = {};
  if (fs.existsSync(cacheFilePath)) {
    cacheContent = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
  }

  const changes = findDifferences(cacheContent, enContent);
  const hasChanged =
    Object.keys(changes.added).length ||
    Object.keys(changes.modified).length ||
    Object.keys(changes.deleted).length;

  if (hasChanged) {
    saveChanges(relativePath, changes);
    console.log(`Saved changes to change file`);
  } else {
    fs.existsSync(changesFilePath) && fs.unlinkSync(changesFilePath);
  }
}

module.exports = {
  findDifferences,
  copyEnToBackup,
  saveChanges,
  handleFileChanges,
};
