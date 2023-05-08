import { useEffect } from 'react';

export const useActivateAnchorWhenScroll = ({
  articleContainer,
  activeAnchorCb,
  anchorList,
}) => {
  useEffect(() => {
    const container = articleContainer.current;
    if (typeof window === 'undefined' || !window || !container) {
      return;
    }
    const anchorEle = 'h2';
    const defaultDistance = 120;

    const h2List = Array.from(container.querySelectorAll(anchorEle));

    const handleScroll = () => {
      // if the distance from top of current h2 is less than 60px , we activate this h2
      for (let anchor of h2List) {
        const id = anchor.getAttribute('id');
        const top = anchor.getClientRects()[0].top;
        if (top < defaultDistance && top > 0) {
          const href = anchorList.find(v => v.href === id)?.href || '';
          activeAnchorCb(href);
          // in case two h2 are too close to misjudged
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [articleContainer, activeAnchorCb, anchorList]);
};
