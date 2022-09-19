import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import {
  formatFileName,
  formatMenus,
  getMenuInfoById,
  getNewestVersionTool,
} from './docUtils';
import { ConstructionOutlined } from '@mui/icons-material';

// constants
const DOC_DIR = join(process.cwd(), 'src/docs');
// const VERSION_REGX = /^v[0-9].*/;
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

const DOCS_MININUM_VERSION = 'v1.0.0';
const GO_MININUM_VERSION = 'v2.0.0';
const JAVA_MININUM_VERSION = 'v2.0.4';
const NODE_MININUM_VERSION = 'v2.0.2';
const PY_MININUM_VERSION = 'v2.0.2';

const VERSION_REGX = /^v\d/;

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
    .filter(v => VERSION_REGX.test(v));
  const [defaultVersion] = versionDirectories;
  const currentVersion = version || defaultVersion;
  const filePathMap = {
    [DIR_TYPE_ENUM.DOC]: `${currentVersion}/site/${lang}`,
    [DIR_TYPE_ENUM.MENU]: `${currentVersion}/site/${lang}/menuStructure/${lang}.json`,
  };
  return join(basePath, filePathMap[type]);
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

// generate all docs paths of available versions
export const generateAllDocsPaths = (widthContent = false) => {
  const { versions, newestVersion } = generateAvailableDocVersions();
  const paths = versions.map(v => ({
    version: v,
    enPath: join(DOC_DIR, `/${v}/site/en`),
    cnPath: join(DOC_DIR, `/${v}/site/zh-CN`),
    cnList: [],
    enList: [],
  }));
  const ignorePaths = [
    'home',
    'template',
    'json',
    '.DS_Store',
    'menuStructure',
  ];
  const docPaths = paths.map(v => {
    const { version, enPath, cnPath, cnList, enList } = v;

    walkFiels(enPath, ignorePaths, enList);
    walkFiels(cnPath, ignorePaths, cnList);
    const cnDocPaths = cnList.map(v => {
      return widthContent
        ? {
            params: {
              slug: v.id,
              locale: 'cn',
              version,
              content: v.content,
              summary: v.summary,
              data: v.data,
              editPath: `/${version}/site/zh-CN${v.editPath}`,
            },
          }
        : {
            params: {
              slug: v.id,
              locale: 'cn',
              version,
            },
          };
    });
    const enDocPaths = enList.map(v => {
      return widthContent
        ? {
            params: {
              slug: v.id,
              locale: 'en',
              version,
              content: v.content,
              summary: v.summary,
              editPath: `/${version}/site/en${v.editPath}`,
              data: v.data,
            },
          }
        : {
            params: {
              slug: v.id,
              locale: 'en',
              version,
            },
          };
    });
    return [...cnDocPaths, ...enDocPaths];
  });

  return docPaths.flat();
};

export const generateCurDocInfo = (id, version, lang = 'en') => {
  const docs = generateAllDocsPaths(true);
  const target = docs.find(
    ({ params }) =>
      params.slug === id && params.version === version && params.locale === lang
  );
  return (
    {
      ...target.params,
    } || {
      slug: id,
      locale: lang,
      version,
      content: 'No Data',
      summary: 'No Data',
      editPath: null,
      data: null,
    }
  );
};

export const generateCurVersionMenu = (version, lang) => {
  const language = lang === 'cn' ? 'zh-CN' : 'en';
  const path = join(
    DOC_DIR,
    `/${version}/site/${language}/menuStructure/${lang}.json`
  );

  try {
    const { menuList } = JSON.parse(fs.readFileSync(path, 'utf-8'));

    const { newestVersion: newestGo } = generateCurLangApiVersions(
      'milvus-sdk-go',
      GO_MININUM_VERSION
    );
    const { newestVersion: newestJava } = generateCurLangApiVersions(
      'milvus-sdk-java',
      JAVA_MININUM_VERSION
    );
    const { newestVersion: newestNode } = generateCurLangApiVersions(
      'milvus-sdk-node',
      NODE_MININUM_VERSION
    );
    const { newestVersion: newestPy } = generateCurLangApiVersions(
      'pymilvus',
      PY_MININUM_VERSION
    );

    const apis = [
      {
        id: 'pymilvus',
        label: 'Python',
        externalLink: `/api-reference/pymilvus/${newestPy}/About.md`,
      },
      {
        id: 'milvus-sdk-java',
        label: 'Java',
        externalLink: `/api-reference/java/${newestJava}/About.md`,
      },
      {
        label: 'Go',
        id: 'milvus-sdk-go',
        externalLink: `/api-reference/go/${newestGo}/About.md`,
      },
      {
        label: 'Node',
        id: 'milvus-sdk-node',
        externalLink: `/api-reference/node/${newestNode}/About.md`,
      },
    ];

    return formatMenus([
      ...menuList,
      {
        id: 'api-reference',
        label: 'Api reference',
        isMenu: true,
        children: apis,
      },
    ]);
  } catch (err) {
    throw err;
  }
};

// use to generate doc home paths
export const generateAvailableDocVersions = () => {
  const docDir = DOC_DIR;

  const docVersions = fs.readdirSync(docDir).filter(v => VERSION_REGX.test(v));
  const { newestVersion, list } = getNewestVersionTool(
    docVersions,
    DOCS_MININUM_VERSION
  );

  return {
    versions: list,
    newestVersion,
  };
};

// get home page mkd content of current verison
export const getCurVersionHomeMd = (version, lang) => {
  const langFolderName = lang === 'en' ? 'en' : 'zh_CN';
  let path = join(DOC_DIR, `${version}/site/${langFolderName}/home/home.md`);

  // v0.x has no home.md but overview.md
  const isExist = fs.existsSync(path);
  if (!isExist) {
    path = join(
      DOC_DIR,
      `${version}/site/${langFolderName}/about_milvus/overview.md`
    );
  }

  const fileContents = fs.readFileSync(path, 'utf8');
  const { content } = matter(fileContents);
  return content;
};

const generateApiVersions = language => {
  const { sdk, minVersion } = getSdkLang(language);
  const curLangDir = join(DOC_DIR, `/API_Reference/${sdk}`);

  const versions = fs.readdirSync(curLangDir).filter(v => VERSION_REGX.test(v));

  const { newestVersion, list } = getNewestVersionTool(versions, minVersion);

  return {
    newestVersion,
    versions: list,
  };
};

export const generateApiData = () => {
  const dir = join(DOC_DIR, 'API_Reference');

  let dataList = [];
  let routers = [];
  let articles = [];

  fs.readdirSync(dir).forEach(lang => {
    const versions = fs.readdirSync(join(dir, lang));
    versions.forEach(version => {
      const list = [];

      const filePath = join(dir, `${lang}/${version}`);
      walkThroughApiFiels(filePath, [], list);
      dataList.push({
        language: getLangFromSdk(lang),
        programLang: lang,
        version: version,
        docList: list,
        versions,
      });
    });
  });

  dataList.forEach(v => {
    const { docList, version, language, programLang } = v;
    docList.forEach(doc => {
      routers.push({
        params: {
          slug: doc.id,
          version,
          language,
        },
      });

      articles.push({
        id: doc.id,
        version,
        language,
        content: doc.content,
        versions: v.versions,
        programLang,
      });
    });
  });
  return {
    routers,
    articles,
  };
};

const generateApiMenus = (language, version) => {
  const { sdk } = getSdkLang(language);

  const dir = join(DOC_DIR, `API_Reference/${sdk}/${version}`);
  const menus = walkApiFiels(dir);

  return formatMenus(menus);
};

function generateCurLangApiVersions(programLang, minVersion) {
  const dir = join(DOC_DIR, `API_Reference/${programLang}`);
  const availableVersions = fs.readdirSync(dir);

  const { newestVersion, list } = getNewestVersionTool(
    availableVersions,
    minVersion
  );

  return {
    availableVersions: list,
    newestVersion,
  };
}

const generateCurApiDocContent = (language, version, slug) => {
  const { articles } = generateApiData();

  const article = articles.find(
    v => v.id === slug && v.language === language && v.version === version
  );

  return article;
};

// data used in community pages. lang: 'en' | 'cn'
export const generateCommunityData = (lang = 'en') => {
  const language = lang === 'en' ? 'en' : 'zh-CN';
  const articlePath = join(
    DOC_DIR,
    `community/site/${language}/communityArticles`
  );
  const homePath = join(
    DOC_DIR,
    `community/site/${language}/communityHome/home.md`
  );
  const menuPath = join(
    DOC_DIR,
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
  const { versions, newestVersion } = generateAvailableDocVersions();
  const ignorePaths = [
    'home',
    'template',
    'json',
    '.DS_Store',
    'menuStructure',
  ];
  const langFolderName = lang === 'en' ? 'en' : 'zh_CN';

  const availableVersions = fs
    .readdirSync(DOC_DIR)
    .filter(v => versions.some(i => v.includes(i)));

  const curVersion = availableVersions.includes(version)
    ? version
    : newestVersion;

  const curVerionPath = join(DOC_DIR, `${curVersion}/site/${langFolderName}`);

  const curVersionMenuPath = join(
    DOC_DIR,
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
    newestVersion,
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

    if (!ignorePaths.includes(subPath)) {
      if (state.isDirectory()) {
        walkFiels(filePath, ignorePaths, list);
      } else {
        const file = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(file);
        const editPath = filePath.includes('en')
          ? filePath.split('en')[1]
          : filePath.split('zh-CN')[1];
        list.push({
          id: subPath,
          content: content,
          summary: data?.summary || 'No data',
          data,
          editPath,
        });
      }
    }
  });
}

export function walkThroughApiFiels(path, ignorePaths, list = []) {
  const paths = fs.readdirSync(path);

  paths.forEach(subPath => {
    const filePath = join(path, subPath);
    const state = fs.statSync(filePath);

    if (!ignorePaths.includes(subPath)) {
      if (state.isDirectory()) {
        walkFiels(filePath, ignorePaths, list);
      } else {
        const file = fs.readFileSync(filePath, 'utf-8');
        const { content } = matter(file);

        list.push({
          id: subPath,
          content,
          editPath: subPath,
        });
      }
    }
  });
}

export const doc_tools = {
  getVersions: generateAvailableDocVersions,
};

export const api_reference = {
  availabelVersionsRegx: /^v2/,
  getContent: generateCurApiDocContent,
  getMenus: generateApiMenus,
  getApiData: generateApiData,
  getVersions: generateApiVersions,
};

function getSdkLang(lang) {
  switch (lang) {
    case 'go':
      return {
        sdk: `milvus-sdk-go`,
        minVersion: GO_MININUM_VERSION,
      };
    case 'java':
      return {
        sdk: `milvus-sdk-java`,
        minVersion: JAVA_MININUM_VERSION,
      };

    case 'node':
      return {
        sdk: `milvus-sdk-node`,
        minVersion: NODE_MININUM_VERSION,
      };
    default:
      return {
        sdk: `pymilvus`,
        minVersion: PY_MININUM_VERSION,
      };
  }
}

function getLangFromSdk(programLang) {
  switch (programLang) {
    case 'milvus-sdk-go':
      return 'go';
    case 'milvus-sdk-java':
      return 'java';
    case 'milvus-sdk-node':
      return 'node';
    default:
      return 'pymilvus';
  }
}
