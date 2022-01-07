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

const LeftNav = (props) => {
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
  } = props;

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
  }, [docMenus]);

  const handleVersionChange = (event) => {
    const v = event.target.value;
    setSelectedVersion(v);
  };

  useEffect(() => {
    setSelectedVersion(currentVersion);
  }, [currentVersion]);

  const generateContent = () => (
    <>
      {selectedVersion && (
        <FormControl
          fullWidth
          size="small"
          className={clsx(styles.selector, { [styles.mobile]: isMobile })}
        >
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedVersion}
            onChange={handleVersionChange}
          >
            {docVersions.map((i) => (
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
        currentMdId={mdId}
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
        {showSearch && <AlgoliaSearch locale={locale} version={version} />}

        {generateContent()}
      </Drawer>
    </>
  ) : (
    <aside className={clsx(className, "left-nav", styles.aside)}>
      {showSearch && <AlgoliaSearch locale={locale} version={version} />}
      {generateContent()}
    </aside>
  );
};

export default LeftNav;
