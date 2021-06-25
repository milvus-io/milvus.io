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
export const useSelectMenu = (locale, ref) => {
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
    const ele = ref.current;

    const selectHandler = e => {
      const disabledClass = {
        alert: 'alert',
        hljs: 'hljs',
      };

      const { nodeName, classList } = e.target;
      if (
        nodeName === 'H1' ||
        [].some.call(classList, item => disabledClass[item] !== null)
      ) {
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
      const innerContainer =
        typeof document !== 'undefined' && document.querySelector('html');
      // header: 90 padding: 32px margin: 16
      const offsetTop = 90 + 32 + 16;
      const docWrapper =
        typeof document !== 'undefined' &&
        document.getElementsByClassName(styles.docWrapper)[0];

      const menuWidth = locale === 'cn' ? 156 : 187;
      let [docWrapWidth, innerWidth] = [
        0,
        typeof window !== 'undefined' ? window.innerWidth : 0,
      ];
      if (docWrapper) {
        docWrapWidth = docWrapper.offsetWidth;
      }

      // left blank width plus menu-bar width： 250 ， margin-left:40
      const offsetLeft = (innerWidth - docWrapWidth) / 2 + 250 + 40;
      // max width of single line
      // left menu width: 250; margin-left: 40px right anchor width: 280; doc padding: 64px 32px
      const maxLineWidth = docWrapWidth - 280 - 250 - 40 - 32;

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

      //doc's paddng-left: 64
      if (translateX < 32) {
        translateX = 32;
      }
      //doc's paddng-right: 32
      if (translateX > maxLineWidth - menuWidth) {
        translateX = maxLineWidth - menuWidth + 32;
      }

      setOptions({
        styles: {
          visibility: 'visible',
          zIndex: 2,
          transform: `translate(${translateX}px,${
            top - offsetTop + scrollTop
          }px)`,
        },
        copy: str,
      });
    };
    if (ele) {
      ele.addEventListener('mouseup', selectHandler, false);
      ele.addEventListener('selectionchange', selectChangeHandler, false);
    }
    return () => {
      if (ele) {
        ele.removeEventListener('mouseup', selectHandler, false);
        ele.removeEventListener('selectionchange', selectChangeHandler, false);
      }
    };
  }, [locale, ref]);

  return { options };
};
