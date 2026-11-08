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

export const normalizeCodeFilterKey = (raw?: string | null): string => {
  if (!raw) return '';
  const cleaned = raw
    .trim()
    .replace(/^[?#]+/, '')
    .replace(/%/g, '')
    .toLowerCase();
  if (!cleaned) return '';
  if (cleaned === 'c++') return '?cpp';
  return `?${cleaned}`;
};

export const matchesLanguageClass = (
  classList: { contains: (cls: string) => boolean },
  searchKey: string
): boolean => {
  const lang = normalizeCodeFilterKey(searchKey).replace(/^\?/, '');
  if (!lang) return false;
  if (lang === 'cpp') {
    return (
      classList.contains('language-cpp') || classList.contains('language-c++')
    );
  }
  return classList.contains(`language-${lang}`);
};

export interface CodeBlockGroup {
  wrapper: Element;
  filters: HTMLAnchorElement[];
  codes: Element[];
  firstKey: string;
}

export const collectCodeBlockGroups = (
  filterWrappers: ArrayLike<Element>
): CodeBlockGroup[] => {
  const groups: CodeBlockGroup[] = [];
  Array.from(filterWrappers).forEach(fw => {
    const filters: HTMLAnchorElement[] =
      typeof fw.querySelectorAll === 'function'
        ? Array.from(fw.querySelectorAll('a'))
        : [];
    let firstKey = '';
    filters.forEach(f => {
      const key = normalizeCodeFilterKey(f.getAttribute('href') || f.hash);
      if (!firstKey && key) {
        firstKey = key;
      }
      f['key'] = key;
    });

    const codes: Element[] = [];
    let next = fw.nextElementSibling;
    while (next) {
      if (next.tagName === 'P' && !(next.textContent || '').trim()) {
        next = next.nextElementSibling;
        continue;
      }
      if (next.tagName === 'PRE') {
        const found =
          typeof next.querySelectorAll === 'function'
            ? next.querySelectorAll('[class*="language-"]')
            : [];
        if (found.length) {
          found.forEach(c => codes.push(c));
        } else if (next.className && next.className.includes('language-')) {
          codes.push(next);
        }
        next = next.nextElementSibling;
        continue;
      }
      break;
    }

    groups.push({
      wrapper: fw,
      filters,
      codes,
      firstKey,
    });
  });
  return groups;
};

export const collectScopedCodeBlocks = (
  filterWrappers: ArrayLike<Element>
): Set<Element> => {
  const groups = collectCodeBlockGroups(filterWrappers);
  const set = new Set<Element>();
  groups.forEach(g => g.codes.forEach(c => set.add(c)));
  return set;
};

export const useMultipleCodeFilter = () => {
  const { asPath } = useRouter();
  const SEARCH = 'search';
  useEffect(() => {
    const setSearch = (val: string) =>
      window.localStorage.setItem(SEARCH, normalizeCodeFilterKey(val));
    const getSearch = () => {
      return normalizeCodeFilterKey(window.localStorage.getItem(SEARCH));
    };

    const allContents = document.querySelectorAll(`[class*="language-"]`);
    if (!allContents.length) return;

    const filterWrappers = document.querySelectorAll('.multipleCode');
    if (!filterWrappers.length) {
      allContents.forEach(c => c.classList.toggle('active', true));
      return;
    }

    const groups = collectCodeBlockGroups(filterWrappers);

    const allGroupedCodes = new Set<Element>();
    groups.forEach(g => g.codes.forEach(c => allGroupedCodes.add(c)));

    // Standalone code blocks outside .multipleCode groups always stay visible
    allContents.forEach(c => {
      if (!allGroupedCodes.has(c)) {
        c.classList.toggle('active', true);
      }
    });

    const allFilters = groups.flatMap(g => g.filters);
    const languageList = Array.from(
      new Set(allFilters.map(f => f['key']).filter(Boolean))
    );
    const firstGlobalSearch = groups[0]?.firstKey || '';

    const clickEventHandler = (targetSearch?: string | null) => {
      const search = normalizeCodeFilterKey(targetSearch);
      if (!search) return;
      setSearch(search);

      groups.forEach(group => {
        const hasMatchingTab = group.filters.some(f => f['key'] === search);
        const activeKey = hasMatchingTab
          ? search
          : group.filters.find(f => f.classList.contains('active'))?.['key'] ||
            group.firstKey;

        group.filters.forEach(f => {
          f.classList.toggle('active', f['key'] === activeKey);
        });

        group.codes.forEach(c => {
          c.classList.toggle(
            'active',
            matchesLanguageClass(c.classList, activeKey)
          );
        });
      });
    };

    filterWrappers.forEach(w => {
      w.addEventListener('click', (e: Event) => {
        e.preventDefault();
        if (e.target instanceof HTMLAnchorElement && e.target.tagName === 'A') {
          clickEventHandler(e.target.getAttribute('href') || e.target.hash);
        }
      });
    });

    if (window) {
      const cacheSearch = getSearch();
      let localSearch = '';
      if (cacheSearch && languageList.includes(cacheSearch)) {
        localSearch = cacheSearch;
      } else {
        localSearch = firstGlobalSearch;
      }
      if (localSearch) {
        clickEventHandler(localSearch);
      }
    }
  }, [asPath]);
};
