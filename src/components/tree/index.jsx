import classes from './index.module.less';
import MenuTreeGroup from './treeGroup';
import MenuTreeItem from './treeItem';
import { useEffect, useRef } from 'react';

const SCROLL_TOP = 'scroll-top';
const IS_REFRESH = 'is_refresh';

export const generateMenuGroup = (
  menulist,
  clickCb,
  scrollFunc,
  version,
  linkPrefix
) => {
  return menulist.map(v => {
    const { children = [], href, id } = v;
    return children.length === 0 && href ? (
      <li key={id}>
        <MenuTreeItem
          data={v}
          version={version}
          linkPrefix={linkPrefix}
          onNodeClick={clickCb}
        />
      </li>
    ) : (
      <li key={id}>
        <MenuTreeGroup
          tree={v}
          version={version}
          linkPrefix={linkPrefix}
          onNodeClick={clickCb}
          autoScroll={scrollFunc}
        />
      </li>
    );
  });
};

export default function MenuTree(props) {
  const { tree, onNodeClick, version, linkPrefix } = props;

  const menu = useRef(null);

  const handleMenuClick = e => {
    const { scrollTop = 0 } = e.currentTarget;

    if (window && typeof window !== 'undefined') {
      window.localStorage.setItem(SCROLL_TOP, `${scrollTop}`);
    }
  };

  const autoScroll = () => {
    if (window && typeof window !== 'undefined') {
      const isRefresh = window.localStorage.getItem(IS_REFRESH);
      const scrollTop = Number(window.localStorage.getItem(SCROLL_TOP));
      if (!scrollTop || !menu || isRefresh === 'false') {
        return;
      }
      menu.current.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });
      window.localStorage.setItem(IS_REFRESH, 'false');
    }
  };

  useEffect(() => {
    window.localStorage.setItem(IS_REFRESH, 'true');
  }, []);

  return (
    <ul className={classes.menuWrapper} onClick={handleMenuClick} ref={menu}>
      {generateMenuGroup(tree, onNodeClick, autoScroll, version, linkPrefix)}
    </ul>
  );
}
