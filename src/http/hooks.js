import { useState, useEffect } from 'react';

export function getCurrentSize() {
  if (typeof window !== 'undefined') {
    const desktop1920 = window.matchMedia('(min-width: 1920px)');
    const desktop1440 = window.matchMedia('(min-width: 1439px)');
    const desktop1024 = window.matchMedia('(min-width: 1024px)');
    const desktop744 = window.matchMedia('(min-width: 744px)');

    if (desktop1920.matches) {
      return 'desktop1920';
    } else if (desktop1440.matches) {
      return 'desktop1440';
    } else if (desktop1024.matches) {
      return 'desktop1024';
    } else if (desktop744.matches) {
      return 'tablet';
    }
    return 'phone';
  }
  return '';
}

export function useWindowSize() {
  const [size, setSize] = useState(() => {
    return getCurrentSize();
  });

  useEffect(() => {
    const onResize = () => {
      const cur = getCurrentSize();
      setSize(cur);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const cur = getCurrentSize();
    setSize(cur);
  }, []);

  return size;
}
