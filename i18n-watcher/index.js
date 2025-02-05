const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { handleFileChanges } = require('./utils');
const { EN_DIR, CACHE_DIR, CHANGES_DIR } = require('./const');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}
if (!fs.existsSync(CHANGES_DIR)) {
  fs.mkdirSync(CHANGES_DIR);
}

const watcher = chokidar.watch(EN_DIR, {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', (event, filePath) => {
  console.log(chalk.green(`Detected file ${event}: ${filePath}`));
  if (path.extname(filePath) === '.json') {
    try {
      const relativePath = path.relative(EN_DIR, filePath);
      const cacheFilePath = path.join(CACHE_DIR, relativePath);

      if (event === 'unlink') {
        // Delete file
        fs.existsSync(cacheFilePath) && fs.unlinkSync(cacheFilePath);
      } else {
        // Update file
        handleFileChanges(relativePath);
      }
    } catch (err) {
      console.error(chalk.red(`Error processing file: ${filePath}`));
    }
  }
});

console.log(chalk.green(`Watching for changes in ${EN_DIR}...`));
