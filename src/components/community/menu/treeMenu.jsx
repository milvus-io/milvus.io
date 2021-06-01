import React, { useState, useEffect, useRef } from 'react';
import { useMobileScreen } from '../../../hooks';
import LocalizedLink from '../../localizedLink/localizedLink';
import * as styles from './treeMenu.module.less';

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

const TreeMenu = ({ wrapperClass, menuList, locale, activePost }) => {
  const { menuList: menus } = menuList.find(menu => menu.lang === locale) || {
    menuList: [],
  };

  const [menuStatus, setMenuStatus] = useState(false);
  const [realMenuList, setRealMenuList] = useState([]);

  const menuRef = useRef(null);

  useEffect(() => {
    const generateMenu = list => {
      // get all labels , make sure will generate menu from top to bottom
      const labelKeys = Object.keys(menus[0])
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
          // id community is home page
          return doc.id === 'community' ? `/community` : `/community/${doc.id}`;
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
      // here will open the right menu and give the active color
      findDoc.isActive = true;
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
    let arr = generateMenu(menus)();

    checkActive(arr);
    sortMenu(arr);
    setRealMenuList(arr);
  }, [menus, activePost]);

  const { isMobile } = useMobileScreen();
  useEffect(() => {
    setMenuStatus(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const html = document.querySelector('html');
    html.style.overflowY = isMobile && menuStatus ? 'hidden' : 'auto';
  }, [isMobile, menuStatus]);

  const generageMenuDom = (list, className = '') => {
    return (
      <ul>
        {list.map(doc => (
          <li
            className={`${className} ${doc.label2 ? styles.child3 : ''}  ${
              doc.isLast ? styles.lastLevel : ''
            } ${doc.isActive ? styles.active : ''}`}
            key={doc.id}
          >
            <div
              className={`${styles.nameWrapper} ${
                doc.showChildren ? styles.active : ''
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={
                doc.isMenu
                  ? () => {
                      toggleMenuChild(doc);
                    }
                  : () => {}
              }
              onClick={
                doc.isMenu
                  ? () => {
                      toggleMenuChild(doc);
                    }
                  : () => {}
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
                <LocalizedLink
                  locale={locale}
                  className={styles.text}
                  to={doc.path}
                >
                  {doc.title}
                </LocalizedLink>
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
              className={`${styles.childWrapper} ${
                doc.showChildren ? styles.open : ''
              }`}
            >
              {doc.children && doc.children.length
                ? generageMenuDom(doc.children, styles.child)
                : null}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const toggleMenuChild = doc => {
    const copyMenu = JSON.parse(JSON.stringify(realMenuList));
    const findDoc = findItem('title', doc.title, copyMenu);
    findDoc.showChildren = !findDoc.showChildren;
    setRealMenuList(copyMenu);
  };

  const toggleMenu = status => {
    setMenuStatus(status);
  };

  const onMaskClick = () => {
    setMenuStatus(false);
  };

  return (
    <>
      <nav
        className={`${wrapperClass} ${styles.container} ${
          !menuStatus ? styles.hide : ''
        }`}
        ref={menuRef}
      >
        {generageMenuDom(realMenuList, `${styles.topLevel}`)}
      </nav>
      {isMobile && (
        <div
          className={styles.miniControl}
          role="button"
          tabIndex={0}
          onKeyDown={() => {
            toggleMenu(!menuStatus);
          }}
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
        <div
          className={styles.mask}
          role="button"
          tabIndex={0}
          onKeyDown={onMaskClick}
          onClick={onMaskClick}
        >
          .
        </div>
      )}
    </>
  );
};

export default TreeMenu;
