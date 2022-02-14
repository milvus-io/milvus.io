import React, { useRef, useEffect, useState } from "react";
import * as styles from "./index.module.less";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const MINIMUM_DETECT_WIDTH = 50;
const LINE_BUTTON_WIDTH = 24;
const MINIMUM_WIDTH = 44; // content: 20px 
const DEFAULT_WIDTH = 302; // content 282

const CollapsibleMenu = props => {
  const dragLine = useRef(null);
  // in minimum status, content_width = 0; conentWrapper_width = minimum width
  // in normal status, conentWrapper_width = fit-content
  const contentRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const collapseIcon = useRef(null);

  // collapse status
  const [isMinimumWidth, setIsMinimumWidth] = useState(false);
  // collapse but hover expand status
  const [isMinimumExpandWidth, setIsMinimumExpandWidth] = useState(false);
  // expand status
  const [isExpandWidth, setIsExpandWidth] = useState(true);


  const stopEvent = (e) => {
    console.log(111111);
    e.stopPropagation();
    e.cancelBubble = true;
    e.preventDefault();
  };
  const handleCollapse = () => {
    // contentRef.current.style.width = `${ZERO_WIDTH}px`;
    // 让 button 失焦 关闭蓝色线条
    dragLine.current.blur();
    contentWrapperRef.current.style.width = `${MINIMUM_WIDTH}px`;
    contentRef.current.style.opacity = 0;
    setIsMinimumWidth(true);
  };
  const handleExpand = () => {
    // contentRef.current.style.width = `${DEFAULT_WIDTH}px`;
    contentWrapperRef.current.style.width = `${DEFAULT_WIDTH}px`;
    contentRef.current.style.opacity = 1;
    setIsMinimumWidth(false);
  };

  const handleHoverMenuToCollapseOrExpand = (e, size) => {
    e.stopPropagation();
    e.cancelBubble = true;
    if (!isMinimumWidth) {
      return;
    }
    if (size === "collapse") {
      contentWrapperRef.current.style.width = `${MINIMUM_WIDTH}px`;
      // contentRef.current.style.width = `${ZERO_WIDTH}px`;
      contentRef.current.style.opacity = 0;

    } else if (size === "expand") {
      contentWrapperRef.current.style.width = `${DEFAULT_WIDTH}px`;
      // contentRef.current.style.width = `${DEFAULT_WIDTH}px`;
      contentRef.current.style.opacity = 1;
    }

  };

  useEffect(() => {
    let isLenstening = false;
    const line = dragLine.current;
    const mouseMoveCb = e => {
      if (!isLenstening || isMinimumWidth) {
        return;
      }

      const { pageX } = e;
      if (pageX <= MINIMUM_DETECT_WIDTH) {
        // stop listenning and collapse menu
        setIsMinimumWidth(true);
        isLenstening = false;
        // contentRef.current.style.width = `${ZERO_WIDTH}px`;
        contentWrapperRef.current.style.width = `${MINIMUM_WIDTH}px`;
      } else {
        setIsMinimumWidth(false);
        // contentRef.current.style.width = `${pageX}px`;
        contentWrapperRef.current.style.width = `${pageX + LINE_BUTTON_WIDTH}px`;
      }
    };

    // 开始监听
    line.addEventListener(
      "mousedown",
      e => {
        // console.log('mousedown---', e);
        isLenstening = true;
      },
      false
    );

    // 取消监听
    line.addEventListener(
      "mouseup",
      e => {
        isLenstening = false;
      },
      false
    );

    // 取消监听
    window.addEventListener(
      "mouseup",
      e => {
        isLenstening = false;
      },
      false
    );

    // 监听鼠标位置 实时改变 menu 大小
    window.addEventListener(
      "mousemove",
      e => {
        mouseMoveCb(e);
      },
      false
    );
  }, []);

  return (
    <section className={styles.collapsibleMenuContainer}>
      <div
        className={`${styles.floatContainer} ${isMinimumWidth ? styles.float : ""
          }`}
        onMouseLeave={e => handleHoverMenuToCollapseOrExpand(e, 'collapse')}
        ref={contentWrapperRef}
      >
        {/* content */}
        <div
          className={`${styles.content} ${isMinimumWidth ? styles.floatMenuContent : ""
            }`}
          onMouseEnter={e => handleHoverMenuToCollapseOrExpand(e, 'expand')}
          ref={contentRef}
        >
          {props.children}
        </div>
        {/* line */}
        <button className={`${styles.lineWrapper} ${!isMinimumWidth ? styles.canBeHover : ''}`} ref={dragLine}>
          <span
            className={`${styles.dragLine}`}
          ></span>
          {!isMinimumWidth && (
            <span
              className={`${styles.iconWrapper} ${styles.invisibleIcon}`}
              onMouseDown={stopEvent}
              onClick={handleCollapse}
              ref={collapseIcon}
            >
              <KeyboardArrowLeftIcon />
            </span>
          )}
          {isMinimumWidth && (
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

export default CollapsibleMenu;
