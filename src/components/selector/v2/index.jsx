import React, { useRef, useEffect, useState } from 'react';
import LocalizedLink from '../../../components/localizedLink/localizedLink';
import { useClickOutside } from '../../../hooks';
import { globalHistory } from '@reach/router';
import * as styles from './v2.module.less';

const V2Selector = ({
  options,
  className = '',
  locale,
  path,
  isLangSelector = false,
  navItemLabel,
}) => {
  const choosenWrapper = useRef(null);
  const wrapper = useRef(null);
  const [open, setOpen] = useState(false);
  const to = path.replace('/en/', '/').replace('/cn/', '/');
  const { pathname } = globalHistory.location;

  const handleClick = e => {
    e.stopPropagation();
    setOpen(open ? false : true);
  };
  useClickOutside(wrapper, () => {
    setOpen(false);
  });

  useEffect(() => {
    const hideOptions = e => {
      const container = document.querySelector('.selector-container');
      if (container) {
        const isInclude = container.contains(e.target);
        if (!isInclude) {
          setOpen(false);
        }
      }
    };

    window.addEventListener('click', hideOptions, false);
    return () => {
      window.removeEventListener('click', hideOptions, false);
    };
  }, []);

  return (
    <div className={`${styles.selectorContainer} ${className}`} ref={wrapper}>
      <div
        role="button"
        tabIndex={0}
        className={styles.choosenWrapper}
        ref={choosenWrapper}
        onClick={e => handleClick(e)}
        onKeyDown={e => handleClick(e)}
      >
        {navItemLabel}
      </div>

      <div className={`${styles.optionsWrapper} ${open ? styles.show : ''}`}>
        {options.map(option => {
          return isLangSelector ? (
            <LocalizedLink
              locale={option.value}
              to={to}
              className={`${styles.optionItem} ${
                option.value === locale && styles.active
              }`}
              key={option.value}
            >
              {option.label}
            </LocalizedLink>
          ) : (
            <LocalizedLink
              locale={locale}
              to={option.link}
              className={`${styles.optionItem} ${
                pathname.includes(option.link) && styles.active
              }`}
              key={option.label}
            >
              {option.label}
            </LocalizedLink>
          );
        })}
      </div>
    </div>
  );
};
export default V2Selector;
