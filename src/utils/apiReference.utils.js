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

const DOCS_MININUM_VERSION = 'v1.0.0';
const GO_MININUM_VERSION = 'v2.0.0';
const JAVA_MININUM_VERSION = 'v2.0.4';
const NODE_MININUM_VERSION = 'v2.0.2';
const PY_MININUM_VERSION = 'v2.0.2';

/**
 * 描述 api refernence verison of current program langugage, without old html versions
 * @date 2022-09-19
 * @param {any} language go | java | node | pymilvus
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
      const menu = walkApiFiels2({
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

  // console.log(
  //   'menuList---',
  //   menuList.filter(
  //     v => v.language === 'pymilvus' && v.params.version === 'v2.1.2'
  //   )[1]
  // );

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
    case 'pymilvus':
      return 'pymilvus';
    default:
      return 'pymilvus';
  }
}

function walkApiFiels(path, flattenedContentList = [], config = {}) {
  const paths = fs.readdirSync(path);

  return paths.map(subPath => {
    const filePath = join(path, subPath);
    const state = fs.statSync(filePath);
    if (state.isDirectory()) {
      return {
        id: subPath,
        label: formatFileName(subPath),
        isMenu: true,
        children: walkApiFiels(filePath, flattenedContentList, config),
      };
    }
    const file = fs.readFileSync(filePath, 'utf-8');

    flattenedContentList.push({
      id: subPath,
      content: file,
      ...config,
    });
    return {
      id: subPath,
      label: formatFileName(subPath),
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

function walkApiFiels2({ basePath, sufixPath: path, contentList, config }) {
  const originPath = join(basePath, path);

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
        children: walkApiFiels2({
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
