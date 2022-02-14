import React, { useRef, useEffect, useState, useMemo } from "react";
import * as styles from "./index.module.less";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const MAXIMUM_DETECT_WIDTH = 500; // when width > 1000; width = 1000
const LINE_BUTTON_WIDTH = 24;
const MINIMUM_CONTENT_WIDTH = 20;
const DEFAULT_WIDTH = 324; // 300 + 24
const MAXIMUM_WIDTH = MAXIMUM_DETECT_WIDTH;
const MINIMUM_WIDTH = MINIMUM_CONTENT_WIDTH + LINE_BUTTON_WIDTH; // 44

const MINIMUM_DETECT_WIDTH = 250; // when width < 150,collapse
const MAXIMUM_CONTENT_WIDTH = MAXIMUM_DETECT_WIDTH - LINE_BUTTON_WIDTH;

const DELAY = 2000;
const CACHED_WIDTH = '@@cahced_width';

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
      content.classList.add(styles.collapseTransition);
      content.classList.remove(styles.expandTransition);
    } else if (size === 'expand') {
      wrapper.style.width = `${DEFAULT_WIDTH}px`;
      content.classList.remove(styles.collapseTransition);
      content.classList.add(styles.expandTransition);
    } else {
      // maxumum
      wrapper.style.width = `${MAXIMUM_WIDTH}px`;
      content.style.maxWidth = `${MAXIMUM_CONTENT_WIDTH}px`;
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
    if (size === "collapse") {
      adjustContent('collapse');
    } else if (size === "expand") {
      adjustContent('expand');
    }
  };

  // dragable function
  // useEffect(() => {
  //   let isListening = false;
  //   let timer = null;
  //   const line = dragLine.current;

  //   // callback of event_mouse_move
  //   const mouseMoveCb = e => {
  //     if ((!isListening) || isMinimumWidth) {
  //       return;
  //     }

  //     const { pageX } = e;
  //     if (pageX < 50) {
  //       contentWrapperRef.current.style.width = `${50}px`;
  //     } else if (pageX >= MAXIMUM_DETECT_WIDTH) {
  //       adjustContent('maximum');
  //       setIsMinimumWidth(false);
  //     } else {
  //       setIsMinimumWidth(false);
  //       contentWrapperRef.current.style.width = `${pageX + LINE_BUTTON_WIDTH}px`;
  //     }
  //   };

  //   // enable listening
  //   line.addEventListener(
  //     "mousedown",
  //     () => {
  //       isListening = true;
  //     },
  //     false
  //   );

  //   // disable listening
  //   line.addEventListener(
  //     "mouseup",
  //     (e) => {
  //       const { pageX } = e;
  //       if (pageX < MINIMUM_DETECT_WIDTH) {
  //         setIsMinimumWidth(true);
  //         props.setIsCollapse(true);
  //         adjustContent('collapse');
  //       }
  //       isListening = false;
  //     },
  //     false
  //   );

  //   // disable listening
  //   window.addEventListener(
  //     "mouseup",
  //     (e) => {
  //       const { pageX } = e;
  //       if (pageX < MINIMUM_DETECT_WIDTH) {
  //         return;
  //       } else {
  //         if (timer) {
  //           clearTimeout(timer);
  //         }
  //         timer = setTimeout(() => {
  //           window.localStorage.setItem(CACHED_WIDTH, Math.min(pageX, LINE_BUTTON_WIDTH + MAXIMUM_WIDTH));
  //         }, DELAY);
  //       }
  //       isListening = false;

  //     },
  //     false
  //   );

  //   // start listening
  //   window.addEventListener(
  //     "mousemove",
  //     e => {
  //       mouseMoveCb(e);
  //     },
  //     false
  //   );

  //   return () => {
  //     line.removeEventListener(
  //       "mousedown",
  //       () => {
  //         isListening = true;
  //       },
  //       false
  //     );

  //     line.removeEventListener(
  //       "mouseup",
  //       () => {
  //         isListening = false;
  //       },
  //       false
  //     );

  //     window.removeEventListener(
  //       "mouseup",
  //       () => {
  //         isListening = false;
  //       },
  //       false
  //     );

  //     window.removeEventListener(
  //       "mousemove",
  //       e => {
  //         mouseMoveCb(e);
  //       },
  //       false
  //     );
  //   };
  // }, []);

  return (
    <section className={`${styles.adjustableMenuContainer} ${props.adjustableMenuClassName}`}>
      <div
        className={`${styles.floatContainer} ${isMinimumWidth ? styles.float : ""
          }`}
        style={{ width: `${DEFAULT_WIDTH}px` }}
        onMouseLeave={e => handleHoverMenuToCollapseOrExpand(e, 'collapse')}
        ref={contentWrapperRef}
      >
        {/* content */}
        <div
          className={`${styles.content}`}
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
