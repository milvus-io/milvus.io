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
  trigger = 'click',
}) => {
  const choosenWrapper = useRef(null);
  const wrapper = useRef(null);
  const [open, setOpen] = useState(false);
  const to = path.replace('/en/', '/').replace('/cn/', '/');
  const { pathname } = globalHistory.location;

  const handleClick = e => {
    e.stopPropagation();
    if (trigger !== 'click') return;
    setOpen(open ? false : true);
  };

  const handleHover = e => {
    if (trigger !== 'hover') return;
    setOpen(open ? false : true);
  };

  const handleMouseLeave = e => {
    e.stopPropagation();
    if (trigger !== 'hover') return;
    setOpen(open ? false : true);
  };

  useClickOutside(wrapper, () => {
    setOpen(false);
  });

  useEffect(() => {
    let clickHideOptions = null;
    if (trigger === 'click') {
      clickHideOptions = e => {
        const container = document.querySelector('.selector-container');
        if (container) {
          const isInclude = container.contains(e.target);
          if (!isInclude) {
            setOpen(false);
          }
        }
      };
      window.addEventListener('click', clickHideOptions, false);
    }

    return () => {
      if (clickHideOptions) {
        window.removeEventListener('click', clickHideOptions, false);
      }
    };
  }, [trigger]);

  return (
    <div className={`${styles.selectorContainer} ${className}`} ref={wrapper}>
      <div
        role="button"
        tabIndex={0}
        className={styles.choosenWrapper}
        ref={choosenWrapper}
        onClick={handleClick}
        onKeyDown={handleClick}
        onMouseEnter={handleHover}
        onMouseOut={handleMouseLeave}
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
