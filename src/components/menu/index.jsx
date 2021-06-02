import React, { useEffect, useState, useRef } from 'react';
import LocalizeLink from '../localizedLink/localizedLink';
import { useMobileScreen } from '../../hooks';
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
    activeDoc,
    version,
    versions,
    locale,
    type,
    onSearchChange,
    language,
    wrapperClass = '',
  } = props;

  const { header } = language;
  const [menuStatus, setMenuStatus] = useState(false);
  const { isBlog } = menuList || {};
  const [realMenuList, setRealMenuList] = useState([]);
  const formatVersion = version === 'master' ? versions[0] : version;
  useEffect(() => {
    const generateMenu = list => {
      // get all labels , make sure will generate menu from top to bottom
      const labelKeys = Object.keys(menuList.menuList[0])
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
          if (doc.id.includes('benchmarks')) {
            return `/docs/${doc.id}`;
          }
          if (isBlog) {
            return `/blogs/${doc.id}`;
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
      const findDoc = findItem('id', activeDoc, list);
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
    let arr = generateMenu(menuList.menuList)();
    // add home page in menu if version is 2.0
    if (type === 'new') {
      const homeMenu = {
        children: [],
        id: 'home',
        isActive: false,
        isBlog: false,
        isLast: false,
        isMenu: null,
        lang: null,
        order: -1,
        outLink: null,
        path: '/docs/home',
        showChildren: false,
        title: 'Home',
      };
      arr = [homeMenu, ...arr];
    }

    checkActive(arr);
    sortMenu(arr);
    setRealMenuList(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuList, activeDoc, version]);

  const { isMobile } = useMobileScreen();
  useEffect(() => {
    setMenuStatus(!isMobile);
  }, [isMobile]);

  const menuRef = useRef(null);

  useEffect(() => {
    const html = document.querySelector('html');
    html.style.overflowY = isMobile && menuStatus ? 'hidden' : 'auto';
  }, [isMobile, menuStatus]);

  const handleMenuClick = e => {
    const menuContainer = menuRef.current;
    if (menuContainer) {
      window.localStorage.setItem('zilliz-height', menuContainer.scrollTop);
    }
  };

  const generageMenuDom = (list, className = '') => {
    return list.map(doc => (
      <div
        className={`${className} ${doc.label2 ? styles.menuChild3 : ''}  ${
          doc.isLast ? styles.menuLastLevel : ''
        } ${doc.isActive ? styles.active : ''}`}
        key={doc.id}
      >
        <div
          className={`${styles.menuNameWrapper} ${
            doc.showChildren ? styles.active : ''
          }`}
          onClick={
            doc.isMenu
              ? () => {
                  toggleMenuChild(doc);
                }
              : handleMenuClick
          }
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
            <LocalizeLink locale={locale} className={styles.text} to={doc.path}>
              {doc.title}
            </LocalizeLink>
          )}

          {doc.children && doc.children.length ? (
            <>
              {doc.isMenu && doc.label1 === '' ? (
                <i
                  className={`fas fa-caret-down ${styles.arrow} ${
                    doc.showChildren ? '' : styles.top
                  }`}
                ></i>
              ) : (
                <i
                  className={`fas ${styles.expandIcon} ${
                    doc.showChildren ? 'fa-minus-square' : 'fa-plus-square'
                  }`}
                ></i>
              )}
            </>
          ) : null}
        </div>
        <div
          className={`${styles.menuChildWrapper} ${
            doc.showChildren ? styles.open : ''
          }`}
        >
          {doc.children && doc.children.length
            ? generageMenuDom(doc.children, styles.menuChild)
            : null}
        </div>
      </div>
    ));
  };

  const toggleMenuChild = doc => {
    let menu = JSON.parse(JSON.stringify(realMenuList));
    const toggleIsShowChildren = (menu, doc) => {
      const findDoc = findItem('title', doc.title, menu);
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

  const toggleMenu = status => {
    setMenuStatus(status);
  };

  const handleSearch = event => {
    const value = event.target.value;
    if (event.code === 'Enter') {
      onSearchChange(value);
    }
  };

  const onMaskClick = () => {
    setMenuStatus(false);
  };

  return (
    <>
      <section
        className={`${wrapperClass} ${styles.menuContainer} ${
          !menuStatus ? styles.hide : ''
        }`}
        ref={menuRef}
      >
        {!isMobile && (
          <input
            className={styles.search}
            type="text"
            onKeyPress={handleSearch}
            placeholder={header.search}
          />
        )}

        {generageMenuDom(realMenuList, `${styles.menuTopLevel}`)}
      </section>
      {isMobile && (
        <div
          className={styles.miniMenuControl}
          onClick={() => {
            toggleMenu(!menuStatus);
          }}
        >
          {menuStatus ? (
            <i className={`fas fa-times ${styles.v2}`}></i>
          ) : (
            <i className={`fas fa-bars ${styles.v2}`}></i>
          )}
        </div>
      )}
      {isMobile && menuStatus && (
        <div className={styles.mask} onClick={onMaskClick}></div>
      )}
    </>
  );
};

export default Menu;
