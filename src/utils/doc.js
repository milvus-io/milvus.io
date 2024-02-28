import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { formatFileName, formatMenus } from './docUtils';

// constants
const VDC_DOC_DIR = join(process.cwd(), 'src/docs');
const VERSION_REGEX = /^v[0-9].*/;
const IGNORE_FILES = [
  'index.md',
  'README.md',
  'Variables.json',
  '.DS_Store',
  'fragments',
  'menuStructure',
];

/**
 * get current version and lang doc directory or menu structure file
 * @param basePath
 * @param lang
 * @param type DIR_TYPE_ENUM
 * @param version
 * @returns
 */
const getDirByType = (basePath, lang = 'en', type, version) => {
  const versionDirectories = fs
    .readdirSync(basePath)
    .filter(v => VERSION_REGEX.test(v));
  const [defaultVersion] = versionDirectories;
  const currentVersion = version || defaultVersion;
  const filePathMap = {
    [DIR_TYPE_ENUM.DOC]: `${currentVersion}/site/${lang}`,
    [DIR_TYPE_ENUM.MENU]: `${currentVersion}/site/${lang}/menuStructure/${lang}.json`,
  };
  return join(basePath, filePathMap[type]);
};

const generateMenu = dir => {
  try {
    const { menuList } = JSON.parse(fs.readFileSync(dir, 'utf-8'));

    return formatMenus(menuList);
  } catch (err) {
    throw err;
  }
};

const generateDocs = dirPath => {
  const subDirPaths = fs
    .readdirSync(dirPath)
    .filter(v => !IGNORE_FILES.includes(v))
    .map(i => join(dirPath, i));

  return subDirPaths
    .map(path => {
      let stats = fs.statSync(path);
      if (stats.isDirectory()) {
        return generateDocs(path);
      } else {
        if (path.includes('.md') && !IGNORE_FILES.includes(path)) {
          const fileContents = fs.readFileSync(path, 'utf8');
          const { data, content } = matter(fileContents);
          const { summary, id } = data;

          return {
            content,
            summary,
            // TODO: remove this to let TC remove md in id in every doc frontmatter
            id: formatFileName(id),
          };
        }
      }
    })
    .flat(Infinity);
};

export const generateAllDocPaths = (lang = 'en', version) => {
  const docDir = getDirByType(VDC_DOC_DIR, lang, DIR_TYPE_ENUM.DOC, version);
  const docs = generateDocs(docDir);

  const paths = docs
    // every doc must have id in frontmatter, otherwise it won't be shown in website
    .filter(doc => !!doc.id)
    .map(d => ({
      params: { slug: d.id },
    }));
  return paths;
};

export const generateCurVersionMenuList = (lang = 'en', version) => {
  const menuDir = getDirByType(VDC_DOC_DIR, lang, DIR_TYPE_ENUM.MENU, version);
  const menus = generateMenu(menuDir);
  return menus;
};

export const getCurrentDoc = (id, lang = 'en', version) => {
  const docDir = getDirByType(VDC_DOC_DIR, lang, DIR_TYPE_ENUM.DOC, version);
  const docs = generateDocs(docDir);
  // TODO: remove formatFileName to let TC remove md in id in every doc frontmatter
  const doc = docs.find(v => formatFileName(v.id) === id) || {
    id: null,
    content: null,
    summary: null,
  };

  return doc;
};

// target: doc | bootcamp | cummunity | api_reference
export const generateAvailableVersions = target => {
  const docDir = VDC_DOC_DIR;

  const versions = fs.readdirSync(docDir);

  console.log('versions--', versions);
};
