import React, { useRef, useEffect, useState } from 'react';
import LocallizeLink from '../../../components/localizedLink/localizedLink';
import { useClickOutside } from '../../../hooks';
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
            <LocallizeLink
              locale={option.value}
              to={to}
              className={`${styles.optionItem} ${
                option.value === navItemLabel && styles.active
              }`}
              key={option.value}
            >
              {option.label}
            </LocallizeLink>
          ) : option.isExternal ? (
            <a
              href={option.link}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.optionItem}
              key={option.label}
            >
              {option.label}
            </a>
          ) : (
            <LocallizeLink
              locale={locale}
              to={option.link}
              className={`${styles.optionItem} ${
                option.link.includes(option.activeKey) && styles.active
              }`}
              key={option.label}
            >
              {option.label}
            </LocallizeLink>
          );
        })}
      </div>
    </div>
  );
};
export default V2Selector;
