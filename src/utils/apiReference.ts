import {
  ApiReferenceLanguageEnum,
  ApiReferenceLabelEnum,
  ApiFileDateInfoType,
  FinalMenuStructureType,
  ApiReferenceRouteEnum,
} from '@/types/docs';
import { VERSION_REG } from '@/consts/regexp';
import {
  BASE_DOC_DIR,
  generateDocVersionInfo,
  validationFileFilter,
  DOCS_MINIMUM_VERSION,
} from './docs';
import { getCacheData, setCacheData } from './index';

const fs = require('fs');
const path = require('path');
const { join } = path;

const API_REFERENCE_WRAPPER_MENU_ID = 'api-reference';
const API_REFERENCE_WRAPPER_MENU_LABEL = 'API Reference';

const apiCache = new Map<string, any>();

/**
 * api reference system,
 * what I need:
 * 1. versions and latest version info of each language
 * 2. menu data of each language for single version
 * 3. file data list of each language for single version
 * 4. file data list of each language for all versions to generate dynamic routes
 *
 * */

// remove .md from file name
const formatMenuLabel = (label: string) => {
  if (!label.includes('.md')) {
    return label;
  }
  return label.replace('.md', '');
};
// file will be html or mkd without front matter
const readApiFile = (params: {
  filePath: string;
  category: ApiReferenceRouteEnum;
  version: string;
  fileDataList: ApiFileDateInfoType[];
  withContent: boolean;
  parentIds?: string[];
}) => {
  const {
    filePath,
    category,
    fileDataList,
    withContent,
    parentIds = [],
    version,
  } = params;
  const fileStat = fs.statSync(filePath);

  if (fileStat.isDirectory()) {
    // the baseFolderName could be a version, so filter it out
    const baseFolderName = path.basename(filePath);
    const parentId = VERSION_REG.test(baseFolderName) ? '' : baseFolderName;
    const subPaths: string[] = fs.readdirSync(filePath).map((v: string) => v);

    return subPaths.filter(validationFileFilter).map(subPath =>
      readApiFile({
        filePath: join(filePath, subPath),
        category,
        version,
        fileDataList,
        withContent,
        parentIds: [...parentIds, parentId],
      })
    );
  } else if (fileStat.isFile()) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const id = path.basename(filePath);
    /**
     * id: xxx.md,
     * parentIds: ['MilvusClient', 'Client'],
     * relativePath: '/v2.4.x/MilvusClient/Client/xxxx.md',
     * language: 'pymilvus'
     * */
    fileDataList.push({
      frontMatter: {
        id,
        parentIds: parentIds.filter(v => !!v),
        relativePath: filePath.match(/\/v\d.*$/)?.[0] || '',
        category,
        version,
      },
      content: withContent ? content : '',
    });
  }
};

const generateApiMenuData = (params: {
  filePath: string;
  prefix?: string;
  parentIds?: string[];
}): FinalMenuStructureType => {
  const { filePath, prefix = '', parentIds = [] } = params;

  const fileStat = fs.statSync(filePath);
  const baseFolderName = path.basename(filePath);
  const fileName = VERSION_REG.test(baseFolderName) ? '' : baseFolderName;
  const menuItemId = prefix ? `${prefix}-${fileName}` : `${fileName}`;

  if (fileStat.isDirectory()) {
    const parentNodes = [...parentIds, menuItemId].filter(node => !!node);
    const subPaths: string[] = fs.readdirSync(filePath).map((v: string) => v);
    const usablePaths = subPaths.filter(validationFileFilter);

    /**
     * to keep the menu item id unique, sub menu item will be like:
     * {id: 'MilvusClient-Client-MilvusClient().md', label: 'MilvusClient().md', children: []}
     */
    const children = usablePaths.map(subPath =>
      generateApiMenuData({
        filePath: join(filePath, subPath),
        prefix: menuItemId,
        parentIds: parentNodes,
      })
    );
    return {
      id: menuItemId,
      label: formatMenuLabel(fileName),
      isMenu: true,
      externalLink: '',
      href: '',
      children,
      parentId: prefix,
      parentIds: parentIds,
      level: NaN,
    };
  } else {
    return {
      id: menuItemId,
      label: formatMenuLabel(fileName),
      children: [],
      isMenu: false,
      externalLink: '',
      href: menuItemId.replaceAll('-', '/'),
      parentId: prefix,
      parentIds: parentIds,
      level: NaN,
    };
  }
};

// api reference configuration, please modify this if you want to add or reduce a language
const API_REFERENCE_CONFIG = {
  [ApiReferenceLanguageEnum.Python]: {
    name: ApiReferenceLabelEnum.Python,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Python}`,
    minVersion: DOCS_MINIMUM_VERSION,
    category: ApiReferenceRouteEnum.Python,
  },
  [ApiReferenceLanguageEnum.Java]: {
    name: ApiReferenceLabelEnum.Java,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Java}`,
    minVersion: DOCS_MINIMUM_VERSION,
    category: ApiReferenceRouteEnum.Java,
  },
  [ApiReferenceLanguageEnum.Go]: {
    name: ApiReferenceLabelEnum.Go,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Go}`,
    minVersion: DOCS_MINIMUM_VERSION,
    category: ApiReferenceRouteEnum.Go,
  },
  [ApiReferenceLanguageEnum.Node]: {
    name: ApiReferenceLabelEnum.Node,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Node}`,
    minVersion: DOCS_MINIMUM_VERSION,
    category: ApiReferenceRouteEnum.Node,
  },
  [ApiReferenceLanguageEnum.Csharp]: {
    name: ApiReferenceLabelEnum.Csharp,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Csharp}`,
    minVersion: DOCS_MINIMUM_VERSION,
    category: ApiReferenceRouteEnum.Csharp,
  },
  [ApiReferenceLanguageEnum.Restful]: {
    name: ApiReferenceLabelEnum.Restful,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Restful}`,
    minVersion: DOCS_MINIMUM_VERSION,
    category: ApiReferenceRouteEnum.Restful,
  },
};

// 1. versions and latest version info of all language
export const generateApiReferenceVersionsInfo = () => {
  const cacheKey = 'api-versions-info';
  const cachedData = getCacheData({ cache: apiCache, key: cacheKey });
  if (cachedData) {
    return cachedData;
  }
  const apiVersionInfo = Object.entries(API_REFERENCE_CONFIG).map(
    ([language, config]: [
      ApiReferenceLanguageEnum,
      {
        name: ApiReferenceLabelEnum;
        path: string;
        minVersion: string | undefined;
        category: ApiReferenceRouteEnum;
      }
    ]) => {
      const { versions, latestVersion } = generateDocVersionInfo({
        filePath: config.path,
        minVersion: config.minVersion,
      });

      return {
        language,
        label: config.name,
        versions,
        latestVersion,
        category: config.category,
      };
    }
  );
  setCacheData({ cache: apiCache, key: cacheKey, data: apiVersionInfo });

  return apiVersionInfo;
};

// 2. menu data of each language for single version
export const generateApiMenuAndContentDataOfSingleVersion = (params: {
  language: ApiReferenceLanguageEnum;
  version: string;
  withContent?: boolean;
}) => {
  try {
    const { language, version, withContent = false } = params;
    const cacheKey = `api-${language}-${version}-${withContent}`;

    const cachedData = getCacheData({ cache: apiCache, key: cacheKey });

    if (cachedData) {
      return cachedData;
    }

    const path = API_REFERENCE_CONFIG[language].path;
    const category = API_REFERENCE_CONFIG[language].category;
    const versionPath = `${path}/${version}`;
    const contentList: ApiFileDateInfoType[] = [];

    readApiFile({
      filePath: versionPath,
      category,
      version,
      fileDataList: contentList,
      withContent,
    });

    const menuData = generateApiMenuData({
      filePath: versionPath,
      parentIds: [language],
    });

    const result = {
      version,
      menuData: [
        {
          ...menuData,
          id: language,
          label: API_REFERENCE_CONFIG[language].name,
          parentIds: [],
          parentId: '',
          level: NaN,
        },
      ],
      contentList,
    };

    setCacheData({ cache: apiCache, key: cacheKey, data: result });

    return result;
  } catch (error) {
    console.log('error--', error);
  }
};

// 4. file data list of each language for all versions to generate dynamic routes
export const generateApiMenuAndContentDataOfAllVersions = (params: {
  language: ApiReferenceLanguageEnum;
  withContent?: boolean;
}) => {
  const { language, withContent = false } = params;
  const versionInfo = generateApiReferenceVersionsInfo();
  const versions = versionInfo.find(v => v.language === language)?.versions;
  const path = API_REFERENCE_CONFIG[language].path;
  const allData = versions.map(version =>
    generateApiMenuAndContentDataOfSingleVersion({
      language,
      version,
      withContent,
    })
  );

  return allData;
};

// 5. generate corresponding api menu data for current doc version automatically
export const generateApiMenuDataOfCurrentVersion = (params: {
  docVersion: string;
}) => {
  const { docVersion } = params;
  const versionInfo = generateApiReferenceVersionsInfo();

  const apiMenu: FinalMenuStructureType[] = versionInfo.map(v => {
    const { language, versions, latestVersion, label, category } = v;
    const isContainCurrentDocVersion = versions.includes(params.docVersion);

    return {
      id: language,
      label,
      isMenu: false,
      externalLink: '',
      href: isContainCurrentDocVersion
        ? `/api-reference/${category}/${docVersion}/About.md`
        : `/api-reference/${category}/${latestVersion}/About.md`,
      children: [],
      parentId: 'api-reference',
      parentIds: ['api-reference'],
      level: 2,
    };
  });

  return {
    id: API_REFERENCE_WRAPPER_MENU_ID,
    label: API_REFERENCE_WRAPPER_MENU_LABEL,
    isMenu: true,
    externalLink: '',
    href: '',
    children: apiMenu,
    parentId: '',
    parentIds: [],
    level: 1,
  };
};

export const generateAllApiFileContent = (params: {
  widthContent?: boolean;
}) => {
  const { widthContent = false } = params;
  const directoryPath = join(BASE_DOC_DIR, 'API_Reference');
};
