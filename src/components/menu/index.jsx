import React, { useEffect, useState, useRef } from 'react';
import LocalizeLink from '../localizedLink/localizedLink';
import VersionSelector from '../selector';
import { useMobileScreen } from '../../hooks';
import './index.scss';
/* eslint-disable */
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
    setShowMask = () => { }
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

          // const { label1, label2, label3 } = doc || {};

          // let parentPath = "";
          // if (label1) {
          //   parentPath += `${label1}/`;
          // }
          // if (label2) {
          //   parentPath += `${label2}/`;
          // }
          // if (label3) {
          //   parentPath += `${label3}/`;
          // }
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
        label1: '',
        label2: '',
        label3: '',
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

  const handleMenuClick = e => {
    const menuContainer = menuRef.current;
    if (menuContainer) {
      window.localStorage.setItem('zilliz-height', menuContainer.scrollTop);
    }

  };

  useEffect(() => {
    const menuContainer = menuRef.current;
    const scrollTop = window.localStorage.getItem('zilliz-height') || 0;
    menuContainer.scrollTop = scrollTop;
  }, [props]);

  const generageMenuDom = (list, className = '') => {
    return list.map(doc => (
      <div
        className={`${className} ${type === 'new' && doc.label2 !== undefined && doc.label2 !== ''
          ? 'menu-child-3'
          : ''
          } ${doc.isBlog ? 'blog' : ''} ${doc.isLast ? 'menu-last-level' : ''} ${doc.isActive ? 'active' : ''
          }`}
        key={doc.id}
      >
        <div
          className={`menu_name-wrapper ${doc.showChildren ? 'active' : ''}`}
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
              className="text outlink"
            >
              <i className="fas fa-external-link-alt"></i>
              {doc.title}
            </a>
          ) : doc.isMenu === true ? (
            <span className="text">{doc.title}</span>
          ) : (
            <LocalizeLink locale={locale} className="text" to={doc.path}>
              {doc.title}
            </LocalizeLink>
          )}

          {doc.children && doc.children.length ? (
            <>
              {type === 'new' ? (
                <>
                  {doc.isMenu && doc.label1 === '' ? (
                    <i
                      className={`fas fa-caret-down arrow ${doc.showChildren ? '' : 'top'
                        }`}
                    ></i>
                  ) : (
                    <i
                      className={`fas expand-icon ${doc.showChildren ? 'fa-minus-square' : 'fa-plus-square'
                        }`}
                    ></i>
                  )}
                </>
              ) : (
                <i
                  className={`fas fa-chevron-down arrow ${doc.showChildren ? '' : 'top'
                    }`}
                ></i>
              )}
            </>
          ) : null}
        </div>
        <div className={`menu-child-wrapper ${doc.showChildren ? 'open' : ''}`}>
          {doc.children && doc.children.length
            ? generageMenuDom(doc.children, 'menu-child')
            : null}
        </div>
      </div>
    ));
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

  const handleSearch = event => {
    const value = event.target.value;
    if (event.code === 'Enter') {
      onSearchChange(value);
    }
  };

  return (
    <>
      <section
        className={`menu-container can-scroll ${!menuStatus && type !== 'new' ? 'hide' : ''} ${type === 'new' ? 'menu-container-new new-hide' : ''
          }`}
        ref={menuRef}
      >
        {isMobile && type !== 'new' ? (
          <i
            className="fas fa-times close"
            onClick={() => {
              toggleMenu(false);
            }}
          ></i>
        ) : null}
        {isBlog || type === 'new' ? (
          <>
            {type === 'new' && !isMobile ? (
              <input
                className="search"
                type="text"
                onKeyPress={handleSearch}
                placeholder={header.search}
              />
            ) : (
              <div className="title"></div>
            )}
          </>
        ) : (
          <div className="border-bottom select-wrapper">
            <VersionSelector
              options={versions}
              selected={formatVersion}
              locale={locale}
              isVersion={true}
            ></VersionSelector>
          </div>
        )}

        {generageMenuDom(realMenuList, 'menu-top-level border-bottom')}
      </section>
      {
        type === 'new' && isMobile ?
          (
            <div
              className="mini-menu-control"
              onClick={() => {
                toggleMenu(!menuStatus);
                setShowMask(!menuStatus);
              }}
            >
              {menuStatus ? <i className="fas fa-times new"></i> : <i className="fas fa-bars new"></i>}
            </div>

          ) :
          (
            !menuStatus ? (
              <div
                className="mini-menu-control"
                onClick={() => {
                  toggleMenu(true);
                }}
              >
                <i className="fas fa-bars"></i>
              </div>
            ) : null
          )
      }
    </>
  );
};

export default Menu;
