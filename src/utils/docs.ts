import fs from 'fs';
import { join } from 'path';

import {
  DocFrontMatterType,
  DocFileDataInfoType,
  OriginMenuStructureType,
  FinalMenuStructureType,
  AllMdVersionIdType,
} from '@/types/docs';
import { JSON_REG, VERSION_REG } from '@/consts/regexp';
import { setCacheData, getCacheData } from './index';
import { LanguageEnum } from '@/types/localization';

const matter = require('gray-matter');

export const BASE_DOC_DIR = join(process.cwd(), 'src/docs');
export const DOCS_MINIMUM_VERSION = 'v2.2.x';
const IGNORE_VERSIONS = ['v2.3.0-beta'];
export const IGNORE_FILES = [
  'README.md',
  'Variables.json',
  '.DS_Store',
  'fragments',
  'menuStructure',
  '.git',
  'home',
  'template',
  '_md2md_demo',
  'release_notes',
  'Tips.json',
];

export const validationFileFilter = (file: string) => {
  return !IGNORE_FILES.includes(file) && !JSON_REG.test(file);
};

// if call the same function multiple times, use cache to store the data
const docCache = new Map<string, any>();

// version system
const convertVersionStringToVersionNum = (
  versionString: string
): {
  version: string;
  versionNum: number;
} => {
  const usableVersion = versionString
    .replace('v', '')
    .replaceAll('x', '1')
    .split('-')[0];
  const [major, minor, patch] = usableVersion.split('.');
  const patchNum = Number.isNaN(parseInt(patch)) ? 0 : parseInt(patch);
  const minorNum = Number.isNaN(parseInt(minor)) ? 0 : parseInt(minor) * 10;
  const majorNum = Number.isNaN(parseInt(major)) ? 0 : parseInt(major) * 1000;
  const versionNum = patchNum + minorNum + majorNum;
  return {
    version: versionString,
    versionNum,
  };
};

export const generateDocVersionInfo = (params?: {
  filePath?: string;
  minVersion?: string;
}) => {
  const { filePath = BASE_DOC_DIR, minVersion = DOCS_MINIMUM_VERSION } =
    params || {};
  const folders: string[] = fs.readdirSync(filePath).map((dirName: string) => {
    return dirName;
  });

  const { versionNum: minVersionNum } =
    convertVersionStringToVersionNum(minVersion);

  const releaseInfoPath = join(BASE_DOC_DIR, 'version.json');
  const releaseNote = JSON.parse(fs.readFileSync(releaseInfoPath, 'utf-8'));

  const { version: releaseVersion, released } = releaseNote;

  const allVersions = folders
    .filter(folder => VERSION_REG.test(folder))
    .filter(folder => folder <= releaseVersion)
    .map(folder => {
      const version = convertVersionStringToVersionNum(folder);
      return version;
    })
    .sort((a, b) => b.versionNum - a.versionNum);

  let usableVersions = allVersions.filter(
    v => v.versionNum >= minVersionNum && !IGNORE_VERSIONS.includes(v.version)
  );

  if (released === 'no') {
    usableVersions = usableVersions.filter(v => v.version !== releaseVersion);
  }

  const latestVersion = usableVersions[0].version;

  const restVersions = usableVersions
    .map(v => v.version)
    .filter(v => v !== latestVersion);

  return {
    versions: usableVersions.map(v => v.version),
    latestVersion,
    restVersions,
  };
};

function removeZeroWidthSpacesFromString(htmlString) {
  const zeroWidthSpace = '\u200B';
  return htmlString.replace(new RegExp(zeroWidthSpace, 'g'), '');
}

// file system
const readFile = (params: {
  path: string;
  fileDataList: DocFileDataInfoType[];
  withContent?: boolean;
}) => {
  try {
    const { path, fileDataList, withContent = false } = params;
    const fileStat = fs.statSync(path);

    const relativePath = path.match(/\/v\d.*$/)?.[0] || '';

    if (fileStat.isDirectory()) {
      const subPaths: string[] = fs
        .readdirSync(path)
        .filter((subPath: string) => !IGNORE_FILES.includes(subPath))
        .map((v: string) => join(path, v));

      return subPaths.map(subPath =>
        readFile({ path: subPath, fileDataList, withContent })
      );
    } else if (fileStat.isFile() && path.endsWith('.md')) {
      const fileData = fs.readFileSync(path, 'utf-8');
      const propsInfo = removeZeroWidthSpacesFromString(
        fs.readFileSync(path.replace('.md', '.json'), 'utf-8')
      );

      const { data, content } = matter(fileData) as {
        data: DocFrontMatterType;
        content: string;
      };

      const cleanedContent = removeZeroWidthSpacesFromString(content);

      // ignore docs files that are marked as deprecated
      if (!data.deprecate) {
        fileDataList.push({
          frontMatter: data,
          content: withContent ? cleanedContent : '',
          editPath: relativePath,
          propsInfo: JSON.parse(propsInfo),
        });
      }
    }
  } catch (error) {
    console.error('readFile error:', error);
  }
};

// recursively read all files of a version into memory
// without home data
export const generateAllContentDataOfSingleVersion = (params: {
  version: string;
  lang: LanguageEnum;
  withContent?: boolean;
}) => {
  const { version, lang = LanguageEnum.ENGLISH, withContent = false } = params;

  // cache key is `content-${version}-${language}-${withContent}`
  const cacheKey = `content-${version}-${lang}-${withContent}`;

  const cachedData = getCacheData({
    cache: docCache,
    key: cacheKey,
  });

  if (cachedData) {
    return cachedData;
  }

  const filePath = join(
    BASE_DOC_DIR,
    `localization/${params.version}/site/${lang}`
  );

  let fileDataList: DocFileDataInfoType[] = [];

  readFile({ path: filePath, fileDataList, withContent: params.withContent });

  setCacheData({
    cache: docCache,
    key: cacheKey,
    data: fileDataList,
  });

  return fileDataList;
};

export const generateContentDataOfSingleFile = (params: {
  version: string;
  id: string;
  lang: LanguageEnum;
  withContent?: boolean;
}) => {
  const {
    version,
    id,
    lang = LanguageEnum.ENGLISH,
    withContent = false,
  } = params;
  const fileDataList = generateAllContentDataOfSingleVersion({
    version,
    lang,
    withContent,
  });

  const targetFileData = fileDataList.find(v => v.frontMatter.id === id);
  return targetFileData;
};

export const generateAllContentDataOfAllVersion = (lang?: LanguageEnum) => {
  const language = lang || LanguageEnum.ENGLISH;
  const cacheKey = `all-content-${language}`;

  const cachedData = getCacheData({ cache: docCache, key: cacheKey });
  if (cachedData) {
    return cachedData;
  }

  const { versions } = generateDocVersionInfo();
  const allFileDataOfAllVersion = versions.reduce((acc, version) => {
    const data = generateAllContentDataOfSingleVersion({
      version,
      lang: language,
      withContent: false,
    }).filter(v => v.frontMatter.id);

    acc.push({
      version,
      mds: data.map(d => d.frontMatter.id),
    });

    return acc;
  }, [] as AllMdVersionIdType[]);

  setCacheData({
    cache: docCache,
    key: cacheKey,
    data: allFileDataOfAllVersion,
  });
  return allFileDataOfAllVersion;
};

export const generateHomePageDataOfSingleVersion = (params: {
  version: string;
  lang?: LanguageEnum;
}) => {
  const { version, lang = LanguageEnum.ENGLISH } = params;

  // home data cache key is `home-${version}-${lang}`
  const cacheKey = `home-${version}-${lang}`;
  const cachedData = getCacheData({
    cache: docCache,
    key: cacheKey,
  });

  if (cachedData) {
    return cachedData;
  }

  const filePath = join(
    BASE_DOC_DIR,
    `localization/${version}/site/${lang}/home/home.md`
  );
  const fileInfo = fs.readFileSync(filePath, 'utf-8');
  const propsInfo = removeZeroWidthSpacesFromString(
    fs.readFileSync(filePath.replace('.md', '.json'), 'utf-8')
  );
  const { data, content } = matter(fileInfo) as {
    data: DocFrontMatterType;
    content: string;
  };

  const cleanedContent = removeZeroWidthSpacesFromString(content);

  setCacheData({
    cache: docCache,
    key: cacheKey,
    data: {
      frontMatter: data,
      content: cleanedContent,
    },
  });

  return {
    frontMatter: data,
    content: cleanedContent,
    filePath,
    propsInfo: JSON.parse(propsInfo),
  };
};

// menu system
// fill in th missing fields: parentId, parentIds, href,
const formatMenuStructure: (
  list: any[],
  parentId?: string,
  parentIds?: string[]
) => any[] = (list, parentId = '', parentIds = []) => {
  if (!list || !list.length) {
    return [];
  }
  list.forEach(item => {
    const { children, id } = item;
    item.parentId = parentId;
    item.parentIds = [...parentIds];
    item.href = id;
    item.children = formatMenuStructure(children, id, [...parentIds, id]);
  });

  return list;
};

export const generateMenuDataOfCurrentVersion = (params: {
  docVersion: string;
  lang: LanguageEnum;
}) => {
  const { docVersion, lang = LanguageEnum.ENGLISH } = params;
  const cacheKey = `menu-${docVersion}-${lang}`;
  const cachedData = getCacheData({ cache: docCache, key: cacheKey });

  if (cachedData) {
    return cachedData;
  }

  const fileData = getMenuStructureData({ docVersion, lang });
  const menu = formatMenuStructure(JSON.parse(fileData));
  setCacheData({ cache: docCache, key: cacheKey, data: menu });
  return menu;
};

const getMenuStructureData = (params: {
  docVersion: string;
  lang: LanguageEnum;
}) => {
  const { docVersion, lang = LanguageEnum.ENGLISH } = params;
  try {
    const filePath = join(
      BASE_DOC_DIR,
      `localization/${docVersion}/site/${lang}/menuStructure/${lang}.json`
    );
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    // fallback to the en version
    return fs.readFileSync(
      join(BASE_DOC_DIR, `${docVersion}/site/en/menuStructure/en.json`),
      'utf-8'
    );
  }
};

export const sortVersionDir = (a: { id: string }, b: { id: string }) => {
  const versionRegex = /^v(\d+)$/;
  const aMatch = a.id.match(versionRegex);
  const bMatch = b.id.match(versionRegex);
  if (aMatch && bMatch) {
    const aVersion = parseInt(aMatch[1], 10);
    const bVersion = parseInt(bMatch[1], 10);

    return bVersion - aVersion;
  }
  return 0;
};
