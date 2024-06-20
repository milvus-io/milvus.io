import {
  AllMdVersionIdType,
  ApiReferenceRouteEnum,
  FinalMenuStructureType,
} from '@/types/docs';

const isDev = process.env.NODE_ENV === 'development';

export const sortVersions = (a, b) => {
  if (a && b) {
    let [v1, s1, m1] = a.split('.');
    let [v2, s2, m2] = b.split('.');

    // s1 m1 will be 'x' and undefined when version is v0.x or v1.x
    s1 = Number.isNaN(Number(s1)) ? 0 : s1;
    m1 = Number.isNaN(Number(m1)) ? 0 : m1;
    s2 = Number.isNaN(Number(s2)) ? 0 : s2;
    m2 = Number.isNaN(Number(m2)) ? 0 : m2;

    const aValue = v1.split('')[1] * 10000 + s1 * 100 + m1 * 1;
    const bValue = v2.split('')[1] * 10000 + s2 * 100 + m2 * 1;

    if (aValue > bValue) {
      return -1;
    }
    if (aValue === bValue) {
      return 0;
    }
    if (aValue < bValue) {
      return 1;
    }
  }
};

export const findActiveMenuItem = (params: {
  mdId: string;
  menu: FinalMenuStructureType[];
  groupId?: string;
}) => {
  const { mdId, menu, groupId } = params;
  const activeNodeId = groupId || mdId;
  let expandedIds: string[] = [];

  const filterTarget = (list: FinalMenuStructureType[], activeId: string) => {
    list.forEach(item => {
      const { children = [] } = item;

      if (item.id === activeId) {
        expandedIds = item.parentIds || [];
      } else {
        filterTarget(children, activeId);
      }
    });
  };

  filterTarget(menu, activeNodeId);
  return expandedIds;
};

// convert vx.x.x/a/b/c to a-b-c
export const formatApiRelativePath = (path: string) => {
  return path.split('/').slice(2).join('-');
};

export const generateVersionSelectOptions = (params: {
  versions: string[];
  currentMdId: string;
  mdListData: AllMdVersionIdType[];
  latestVersion: string;
  type?: 'doc' | 'api';
  category?: ApiReferenceRouteEnum;
}) => {
  const {
    versions,
    currentMdId,
    mdListData,
    latestVersion,
    type = 'doc',
    category = ApiReferenceRouteEnum.Python,
  } = params;

  let links: { label: string; href: string }[] = [];

  if (type === 'api') {
    versions.forEach(version => {
      const curVersionMds =
        mdListData.find(v => v.version === version)?.mds || [];
      const isContainCurMd = curVersionMds.some(mdId => mdId === currentMdId);
      // split the path to get the last part
      const linkSuffix = isContainCurMd ? currentMdId : 'About.md';
      links.push({
        label: version,
        href: `/api-reference/${category}/${version}/About.md`,
      });
    });
  } else {
    const linkSuffix = currentMdId === 'home' ? '' : currentMdId;

    versions.forEach(version => {
      const curVersionMds =
        mdListData.find(v => v.version === version)?.mds || [];
      const isContainCurMd = curVersionMds.some(mdId => mdId === currentMdId);
      if (isContainCurMd) {
        // have same md file in current version
        const linkItem =
          version === latestVersion
            ? { label: version, href: `/docs/${linkSuffix}` }
            : {
                label: version,
                href: `/docs/${version}/${linkSuffix}`,
              };
        links.push(linkItem);
      } else {
        const linkItem =
          version === latestVersion
            ? { label: version, href: '/docs' }
            : { label: version, href: `/docs/${version}` };
        links.push(linkItem);
      }
    });
  }
  return links;
};

export const setCacheData = (params: {
  cache: Map<string, any>;
  key: string;
  data: any;
}) => {
  const { cache, key, data } = params;
  cache.set(key, data);
};

export const getCacheData = (params: {
  cache: Map<string, any>;
  key: string;
}) => {
  // only use cache in production
  if (isDev) {
    return null;
  }

  const { cache, key } = params;
  return cache.get(key);
};

export const formatQueryString = (hash: string) => {
  return hash.replace(/#/g, '');
};
