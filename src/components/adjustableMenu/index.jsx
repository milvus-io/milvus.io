import React, { useRef, useState, useEffect } from "react";
import * as styles from "./index.module.less";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import clsx from "clsx";
import { useCollapseStatus } from '../../hooks';

const LINE_BUTTON_WIDTH = 24;
const MINIMUM_CONTENT_WIDTH = 20;
const DEFAULT_WIDTH = 306; // 282 + 24
const MINIMUM_WIDTH = MINIMUM_CONTENT_WIDTH + LINE_BUTTON_WIDTH; // 44
export const IS_COLLAPSE = "@@is_collapse";


const AdjustableMenu = props => {
  const { adjustableMenuClassName = '' } = props;
  const dragLine = useRef(null);

  const contentRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const collapseIcon = useRef(null);
  // collapse status
  const [isMinimumWidth, setIsMinimumWidth] = useState(false);
  useCollapseStatus(setIsMinimumWidth);

  const storeCollapseStatus = (bool) => {
    window.sessionStorage.setItem(IS_COLLAPSE, bool);
  };

  const adjustContent = (size) => {
    const content = contentRef?.current;
    const wrapper = contentWrapperRef?.current;

    if (!content || !wrapper) {
      return;
    }
    if (size === 'collapse') {
      wrapper.style.width = `${MINIMUM_WIDTH}px`;

    } else if (size === 'expand') {
      wrapper.style.width = `${DEFAULT_WIDTH}px`;
    }
  };

  const handleCollapse = () => {
    // make button lose focus, turn drag_line to normal 
    adjustContent('collapse');
    storeCollapseStatus(true);
    setIsMinimumWidth(true);
    props.setIsCollapse(true);
  };
  const handleExpand = () => {
    adjustContent('expand');
    storeCollapseStatus(false);
    setIsMinimumWidth(false);
    props.setIsCollapse(false);
  };

  const handleHoverMenuToCollapseOrExpand = (e, size) => {
    e.stopPropagation();
    if (!isMinimumWidth) {
      return;
    }
    adjustContent(size);
  };

  useEffect(() => {
    isMinimumWidth && adjustContent('collapse');
  }, [isMinimumWidth]);

  return (
    <section className={`${styles.adjustableMenuContainer} ${adjustableMenuClassName}`}>
      <div
        className={clsx(styles.floatContainer, {
          [styles.float]: isMinimumWidth
        })}
        style={{ width: `${DEFAULT_WIDTH}px` }}
        onMouseLeave={e => handleHoverMenuToCollapseOrExpand(e, 'collapse')}
        ref={contentWrapperRef}
      >
        {/* content */}
        <div
          className={styles.content}
          onMouseEnter={e => handleHoverMenuToCollapseOrExpand(e, 'expand')}
          ref={contentRef}
        >
          {props.children}
        </div>
        {/* line */}
        <button className={clsx(styles.lineWrapper, {
          [styles.canBeHover]: !isMinimumWidth
        })} ref={dragLine}>
          <span
            className={styles.dragLine}
          ></span>
          {!isMinimumWidth ? (
            <span
              className={`${styles.iconWrapper} ${styles.invisibleIcon}`}
              onClick={handleCollapse}
              ref={collapseIcon}
            >
              <KeyboardArrowLeftIcon />
            </span>
          ) : (
            <span
              className={`${styles.iconWrapper} ${styles.show}`}
              onClick={handleExpand}
            >
              <KeyboardArrowRightIcon />
            </span>
          )}
        </button>
      </div>
    </section>
  );
};

export default AdjustableMenu;
