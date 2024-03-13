import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import {
  formatFileName,
  formatMenus,
  getMenuInfoById,
  getNewestVersionTool,
  formatMenuStructure,
} from './docUtils';
import { generateAvailableApiVersions } from './apiReference.utils';

/**
 * what i need:
 * all available doc versions
 * routers based on available version
 * contents based on available version, folder structure property
 * menus based on available version
 * */

const BASE_DOC_DIR = join(process.cwd(), 'src/docs');
const DOCS_MINIMUM_VERSION = 'v1.0.0';
const VERSION_REG = /^v\d/;
const IGNORE_FILES = [
  'index.md',
  'README.md',
  'Variables.json',
  '.DS_Store',
  'fragments',
  'menuStructure',
  '.git',
  'home',
];

const generateAvailableDocVersions = () => {
  const versions = fs
    .readdirSync(BASE_DOC_DIR)
    .filter(v => VERSION_REG.test(v));
  const { list, newestVersion } = getNewestVersionTool(
    versions,
    DOCS_MINIMUM_VERSION
  );

  return {
    versions: list,
    newestVersion,
  };
};

const generateAllDocData = () => {
  let contentList = [];
  const { versions } = generateAvailableDocVersions();
  const docData = versions.map(version => {
    const docDir = join(BASE_DOC_DIR, `${version}/site/en`);
    const menuDir = join(
      BASE_DOC_DIR,
      `${version}/site/en/menuStructure/en.json`
    );
    const homeDir = join(BASE_DOC_DIR, `${version}/site/en/home/home.md`);

    const originMenu = JSON.parse(fs.readFileSync(menuDir, 'utf-8')).menuList;

    const menu = formatMenuStructure(originMenu);

    const homeData = fs.readFileSync(homeDir);
    const { content } = matter(homeData);

    walkFiles({
      basePath: docDir,
      suffixPath: '',
      contentList,
      config: { version },
    });

    return {
      version,
      menu: menu,
      homeContent: content,
    };
  });

  return {
    docData,
    contentList,
  };
};

const getLatestVersionRouter = contentList => {
  return contentList.map(v => ({
    params: {
      slug: v.id,
    },
  }));
};

const getDocRouter = contentList => {
  return contentList.map(v => ({
    params: {
      slug: v.id,
      version: v.version,
    },
  }));
};

const getDocMenu = (docData, version) => {
  const menu = docData.find(v => v.version === version)?.menu;

  const { newestVersion: newestGo } = generateAvailableApiVersions('go');
  const { newestVersion: newestJava } = generateAvailableApiVersions('java');
  const { newestVersion: newestNode } = generateAvailableApiVersions('node');
  const { newestVersion: newestPy } = generateAvailableApiVersions('pymilvus');
  const { newestVersion: newestRestful } =
    generateAvailableApiVersions('restful');
  const { newestVersion: newestCsharp } =
    generateAvailableApiVersions('csharp');

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
    {
      label: 'RESTful',
      id: 'milvus-restful',
      externalLink: `/api-reference/restful/${newestRestful}/About.md`,
    },
    {
      label: 'C#',
      id: 'milvus-sdk-csharp',
      externalLink: `/api-reference/csharp/${newestCsharp}/About.md`,
    },
  ];

  return formatMenus([
    ...menu,
    {
      id: 'api-reference',
      label: 'Api reference',
      isMenu: true,
      children: apis,
    },
  ]);
};

const getHomeData = (docData, version) => {
  const homeContent = docData.find(v => v.version === version)?.homeContent;

  return homeContent || '';
};

const getDocContent = (allData, version, id) => {
  const target = allData.find(v => v.id === id && v.version === version);

  if (!target) {
    return {
      id,
      version,
      content: 'No Data',
      data: null,
      absolutePath: '',
      editPath: '',
    };
  }

  return {
    id,
    version,
    content: target.content,
    data: target.data,
    absolutePath: target.absolutePath,
    editPath: target.path,
  };
};

function walkFiles({ basePath, suffixPath: path, contentList, config }) {
  const originPath = join(basePath, path);
  const paths = fs.readdirSync(originPath);

  paths
    .filter(v => !IGNORE_FILES.includes(v))
    .forEach(subPath => {
      const suffixPath = `${path}/${subPath}`;
      const filePath = join(basePath, suffixPath);
      const state = fs.statSync(filePath);
      if (state.isDirectory()) {
        walkFiles({
          basePath,
          suffixPath,
          contentList,
          config,
        });
      } else {
        const file = fs.readFileSync(filePath, 'utf-8');

        const { data, content } = matter(file);

        contentList.push({
          id: subPath,
          path: suffixPath.replace('/', ''),
          absolutePath: filePath,
          data,
          content,
          ...config,
        });
      }
    });
}

const docUtils = {
  getAllData: generateAllDocData,
  getVersion: generateAvailableDocVersions,
  getDocRouter,
  getLatestVersionRouter,
  getDocMenu,
  getHomeData,
  getDocContent,
};

export default docUtils;
