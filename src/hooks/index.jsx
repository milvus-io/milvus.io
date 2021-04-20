import { useEffect, useState } from "react";

export const useMobileScreen = () => {
  const [screenWidth, setScreenWidth] = useState(null);
  useEffect(() => {
    const cb = () => {
      setScreenWidth(document.body.clientWidth);
    };
    cb();
    window.addEventListener("resize", cb);

    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);
  return screenWidth;
};

export const useSelectMenu = (setOptions) => {
  // titlebar height:60; self height: 26; margin 8
  const offsetTop = 60 + 36 + 8;
  const docWrapper = document.getElementsByClassName('doc-wrapper')[0];
  let docWrapWidth = 0;
  if (docWrapper) {
    docWrapWidth = parseInt(window.getComputedStyle(docWrapper).width);
  }
  const { innerWidth } = window;
  const offsetLeft = (innerWidth - docWrapWidth) / 2 + 250;

  // max width of single line
  const maxLineWidth = docWrapWidth - 280 - 250 - 64 - 8;

  const selectHandler = (e) => {
    const { scrollTop } = document.getElementsByClassName('inner-container')[0];
    const str = document.getSelection().toString();
    const { top, left, width } = window.getSelection().getRangeAt(0).getBoundingClientRect();
    console.log(maxLineWidth, left, width)
    const realWidth = Math.min(maxLineWidth, width);
    const translateX = left - offsetLeft + (realWidth - 240) / 2;
    let realTranslateX = 0;
    realTranslateX = translateX > offsetLeft ? translateX : 32;
    realTranslateX = translateX < offsetLeft + 32 + maxLineWidth ? translateX : maxLineWidth - 120;
    if(translateX > offsetLeft){
      translateX = 32;
    }
    
    if (!str.length) {
      setOptions({
        visibility: 'hidden',
        zIndex: -100,
        transform: `translateX(0,0)`,
      });
      return
    };

    setOptions({
      visibility: 'visible',
      zIndex: 199,
      transform: `translate(${realTranslateX}px,${top - offsetTop + scrollTop}px)`,
    });
  };

  useEffect(() => {
    window.addEventListener("mouseup", (e) => selectHandler(e), false);
    return () => {
      window.removeEventListener("mouseup", (e) => selectHandler(e), false);
    };
  }, [docWrapper]);// eslint-disable-line react-hooks/exhaustive-deps
}