import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './ExpansionTreeView.module.css';
import { ApiReferenceRouteEnum, FinalMenuStructureType } from '@/types/docs';
import { ExternalDocLinkIcon, ChevronRightIcon } from '@/components/icons';
import { findActiveMenuItem } from '@/utils';
import { useRouter } from 'next/router';
import { LanguageEnum } from '@/types/localization';
import { getLinkPrefix } from './utils';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

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
  lang?: LanguageEnum;
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
  const {
    itemList,
    homepageConf,
    currentMdId,
    latestVersion,
    type,
    version,
    groupId = '',
    classes: customClasses,
    lang,
    category,
  } = props;

  const { asPath } = useRouter();

  const {
    tree: treeClassName,
    item: itemClassName,
    link: linkClassName,
  } = customClasses;
  const linkPrefix = getLinkPrefix({ type, lang, category });
  const treeView = useRef<HTMLUListElement>(null);
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
    window.sessionStorage.setItem(SCROLL_TOP, `${menuTree.scrollTop}`);
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
    const scrollTop = window.sessionStorage.getItem(SCROLL_TOP) || '0';

    setTimeout(() => {
      if (menuTree) {
        menuTree.scrollTo({
          top: Number(scrollTop),
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
    }, [externalLink, linkPrefix, href, version, latestVersion]);

    if (!href) {
      return <>{label}</>;
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

  const generateTreeItem = (item: FinalMenuStructureType) => {
    const { id, label, href, children, parentIds, externalLink = '' } = item;
    const isExpanded = expandedIds.includes(id);
    const isSelected = selectedId === id;
    const hasChildren = children?.length > 0;

    return (
      <li key={hasChildren ? id : `child-${id}-${href}`} className={itemClassName}>
        {hasChildren ? (
          <Collapsible open={isExpanded}>
            <div
              className={clsx(styles.treeItemLabel, {
                [styles.selected]: isSelected,
              })}
              onClick={() => handleClickParentTree({ nodeId: id, parentIds })}
            >
              <span
                className={clsx(styles.treeItemIcon, {
                  [styles.treeItemIconExpanded]: isExpanded,
                })}
              >
                <ChevronRightIcon />
              </span>
              <span>{label}</span>
            </div>
            <CollapsibleContent className={styles.collapsibleContent}>
              <ul className={styles.treeItemChildren}>
                {children.map(child => generateTreeItem(child))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div
            className={clsx(styles.treeItemLabel, styles.treeItemLeaf, {
              [styles.selected]: isSelected,
            })}
            onClick={() =>
              handleClickParentTree({ nodeId: id, groupId, parentIds })
            }
          >
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
          </div>
        )}
      </li>
    );
  };

  useEffect(() => {
    setSelectedId(groupId || currentMdId);
  }, [asPath]);

  return (
    <ul
      ref={treeView}
      className={clsx(styles.mv3TreeView, {
        [treeClassName]: treeClassName,
      })}
      onClick={handleClickMenuLink}
    >
      {itemList.map(i => generateTreeItem(i))}
    </ul>
  );
};

export default ExpansionTreeView;
