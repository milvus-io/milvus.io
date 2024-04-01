const fs = require('fs');
const { join } = require('path');

const BOOT_CAMP_ORIGINAL_FILE_PATH = join(
  process.cwd(),
  'src/docs/bootcamp/site/en/bootcampHome/index.json'
);

export const generateBootCampData = () => {
  const bootCampData = fs.readFileSync(BOOT_CAMP_ORIGINAL_FILE_PATH, 'utf8');
  return JSON.parse(bootCampData);
};
