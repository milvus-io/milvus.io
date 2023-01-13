import React, { useEffect } from 'react';
import Code from '../components/code/code';
import hljs from 'highlight.js';
import ReactDOM from 'react-dom';
import { drawZChart } from '@zilliz/zui';
// import "@zilliz/zui/ZChart.css";

/**
 * connect to local enterprise manager
 * example:
 * <code>asdasd</code>

<div class="query-button-panel">
<span class="copy">copy</span>
<span class="console">console</span>
<span class="setting">setting</span>

</div>
 * 
 */
export const useEmPanel = setShowModal => {
  const getRequestAsCURL = code => {
    const [header, ...data] = code.split('\n');
    const [method, url] = header.split(' ');
    const queryBody = data.join('\n');

    return `curl -X ${method} "http://localhost:8000${url}" -H 'Content-Type: application/json' -d'\n${queryBody}'`;
  };

  const copyToClipboard = content => {
    const el = document.createElement(`textarea`);
    el.value = content;
    el.setAttribute(`readonly`, ``);
    el.style.position = `absolute`;
    el.style.left = `-9999px`;
    document.body.appendChild(el);
    el.select();
    document.execCommand(`copy`);
    document.body.removeChild(el);
  };

  const handleCopy = code => {
    copyToClipboard(code);
  };

  const handleOpenConsole = () => {
    console.log('open console');
  };

  const handleSetting = () => setShowModal(true);

  useEffect(() => {
    document.querySelectorAll('.query-button-panel').forEach(panel => {
      const codeWrapper = panel.previousElementSibling;
      codeWrapper.classList.add('query-button-code');

      const querySnippet = codeWrapper.querySelector('code').textContent;
      const formatCode = getRequestAsCURL(querySnippet);

      panel.addEventListener('click', e => {
        const funcMap = {
          copy: handleCopy,
          console: handleOpenConsole,
          // setting wrapper
          setting: handleSetting,
          // setting icon
          'fa-cog': handleSetting,
        };

        const classList = e.target.classList;

        Object.keys(funcMap).forEach(key => {
          if (classList.contains(key)) {
            funcMap[key](formatCode);
          }
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * This is for doc inside filter.
 * filter is a link, will add #xxx in url.
 * filter content must has class filter-xxx (same with #xxx)
 * will show different content depend on #xxx in url.
 */

export const useFilter = () => {
  useEffect(() => {
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
  }, []);
};

export const useMultipleCodeFilter = () => {
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
        f.key = f.search || f.hash.replace('#', '?');
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
      w.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
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
  }, []);
};

/**
 * Support copy code for code area
 */
export const useCodeCopy = (tooltip, cfgs) => {
  useEffect(() => {
    const elements = document.querySelectorAll('pre code');
    if (!!elements.length) {
      cfgs && hljs.configure(cfgs);
      elements.forEach(block => {
        hljs.highlightElement(block);

        const html = block.innerHTML;
        const content = block.textContent;
        const code = <Code html={html} content={content} tooltip={tooltip} />;
        ReactDOM.render(code, block);
      });
    }

    return () => {
      if (!!elements.length) {
        elements.forEach(block => {
          ReactDOM.unmountComponentAtNode(block);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * Support ZChart
 */
export const useZChart = ref => {
  useEffect(() => {
    const width = ref && ref.current.offsetWidth;
    if (width <= 0) return;
    drawZCharts(width);

    const resizeHandler = () => {
      const { width } = document
        .querySelector('.doc-post-content')
        .getBoundingClientRect();
      drawZCharts(width);
    };
    window.addEventListener('resize', resizeHandler);

    return () => window.removeEventListener('resize', resizeHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);
};

const drawZCharts = width => {
  const divs = document.querySelectorAll('.zchart-container');
  [].forEach.call(divs, div => {
    try {
      const id = div.id;

      const chartTypeTemplate = [].find.call(
        div.children,
        div => div.id === 'chart-type'
      );
      if (!chartTypeTemplate) {
        console.warn('ZChart - Invalid chart type.');
        return;
      }
      // eslint-disable-next-line
      const chartType = eval(chartTypeTemplate.innerHTML);

      const dataTemplate = [].find.call(div.children, div => div.id === 'data');
      if (!dataTemplate) {
        console.warn('ZChart - Invalid data.');
        return;
      }
      const data = JSON.parse(dataTemplate.innerHTML);

      const configTemplate = [].find.call(
        div.children,
        div => div.id === 'config'
      );
      if (!configTemplate) {
        console.warn('ZChart - Invalid config.');
        return;
      }
      const config = JSON.parse(decodeEntity(configTemplate.innerHTML));
      config.width = width;

      [].filter
        .call(div.children, div => div.tagName === 'svg')
        .forEach(svg => svg.remove());

      drawZChart({
        domSelector: `#${id}`,
        chartType,
        data,
        config,
      });
    } catch (err) {
      console.log(err);
    }
  });
};

function decodeEntity(inputStr) {
  var textarea = document.createElement('textarea');
  textarea.innerHTML = inputStr;
  return textarea.value;
}
