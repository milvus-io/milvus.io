/**
 * remove .md in filename
 * @date 2022-06-20
 * @param {any} fileName:string
 * @returns {any}
 */
export const formatFileName = fileName => {
  if (!fileName) {
    return '';
  }

  return fileName.split('.')[0];
};

export const getMenuInfoById = (menus, id) => {
  const flattened = list => {
    return list.reduce((pre, cur) => {
      const { children } = cur;
      if (children.length) {
        pre = pre.concat(flattened(children));
      }
      pre = pre.concat(cur);

      return pre;
    }, []);
  };

  const target = flattened(menus).find(v => v.id === id);
  return target;
};

export const handleClickMenuPageItem = (list, activeId, parentIds) => {
  const activeIds = [...parentIds, activeId];
  return list.map(v => {
    const { children = [], isOpen, id } = v;
    if (children.length) {
      // if item is expanded and click this item again, close it;
      return {
        ...v,
        isActive: id === activeId || activeIds.includes(id),
        isOpen: isOpen && id === activeId ? false : activeIds.includes(id),
        children: handleClickMenuPageItem(children, activeId, activeIds),
      };
    }
    return {
      ...v,
      isActive: id === activeId,
      isOpen: false,
    };
  });
};

export const handleClickPureMenuItem = (
  list,
  activeId,
  parentIds,
  isCloseSubMenus
) => {
  const activeIds = [...parentIds, activeId];
  return list.map(v => {
    const { children = [], isOpen, id, isActive } = v;
    if (children.length) {
      return {
        ...v,
        isActive: id === activeId ? !isActive : isActive,
        isOpen:
          isOpen && isCloseSubMenus
            ? false
            : id === activeId
            ? !isOpen
            : isOpen,
        children: handleClickPureMenuItem(
          children,
          activeId,
          activeIds,
          isOpen && id === activeId
        ),
      };
    }
    return {
      ...v,
    };
  });
};

export const recursionUpdateTree = (
  list,
  activeId,
  parentIds,
  isPage = false
) => {
  if (!isPage) {
    return handleClickPureMenuItem(list, activeId, parentIds);
  } else {
    return handleClickMenuPageItem(list, activeId, parentIds);
  }
};

export const formatMenus = (menus, ids) => {
  const parents = ids || [];
  const menuList = menus.map(m => {
    const commonProps = {
      id: m.id,
      label: m.label,
      href: m.children ? '' : m.id,
      externalLink: m.outLink || '',
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

/**
 * 描述 filter available versions and get newest version
 * @date 2022-09-15
 * @param {any} versions version list
 * @param {any} minVersion Minimum version
 * @returns {any}
 */
export const getNewestVersionTool = (versions, minVersion) => {
  if (!versions.length) {
    return {
      newestVersion: null,
      list: [],
    };
  }

  let minEdition = minVersion.includes('x')
    ? minVersion.replace('x', 0)
    : minVersion;

  minEdition = minEdition.replaceAll(/v|\./g, '');

  const list = versions.map(v => {
    let edition = v.includes('x') ? v.replace('x', '1') : v;

    edition = edition.replaceAll(/v|\./g, '');

    return {
      version: v,
      edition,
    };
  });

  const filteredList = list.filter(v => v.edition >= minEdition);

  if (!filteredList.length) {
    return {
      newestVersion: null,
      list: [],
    };
  }
  filteredList.sort((x, y) => y.edition - x.edition);

  return {
    newestVersion: filteredList[0].version,
    list: filteredList.map(v => v.version),
  };
};

export const formatMenuStructure = list => {
  let newList = list.map(v => {
    const {
      id,
      title,
      isMenu = false,
      outLink = '',
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
      isMenu,
      outLink,
      parentId,
      parentIds,
      level,
      children: [],
    };
  });

  newList.sort((x, y) => y.level - x.level);

  const resultList = newList.slice();

  newList.forEach(v => {
    const { parentId, level, ...rest } = v;
    const parentIndex = resultList.findIndex(v => v.id === parentId);
    if (parentIndex !== -1) {
      resultList[parentIndex].children.push(rest);
    }
  });

  return resultList
    .filter(v => v.level === 1)
    .map(v => {
      const { level, parentId, ...rest } = v;
      return {
        ...rest,
      };
    });
};
