const fs = require('fs');
const { join } = require('path');

const BOOTCAMP_ORIGINAL_FILE_PATH = join(
  process.cwd(),
  'src/docs/bootcamp/site/en/bootcampHome/index.json'
);

export const generateBootcampData = () => {
  const bootcampData = fs.readFileSync(BOOTCAMP_ORIGINAL_FILE_PATH, 'utf8');
  return JSON.parse(bootcampData);
};
