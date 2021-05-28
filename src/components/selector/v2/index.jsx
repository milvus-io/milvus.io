import React, { useRef, useEffect, useState } from 'react';
import { useMobileScreen } from '../../../hooks';
import LocallizeLink from '../../../components/localizedLink/localizedLink';
import { globalHistory } from '@reach/router';
import * as styles from './v2.module.less';

const V2Selector = ({
  options,
  className = '',
  locale
}) => {
  const choosenWrapper = useRef(null);
  const [open, setOpen] = useState(false);
  const label = locale === 'cn' ? '中文' : 'English';
  const to = globalHistory.location.pathname
    .replace('/en/', '/')
    .replace('/cn/', '/');
  const { isMobile } = useMobileScreen();

  const handleClick = e => {
    e.stopPropagation();
    setOpen(open ? false : true);
  };

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
    <div
      className={`${styles.selectorContainer} ${className} ${isMobile ? styles.mobileSelector : ''
        }`}
    >
      <div
        role="button"
        tabIndex={0}
        className={styles.choosenWrapper}
        ref={choosenWrapper}
        onClick={e => handleClick(e)}
        onKeyDown={e => handleClick(e)}
      >
        <p className={styles.labelWrapper}>{label}</p>
        <span className={`${styles.iconWrapper} ${open ? styles.show : ''}`}>
          <i className="fa fa-chevron-down"></i>
        </span>
      </div>

      <div
        className={`${styles.optionsWrapper} ${open ? styles.show : ''}`}
      >
        {options.map(option => (
          <LocallizeLink
            locale={option.value}
            to={to}
            data-option={option}
            className={`${styles.optionItem} ${option.label === label && styles.active
              }`}
            key={option.value}
          >
            {option.label}
          </LocallizeLink>
        ))}
      </div>
    </div>
  );
};

export default V2Selector;
