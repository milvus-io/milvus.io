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
    const commomProps = {
      id: m.id,
      label: m.label,
      href: m.isMenu ? '' : m.id,
      externalLink: m.externalLink || '',
      isActive: false,
      isOpen: false,
      parentIds: [...parents],
    };
    return m.children
      ? {
          ...commomProps,
          children: [...formatMenus(m.children, [...parents, m.id])],
        }
      : {
          ...commomProps,
          children: [],
        };
  });

  return menuList;
};