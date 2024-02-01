import classes from './index.module.less';
import Link from 'next/link';
import { generateMenuGroup } from './index';
import clsx from 'clsx';
import { useMemo, useRef, useEffect } from 'react';
import { Triangle } from '../../components/icons';

export default function MenuTreeGroup(props) {
  const {
    tree: { id, label, children, href, isOpen, isActive, parentIds },
    onNodeClick,
    autoScroll,
    version,
    linkPrefix,
  } = props;

  const subMenu = useRef(null);
  const elementHeightCache = useRef(0);
  const menuWrapper = useRef(null);

  const hendleMenuClick = () => {
    // when expand chang 'height: auto' to cache-height
    if (
      isOpen &&
      subMenu &&
      subMenu.current &&
      menuWrapper &&
      menuWrapper.current
    ) {
      menuWrapper.current.style.minHeight = `${subMenu.current.clientHeight}px`;
    }
    onNodeClick(id, parentIds, !!href);
  };

  const layerClassName = useMemo(() => {
    return parentIds.length === 0 ? classes.outerGroup : classes.innerGroup;
  }, [parentIds]);

  const elementStyle = useMemo(() => {
    const height =
      subMenu && subMenu.current
        ? isOpen
          ? subMenu.current.clientHeight
          : 0
        : 0;
    // when expand: default height = 0, transition = height;
    // when collapse: height = auto, transition = min-height;
    // tbd: find out why transition height is not working
    const changes = isOpen ? 'all' : 'min-height';
    // cache height of current open menu
    elementHeightCache.current = height;

    return {
      height,
      minHeight: height,
      changes,
    };
  }, [isOpen]);

  useEffect(() => {
    if (!menuWrapper || !menuWrapper.current) {
      return;
    }

    const onTransitionend = e => {
      if (
        elementHeightCache.current > 0 &&
        ['height', 'min-height'].includes(e.propertyName)
      ) {
        // must set height to auto after transition when open menu, otherwise sub-menu can't expand
        menuWrapper.current.style.height = 'auto';
        autoScroll();
      }
    };
    const menuEle = menuWrapper.current;
    menuEle.addEventListener('transitionend', onTransitionend, false);
    return () => {
      menuEle.removeEventListener('transitionend', onTransitionend, false);
    };
  }, [autoScroll]);

  return (
    <div className={clsx(classes.menuTreeGroupWrapper)}>
      <div
        className={clsx(layerClassName, {
          [classes.expandedIcon]: isOpen,
          [classes.activeGroup]: isActive,
        })}
        style={{
          paddingLeft: `${20 * parentIds.length}px`,
        }}
        onClick={hendleMenuClick}
      >
        <div className={classes.labelWrapper}>
          <span className={classes.iconWrapper}>
            <Triangle />
          </span>
          {href ? (
            <Link href={`/docs/${version}/${href}`}>{label}</Link>
          ) : (
            <p>{label}</p>
          )}
        </div>
      </div>
      <div
        ref={menuWrapper}
        className={clsx(classes.subMenusWrapper)}
        style={{
          transition: `${elementStyle.changes} 0.3s ease`,
          willChange: `${elementStyle.changes}`,
          height: elementStyle.height,
          minHeight: elementStyle.height,
        }}
      >
        <ul ref={subMenu}>
          {generateMenuGroup(
            children,
            onNodeClick,
            autoScroll,
            version,
            linkPrefix
          )}
        </ul>
      </div>
    </div>
  );
}
