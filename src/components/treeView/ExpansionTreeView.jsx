import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import CustomIconLink from '../customIconLink';
import * as styles from './ExpansionTreeView.module.less';

const SCROLL_TOP = '@@scroll|menu';

const filterExpandedItems = (targetId, items = []) => {
  const ids = [];
  const treeForEach = (tree, func, parent = {}) => {
    tree.forEach(data => {
      data.children && treeForEach(data.children, func, data);
      func(parent, data);
    });
  };
  treeForEach(items, (parent, data) => {
    if (data?.id === targetId || ids.includes(data?.id)) {
      parent.id && ids.push(parent.id);
    }
  });
  return ids;
};

const ExpansionTreeView = props => {
  // https://mui.com/components/tree-view/
  // itemList = [ { id='', children = [], label='', link='' }, ...]
  const {
    itemList = [],
    treeClassName = '',
    itemClassName = '',
    linkClassName = '',
    homeUrl,
    homeLabel,
    showHome = false,
    currentMdId,
    language: lng,
    version,
    linkPrefix,
    ...others
  } = props;

  console.log('itemList--', itemList);

  const treeView = useRef(null);

  const [expandedIds, setExpandedIds] = useState(
    filterExpandedItems(currentMdId, itemList)
  );

  const handleClickMenuLink = () => {
    const menuTree = treeView.current;
    if (!menuTree) return;
    window.sessionStorage.setItem(SCROLL_TOP, menuTree.scrollTop);
  };

  useEffect(() => {
    const initIds = filterExpandedItems(currentMdId, itemList);
    setExpandedIds(initIds);
  }, [itemList, currentMdId]);

  useEffect(() => {
    const menuTree = treeView.current;
    if (!menuTree) return;
    const scrollTop = window.sessionStorage.getItem(SCROLL_TOP) || 0;

    // mutationObserver can't be disconnected,it leads to container scrolls as long as menu item be clicked
    // todo: find another way to replace setTimeout
    setTimeout(() => {
      if (menuTree) {
        menuTree.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      }
    });
  }, []);

  const handleClickParentTree = id => {
    const currentSelectedIds = [...expandedIds].reverse();
    const idIndex = currentSelectedIds.indexOf(id);
    if (idIndex === -1) {
      const expandingIds = [id, ...filterExpandedItems(id, itemList)];
      setExpandedIds(expandingIds);
    } else {
      setExpandedIds(currentSelectedIds.slice(0, idIndex).reverse());
    }
  };

  const generateLink = ({
    originUrl,
    label,
    onClick,
    className,
    version,
    linkPrefix,
    externalLink,
  }) => {
    return externalLink ? (
      <CustomIconLink
        href={externalLink}
        className={clsx('mv3-item-link', {
          className,
        })}
        isDoc
        showIcon
      >
        {label}
      </CustomIconLink>
    ) : (
      <Link
        href={`${linkPrefix}/${version}/${originUrl}`}
        className={clsx('mv3-item-link', {
          className,
        })}
      >
        {label}
      </Link>
    );
  };

  const generateTreeItem = props => {
    const { id, label, href, children, externalLink = '' } = props;
    return children?.length ? (
      <TreeItem
        key={`parent-${id}-${href}`}
        className={itemClassName}
        nodeId={id}
        label={label}
        onClick={() => {
          handleClickParentTree(id);
        }}
      >
        {children.map(i => generateTreeItem(i))}
      </TreeItem>
    ) : (
      <TreeItem
        key={`child-${id}-${href}`}
        className={itemClassName}
        nodeId={id}
        label={
          href
            ? generateLink({
                originUrl: href,
                label,
                onClick: handleClickMenuLink,
                className: linkClassName,
                version,
                linkPrefix,
                externalLink,
              })
            : label
        }
      />
    );
  };

  return (
    <TreeView
      ref={treeView}
      className={clsx(styles.mv3TreeView, {
        [treeClassName]: treeClassName,
      })}
      selected={currentMdId === 'home' ? `home-${homeLabel}` : currentMdId}
      expanded={expandedIds}
      {...others}
      onClick={handleClickMenuLink}
    >
      {itemList.map(i => generateTreeItem(i))}
    </TreeView>
  );
};

export default ExpansionTreeView;
