import { useEffect, useState, useMemo } from 'react';

export const useMobileScreen = () => {
  const [screenWidth, setScreenWidth] = useState(null);
  useEffect(() => {
    const cb = () => {
      setScreenWidth(document.body.clientWidth);
    };
    cb();
    window.addEventListener('resize', cb);

    return () => {
      window.removeEventListener('resize', cb);
    };
  }, []);

  const isMobile = useMemo(() => screenWidth && screenWidth < 1000, [
    screenWidth,
  ]);

  return { screenWidth, isMobile };
};

export const useSelectMenu = setOptions => {
  // titlebar height:60; self height: 36; margin 8
  const offsetTop = 60 + 36 + 8;
  const docWrapper =
    typeof document !== 'undefined' &&
    document.getElementsByClassName('doc-wrapper')[0];
  const innerContainer =
    typeof document !== 'undefined' &&
    document.getElementsByClassName('inner-container')[0];
  const menuWidth = 260;
  let [docWrapWidth, scrollTop, innerWidth] = [
    0,
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

  const selectHandler = e => {
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
    document.addEventListener('mouseup', e => selectHandler(e), false);
    document.addEventListener(
      'selectionchange',
      e => selectChangeHandler(e),
      false
    );
    return () => {
      document.removeEventListener('mouseup', e => selectHandler(e), false);
      document.removeEventListener(
        'selectionchange',
        e => selectChangeHandler(e),
        false
      );
    };
  }, [docWrapper]); // eslint-disable-line react-hooks/exhaustive-deps
};
