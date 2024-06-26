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
    const h2List = Array.from(container.querySelectorAll('h2'));
    const firstLink = h1Ele || h2List[0];
    setActiveAnchor(firstLink.getAttribute('id'));
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
        if (!anchor) continue;
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

// generate anchor list on the top of the faq pages
export const useGenAnchor = (version: string, editPath: string) => {
  useEffect(() => {
    const insertAnchors = (anchors: string) => {
      const firstElement = document.querySelector('h1');

      firstElement.insertAdjacentHTML('afterend', anchors);
    };

    const getAnchorsFromInfo = (
      info: {
        id: string;
        title: string;
      }[]
    ) => {
      const items = info
        .map(
          item =>
            `<li>
              <a href=${item.id}>
                ${item.title}
              </a>
            </li>`
        )
        .join('\n');
      const tpl = `
      <ul id="auto-anchors">
        ${items}
      </ul>
    `;
      return tpl;
    };

    if (editPath && editPath.includes('faq')) {
      const faqHeadersElements = document.querySelectorAll('h4');
      if (faqHeadersElements.length > 0) {
        const info = Array.from(faqHeadersElements).map(element => ({
          id: `#${element.id}`,
          title: element.innerHTML,
        }));

        const anchors = getAnchorsFromInfo(info);

        insertAnchors(anchors);
      }
    }
  }, [editPath, version]);
};
