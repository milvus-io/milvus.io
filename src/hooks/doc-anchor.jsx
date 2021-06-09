import { useEffect } from 'react';

/**
 * This is for generate anchors in faq page.
 * Version >= 1.0.0 and html tag is h4.
 * Will generate h4 anchors after the first h1 title.
 * @param {*} version
 * @param {*} editPath
 */
export const useGenAnchor = (version, editPath) => {
  useEffect(() => {
    const insertAnchors = anchors => {
      const firstElement = document.querySelector('h1');

      firstElement.insertAdjacentHTML('afterend', anchors);
    };

    const getAnchorsFromInfo = info => {
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

    const isAutoGenVersion = version && version.split('.')[0].slice(1) >= 1;

    if (editPath && editPath.includes('faq') && isAutoGenVersion) {
      const faqHeadersElements = document.querySelectorAll('h4');
      if (faqHeadersElements.length > 0) {
        const info = Array.from(faqHeadersElements).map(element => ({
          id: `#${element.id}`,
          title: element.textContent,
        }));

        const anchors = getAnchorsFromInfo(info);

        insertAnchors(anchors);
      }
    }
  }, [editPath, version]);
};
