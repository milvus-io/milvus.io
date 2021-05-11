import React, { useRef, useEffect, useState } from 'react';
import { useMobileScreen } from '../../../hooks';
// import { Link } from 'gatsby';
import * as styles from './v2.module.less';

const V2Selector = ({
  selected,
  options,
  setSelected = () => {},
  className = '',
}) => {
  const choosenWrapper = useRef(null);
  const [open, setOpen] = useState(false);

  const { isMobile } = useMobileScreen();

  const handleClick = e => {
    e.stopPropagation();
    setOpen(open ? false : true);
  };

  const handleSelect = e => {
    const { option } = e.target.dataset;
    if (option === selected) return;
    setSelected(option);
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
      className={`${styles.selectorContainer} ${className} ${
        isMobile ? styles.mobileSelector : ''
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
        <p className={styles.labelWrapper}>{selected}</p>
        <div className={`${styles.iconWrapper} ${open ? styles.show : ''}`}>
          <i className="fa fa-chevron-down"></i>
        </div>
      </div>

      <div
        className={`${styles.optionsWrapper} ${open ? styles.show : ''}`}
        role="button"
        tabIndex={-1}
        onClick={handleSelect}
        onKeyDown={handleSelect}
      >
        {options.map(option => (
          <p
            data-option={option}
            className={`${styles.optionItem} ${
              option === selected && styles.active
            }`}
            key={option}
          >
            {option}
          </p>
        ))}
      </div>
    </div>
  );
};

export default V2Selector;
