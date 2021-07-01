import React from 'react';
import LocalizedLink from '../../../localizedLink/localizedLink';
import V2Selector from '../../../selector/v2';
import * as navStyles from './menu.module.less';

const Menu = ({ options, navList, locale, path }) => {
  const LinkContent = ({ label, icon }) => (
    <>
      {icon ? <img className={navStyles.img} src={icon} alt="github" /> : label}
    </>
  );

  return (
    <div className={navStyles.navSection}>
      {navList.map(i => {
        const { label, link, isExternal, icon } = i;
        return isExternal ? (
          <a
            className={navStyles.navItem}
            href={link}
            key={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkContent label={label} icon={icon} />
          </a>
        ) : (
          <LocalizedLink
            className={navStyles.navItem}
            to={link}
            key={label}
            locale={locale}
          >
            <LinkContent label={label} icon={icon} />
          </LocalizedLink>
        );
      })}
      <div className={navStyles.dropDown}>
        <V2Selector
          className={navStyles.mobileSelector}
          options={options}
          locale={locale}
          path={path}
        />
      </div>
    </div>
  );
};

export default Menu;
