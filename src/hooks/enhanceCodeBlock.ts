import { useEffect } from 'react';
import { copyToCommand } from '../utils/common';
import { checkIconTpl, copyIconTpl } from '../components/icons';
import { useRouter } from 'next/router';
import { formatCodeContent } from '@/utils/code';
import { FILTER_QUERY_KEY } from '@/consts';
import { formatQueryString } from '@/utils';

export const useCopyCode = (codeList = []) => {
  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      const btns = document.querySelectorAll('.copy-code-btn');

      btns.forEach((btn, index) => {
        btn.innerHTML = copyIconTpl;

        btn.addEventListener('click', () => {
          const code = formatCodeContent(codeList[index]);
          copyToCommand(code, () => {
            btns.forEach((v, i) => {
              if (i === index) {
                v.innerHTML = checkIconTpl;

                setTimeout(() => {
                  v.innerHTML = copyIconTpl;
                }, 3000);
              } else {
                v.innerHTML = copyIconTpl;
              }
            });
          });
        });
      });
    }
  }, [codeList]);
};

// docs tab filter, implement this feature using search parameters
export const useFilter = () => {
  const { asPath } = useRouter();

  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search).get(
        FILTER_QUERY_KEY
      );

      const filterWrappers = Array.from(document.querySelectorAll('.filter'));
      const filterContents = Array.from(
        document.querySelectorAll(`[class*="filter-"]`)
      );
      let filterLinks = [];
      let curTab = searchParams;

      filterWrappers.forEach(fw => {
        const fl = fw.querySelectorAll('a');

        fl.forEach(link => {
          if (!curTab) {
            curTab = formatQueryString(link.hash);
            window.history.pushState(
              null,
              '',
              `?${FILTER_QUERY_KEY}=${curTab}${hash}`
            );
          }

          filterLinks.push(link);
        });
      });

      if (!filterContents.length || !filterLinks.length) return;

      const filterClickHandler = (params: {
        query: string;
        filterLinks: HTMLAnchorElement[];
        filterContents: Element[];
      }) => {
        const { query, filterLinks, filterContents } = params;
        const currentFilters = filterLinks.filter(
          f => formatQueryString(f.hash) === query
        );
        const currentContents = document.querySelectorAll(
          `.filter-${query.replace('#', '').replace(/%/g, '')}`
        );
        filterLinks.forEach(fl => fl.classList.toggle('active', false));
        currentFilters.forEach(cf => cf.classList.toggle('active', true));
        filterContents.forEach(fc => fc.classList.toggle('active', false));
        currentContents.forEach(c => c.classList.toggle('active', true));
      };

      filterLinks.forEach(a => {
        const queryString = formatQueryString(a.hash);
        a.addEventListener('click', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          window.history.pushState(
            null,
            '',
            `?${FILTER_QUERY_KEY}=${queryString}`
          );
          filterClickHandler({
            query: queryString,
            filterLinks,
            filterContents,
          });
        });
      });

      const containCurTab = filterLinks.some(fl => fl.hash === `#${curTab}`);

      if (containCurTab) {
        for (let fl of filterLinks) {
          if (fl.hash === `#${curTab}`) {
            filterClickHandler({
              query: formatQueryString(fl.hash),
              filterLinks,
              filterContents,
            });
            break;
          }
        }
      } else {
        filterClickHandler({
          query: formatQueryString(filterLinks[0].hash),
          filterLinks,
          filterContents,
        });
      }
    }
  }, [asPath]);
};

export const useMultipleCodeFilter = () => {
  const { asPath } = useRouter();
  const SEARCH = 'search';
  useEffect(() => {
    const setSearch = val => window.localStorage.setItem(SEARCH, val);
    const getSearch = () => {
      return window.localStorage.getItem(SEARCH);
    };

    const filterWrappers = document.querySelectorAll('.multipleCode');
    const allFilters = [];
    let firstSearch = '';
    filterWrappers.forEach(fw => {
      const fs = fw.querySelectorAll('a');

      fs.forEach(f => {
        if (!firstSearch) {
          // <a href='?node' >xxx</a>
          firstSearch = f.search || f.hash.replace('#', '?');
        }
        f['key'] = f.search || f.hash.replace('#', '?');
        allFilters.push(f);
      });
    });
    const allContents = document.querySelectorAll(`[class*="language-"]`);
    if (!allContents.length) return;
    if (!filterWrappers.length) {
      allContents.forEach(c => c.classList.toggle('active', true));
      return;
    }
    // the language options of current code block
    // we must make sure options are same on single page
    const languageList = Array.prototype.map.call(
      filterWrappers[0].children,
      item => item.getAttribute('href')
    );
    const clickEventHandler = targetSearch => {
      const search = targetSearch.replace('#', '?');
      setSearch(targetSearch);
      const currentFilters = allFilters.filter(f => f.key === search);
      allFilters.forEach(f => f.classList.toggle('active', false));
      currentFilters.forEach(cf => cf.classList.toggle('active', true));
      allContents.forEach(c => c.classList.toggle('active', false));
      const contents = document.querySelectorAll(
        `.language-${search.replace('?', '').replace(/%/g, '')}`
      );

      contents.forEach(c => c.classList.toggle('active', true));
    };

    filterWrappers.forEach(w => {
      w.addEventListener('click', (e: Event) => {
        e.preventDefault();
        if (e.target instanceof HTMLAnchorElement && e.target.tagName === 'A') {
          clickEventHandler(e.target.search || e.target.hash);
        }
      });
    });

    if (window) {
      const cacheSearch = getSearch();
      let localSearch;
      // there may be no recorded language on the current page
      // so we must judge
      if (cacheSearch && languageList.includes(cacheSearch)) {
        localSearch = cacheSearch;
      } else {
        localSearch = firstSearch;
      }
      if (localSearch) {
        clickEventHandler(localSearch);
      }
    }
  }, [asPath]);
};
