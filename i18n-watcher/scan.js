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

function bootstrap() {
  console.info(chalk.yellow(`Scanning ${EN_DIR}...`));
  const files = fs
    .readdirSync(EN_DIR)
    .filter(file => path.extname(file) === '.json');

  for (const file of files) {
    handleFileChanges(file);
  }

  console.info(
    chalk.green(`Scanning completed. ${files.length} files processed.`)
  );
}
bootstrap();
