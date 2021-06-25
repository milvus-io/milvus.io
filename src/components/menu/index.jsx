import React, { useEffect, useState, useRef } from 'react';
import LocalizeLink from '../localizedLink/localizedLink';
import * as styles from './index.module.less';

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

const isChildItem = (id, arr) => {
  return !!findItem('id', id, arr);
};

const closeAllChildren = arr => {
  if (!arr.length) return [];
  return arr.map(item => {
    let { children } = item;
    if (children && children.length) {
      children = closeAllChildren(children);
    }
    return { ...item, children, showChildren: false };
  });
};

const Menu = props => {
  const {
    menuList,
    activePost,
    formatVersion,
    locale,
    pageType = 'doc',
    isBlog,
    wrapperClass = '',
    allApiMenus = [],
    // mobileMenuOpened = false,
  } = props;

  const [realMenuList, setRealMenuList] = useState([]);

  /**
   * Find out the compatible api menus by comparing the target doc version for each item;
   * @param {array} apiMenus apiMenus from graphQL
   * @param {string} currentDocVersion doc version in current page
   * @returns {array} api menus matching current doc version, may be empty []
   */
  const filterApiMenus = (apiMenus = [], currentDocVersion) => {
    // level 1 menu
    const rootMenu = [];
    // level 2 menus
    const secondLevelMenus = [];
    // level 3 items' names
    const thirdLevelMenuNames = [];
    // filter all compatible api menu items(not a directory)
    const filteredMenus = apiMenus.reduce((prev, menu) => {
      if (menu?.isMenu && !menu?.label2) {
        menu?.id === 'api_reference'
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
      v =>
        thirdLevelMenuNames.includes(v?.id) &&
        v?.docVersion?.includes(currentDocVersion)
    );
    // merge the level 1&2 menus into results
    filteredMenus?.length &&
      filteredMenus.push(...rootMenu, ...filteredSecondLevelMenus);
    return filteredMenus;
  };

  /**
   * Replace api reference menu in MenuList with allApiMenus.
   * Will append allApiMenus to the end if there's no api reference menu.
   * @param {array} menus MenuList.
   * @param {array} apiMenus allApiMenus.
   * @returns {array} Combined array with MenuList(without api reference) and allApiMenus.
   */
  const mergeMenus = (menus=[], apiMenus=[]) => {
    const apiMenu = apiMenus[0];
    if (!apiMenu) return menus;
    // If menus doesn't have "API" menu, add apiMenu as the last one.
    if (!menus.find(item => item?.id === "API")) {
      apiMenu.order = menus.length;
      return [...menus, apiMenu];
    }
    // If exists, replace "API" with apiMenu.
    return menus.reduce((prev, item) => {
      const {id, order} = item;
      if (id === "API") {
        apiMenu.order = order;
        return [...prev, apiMenu];
      }
      return [...prev, item];
    }, []);
  };

  useEffect(() => {
    const generateMenu = list => {
      // get all labels , make sure will generate menu from top to bottom
      const labelKeys = Object.keys(menuList[0])
        .filter(v => v.includes('label'))
        .sort((a, b) => a[a.length - 1] - b[b.length - 1]);
      let index = 0;
      return function innerFn(formatMenu = []) {
        let copyMenu = JSON.parse(JSON.stringify(formatMenu));
        const parentLabel = index ? labelKeys[index - 1] : '';

        if (index && !parentLabel) {
          return copyMenu;
        }
        const generatePath = doc => {
          if (pageType === 'community') {
            // id community is home page
            return doc.id === 'community'
              ? `/community`
              : `/community/${doc.id}`;
          }
          if (pageType === 'bootcamp') {
            // id community is home page
            return doc.id === 'bootcamp' ? `/bootcamp` : `/bootcamp/${doc.id}`;
          }
          if (doc.id.includes('benchmarks')) {
            return `/docs/${doc.id}`;
          }
          if (isBlog) {
            return `/blogs/${doc.id}`;
          }
          if (doc?.isApiReference) {
            return doc?.url;
          }

          return `/docs/${formatVersion}/${doc.id}`;
        };
        // find top menu by current label
        const topMenu = list.filter(v => {
          if (!labelKeys[index] || !v[labelKeys[index]]) {
            return index > 0 ? (v[parentLabel] ? true : false) : true;
          }
          return false;
        });

        topMenu.forEach(v => {
          const item = {
            ...v,
            children: [],
            showChildren: false,
            isActive: false,
            isLast: !labelKeys[index + 1],
            isBlog,
            path: generatePath(v),
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

    const checkActive = list => {
      const findDoc = findItem('id', activePost, list);
      if (!findDoc) {
        return;
      }
      const labelKeys = Object.keys(findDoc).filter(v => v.includes('label'));
      findDoc.isActive = true; // here will open the right menu and give the active color
      labelKeys.forEach(label => {
        const parentDoc = findItem('id', findDoc[label], list);
        parentDoc && (parentDoc.showChildren = true);
      });
    };

    const sortMenu = list => {
      list.sort((a, b) => {
        return a.order - b.order;
      });
      list.forEach(v => {
        if (v.children && v.children.length) {
          sortMenu(v.children);
        }
      });
    };
    let arr = generateMenu(menuList)();

    // filter out compatible api menus(left nav) by current doc version
    const filteredApiMenus = filterApiMenus(allApiMenus, formatVersion);
    const apiMenus =
      filteredApiMenus.length && generateMenu(filteredApiMenus)();
    apiMenus?.length && (arr = mergeMenus(arr, apiMenus));

    checkActive(arr);
    sortMenu(arr);
    setRealMenuList(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuList, activePost, formatVersion]);

  const menuRef = useRef(null);

  const handleMenuClick = doc => {
    if (doc.isMenu) {
      toggleMenuChild(doc);
    }
  };

  const generageMenuDom = (list, className = '') => {
    return (
      <ul>
        {list.map(doc => (
          <li
            className={`${className} ${doc.label2 ? styles.menuChild3 : ''}  ${doc.isLast ? styles.menuLastLevel : ''
              } ${doc.isActive ? styles.active : ''}`}
            key={doc.id}
          >
            <div
              className={`${styles.menuNameWrapper} ${doc.showChildren ? styles.active : ''
                }`}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleMenuClick(doc)}
              onClick={() => handleMenuClick(doc)}
              style={doc.isMenu ? { cursor: 'pointer' } : null}
            >
              {doc.outLink ? (
                <a
                  href={doc.outLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.outlink} ${styles.text}`}
                >
                  <i className="fas fa-external-link-alt"></i>
                  {doc.title}
                </a>
              ) : doc.isMenu === true ? (
                <span className={styles.text}>{doc.title}</span>
              ) : (
                <LocalizeLink
                  locale={locale}
                  className={styles.text}
                  to={doc.path}
                >
                  {doc.title}
                </LocalizeLink>
              )}

              {doc.children && doc.children.length ? (
                <>
                  {doc.isMenu && doc.label1 === '' ? (
                    <i
                      className={`fas fa-caret-down ${styles.arrow} ${doc.showChildren ? '' : styles.top
                        }`}
                    ></i>
                  ) : (
                    <i
                      className={`fas ${styles.expandIcon} ${doc.showChildren ? 'fa-minus-square' : 'fa-plus-square'
                        }`}
                    ></i>
                  )}
                </>
              ) : null}
            </div>
            <div
              className={`${styles.menuChildWrapper} ${doc.showChildren ? styles.open : ''
                }`}
            >
              {doc.children && doc.children.length
                ? generageMenuDom(doc.children, styles.menuChild)
                : null}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const toggleMenuChild = doc => {
    let menu = JSON.parse(JSON.stringify(realMenuList));
    const toggleIsShowChildren = (menu, doc) => {
      const findDoc = findItem('id', doc.id, menu);
      const copyMenu = menu.map(item => {
        const { showChildren, id, children } = item;
        let childrenList = children;

        if (children && children.length && isChildItem(findDoc.id, children)) {
          childrenList = toggleIsShowChildren(children, findDoc);
          return { ...item, children: childrenList, showChildren: true };
        }
        if (id === findDoc.id) {
          childrenList = closeAllChildren(children);
          return {
            ...item,
            children: childrenList,
            showChildren: !showChildren,
          };
        }
        childrenList = closeAllChildren(children);
        return { ...item, children: childrenList, showChildren: false };
      });
      return copyMenu;
    };
    setRealMenuList(toggleIsShowChildren(menu, doc));
  };

  return (
    <>
      <nav className={`${wrapperClass} ${styles.menuContainer}`} ref={menuRef}>
        {generageMenuDom(realMenuList, `${styles.menuTopLevel}`)}
      </nav>
    </>
  );
};

export default Menu;
