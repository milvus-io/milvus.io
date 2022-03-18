import React, { useEffect, useState } from "react";
import { Link } from "gatsby-plugin-react-i18next";
import clsx from "clsx";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import CustomIconLink from "../customIconLink";
import "./ExpansionTreeView.less";

const SCROLL_TOP = "@@scroll|menu";

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
    treeClassName = "",
    itemClassName = "",
    linkClassName = "",
    homeUrl,
    homeLabel,
    showHome = false,
    currentMdId,
    language: lng,
    ...others
  } = props;

  const [expandedIds, setExpandedIds] = useState(
    filterExpandedItems(currentMdId, itemList)
  );

  const handleClickMenuLink = () => {
    const menuTree = document.querySelector(".mv3-tree-view");
    window.sessionStorage.setItem(SCROLL_TOP, menuTree.scrollTop);
  };

  useEffect(() => {
    const initIds = filterExpandedItems(currentMdId, itemList);
    setExpandedIds(initIds);
  }, [itemList, currentMdId]);

  useEffect(() => {
    const menuTree = document.querySelector(".mv3-tree-view");
    const scrollTop = window.sessionStorage.getItem(SCROLL_TOP) || 0;

    // mutationObserver can't be disconnected,it leads to container scrolls as long as menu item be clicked
    // todo: find another way to replace setTimeout
    setTimeout(() => {
      if (menuTree) {
        menuTree.scrollTo({
          top: scrollTop,
          behavior: "smooth",
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

  const generateLink = (originUrl, label, linkClassName) => {
    const externalUrlReg = /^(http|https)/;
    const isExternal = externalUrlReg.test(originUrl);
    return isExternal ? (
      <CustomIconLink
        to={originUrl}
        className={clsx("mv3-item-link", {
          [linkClassName]: linkClassName,
        })}
        isDoc={true}
      >
        {label}
      </CustomIconLink>
    ) : (
      <Link
        to={originUrl}
        className={clsx("mv3-item-link", {
          [linkClassName]: linkClassName,
        })}
      >
        {label}
      </Link>
    );
  };

  const generateTreeItem = ({ id, label, link, children }) => {
    return children?.length ? (
      <TreeItem
        key={`parent-${id}-${link}`}
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
        key={`child-${id}-${link}`}
        className={itemClassName}
        nodeId={id}
        label={
          link
            ? generateLink(link, label, handleClickMenuLink, linkClassName)
            : label
        }
      />
    );
  };

  return (
    <TreeView
      className={clsx("mv3-tree-view", { [treeClassName]: treeClassName })}
      selected={currentMdId === "home" ? `home-${homeLabel}` : currentMdId}
      expanded={expandedIds}
      {...others}
      onClick={handleClickMenuLink}
    >
      {showHome && (
        <TreeItem
          nodeId={`home-${homeLabel}`}
          className={itemClassName}
          label={
            <Link
              to={homeUrl}
              className={clsx("mv3-item-link", {
                [linkClassName]: linkClassName,
              })}
              language={lng}
            >
              {homeLabel}
            </Link>
          }
        />
      )}
      {itemList.map(i => generateTreeItem(i))}
    </TreeView>
  );
};

export default ExpansionTreeView;
