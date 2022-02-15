import React, { useRef, useState } from "react";
import * as styles from "./index.module.less";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import clsx from "clsx";

const LINE_BUTTON_WIDTH = 24;
const MINIMUM_CONTENT_WIDTH = 20;
const DEFAULT_WIDTH = 324; // 300 + 24
const MINIMUM_WIDTH = MINIMUM_CONTENT_WIDTH + LINE_BUTTON_WIDTH; // 44

const AdjustableMenu = props => {
  const dragLine = useRef(null);
  // in the case of minimum width, content_width = MINIMUM_CONTENT_WIDTH; conentWrapper_width = MINIMUM_WIDTH
  // in the case of normal width, conentWrapper_width = fit-content
  // in the case of maximum width, content_max_width = MAXIMUM_CONTENT_WIDTH; conentWrapper_width = MAXIMUM_WIDTH
  const contentRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const collapseIcon = useRef(null);

  // collapse status
  const [isMinimumWidth, setIsMinimumWidth] = useState(false);

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
    dragLine.current.blur();
    adjustContent('collapse');
    setIsMinimumWidth(true);
    props.setIsCollapse(true);
  };
  const handleExpand = () => {
    adjustContent('expand');
    setIsMinimumWidth(false);
    props.setIsCollapse(false);
  };

  const handleHoverMenuToCollapseOrExpand = (e, size) => {
    e.stopPropagation();
    e.cancelBubble = true;
    if (!isMinimumWidth) {
      return;
    }
    adjustContent(size);
  };

  return (
    <section className={`${styles.adjustableMenuContainer} ${props.adjustableMenuClassName}`}>
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
