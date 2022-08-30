import React, { useState } from 'react';
import * as styles from './index.module.less';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import clsx from 'clsx';

export const IS_OPENED = '@@is_opened';

const AdjustableMenu = props => {
  const { adjustableMenuClassName = '', isOpened = false } = props;
  const [expanded, setExpanded] = useState(false);

  const storeOpenedState = bool => {
    window.sessionStorage.setItem(IS_OPENED, bool);
  };

  const handleCollapse = () => {
    // make button lose focus, turn drag_line to normal
    const newState = !isOpened;
    storeOpenedState(newState);
    props.onMenuCollapseUpdate(newState);
  };

  const expand = () => {
    if (isOpened) {
      setExpanded(true);
    }
  };

  const shrink = () => {
    if (isOpened) {
      setExpanded(false);
    }
  };

  return (
    <section
      className={clsx(styles.adjustableMenuContainer, adjustableMenuClassName, {
        [styles.expanded]: expanded,
      })}
    >
      <div
        className={clsx(styles.floatContainer, {
          [styles.opened]: isOpened,
        })}
        role="menu"
        tabIndex="0"
        onMouseLeave={shrink}
      >
        {/* content */}
        <div
          className={styles.content}
          role="menu"
          tabIndex="0"
          onMouseEnter={expand}
        >
          {props.children}
        </div>
        {/* line */}
        <button className={clsx(styles.lineWrapper)}>
          <span className={styles.dragLine}></span>
          <span
            className={`${styles.iconWrapper}`}
            role="menu"
            tabIndex="0"
            onClick={handleCollapse}
            onKeyDown={handleCollapse}
          >
            <KeyboardArrowRightIcon />
          </span>
        </button>
      </div>
    </section>
  );
};

export default AdjustableMenu;
