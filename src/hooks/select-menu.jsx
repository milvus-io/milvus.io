import { useEffect, useState } from 'react';
import * as styles from '../components/docLayout/index.module.less';

/**
 * This is for user select some text then they can easily create a new issue in github.
 * 
 * @returns {
    styles: {
      visibility: 'hidden',
      zIndex: -100,
      transform: `translateX(0,0)`,
    },
    copy: '',
  }
 */
export const useSelectMenu = () => {
  const [options, setOptions] = useState({
    styles: {
      visibility: 'hidden',
      zIndex: -100,
      transform: `translateX(0,0)`,
    },
    copy: '',
  });

  const selectChangeHandler = e => {
    const str = document.getSelection().toString();
    if (!str.length) {
      setOptions({
        styles: {
          visibility: 'hidden',
          zIndex: -1,
          transform: `translateX(0,0)`,
        },
        copy: '',
      });
      return;
    }
  };

  useEffect(() => {
    const selectHandler = e => {
      const innerContainer =
        typeof document !== 'undefined' &&
        document.getElementsByClassName(styles.innerContainer)[0];
      // titlebar height:60; self height: 36; margin 8
      const offsetTop = 60 + 36 + 8;
      const docWrapper =
        typeof document !== 'undefined' &&
        document.getElementsByClassName(styles.docWrapper)[0];

      const menuWidth = 260;
      let [docWrapWidth, innerWidth] = [
        0,
        typeof window !== 'undefined' ? window.innerWidth : 0,
      ];
      if (docWrapper) {
        docWrapWidth = docWrapper.offsetWidth;
      }

      // left blank width plus menu-bar width
      const offsetLeft = (innerWidth - docWrapWidth) / 2 + 250;
      // max width of single line
      // left menu width: 250; right anchor width: 280; doc padding: 64px
      const maxLineWidth = docWrapWidth - 280 - 250 - 64 - 8;

      let scrollTop = 0;
      if (innerContainer) {
        scrollTop = innerContainer.scrollTop;
      }

      const str = document.getSelection().toString();
      if (!str.length) {
        setOptions({
          styles: {
            visibility: 'hidden',
            zIndex: -1,
            transform: `translateX(0,0)`,
          },
          copy: '',
        });
        return;
      }

      // Select the upper left corner of the text
      const { top, left, width } = window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect();
      // if there is multiple lines, calculate it as single lin,to keep the menu stay center
      const realWidth = Math.min(maxLineWidth, width);
      let translateX = left - offsetLeft + (realWidth - menuWidth) / 2;

      if (translateX < 32) {
        translateX = 32;
      }
      if (translateX > maxLineWidth - menuWidth) {
        translateX = maxLineWidth - menuWidth + 32;
      }

      setOptions({
        styles: {
          visibility: 'visible',
          zIndex: 199,
          transform: `translate(${translateX}px,${
            top - offsetTop + scrollTop
          }px)`,
        },
        copy: str,
      });
    };
    document.addEventListener('mouseup', selectHandler, false);
    document.addEventListener('selectionchange', selectChangeHandler, false);
    return () => {
      document.removeEventListener('mouseup', selectHandler, false);
      document.removeEventListener(
        'selectionchange',
        selectChangeHandler,
        false
      );
    };
  }, []);

  return { options };
};
