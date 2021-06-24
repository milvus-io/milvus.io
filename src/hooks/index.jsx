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

  const isMobile = useMemo(
    () => screenWidth && screenWidth < 1000,
    [screenWidth]
  );

  return { screenWidth, isMobile };
};

export const useClickOutside = (ref, handler, events) => {
  if (!events) events = [`mousedown`, `touchstart`];

  useEffect(() => {
    const detectClickOutside = event => {
      try {
        !ref.current.contains(event.target) && handler(event);
      } catch (error) {
        console.log(error);
      }
    };
    for (const event of events)
      document.addEventListener(event, detectClickOutside);
    return () => {
      for (const event of events)
        document.removeEventListener(event, detectClickOutside);
    };
  }, [events, handler, ref]);
};
