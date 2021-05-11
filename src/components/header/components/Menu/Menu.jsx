import React from 'react';
import { Link } from 'gatsby';
import V2Selector from '../../../selector/v2';
import * as navStyles from './menu.module.less';

const Menu = ({ version, options, setSelected, navList }) => (
  <div className={navStyles.navSection}>
    {navList.map(i => {
      const { label, link, isExternal } = i;
      return isExternal ? (
        <a
          className={navStyles.navItem}
          href={link}
          key={label}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      ) : (
        <Link className={navStyles.navItem} to={link} key={label}>
          {label}
        </Link>
      );
    })}
    <div className={navStyles.dropDown}>
      <V2Selector
        className={navStyles.mobileSelector}
        selected={version}
        options={options}
        setSelected={setSelected}
      />
    </div>
  </div>
);

export default Menu;
