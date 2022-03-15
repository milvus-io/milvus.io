import React, { useEffect, useState, useMemo } from "react";
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
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
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
    isMobile = false,
    language,
    version,
    showHome = false,
    group,
    trans,
    setIsCollapse,
  } = props;

  const nodeId = group || mdId;
  const [treeItems, setTreeItems] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(currentVersion);
  const [openDrawer, setOpenDrawer] = useState(false);
  const showSearch = useMemo(() => {
    return pageType === "doc" || pageType === "api";
  }, [pageType]);

  useEffect(() => {
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
    const mergedMenuList = mergeMenuList(
      formatedMdMenuList,
      formatedApiMenuList
    );
    setTreeItems(mergedMenuList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docMenus]);

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
        <div
          className={clsx("selector-container", styles.selectorContainer, {
            [styles.mobile]: isMobile,
          })}
        >
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
            className={clsx("selector", styles.selector, {
              [styles.mobile]: isMobile,
            })}
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
        treeClassName={clsx(styles.tree, { [styles.mobile]: isMobile })}
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

  return isMobile ? (
    <>
      <IconButton
        aria-label="open menu"
        onClick={() => {
          setOpenDrawer(true);
        }}
        className="doc-menu-icon"
        color="primary"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        // anchor={anchor}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
        className={styles.drawer}
      >
        {showSearch && (
          <AlgoliaSearch trans={trans} locale={locale} version={version} />
        )}

        {generateContent()}
      </Drawer>
    </>
  ) : (
    <AdjustableMenu setIsCollapse={setIsCollapse}>
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
