import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import styles from './ExpansionTreeView.module.less';
import { ApiReferenceRouteEnum, FinalMenuStructureType } from '@/types/docs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ExternalDocLinkIcon } from '@/components/icons';
import { findActiveMenuItem } from '@/utils';

const SCROLL_TOP = '@@scroll|menu';

interface ExpansionTreeViewPropsType {
  itemList: FinalMenuStructureType[];
  homepageConf: {
    label: string;
    link: string;
  };
  currentMdId: string;
  latestVersion: string;
  type: 'doc' | 'api';
  version: string;
  groupId?: string;
  classes?: {
    tree?: string;
    item?: string;
    link?: string;
  };
  showHomeButton?: boolean;
  collapseIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  category?: ApiReferenceRouteEnum;
}

const ExpansionTreeView = (props: ExpansionTreeViewPropsType) => {
  // https://mui.com/components/tree-view/
  // itemList = [ { id='', children = [], label='', link='' }, ...]
  const {
    itemList,
    homepageConf,
    currentMdId,
    latestVersion,
    type,
    version,
    groupId = '',
    classes,
    showHomeButton = false,
    collapseIcon,
    expandIcon,
    category,
  } = props;

  // deconstruct classes
  const {
    tree: treeClassName,
    item: itemClassName,
    link: linkClassName,
  } = classes;
  const linkPrefix = type === 'doc' ? '/docs' : `/api-reference/${category}`;
  const treeView = useRef(null);
  const [expandedIds, setExpandedIds] = useState<string[]>(
    findActiveMenuItem({
      groupId,
      mdId: currentMdId,
      menu: itemList,
    })
  );

  const [selectedId, setSelectedId] = useState(groupId || currentMdId);

  const handleClickMenuLink = () => {
    const menuTree = treeView.current;
    if (!menuTree) return;
    window.sessionStorage.setItem(SCROLL_TOP, menuTree.scrollTop);
  };

  useEffect(() => {
    const initIds = findActiveMenuItem({
      groupId,
      mdId: currentMdId,
      menu: itemList,
    });
    setExpandedIds(initIds);
  }, [itemList, currentMdId, groupId]);

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

  const handleClickParentTree = (params: {
    nodeId: string;
    groupId?: string;
    parentIds: string[];
  }) => {
    const { nodeId, groupId = '', parentIds } = params;
    const curNodeId = groupId || nodeId;
    const curExpandNodeIndex = expandedIds.indexOf(curNodeId);

    if (curExpandNodeIndex !== -1) {
      // close menu
      setExpandedIds(v => v.slice(0, curExpandNodeIndex));
      return;
    }

    setExpandedIds([...parentIds, curNodeId]);
  };

  const TreeItemLink: React.FC<{
    href?: string;
    label: string;
    onClick: () => void;
    id: string;
    linkPrefix: string;
    version: string;
    latestVersion: string;
    className?: string;
    externalLink?: string;
  }> = ({
    href,
    label,
    onClick,
    id,
    linkPrefix,
    version,
    latestVersion,
    className = '',
    externalLink,
  }) => {
    const finalLink = useMemo(() => {
      if (externalLink) {
        return externalLink;
      }
      if (href.includes('api-reference')) {
        return href;
      }
      if (type === 'doc') {
        return version === latestVersion
          ? `${linkPrefix}/${href}`
          : `${linkPrefix}/${version}/${href}`;
      }
      return `${linkPrefix}/${version}/${href}`;
    }, [externalLink, linkPrefix, href, type, latestVersion, version]);

    if (!href) {
      return <>label</>;
    }

    return (
      <Link
        href={finalLink}
        className={clsx('mv3-item-link', {
          className,
        })}
        onClick={() => {
          onClick();
          setSelectedId(id);
        }}
      >
        {externalLink ? (
          <span>
            <ExternalDocLinkIcon />
            {label}
          </span>
        ) : (
          label
        )}
      </Link>
    );
  };

  const generateTreeItem = (props: FinalMenuStructureType) => {
    const { id, label, href, children, parentIds, externalLink = '' } = props;
    return children?.length ? (
      <TreeItem
        key={id}
        className={itemClassName}
        nodeId={id}
        label={label}
        onClick={() => {
          handleClickParentTree({
            nodeId: id,
            groupId,
            parentIds,
          });
        }}
      >
        {children.map(i => generateTreeItem(i))}
      </TreeItem>
    ) : (
      <TreeItem
        key={`child-${id}-${href}`}
        className={itemClassName}
        nodeId={id}
        onClick={() => {
          handleClickParentTree({
            nodeId: id,
            groupId,
            parentIds,
          });
        }}
        label={
          <TreeItemLink
            href={href}
            label={label}
            onClick={handleClickMenuLink}
            className={linkClassName}
            version={version}
            linkPrefix={linkPrefix}
            externalLink={externalLink}
            latestVersion={latestVersion}
            id={id}
          />
        }
      />
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      ref={treeView}
      className={clsx(styles.mv3TreeView, {
        [treeClassName]: treeClassName,
      })}
      selected={
        currentMdId === 'home' ? [`home-${homepageConf.label}`] : [selectedId]
      }
      expanded={expandedIds}
      onClick={handleClickMenuLink}
    >
      {itemList.map(i => generateTreeItem(i))}
    </TreeView>
  );
};

export default ExpansionTreeView;
