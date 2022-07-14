import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { formatFileName, formatMenus, getMenuInfoById } from './docUtils';

// constants
const VDC_DOC_DIR = join(process.cwd(), 'src/docs/vectordb');
const VERSION_REGEX = /^v[0-9].*/;
const IGNORE_FILES = [
  'index.md',
  'README.md',
  'Variables.json',
  '.DS_Store',
  'fragments',
  'menuStructure',
];

const  DIR_TYPE_ENUM ={
  MENU: 'menu',
  DOC :'doc',
}

/**
 * get current version and lang doc directory or menu structure file
 * @param basePath
 * @param lang
 * @param type DIR_TYPE_ENUM
 * @param version
 * @returns
 */
const getDirByType = (
  basePath,
  lang = 'en',
  type,
  version
) => {
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

const generateMenu = (dir) => {
  try {
    const { menuList } = JSON.parse(fs.readFileSync(dir, 'utf-8'));

    return formatMenus(menuList);
  } catch (err) {
    throw err;
  }
};

// get list of all doc info without content
const generateDocsInfo = (
  dirPath,
  version,
  lang,
  widthContent = false
) => {
  const subDirPaths = fs
    .readdirSync(dirPath)
    .filter(v => !IGNORE_FILES.includes(v))
    .map(i => join(dirPath, i));

  return subDirPaths
    .map(path => {
      let stats = fs.statSync(path);
      if (stats.isDirectory()) {
        return generateDocsInfo(path, version, lang, widthContent);
      } else {
        if (path.includes('.md') && !IGNORE_FILES.includes(path)) {
          const fileContents = fs.readFileSync(path, 'utf8');
          const { data, content } = matter(fileContents);
          const { summary = '', id } = data;

          return {
            summary: widthContent ? summary : '',
            content: widthContent ? content : '',
            // TODO: remove this to let TC remove md in id in every doc frontmatter
            id: formatFileName(id),
            version,
            lang,
          };
        }
      }
    })
    .flat(Infinity);
};

//
export const generateCurDocInfo = (
  id,
  version,
  lang = 'en'
) => {
  const prifixPath = getDirByType(
    VDC_DOC_DIR,
    'en',
    DIR_TYPE_ENUM.DOC,
    version
  );

  const curVersionDocs = generateDocsInfo(prifixPath, version, lang, true);
  const doc = curVersionDocs
    .flat(Infinity)
    .filter(v => !!v)
    .find(v => {
      return v.id === id;
    }) || {
    summary: 'No Data',
    content: 'No Data',
    id: formatFileName(id),
    version,
    lang,
  };

  // console.log(doc);

  return doc;
};

export const generateCurVersionMenuList = (
  lang = 'en',
  version = 'v2.0.x'
) => {
  const menuDir = getDirByType(VDC_DOC_DIR, lang, DIR_TYPE_ENUM.MENU, version);
  const menus = generateMenu(menuDir);
  return menus;
};

export const generateAllVersionPaths = () => {
  const docDirs= [];
  const versionsDocsDirs = fs
    .readdirSync(VDC_DOC_DIR)
    .filter(v => VERSION_REGEX.test(v));
  versionsDocsDirs.forEach(version => {
    docDirs.push({
      lang: 'en',
      version,
      path: join(VDC_DOC_DIR, `/${version}/site/en`),
    });
  });

  let docs = [];
  docDirs.forEach(v => {
    docs = docs.concat(generateDocsInfo(v.path, v.version, v.lang, false));
  });

  const paths = docs
    .flat(2)
    // every doc must have id in frontmatter, otherwise it won't be shown in website
    .filter(doc => doc && !!doc?.id)
    .map(d => ({
      params: { slug: d.id, version: d.version },
    }));
  return paths;
};
