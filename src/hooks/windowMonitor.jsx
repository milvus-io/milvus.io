import { useState, useEffect } from 'react';
import { throttle } from '@/utils/imgSearch.utils';

export const useDetectScrollBottom = () => {
  const [scrollBottom, setScrollBottom] = useState(Infinity);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setScrollBottom(distanceToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollBottom;
};
