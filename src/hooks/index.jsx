import { useEffect, useState, useRef } from "react";

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
  const offsetTop = 60 + 40 + 8;
  const offsetLeft = -140;

  const selectHandler = (e) => {
    const str = document.getSelection().toString();
    const {target} = e;
    if (!!str.length) {
      const { top, left, width } = window.getSelection().getRangeAt(0).getBoundingClientRect();
      setOptions({
        display: "block",
        position: 'absolute',
        left: left + (width / 2) + offsetLeft,
        top: top - offsetTop,
        target
      });
    } else {
      setOptions({
        display: "none",
        position: 'absolute',
        right: 0,
        top: 0,
        target
      });
    }
  };
  const mouseDownHandler = (e) => {
    setOptions({
      display: "none",
      position: 'absolute',
      right: 0,
      top: 0,
    });
  };

  useEffect(() => {
    // window.addEventListener("mousedown", (e) => mouseDownHandler(e), false);
    window.addEventListener("mouseup", (e) => selectHandler(e), false);
    return () => {
      window.removeEventListener(
        "mousedown",
        (e) => mouseDownHandler(e),
        false
      );
      window.removeEventListener("mouseup", (e) => selectHandler(e), false);
    };
  }, []);
}