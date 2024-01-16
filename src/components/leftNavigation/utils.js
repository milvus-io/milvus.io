const findItem = (key, value, arr) => {
  let find = undefined;
  arr.forEach(v => {
    if (find) return;
    // because of tab id like: xxx-cpu
    // we only need string before "-" to compare
    // value already split with "-"
    const target = v[key].split('-')[0];
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
          .filter(v => v.includes('label'))
          .sort((a, b) => a[a.length - 1] - b[b.length - 1])
      : [];
  let index = 0;
  return function innerFn(formatMenu = []) {
    const copyMenu = JSON.parse(JSON.stringify(formatMenu));
    const parentLabel = index ? labelKeys[index - 1] : '';

    if (index && !parentLabel) {
      return copyMenu;
    }
    const generatePath = doc => {
      if (pageType === 'community') {
        // id community is home page
        return doc.id === 'community' ? `/community` : `/community/${doc.id}`;
      }
      if (pageType === 'bootcamp') {
        // id community is home page
        return doc.id === 'bootcamp' ? `/bootcamp` : `/bootcamp/${doc.id}`;
      }
      if (doc.id.includes('benchmarks')) {
        return `/docs/${doc.id}`;
      }
      if (pageType === 'blog') {
        return `/blogs/${doc.id}`;
      }
      if (doc?.isApiReference) {
        return doc?.url;
      }

      return doc?.outLink
        ? `${doc?.outLink}`
        : `/docs/${version ? `${version}/` : ''}${doc.id}`;
    };
    // find top menu by current label
    const topMenu = menuList.filter(v => {
      if (!labelKeys[index] || !v[labelKeys[index]]) {
        return index > 0 ? (v[parentLabel] ? true : false) : true;
      }
      return false;
    });

    topMenu.forEach(v => {
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
        const parent = findItem('id', v[parentLabel], copyMenu);
        parent && parent.children.push(item);
      }
    });

    index++;
    return innerFn(copyMenu);
  };
};
