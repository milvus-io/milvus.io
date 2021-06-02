import React from 'react';
import LocalizeLink from '../localizedLink/localizedLink';
import * as styles from './sidebar.module.less';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Sidebar = props => {
  const {
    locale,
    showSearch = true,
    showVersions = false,
    showMenu = true,
    menuConfig,
    searchConfig,
    versionConfig,
    wrapperClass = '',
  } = props;

  const { placeholder, onSearchChange } = searchConfig || {};
  const { versions, version, homeTitle } = versionConfig || {};
  const { menuList, activePost, formatVersion } = menuConfig || {};

  const docHomePath = ``;

  const [mobileSidebarOpened, setMobileSidebarOpened] = useState(false);

  const handleSearch = event => {
    const value = event.target.value;
    if (event.code === 'Enter') {
      onSearchChange(value);
    }
  };

  const onMaskClick = () => {
    setMobileSidebarOpened(false);
  };

  return (
    <aside className={`${wrapperClass}`}>
      {showSearch && (
        <section className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.search}
            onKeyPress={handleSearch}
            placeholder={placeholder}
          />
        </section>
      )}
      {showVersions && (
        <section>
          <LocalizeLink locale={locale} to={docHomePath}>
            {homeTitle}
          </LocalizeLink>
          {/* @TODO: add version selector */}
        </section>
      )}
      {showMenu && (
        <Menu
          menuList={menuList}
          activePost={activePost}
          formatVersion={formatVersion}
          wrapperClass={styles.menuWrapper}
        />
      )}

      {mobileSidebarOpened && (
        <div className={styles.mask} onClick={onMaskClick}></div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  locale: PropTypes.string.isRequired,
  showSearch: PropTypes.boolean,
  showVersions: PropTypes.boolean,
  showMenu: PropTypes.boolean,
  menuConfig: PropTypes.object,
  searchConfig: PropTypes.object,
};

export default Sidebar;
