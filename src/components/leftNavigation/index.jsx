import React, { useEffect, useState } from "react";
import { Link } from "gatsby-plugin-react-i18next";
import * as styles from "./leftNav.module.less";
import "./leftNav.less";
import { AlgoliaSearch } from "../search/agloia";
import clsx from "clsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { mdMenuListFactory, filterApiMenus, mergeMenuList } from "./utils";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ExpansionTreeView from "../treeView/ExpansionTreeView";
import { sortVersions } from "../../utils/index";
import AdjustableMenu from "../adjustableMenu";

const LeftNav = props => {
  const {
    homeUrl,
    homeLabel,
    menus: docMenus = [],
    apiMenus = [],
    pageType = "doc",
    currentVersion,
    locale = "en",
    docVersions = [],
    className = "",
    mdId = "home",
    language,
    version,
    showHome = false,
    group,
    trans,
    isOpened,
    onMenuCollapseUpdate,
  } = props;

  const nodeId = group || mdId;
  const [selectedVersion, setSelectedVersion] = useState(currentVersion);
  const showSearch = pageType === "doc" || pageType === "api";
  const generateMdMenuList = mdMenuListFactory(
    docMenus,
    pageType,
    currentVersion,
    locale
  );
  const formatedMdMenuList = generateMdMenuList();
  const filteredApiMenus = filterApiMenus(apiMenus, currentVersion);
  const generateApiMenuList = mdMenuListFactory(
    filteredApiMenus,
    pageType,
    currentVersion,
    locale
  );
  const formatedApiMenuList = generateApiMenuList();
  const treeItems = mergeMenuList(formatedMdMenuList, formatedApiMenuList);

  const handleVersionChange = event => {
    const v = event.target.value;
    setSelectedVersion(v);
  };

  useEffect(() => {
    setSelectedVersion(currentVersion);
  }, [currentVersion]);

  const sortedVersions = docVersions.sort(sortVersions);

  const generateContent = () => (
    <>
      {selectedVersion && (
        <div className={clsx("selector-container", styles.selectorContainer)}>
          <Link
            to={homeUrl}
            className={clsx(styles.homeBtn, {
              [styles.selected]: mdId === "home",
            })}
          >
            {homeLabel}
          </Link>
          <FormControl
            fullWidth
            size="small"
            className={clsx("selector", styles.selector)}
          >
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedVersion}
              onChange={handleVersionChange}
            >
              {sortedVersions.map(i => (
                <MenuItem key={i} value={i}>
                  <Link
                    to={i === "v0.x" ? `/docs/${i}/overview.md` : `/docs/${i}`}
                    className={styles.selectorItem}
                  >
                    {i}
                  </Link>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <ExpansionTreeView
        itemList={treeItems}
        // treeClassName={styles.tree}
        treeClassName={styles.tree}
        itemClassName={styles.treeItem}
        linkClassName={styles.treeItemLink}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        homeUrl={homeUrl}
        homeLabel={homeLabel}
        showHome={showHome}
        currentMdId={nodeId}
        language={language}
      />
    </>
  );

  return (
    <AdjustableMenu
      isOpened={isOpened}
      onMenuCollapseUpdate={onMenuCollapseUpdate}
    >
      <aside className={clsx(className, "left-nav", styles.aside)}>
        {showSearch && (
          <AlgoliaSearch trans={trans} locale={language} version={version} />
        )}
        {generateContent()}
      </aside>
    </AdjustableMenu>
  );
};

export default LeftNav;
