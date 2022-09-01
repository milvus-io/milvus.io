import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { formatFileName, formatMenus, getMenuInfoById } from './docUtils';

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

const DIR_TYPE_ENUM = {
  MENU: 'menu',
  DOC: 'doc',
};

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

// get list of all doc info without content
const generateDocsInfo = (dirPath, version, lang, widthContent = false) => {
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
export const generateCurDocInfo = (id, version, lang = 'en') => {
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

export const generateCurVersionMenuList = (lang = 'en', version = 'v2.0.x') => {
  const menuDir = getDirByType(VDC_DOC_DIR, lang, DIR_TYPE_ENUM.MENU, version);
  const menus = generateMenu(menuDir);
  return menus;
};

export const generateAllVersionPaths = () => {
  const docDirs = [];
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

// target: doc | bootcamp | cummunity | api_reference
export const generateAvailableVersions = target => {
  const docDir = VDC_DOC_DIR;

  const ignorePaths = [
    'git',
    'md',
    'json',
    'lock',
    'LICENSE',
    'export_pdf',
    'v0.',
  ];
  const versions = fs.readdirSync(docDir).filter(v => {
    return !ignorePaths.some(name => v.includes(name));
  });

  return versions;
};

// get home page mkd content of current verison
export const getCurVersionHomeMd = (version, lang) => {
  const langFolderName = lang === 'en' ? 'en' : 'zh_CN';
  const path = join(
    VDC_DOC_DIR,
    `${version}/site/${langFolderName}/home/home.md`
  );

  const fileContents = fs.readFileSync(path, 'utf8');
  const { data, content } = matter(fileContents);
  return content;
};

// data used in api pages. lang: 'go' | 'java' | 'node' | 'pymilvus'
export const generateApiData = (lang = 'pymilvus', version) => {
  // {id: xxx.md, content: xxxxx}[]
  let contentList = [];
  const dir = join(VDC_DOC_DIR, 'API_Reference');
  const paths = fs.readdirSync(dir);

  const curLangFolderName = paths.filter(v => v.includes(lang))[0];
  const curLangPath = join(dir, curLangFolderName);

  const versions = fs.readdirSync(curLangPath);

  // version param or newest version
  const curVerison = versions.includes(version)
    ? version
    : versions.reverse().slice(0, 1)[0];

  const curVersionPath = join(curLangPath, curVerison);

  // data: {id: xxx.md, label: xxx, children: []}[]
  const data = walkApiFiels(curVersionPath, contentList);

  return {
    versions,
    curVerison,
    menuList: data,
    contentList: contentList,
  };
};

// data used in community pages. lang: 'en' | 'cn'
export const generateCommunityData = (lang = 'en') => {
  const language = lang === 'en' ? 'en' : 'zh-CN';
  const articlePath = join(
    VDC_DOC_DIR,
    `community/site/${language}/communityArticles`
  );
  const homePath = join(
    VDC_DOC_DIR,
    `community/site/${language}/communityHome/home.md`
  );
  const menuPath = join(
    VDC_DOC_DIR,
    `community/site/${language}/communityArticles/communityMenu/${lang}.json`
  );

  const articleList = [];
  walkApiFiels(articlePath, articleList);
  const routers = articleList.map(v => ({
    id: v.label,
  }));

  const homeMd = fs.readFileSync(homePath, 'utf-8');

  const { data, content } = matter(homeMd);

  const menusList = fs.readFileSync(menuPath, 'utf-8');

  return {
    communityArticles: articleList,
    routers,
    homeData: content,
    menus: menusList,
  };
};

// lang: 'en' | 'cn'; version: start from v1.0.0
export const generateDocsData = (version, lang = 'en') => {
  const contentList = [];
  const availabelVerisons = ['v1', 'v2', 'v0.x'];
  const ignorePaths = ['template', 'git', 'menuStructure'];
  const langFolderName = lang === 'en' ? 'en' : 'zh_CN';

  const availableVersions = fs
    .readdirSync(VDC_DOC_DIR)
    .filter(v => availabelVerisons.some(i => v.includes(i)));

  const curVersion = availableVersions.includes(version)
    ? version
    : availableVersions.reverse().slice(0, 1)[0];

  const curVerionPath = join(
    VDC_DOC_DIR,
    `${curVersion}/site/${langFolderName}`
  );

  const curVersionMenuPath = join(
    VDC_DOC_DIR,
    `${curVersion}/site/${langFolderName}/menuStructure/${lang}.json`
  );

  walkFiels(curVerionPath, ignorePaths, contentList);

  const menu = fs.readFileSync(curVersionMenuPath, 'utf-8');

  const routers = contentList.map(v => ({
    id: v.label,
  }));

  return {
    menus: menu,
    routers,
    docArticals: contentList,
    versions: availableVersions,
    version: curVersion,
  };
};

// recursively read file
export function walkApiFiels(path, flattenedContentList = []) {
  const paths = fs.readdirSync(path);

  return paths.map(subPath => {
    const filePath = join(path, subPath);
    const state = fs.statSync(filePath);
    if (state.isDirectory()) {
      return {
        id: subPath,
        label: formatFileName(subPath),
        isMenu: true,
        children: walkApiFiels(filePath, flattenedContentList),
      };
    }
    const file = fs.readFileSync(filePath, 'utf-8');
    flattenedContentList.push({
      id: subPath,
      content: file,
    });
    return {
      id: subPath,
      label: formatFileName(subPath),
    };
  });
}

export function walkFiels(path, ignorePaths, list = []) {
  const paths = fs.readdirSync(path);

  paths.forEach(subPath => {
    const filePath = join(path, subPath);
    const state = fs.statSync(filePath);

    if (!ignorePaths.includes(filePath)) {
      if (state.isDirectory()) {
        walkFiels(filePath, ignorePaths, list);
      } else {
        const file = fs.readFileSync(filePath, 'utf-8');
        list.push({
          id: subPath,
          content: file,
        });
      }
    }
  });
}
