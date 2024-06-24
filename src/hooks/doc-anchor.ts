import { useEffect, useState } from 'react';
import { DocAnchorItemType } from '@/types/docs';
import { useRouter } from 'next/router';

export const useActivateAnchorWhenScroll = ({
  articleContainer,
  anchorList,
}: {
  articleContainer: React.MutableRefObject<HTMLDivElement | null>;
  anchorList: DocAnchorItemType[];
}) => {
  const { asPath } = useRouter();
  const [activeAnchor, setActiveAnchor] = useState('');

  useEffect(() => {
    const container = articleContainer.current;
    if (typeof window === 'undefined' || !window || !container) {
      return;
    }
    const h1Ele = container.querySelector('h1');
    setActiveAnchor(h1Ele.getAttribute('id'));
  }, [asPath]);

  useEffect(() => {
    const container = articleContainer.current;
    if (typeof window === 'undefined' || !window || !container) {
      return;
    }
    const anchorEle = 'h2';
    const defaultDistance = 130; // 60 + header：70px

    const h2List = Array.from(container.querySelectorAll(anchorEle));
    const h1Ele = container.querySelector('h1');
    const anchors = [h1Ele, ...h2List];

    const handleScroll = () => {
      // if the distance from top of current h2 is less than 60px , we activate this h2
      for (let anchor of anchors) {
        const id = anchor.getAttribute('id');
        const top = anchor.getClientRects()[0]?.top;
        if (top < defaultDistance && top > 0) {
          const href = anchorList.find(v => v.href === id)?.href || '';
          setActiveAnchor(href);
          // in case two h2 are too close to misjudged
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [articleContainer, anchorList]);

  return activeAnchor;
};
