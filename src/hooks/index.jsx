import { useEffect, useState, useMemo } from 'react';
import { sourceMap } from '../consts/newsletterSource';
import { IS_OPENED } from '../components/adjustableMenu';
import { getCurrentSize } from '../http/hooks';

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

export const useSubscribeSrouce = () => {
  const [source, setSource] = useState('');

  useEffect(() => {
    const path = window ? window.location.pathname : '';
    if (!path) {
      return;
    }
    const pathname = path === '/' ? '/' : path.replaceAll('/', '');
    const pageSource = sourceMap[pathname];

    if (pageSource === 'Milvus: demo') {
      const { search = [] } = window && window.location;
      const source = ['utm_source', 'utm_medium', 'utm_campaign'].every(v =>
        search.includes(v)
      )
        ? 'Ads: Reddit'
        : 'Milvus: demo';

      setSource(source);
    } else {
      setSource(pageSource);
    }
  }, []);
  return source;
};

export const useOpenedStatus = cb => {
  useEffect(() => {
    const device = getCurrentSize();
    if (typeof cb !== 'function' || device === 'phone' || device === 'tablet') {
      return;
    }
    const isMenuOpened = window.sessionStorage.getItem(IS_OPENED) === 'true';

    cb(isMenuOpened);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
