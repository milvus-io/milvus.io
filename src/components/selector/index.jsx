import React, { useState, useEffect } from 'react';
import LocalizedLink from '../localizedLink/localizedLink';
import * as styles from './index.module.less';

const Selector = props => {
  const {
    options,
    selected,
    locale,
    isVersion = false,
    className = '',
  } = props;
  const [listStatus, setListStatus] = useState(false);
  const toggleList = e => {
    e.stopPropagation();
    setListStatus(!listStatus);
  };

  useEffect(() => {
    const cb = () => {
      setListStatus(false);
    };
    window.addEventListener('click', cb);
    return () => {
      window.removeEventListener('click', cb);
    };
  }, []);

  return (
    <div
      className={`${styles.selectorWrapper} ${
        isVersion && styles.versionWrapper
      } ${className}`}
    >
      <div
        className={styles.selected}
        tabIndex="0"
        role="button"
        aria-label="open selector"
        onClick={toggleList}
        onKeyDown={toggleList}
      >
        <span className={styles.label}>{selected}</span>
        <p className={styles.iconWrapper}>
          <i className={`fas fa-chevron-down ${styles.arrow}`}></i>
        </p>
      </div>
      <ul className={`${styles.optionsWrapper} ${listStatus && styles.open}`}>
        {options.map(v => {
          const to = v === 'v0.x' ? `/docs/${v}/overview.md` : `/docs/${v}`;
          return (
            <li
              className={v === selected ? styles.active : ''}
              key={v}
              data-value={v}
            >
              {isVersion ? (
                <LocalizedLink locale={locale} className={styles.text} to={to}>
                  {v}
                </LocalizedLink>
              ) : (
                <span className={styles.text} data-value={v}>
                  {v}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Selector;
