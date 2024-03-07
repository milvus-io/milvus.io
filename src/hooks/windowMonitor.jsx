import { useState, useEffect } from 'react';

export const useDetectScrollBottom = () => {
  const [scrollBottom, setScrollBottom] = useState(Infinity);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setScrollBottom(distanceToBottom);
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollBottom;
};
