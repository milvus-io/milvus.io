import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';
import * as styles from './leftNav.module.less';
import './leftNav.less';
import { AlgoliaSearch } from '../search/agloia';
import clsx from 'clsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ExpansionTreeView from '../treeView/ExpansionTreeView';
import { sortVersions } from '../../utils/index';
import AdjustableMenu from '../adjustableMenu';

const LeftNav = props => {
  const {
    homeUrl,
    homeLabel,
    menus = [],
    versions = [],
    version,
    className = '',
    mdId = 'home',
    language,
    group,
    trans,
    isOpened,
    showHome = false,
    showSearch = true,
    getVersionLink = i =>
      i === 'v0.x' ? `/docs/${i}/overview.md` : `/docs/${i}`,
    onMenuCollapseUpdate,
  } = props;

  const nodeId = group || mdId;
  const sortedVersions = versions.sort(sortVersions);

  const generateContent = () => (
    <>
      {version && (
        <div className={clsx('selector-container', styles.selectorContainer)}>
          <Link
            to={homeUrl}
            className={clsx(styles.homeBtn, {
              [styles.selected]: mdId === 'home',
            })}
          >
            {homeLabel}
          </Link>
          <FormControl
            fullWidth
            size="small"
            className={clsx('selector', styles.selector)}
          >
            <Select
              labelId="version-select-label"
              id="version-select"
              value={version}
            >
              {sortedVersions.map(i => (
                <MenuItem key={i} value={i}>
                  <Link to={getVersionLink(i)} className={styles.selectorItem}>
                    {i}
                  </Link>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <ExpansionTreeView
        itemList={menus}
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
      <aside className={clsx(className, 'left-nav', styles.aside)}>
        {showSearch && (
          <AlgoliaSearch trans={trans} locale={language} version={version} />
        )}
        {generateContent()}
      </aside>
    </AdjustableMenu>
  );
};

export default LeftNav;
