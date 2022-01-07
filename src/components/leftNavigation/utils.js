const findItem = (key, value, arr) => {
  let find = undefined;
  arr.forEach((v) => {
    if (find) return;
    // because of tab id like: xxx-cpu
    // we only need string before "-" to compare
    // value already split with "-"
    const target = v[key].split("-")[0];
    if (target === value) {
      find = v;
    } else if (v.children && v.children.length) {
      find = findItem(key, value, v.children);
    }
  });
  return find;
};

export const mdMenuListFactory = (menuList, pageType, version, locale) => {
  // get all labels , make sure will generate menu from top to bottom
  const labelKeys =
    menuList.length > 0
      ? Object.keys(menuList[0])
          .filter((v) => v.includes("label"))
          .sort((a, b) => a[a.length - 1] - b[b.length - 1])
      : [];
  let index = 0;
  return function innerFn(formatMenu = []) {
    let copyMenu = JSON.parse(JSON.stringify(formatMenu));
    const parentLabel = index ? labelKeys[index - 1] : "";

    if (index && !parentLabel) {
      return copyMenu;
    }
    const generatePath = (doc) => {
      if (pageType === "community") {
        // id community is home page
        return doc.id === "community" ? `/community` : `/community/${doc.id}`;
      }
      if (pageType === "bootcamp") {
        // id community is home page
        return doc.id === "bootcamp" ? `/bootcamp` : `/bootcamp/${doc.id}`;
      }
      if (doc.id.includes("benchmarks")) {
        return `/docs/${doc.id}`;
      }
      if (pageType === "blog") {
        return `/blogs/${doc.id}`;
      }
      if (doc?.isApiReference) {
        return doc?.url;
      }

      return doc?.outLink ? `${doc?.outLink}` : `/docs/${version}/${doc.id}`;
    };
    // find top menu by current label
    const topMenu = menuList.filter((v) => {
      if (!labelKeys[index] || !v[labelKeys[index]]) {
        return index > 0 ? (v[parentLabel] ? true : false) : true;
      }
      return false;
    });

    topMenu.forEach((v) => {
      // i18n: { title: { en: 'API Reference', cn: 'API 参考' }, }
      if (v?.i18n) {
        const { i18n, title } = v;
        const localizedTitle = i18n?.title?.[locale] || title;
        localizedTitle && (v.title = localizedTitle);
      }
      // const item = {
      //   ...v,
      //   children: [],
      //   showChildren: false,
      //   isActive: false,
      //   isLast: !labelKeys[index + 1],
      //   isBlog,
      //   path: generatePath(v),
      // };
      const item = {
        id: v.id,
        label: v.title,
        link: generatePath(v),
        children: [],
      };
      if (index === 0) {
        copyMenu.push(item);
      } else {
        const parent = findItem("id", v[parentLabel], copyMenu);
        parent && parent.children.push(item);
      }
    });

    index++;
    return innerFn(copyMenu);
  };
};

export const filterApiMenus = (menus = [], currentDocVersion) => {
  // level 1 menu
  const rootMenu = [];
  // level 2 menus
  const secondLevelMenus = [];
  // level 3 items' names
  const thirdLevelMenuNames = [];
  // filter all compatible api menu items(not a directory)
  const filteredMenus = menus.reduce((prev, menu) => {
    if (menu?.isMenu && !menu?.label2) {
      menu?.id === "api_reference"
        ? rootMenu.push(menu)
        : secondLevelMenus.push(menu);
    } else if (menu?.docVersion?.includes(currentDocVersion)) {
      prev.push(menu);
      thirdLevelMenuNames.push(menu?.label2);
    }
    return prev;
  }, []);
  // filter level 2 menus if they has children(level 3 menu items)
  const filteredSecondLevelMenus = secondLevelMenus.filter(
    (v) =>
      thirdLevelMenuNames.includes(v?.id) &&
      v?.docVersion?.includes(currentDocVersion)
  );
  // merge the level 1&2 menus into results
  filteredMenus?.length &&
    filteredMenus.push(...rootMenu, ...filteredSecondLevelMenus);
  return filteredMenus;
};

export const mergeMenuList = (menus = [], apiMenus = []) => {
  const apiMenu = apiMenus[0];
  if (!apiMenu) return menus;
  // If menus doesn't have "API" menu, add apiMenu as the last one.
  if (!menus.find((item) => item?.id === "API")) {
    apiMenu.order = menus.length;
    return [...menus, apiMenu];
  }
  // If exists, replace "API" with apiMenu.
  return menus.reduce((prev, item) => {
    const { id, order, children } = item;
    if (id === "API") {
      apiMenu.order = order;
      // Copy "API" menu's children to apiMenu if not exists.
      // Such as "C++"" and "RESTful".
      mergeChildren(children, apiMenu);
      return [...prev, apiMenu];
    }
    return [...prev, item];
  }, []);
};

const mergeChildren = (children, target) => {
  const transformId = { pymilvus: "Python", java: "Java", go: "Go" };
  const existedApiNames = target.children.map(
    (child) => transformId[child.category] || ""
  );
  children.forEach((child) => {
    const { id } = child;
    if (!existedApiNames.includes(id)) {
      target.children.push({ ...child, label1: '"api_reference"' });
    }
  });
};
