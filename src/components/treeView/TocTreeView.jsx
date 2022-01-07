import React, { useMemo } from "react";
// import { Link } from "gatsby-plugin-react-i18next";
import clsx from "clsx";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { Typography } from "@mui/material";
import * as styles from "./TocTreeView.module.less";
import "./TocTreeView.less";

const title2hash = (title = "") => {
  const normalVal = title.replace(/[.｜,｜/｜'｜?｜？｜、|，|(|)|:]/g, "");
  const anchor = normalVal.split(" ").join("-");
  return anchor;
};

const TocTreeView = (props) => {
  const { maxDepth = 3, items, title, className } = props;

  const parseItems = (originItems = []) => {
    const allLegalIds = [];
    // { id, label, link, children }
    const result = originItems.reduce((prev, item, idx, arr) => {
      const getParent = (srcList = [], curItem) => {
        if (srcList.length === 0) return;
        const { depth: curDepth } = curItem;
        const latestItem = srcList[srcList.length - 1];
        if (curDepth - latestItem.depth === 1) {
          return latestItem;
        }
        return getParent(latestItem.children, curItem);
      };
      const { depth, value } = item;
      const curHash = title2hash(value);
      if (depth <= maxDepth) allLegalIds.push(`${idx}-${curHash}`);
      const newItem = {
        id: `${idx}-${curHash}`,
        label: value,
        link: `#${curHash}`,
        depth,
        children: [],
      };
      if (depth === 1 || idx === 0) {
        prev.push(newItem);
        return prev;
      }
      const parentItem = getParent(prev, newItem);
      if (parentItem) {
        parentItem.children.push(newItem);
      } else {
        prev.push(newItem);
      }
      return prev;
    }, []);
    return { result, allLegalIds };
  };

  const nestedItemsMemo = useMemo(() => parseItems(items), [items]);
  const expandedItemsIdList = nestedItemsMemo.allLegalIds;

  const generateLink = (originUrl, label, linkClassName = "") => {
    return (
      <a
        key={`${originUrl}-${label}`}
        href={originUrl}
        className={clsx("mv3-toc-link", {
          [linkClassName]: linkClassName,
        })}
      >
        {label}
      </a>
    );
  };

  const generateTreeItem = ({ id, label, link, children }) => {
    return (
      <>
        {children?.length ? (
          <TreeItem
            key={`${id}-parent`}
            nodeId={id}
            label={link ? generateLink(link, label) : label}
          >
            {children.map((i) => generateTreeItem(i))}
          </TreeItem>
        ) : (
          <TreeItem
            key={`${id}-children`}
            nodeId={id}
            label={link ? generateLink(link, label) : label}
          />
        )}
      </>
    );
  };

  return (
    <div
      className={clsx("mv3-toc-container", styles.container, {
        [className]: className,
      })}
    >
      {title && (
        <Typography variant="h7" className={clsx(styles.title)}>
          {title}
        </Typography>
      )}
      <TreeView
        className={clsx("mv3-toc-tree")}
        // selected={selectedId}
        expanded={expandedItemsIdList}
      >
        {nestedItemsMemo.result.map((i) => generateTreeItem(i))}
      </TreeView>
    </div>
  );
};

export default TocTreeView;
