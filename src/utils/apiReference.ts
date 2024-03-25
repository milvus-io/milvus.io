import {
  ApiReferenceLanguageEnum,
  ApiReferenceLabelEnum,
  ApiFileDateInfoType,
  ApiMenuStructureType,
  FinalMenuStructureType,
} from '@/types/docs';
import {
  BASE_DOC_DIR,
  VERSION_REG,
  IGNORE_FILES,
  generateDocVersionInfo,
} from './docs';
const fs = require('fs');
const path = require('path');
const { join } = path;

/**
 * api reference system,
 * what I need:
 * 1. versions and latest version info of each language
 * 2. menu data of each language for single version
 * 3. file data list of each language for single version
 * 4. file data list of each language for all versions to generate dynamic routes
 *
 * */

// file will be html or mkd without front matter
const readApiFile = (params: {
  filePath: string;
  fileDataList: ApiFileDateInfoType[];
  withContent: boolean;
  parentId?: string;
}) => {
  const { filePath, fileDataList, withContent, parentId = '' } = params;
  const fileStat = fs.statSync(filePath);

  if (fileStat.isDirectory()) {
    // the baseFolderName could be a version, so filter it out
    const baseFolderName = path.basename(filePath);
    const parentId = VERSION_REG.test(baseFolderName) ? '' : baseFolderName;
    const subPaths: string[] = fs.readdirSync(filePath).map((v: string) => v);

    return subPaths
      .filter(subPath => !IGNORE_FILES.includes(subPath))
      .map(subPath =>
        readApiFile({
          filePath: join(filePath, subPath),
          fileDataList,
          withContent,
          parentId,
        })
      );
  } else if (fileStat.isFile()) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const id = path.basename(filePath);

    fileDataList.push({
      frontMatter: { id, parentId },
      content: withContent ? content : '',
    });
  }
};

const generateApiMenuData = (params: { filePath: string; prefix?: string }) => {
  const { filePath, prefix = '' } = params;

  const fileStat = fs.statSync(filePath);
  const baseFolderName = path.basename(filePath);
  const fileName = VERSION_REG.test(baseFolderName) ? '' : baseFolderName;
  const menuItemId = prefix ? `${prefix}-${fileName}` : `${fileName}`;

  if (fileStat.isDirectory()) {
    const subPaths: string[] = fs.readdirSync(filePath).map((v: string) => v);
    const useablePaths = subPaths.filter(
      subPath => !IGNORE_FILES.includes(subPath)
    );

    /**
     * to keep the menu item id unique, sub menu item will be like:
     * {id: 'MilvusClient-Client-MilvusClient().md', label: 'MilvusClient().md', children: []}
     */
    const children = useablePaths.map(subPath =>
      generateApiMenuData({
        filePath: join(filePath, subPath),
        prefix: menuItemId,
      })
    );
    return {
      id: menuItemId,
      label: fileName,
      children,
    };
  } else {
    return {
      id: menuItemId,
      label: fileName,
      children: [],
    };
  }
};

// api reference configuration, please modify this if you want to add or reduce a language
const API_REFERENCE_CONFIG = {
  [ApiReferenceLanguageEnum.Restful]: {
    name: ApiReferenceLabelEnum.Restful,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Restful}`,
    minVersion: undefined,
  },
  [ApiReferenceLanguageEnum.Csharp]: {
    name: ApiReferenceLabelEnum.Csharp,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Csharp}`,
    minVersion: undefined,
  },
  [ApiReferenceLanguageEnum.Go]: {
    name: ApiReferenceLabelEnum.Go,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Go}`,
    minVersion: 'v2.0.x',
  },
  [ApiReferenceLanguageEnum.Java]: {
    name: ApiReferenceLabelEnum.Java,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Java}`,
    minVersion: 'v.2.0.x',
  },
  [ApiReferenceLanguageEnum.Node]: {
    name: ApiReferenceLabelEnum.Node,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Node}`,
    minVersion: undefined,
  },
  [ApiReferenceLanguageEnum.Python]: {
    name: ApiReferenceLabelEnum.Python,
    path: `${BASE_DOC_DIR}/API_Reference/${ApiReferenceLanguageEnum.Python}`,
    minVersion: 'v.2.0.x',
  },
};

// 1. versions and latest version info of all language
export const generateApiReferenceVersionsInfo = () => {
  // if(language){
  //   const {path, minVersion} = API_REFERENCE_CONFIG[language];
  //   const { versions, latestVersion } = generateDocVersionInfo({
  //     filePath: path,
  //     minVersion: minVersion,
  //   });

  //   return {
  //     language,
  //     label: API_REFERENCE_CONFIG[language].name,
  //     versions,
  //     latestVersion,
  //   }
  // }
  const apiVersionInfo = Object.entries(API_REFERENCE_CONFIG).map(
    ([language, config]) => {
      const { versions, latestVersion } = generateDocVersionInfo({
        filePath: config.path,
        minVersion: config.minVersion,
      });

      return {
        language,
        label: config.name,
        versions,
        latestVersion,
      };
    }
  );

  return apiVersionInfo;
};

// 2. menu data of each language for single version
export const generateApiMenuAndContentDataOfSingleVersion = (params: {
  language: ApiReferenceLanguageEnum;
  version: string;
  withContent?: boolean;
}) => {
  const { language, version, withContent = false } = params;
  const path = API_REFERENCE_CONFIG[language].path;
  const versionPath = `${path}/${version}`;
  const contentList: ApiFileDateInfoType[] = [];

  readApiFile({
    filePath: versionPath,
    fileDataList: contentList,
    withContent,
  });

  const menuData = generateApiMenuData({ filePath: versionPath });

  return {
    version,
    menuData,
    contentList,
  };
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
    const { language, versions, latestVersion, label } = v;
    const isContainCurrentDocVersion = versions.includes(params.docVersion);
    if (isContainCurrentDocVersion) {
      return {
        id: language,
        label,
        isMenu: false,
        externalLink: '',
        href: `/api-reference/${language}/${docVersion}/About.md`,
        parentId: 'api-reference',
        parentIds: ['api-reference'],
        level: 2,
        children: [],
      };
    }
    return {
      id: language,
      label,
      isMenu: false,
      externalLink: '',
      href: `/api-reference/${language}/${latestVersion}/About.md`,
      parentId: 'api-reference',
      parentIds: ['api-reference'],
      level: 2,
      children: [],
    };
  });

  return {
    parentId: '',
    parentIds: [],
    level: 1,
    id: 'api-reference',
    label: 'API Reference',
    isMenu: true,
    externalLink: '',
    href: '',
    children: apiMenu,
  };
};
