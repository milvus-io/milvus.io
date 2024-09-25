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
  sortVersionDir,
} from './docs';
import { getCacheData, setCacheData } from './index';
import { formatMenuLabel } from './apiReference';

const fs = require('fs');
const path = require('path');
const { join } = path;

const apiCache = new Map<string, any>();

const API_RESTFUL_CONFIG = {
  [ApiReferenceLanguageEnum.Restful]: {
    name: ApiReferenceLabelEnum.Restful,
    path: `${BASE_DOC_DIR}/API_Reference_MDX/${ApiReferenceLanguageEnum.Restful}`,
    minVersion: DOCS_MINIMUM_VERSION,
    category: ApiReferenceRouteEnum.Restful,
  },
};

export const SPLIT_FLAG = '::';

export const generateRestfulVersionsInfo = () => {
  const cacheKey = 'restful-versions-info';
  const cachedData = getCacheData({ cache: apiCache, key: cacheKey });
  if (cachedData) {
    return cachedData;
  }
  const restfulInfo = Object.entries(API_RESTFUL_CONFIG).map(
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
  setCacheData({ cache: apiCache, key: cacheKey, data: restfulInfo });

  return restfulInfo;
};

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
        id: id.replace('.mdx', '.md'),
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
  const menuItemId = prefix
    ? `${prefix}${SPLIT_FLAG}${fileName}`
    : `${fileName}`;

  if (fileStat.isDirectory()) {
    const parentNodes = [...parentIds, menuItemId].filter(node => !!node);
    const subPaths: string[] = fs.readdirSync(filePath).map((v: string) => v);
    const usablePaths = subPaths.filter(validationFileFilter);

    /**
     * to keep the menu item id unique, sub menu item will be like:
     * {id: 'MilvusClient-Client-MilvusClient().md', label: 'MilvusClient().md', children: []}
     */
    const children = usablePaths
      .map(subPath =>
        generateApiMenuData({
          filePath: join(filePath, subPath),
          prefix: menuItemId,
          parentIds: parentNodes,
        })
      )
      .sort(sortVersionDir);

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
      id: menuItemId.replace('.mdx', '.md'),
      label: formatMenuLabel(fileName),
      children: [],
      isMenu: false,
      externalLink: '',
      href: menuItemId.replaceAll(SPLIT_FLAG, '/').replace('.mdx', '.md'),
      parentId: prefix,
      parentIds: parentIds,
      level: NaN,
    };
  }
};

export const generateRestfulMenuAndContentDataOfSingleVersion = (params: {
  language: ApiReferenceLanguageEnum;
  version: string;
  withContent?: boolean;
}): {} => {
  const { language, version, withContent = false } = params;
  const cacheKey = `api-${language}-${version}-${withContent}`;

  const cachedData = getCacheData({ cache: apiCache, key: cacheKey });

  if (cachedData) {
    return cachedData;
  }

  const path = API_RESTFUL_CONFIG[language].path;
  const category = API_RESTFUL_CONFIG[language].category;
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
        label: API_RESTFUL_CONFIG[language].name,
        parentIds: [],
        parentId: '',
        level: NaN,
      },
    ],
    contentList,
  };

  setCacheData({ cache: apiCache, key: cacheKey, data: result });

  return result;
};

export const generateRestfulMenuAndContentDataOfAllVersions = (params: {
  language: ApiReferenceLanguageEnum;
  withContent?: boolean;
}) => {
  const { language, withContent = false } = params;
  const versionInfo = generateRestfulVersionsInfo();
  const versions = versionInfo.find(v => v.language === language)?.versions;
  const path = API_RESTFUL_CONFIG[language].path;
  const allData = versions.map((version: string) =>
    generateRestfulMenuAndContentDataOfSingleVersion({
      language,
      version,
      withContent,
    })
  );

  return allData;
};
