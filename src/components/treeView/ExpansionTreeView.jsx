import React, { useEffect, useState } from "react";
import { Link } from "gatsby-plugin-react-i18next";
import clsx from "clsx";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import CustomIconLink from "../customIconLink";
import "./ExpansionTreeView.less";

const ExpansionTreeView = (props) => {
  // https://mui.com/components/tree-view/
  // itemList = [ { id='', children = [], label='', link='' }, ...]
  const {
    itemList = [],
    treeClassName = "",
    itemClassName = "",
    linkClassName = "",
    homeUrl,
    homeLabel,
    currentMdId,
    language: lng,
    ...others
  } = props;
  const [expandedIds, setExpandedIds] = useState([]);

  const filterExpandedItems = (targetId, items = []) => {
    const ids = [];
    const treeForEach = (tree, func, parent = {}) => {
      tree.forEach((data) => {
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

  useEffect(() => {
    const initIds = filterExpandedItems(currentMdId, itemList);
    setExpandedIds(initIds);
  }, [itemList, currentMdId]);

  const handleClickParentTree = (id) => {
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
    return (
      <>
        {children?.length ? (
          <TreeItem
            key={id}
            className={itemClassName}
            nodeId={id}
            label={label}
            onClick={() => {
              handleClickParentTree(id);
            }}
          >
            {children.map((i) => generateTreeItem(i))}
          </TreeItem>
        ) : (
          <TreeItem
            key={id}
            className={itemClassName}
            nodeId={id}
            label={link ? generateLink(link, label, linkClassName) : label}
          />
        )}
      </>
    );
  };
  return (
    <TreeView
      className={clsx("mv3-tree-view", { [treeClassName]: treeClassName })}
      selected={currentMdId === "home" ? `home-${homeLabel}` : currentMdId}
      expanded={expandedIds}
      {...others}
    >
      {homeLabel && homeUrl && (
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
      {itemList.map((i) => generateTreeItem(i))}
    </TreeView>
  );
};

export default ExpansionTreeView;
