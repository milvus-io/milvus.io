import { useEffect } from 'react';
import { copyToCommand } from '../utils/common';
import { checkIconTpl, copyIconTpl } from '../components/icons';

export const useCopyCode = (codeList = []) => {
  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      const btns = document.querySelectorAll('.copy-code-btn');

      btns.forEach((btn, index) => {
        btn.innerHTML = copyIconTpl;

        btn.addEventListener('click', () => {
          copyToCommand(codeList[index], () => {
            btns.forEach((v, i) => {
              if (i === index) {
                v.innerHTML = checkIconTpl;
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

export const useFilter = () => {
  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      const filterWrappers = document.querySelectorAll('.filter');
      const allFilters = [];
      let firstHash = '';
      filterWrappers.forEach(fw => {
        const fs = fw.querySelectorAll('a');

        fs.forEach(f => {
          if (!firstHash) {
            firstHash = f.hash;
          }
          allFilters.push(f);
        });
      });
      const allContents = document.querySelectorAll(`[class*="filter-"]`);

      if (!allContents.length) return;

      const clickEventHandler = targetHash => {
        const hash = targetHash;
        const currentFilters = allFilters.filter(f => f.hash === hash);
        allFilters.forEach(f => f.classList.toggle('active', false));
        currentFilters.forEach(cf => cf.classList.toggle('active', true));
        allContents.forEach(c => c.classList.toggle('active', false));
        const contents = document.querySelectorAll(
          `.filter-${hash.replace('#', '').replace(/%/g, '')}`
        );
        contents.forEach(c => c.classList.toggle('active', true));
      };
      filterWrappers.forEach(w => {
        w.addEventListener('click', e => {
          if (e.target.tagName === 'A') {
            clickEventHandler(e.target.hash);
          }
        });
      });

      if (window) {
        const windowHash = window.location.hash || firstHash;
        if (windowHash) {
          clickEventHandler(windowHash);
        }

        window.addEventListener(
          'hashchange',
          () => {
            clickEventHandler(window.location.hash);
          },
          false
        );
      }
    }
  }, []);
};

export const useMultipleCodeFilter = path => {
  const SEARCH = 'search';
  useEffect(() => {
    if (window && typeof window !== 'undefined') {
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
            firstSearch = f.search;
          }
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
        const search = targetSearch;
        setSearch(search);
        const currentFilters = allFilters.filter(f => f.search === search);
        allFilters.forEach(f => f.classList.toggle('active', false));
        currentFilters.forEach(cf => cf.classList.toggle('active', true));
        allContents.forEach(c => c.classList.toggle('active', false));
        const contents = document.querySelectorAll(
          `.language-${search.replace('?', '').replace(/%/g, '')}`
        );

        contents.forEach(c => c.classList.toggle('active', true));
      };

      filterWrappers.forEach(w => {
        w.addEventListener('click', e => {
          e.preventDefault();
          if (e.target.tagName === 'A') {
            clickEventHandler(e.target.search);
          }
        });
      });

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
  }, [path]);
};
