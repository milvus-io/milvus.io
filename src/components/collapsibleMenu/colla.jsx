import React, { useRef, useEffect, useState } from "react";
import * as styles from "./index.module.less";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const MINIMUM_WIDTH = 20;
const DEFAULT_WIDTH = 282;
const ZERO_WIDTH = 0;

const CollapsibleMenu = props => {
  const dragLine = useRef(null);
  // in minimum status, content_width = 0; conentWrapper_width = minimum width
  // in normal status, conentWrapper_width = fit-content
  const contentRef = useRef(null);
  const contentWrapperRef = useRef(null);

  const [isMinimumWidth, setIsMinimumWidth] = useState(false);

  const handleCollapse = () => {
    // contentRef.current.style.width = `${ZERO_WIDTH}px`;
    contentWrapperRef.current.style.width = `${MINIMUM_WIDTH}px`;
    setIsMinimumWidth(true);
  };
  const handleExpand = () => {
    setIsMinimumWidth(false);
    // contentRef.current.style.width = `${DEFAULT_WIDTH}px`;
    contentWrapperRef.current.style.width = `${DEFAULT_WIDTH}px`;
  };

  const handleCollapseOrExpandMenu = (e, size) => {
    e.stopPropagation();
    e.cancelBubble = true;
    if (!isMinimumWidth) {
      return;
    }
    if (size === "collapse") {
      contentWrapperRef.current.style.width = `${MINIMUM_WIDTH}px`;
      // contentRef.current.style.width = `${ZERO_WIDTH}px`;
    } else if (size === "expand") {
      contentWrapperRef.current.style.width = `${DEFAULT_WIDTH}px`;
      // contentRef.current.style.width = `${DEFAULT_WIDTH}px`;
    }

  };

  useEffect(() => {
    let isLenstening = false;
    const line = dragLine.current;

    const mouseMoveCb = e => {
      if (!isLenstening) {
        return;
      }

      const { pageX } = e;
      if (pageX <= MINIMUM_WIDTH) {
        setIsMinimumWidth(true);
        // contentRef.current.style.width = `${ZERO_WIDTH}px`;
        contentWrapperRef.current.style.width = `${MINIMUM_WIDTH}px`;
      } else {
        setIsMinimumWidth(false);
        // contentRef.current.style.width = `${pageX}px`;
        contentWrapperRef.current.style.width = `${pageX}px`;
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

        ref={contentWrapperRef}
      >
        {/* content */}
        <div
          className={`${styles.content} ${isMinimumWidth ? styles.floatMenuContent : ""
            }`}
          onMouseEnter={e => handleCollapseOrExpandMenu(e, 'expand')}
          onMouseLeave={e => handleCollapseOrExpandMenu(e, 'collapse')}
        >
          {props.children}
        </div>
        {/* line */}
        <button className={styles.lineWrapper} ref={dragLine}>
          <span
            className={`${styles.dragLine} ${isMinimumWidth ? styles.show : ""
              }`}
          ></span>
          {!isMinimumWidth && (
            <span
              className={`${styles.iconWrapper} ${styles.invisibleIcon}`}
              onClick={handleCollapse}
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
