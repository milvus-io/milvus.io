/**
 * what i need:
 * available versions -- check
 * routers base on available veriosn
 * contents base on available veriosn
 * menus available veriosn
 * */

import fs from 'fs';
import { join } from 'path';
import { formatFileName, formatMenus, getNewestVersionTool } from './docUtils';

const API_BASE_DIR = join(process.cwd(), '/src/docs/API_Reference');
const API_REFERENCE_RELATIVE_BASE_URL = '/api-reference';
const API_REFERENCE_HOMEPAGE_FILE_NAME = '/About.md';

// base config of api reference, please modify this if you need to add or reduce api reference

const DOCS_MININUM_VERSION = 'v1.0.0';
const GO_MININUM_VERSION = 'v2.0.0';
const JAVA_MININUM_VERSION = 'v2.0.4';
const NODE_MININUM_VERSION = 'v2.0.2';
const PY_MININUM_VERSION = 'v2.0.2';
const RESTFUL_MININUM_VERSION = 'v2.2.x';
const CSHARP_MININUM_VERSION = 'v2.2.x';

const API_REFERENCE_BASE_CONFIG = {
  python: {
    id: 'pymilvus',
    folderName: 'pymilvus',
    label: 'Python',
    langAlias: 'python',
    homepageUrl: '',
    homepageName: API_REFERENCE_HOMEPAGE_FILE_NAME,
    minVersion: PY_MININUM_VERSION,
  },
  java: {
    id: 'milvus-sdk-java',
    folderName: 'milvus-sdk-java',
    label: 'Java',
    langAlias: 'java',
    homepageUrl: '',
    homepageName: API_REFERENCE_HOMEPAGE_FILE_NAME,
    minVersion: JAVA_MININUM_VERSION,
  },
  go: {
    label: 'Go',
    langAlias: 'go',
    id: 'milvus-sdk-go',
    folderName: 'milvus-sdk-go',
    homepageUrl: '',
    homepageName: API_REFERENCE_HOMEPAGE_FILE_NAME,
    minVersion: GO_MININUM_VERSION,
  },
  node: {
    label: 'Node',
    langAlias: 'node',
    id: 'milvus-sdk-node',
    folderName: 'milvus-sdk-node',
    homepageUrl: '',
    homepageName: API_REFERENCE_HOMEPAGE_FILE_NAME,
    minVersion: NODE_MININUM_VERSION,
  },
  restful: {
    label: 'RESTful',
    langAlias: 'restful',
    id: 'milvus-restful',
    folderName: 'milvus-restful',
    homepageUrl: '',
    homepageName: API_REFERENCE_HOMEPAGE_FILE_NAME,
    minVersion: RESTFUL_MININUM_VERSION,
  },
  csharp: {
    label: 'C#',
    langAlias: 'csharp',
    id: 'milvus-sdk-csharp',
    folderName: 'milvus-sdk-csharp',
    homepageUrl: '',
    homepageName: API_REFERENCE_HOMEPAGE_FILE_NAME,
    minVersion: CSHARP_MININUM_VERSION,
  },
};

/**
 * Generate API reference data for the specified language.
 *
 * @param {string} lang - the language for which API reference data is to be generated
 * @returns {object} {
 *    newestVersion: string,
 *    versions: string[],
 *    apiConfig: object
 * }
 */
const generateApiData = lang => {
  let apiConfig = API_REFERENCE_BASE_CONFIG[lang];
  const { folderName, minVersion, langAlias, homepageName } = apiConfig;
  const filePath = `${API_BASE_DIR}/${folderName}`;

  const versions = fs.readdirSync(filePath);
  const { newestVersion, list } = getNewestVersionTool(versions, minVersion);
  apiConfig.homepageUrl = `${API_REFERENCE_RELATIVE_BASE_URL}/${langAlias}/${newestVersion}/${homepageName}`;

  return {
    newestVersion,
    versions,
    apiConfig,
  };
};

/**
 * 描述 api refernence verison of current program langugage, without old html versions
 * @date 2022-09-19
 * @param {any} language go | java | node | pymilvus | restful | csharp
 * @returns {any}
 */
export const generateAvailableApiVersions = language => {
  const { sdk, minVersion } = getSdkLang(language);

  const versions = fs.readdirSync(`${API_BASE_DIR}/${sdk}`);

  const { newestVersion, list } = getNewestVersionTool(versions, minVersion);

  return {
    newestVersion,
    versions: list,
  };
};

/**
 * 描述 generate all api docs routers and content
 * @date 2022-09-19
 * @param {any} widthContent=false
 * @returns {any} {
 *    contentList: {language: go|java|node|pymilvus, version, id, content}[]
 *    routerList: {language: go|java|node|pymilvus, version, slug}[]
 *    menuList: {language: go|java|node|pymilvus, version, version, menu}
 * }
 */
const generateAllApiData = () => {
  let contentList = [];
  let menuList = [];

  const programLangData = fs.readdirSync(API_BASE_DIR).map(lang => {
    const { newestVersion, versions } = generateAvailableApiVersions(
      getLangFromSdk(lang)
    );

    return {
      lang,
      versions,
      newestVersion,
    };
  });

  programLangData.forEach(v => {
    const { lang, versions } = v;

    versions.forEach(version => {
      const menu = walkApiFiles({
        basePath: join(API_BASE_DIR, `/${lang}/${version}`),
        sufixPath: '',
        contentList,
        config: {
          version,
          language: getLangFromSdk(lang),
        },
      });

      menuList.push({
        language: getLangFromSdk(v.lang),
        version,
        menu: formatMenus(menu),
      });
    });
  });

  const routerList = contentList.map(v => {
    return {
      params: {
        language: v.language,
        version: v.version,
        slug: v.path.split('/'),
      },
    };
  });

  return {
    menuList,
    contentList,
    routerList,
  };
};

const getApiRoutersOfAllVersions = () => {
  const { routerList } = generateAllApiData();

  return routerList;
};

const getApiMenuOfCurVersion = (language, version) => {
  const { menuList } = generateAllApiData();

  const { menu } = menuList.find(
    v => v.language === language && v.version === version
  );
  return menu;
};

const getApiDocOfCurVersion = (language, version, id) => {
  const { contentList } = generateAllApiData();

  const doc = contentList.find(
    v => v.language === language && v.version === version && v.path === id
  );
  return doc;
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
    case 'restful':
      return {
        sdk: `milvus-restful`,
        minVersion: RESTFUL_MININUM_VERSION,
      };
    case 'csharp':
      return {
        sdk: `milvus-sdk-csharp`,
        minVersion: CSHARP_MININUM_VERSION,
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
    case 'milvus-restful':
      return 'restful';
    case 'milvus-sdk-csharp':
      return 'csharp';
    default:
      return 'pymilvus';
  }
}

/**
 * 描述  router name of api is nested，because id may be repeated. so use surfixPath as unique key. fo example: /Collection/collection().md, /Collection/delete().md
 * @date 2022-09-27
 * @param {any} {basePath
 * @param {any} sufixPath path after {language}/{version}/
 * @param {any} contentList  list contains all api doc contents, it's a flattended list
 * @param {any} config} includes current program language and version
 * @returns {any} an nested list use for menu
 */
function walkApiFiles({ basePath, sufixPath: path, contentList, config }) {
  const originPath = join(basePath, path);

  debugger;
  const paths = fs.readdirSync(originPath);

  return paths.map(subPath => {
    const sufixPath = `${path}/${subPath}`;
    const filePath = join(basePath, sufixPath);

    const state = fs.statSync(filePath);
    if (state.isDirectory()) {
      return {
        id: sufixPath.replace('/', ''),
        label: formatFileName(subPath),
        absolutePath: filePath,
        isMenu: true,
        children: walkApiFiles({
          basePath,
          sufixPath,
          contentList,
          config,
        }),
      };
    }
    const file = fs.readFileSync(filePath, 'utf-8');

    contentList.push({
      id: subPath,
      path: sufixPath.replace('/', ''),
      absolutePath: filePath,
      content: file,
      ...config,
    });
    return {
      id: sufixPath.replace('/', ''),
      label: formatFileName(subPath),
      absolutePath: filePath,
    };
  });
}

const apiUtils = {
  getVersions: generateAvailableApiVersions,
  getData: generateAllApiData,
  getRouter: getApiRoutersOfAllVersions,
  getMenu: getApiMenuOfCurVersion,
  getDoc: getApiDocOfCurVersion,
};

export default apiUtils;
