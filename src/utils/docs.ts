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

const matter = require('gray-matter');

export const BASE_DOC_DIR = join(process.cwd(), 'src/docs');
export const DOCS_MINIMUM_VERSION = 'v2.0.1';
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

  const allVersions = folders
    .filter(folder => VERSION_REG.test(folder))
    .map(folder => {
      const version = convertVersionStringToVersionNum(folder);
      return version;
    })
    .sort((a, b) => b.versionNum - a.versionNum);

  const releaseInfoPath = join(BASE_DOC_DIR, 'version.json');
  const releaseNote = JSON.parse(fs.readFileSync(releaseInfoPath, 'utf-8'));

  let usableVersions = allVersions.filter(
    v => v.versionNum >= minVersionNum && !IGNORE_VERSIONS.includes(v.version)
  );
  const { version: releaseVersion, released } = releaseNote;

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

// file system
const readFile = (params: {
  path: string;
  fileDataList: DocFileDataInfoType[];
  withContent?: boolean;
}) => {
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
  } else if (fileStat.isFile()) {
    const fileData = fs.readFileSync(path, 'utf-8');

    const { data, content } = matter(fileData) as {
      data: DocFrontMatterType;
      content: string;
    };

    // ignore docs files that are marked as deprecated
    if (!data.deprecate) {
      fileDataList.push({
        frontMatter: data,
        content: withContent ? content : '',
        editPath: relativePath,
      });
    }
  }
};

// recursively read all files of a version into memory
// without home data
export const generateAllContentDataOfSingleVersion = (params: {
  version: string;
  lang?: 'en' | 'cn';
  withContent?: boolean;
}) => {
  const { version, lang = 'en', withContent = false } = params;

  // cache key is `content-${version}-${language}-${withContent}`
  const cacheKey = `content-${version}-${lang}-${withContent}`;

  const cachedData = getCacheData({
    cache: docCache,
    key: cacheKey,
  });

  if (cachedData) {
    return cachedData;
  }

  const langFolderName = params.lang === 'cn' ? 'zh-CN' : 'en';
  const filePath = join(
    BASE_DOC_DIR,
    `${params.version}/site/${langFolderName}`
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
  lang?: 'en' | 'cn';
  withContent?: boolean;
}) => {
  const { version, id, lang = 'en', withContent = false } = params;
  const fileDataList = generateAllContentDataOfSingleVersion({
    version,
    lang,
    withContent,
  });

  const targetFileData = fileDataList.find(v => v.frontMatter.id === id);
  return targetFileData;
};

export const generateAllContentDataOfAllVersion = (lang?: 'en' | 'cn') => {
  const language = lang || 'en';
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
  lang?: 'en' | 'cn';
}) => {
  const { version, lang = 'en' } = params;

  // home data cache key is `home-${version}-${lang}`
  const cacheKey = `home-${version}-${lang}`;
  const cachedData = getCacheData({
    cache: docCache,
    key: cacheKey,
  });

  if (cachedData) {
    return cachedData;
  }

  const langFolderName = lang === 'cn' ? 'zh-CN' : 'en';
  const filePath = join(
    BASE_DOC_DIR,
    `${version}/site/${langFolderName}/home/home.md`
  );
  const fileInfo = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileInfo) as {
    data: DocFrontMatterType;
    content: string;
  };

  setCacheData({
    cache: docCache,
    key: cacheKey,
    data: {
      frontMatter: data,
      content,
    },
  });

  return {
    frontMatter: data,
    content,
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
  lang?: string;
}) => {
  const { docVersion, lang = 'en' } = params;
  const cacheKey = `menu-${docVersion}-${lang}`;
  const cachedData = getCacheData({ cache: docCache, key: cacheKey });

  if (cachedData) {
    return cachedData;
  }

  const langFolderName = lang === 'cn' ? 'zh-CN' : 'en';
  const fileName = lang === 'cn' ? 'cn.json' : 'en.json';
  const filePath = join(
    BASE_DOC_DIR,
    `${docVersion}/site/${langFolderName}/menuStructure/${fileName}`
  );

  const fileData = fs.readFileSync(filePath, 'utf-8');
  const menu = formatMenuStructure(JSON.parse(fileData));

  setCacheData({ cache: docCache, key: cacheKey, data: menu });

  return menu;
};
