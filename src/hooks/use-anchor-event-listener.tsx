import { useEffect, useState, useRef } from 'react';

import { checkIconTpl } from '@/components/icons';
import { linkIconTpl } from '@/components/icons';
import { copyToCommand } from '@/utils/common';

export const useAnchorEventListener = (currentId: string) => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const pageHref = useRef('');

  useEffect(() => {
    // add click event handler for copy icon after headings
    if (window && typeof window !== 'undefined') {
      const anchors = Array.from(document.querySelectorAll('.anchor-icon'));
      const baseHref = window.location.href.split('#')[0];

      anchors.forEach(anchor => {
        anchor.addEventListener(
          'click',
          e => {
            if (!e.currentTarget) {
              return;
            }
            const {
              dataset: { href },
            } = e.currentTarget as HTMLAnchorElement;
            pageHref.current = `${baseHref}${href}`;
            copyToCommand(pageHref.current);

            anchor.innerHTML = checkIconTpl;

            setTimeout(() => {
              anchor.innerHTML = linkIconTpl;
            }, 3000);
          },
          false
        );
      });
    }

    return () => {
      setIsOpenMobileMenu(false);
    };
  }, [currentId]);
};
