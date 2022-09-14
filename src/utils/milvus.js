import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { formatFileName, formatMenus, getMenuInfoById } from './docUtils';

// constants
const DOC_DIR = join(process.cwd(), 'src/docs');
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

const API_LANGUAGES = [
  {
    id: 'pymilvus',
    label: 'Python',
    externalLink: '/api-reference/pymilvus/v2.1.1/About.md',
  },
  {
    id: 'milvus-sdk-java',
    label: 'Java',
    externalLink: '/api-reference/java/v2.1.0/About.md',
  },
  {
    label: 'Go',
    id: 'milvus-sdk-go',
    externalLink: '/api-reference/go/v2.1.1/About.md',
  },
  {
    label: 'Node',
    id: 'milvus-sdk-node',
    externalLink: '/api-reference/node/v2.1.2/About.md',
  },
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

    return formatMenus([
      ...menuList,
      {
        id: 'api-reference',
        label: 'Api reference',
        isMenu: true,
        children: API_LANGUAGES,
      },
    ]);
  } catch (err) {
    throw err;
  }
};

// use to generate doc home paths
export const generateAvailableDocVersions = () => {
  const docDir = DOC_DIR;
  const availabelVersions = ['v0.x', 'v1', 'v2'];
  const versionRegx = /^v\d/;

  const docVersions = fs.readdirSync(docDir).filter(v => {
    return versionRegx.test(v);
  });

  const newestVersion = docVersions.slice().reverse().shift();

  return {
    versions: docVersions,
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

export const generateApiData = () => {
  const dir = join(DOC_DIR, 'API_Reference');
  const availabelVersionsRegx = /^v2/;

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
        language: lang,
        version: version,
        docList: list,
        versions,
      });
    });
  });

  dataList.forEach(v => {
    const { docList, version, language } = v;

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
      });
    });
  });
  return {
    routers,
    articles,
  };
};

const generateApiMenus = (language, version) => {
  const dir = join(DOC_DIR, `API_Reference/${language}/${version}`);
  const menus = walkApiFiels(dir);

  return formatMenus(menus);
};

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

export const api_reference = {
  availabelVersionsRegx: /^v2/,
  getContent: generateCurApiDocContent,
  getMenus: generateApiMenus,
  getApiData: generateApiData,
};
