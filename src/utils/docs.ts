import {
  DocFrontMatterType,
  DocFileDataInfoType,
  OriginMenuStructureType,
  FinalMenuStructureType,
  AllMdVersionIdType,
} from '@/types/docs';

const fs = require('fs');
const { join } = require('path');
const matter = require('gray-matter');

export const BASE_DOC_DIR = join(process.cwd(), 'src/docs');
const DOCS_MINIMUM_VERSION = 'v1.0.0';
export const VERSION_REG = /^v\d/;
export const IGNORE_FILES = [
  'index.md',
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

/**
 * version system
 * what I need:
 * 1. version list
 * 2. latest version
 * */

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
  filePath: string;
  minVersion: string;
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

  let usableVersions = allVersions.filter(v => v.versionNum >= minVersionNum);
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

/**
 * file system,
 * what I need:
 * 1. detail data of a file, like front matter info, content or without content
 * 2. data list of NO.1 for one single version.
 * 3. object, key is version, value is data list of NO.2
 * 4. home page data of single version
 * */

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

    fileDataList.push({
      frontMatter: data,
      content: withContent ? content : '',
      editPath: relativePath,
    });
  }
};

// recursively read all files of a version into memory
// without home data
export const generateAllContentDataOfSingleVersion = (params: {
  version: string;
  lang?: 'en' | 'cn';
  withContent?: boolean;
}) => {
  const langFolderName = params.lang === 'cn' ? 'zh-CN' : 'en';
  const filePath = join(
    BASE_DOC_DIR,
    `${params.version}/site/${langFolderName}`
  );

  let fileDataList: DocFileDataInfoType[] = [];

  readFile({ path: filePath, fileDataList, withContent: params.withContent });
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
  return allFileDataOfAllVersion;
};

export const generateHomePageDataOfSingleVersion = (params: {
  version: string;
  lang?: 'en' | 'cn';
}) => {
  const { version, lang = 'en' } = params;
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

  return {
    frontMatter: data,
    content,
  };
};

/**
 * menu system,
 * what I need:
 * 1. menu data of single version
 * 2. menu data format function
 * */

const formatMenuStructure = (
  list: OriginMenuStructureType[]
): FinalMenuStructureType[] => {
  const newList = list.map(v => {
    const {
      id,
      title,
      isMenu = false,
      outLink = '',
      order = 0,
      label1,
      label2,
      label3,
    } = v;

    const parentId = label3 || label2 || label1 || '';
    const parentIds = [label1, label2, label3].filter(v => !!v);
    const level = [label1, label2, label3].filter(v => !!v).length + 1;

    return {
      id: id,
      label: title,
      href: id,
      isMenu,
      externalLink: outLink,
      parentId,
      parentIds,
      level,
      order,
      children: [],
    };
  });

  newList.sort((x, y) => y.level - x.level);

  const resultList = newList.slice();

  newList.forEach(v => {
    const { parentId } = v;
    const parentIndex = resultList.findIndex(v => v.id === parentId);
    if (parentIndex !== -1) {
      resultList[parentIndex].children.push({
        label: v.label,
        id: v.id,
        isMenu: v.isMenu,
        externalLink: v.externalLink,
        href: v.href,
        children: v.children,
        parentId: parentId,
        parentIds: v.parentIds,
        level: v.level,
      });
    }
  });

  return resultList.filter(v => v.level === 1);
};

const formatMenus = (menus: FinalMenuStructureType[], ids?: string[]) => {
  const parents = ids || [];
  const menuList = menus.map(m => {
    const commonProps = {
      id: m.id,
      label: m.label,
      href: m.id,
      externalLink: m.externalLink,
      parentIds: [...parents],
    };
    return m.children
      ? {
          ...commonProps,
          children: [...formatMenus(m.children, [...parents, m.id])],
        }
      : {
          ...commonProps,
          children: [],
        };
  });

  return menuList;
};

export const generateMenuDataOfCurrentVersion = (params: {
  docVersion: string;
  lang?: string;
}) => {
  const { docVersion, lang = 'en' } = params;
  const langFolderName = lang === 'cn' ? 'zh-CN' : 'en';
  const fileName = lang === 'cn' ? 'cn.json' : 'en.json';
  const filePath = join(
    BASE_DOC_DIR,
    `${docVersion}/site/${langFolderName}/menuStructure/${fileName}`
  );

  const fileData = fs.readFileSync(filePath, 'utf-8');
  const menu = JSON.parse(fileData).menuList;

  return formatMenuStructure(menu);
};
