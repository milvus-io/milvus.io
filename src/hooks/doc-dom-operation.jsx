import React, { useEffect } from "react";
import Code from "../components/code/code";
import hljs from "highlight.js";
import ReactDOM from "react-dom";

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
export const useEmPanel = (setShowModal) => {
  const getRequestAsCURL = (code) => {
    const [header, ...data] = code.split("\n");
    const [method, url] = header.split(" ");
    const queryBody = data.join("\n");

    return `curl -X ${method} "http://localhost:8000${url}" -H 'Content-Type: application/json' -d'\n${queryBody}'`;
  };

  const copyToClipboard = (content) => {
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

  const handleCopy = (code) => {
    copyToClipboard(code);
  };

  const handleOpenConsole = () => {
    console.log("open console");
  };

  const handleSetting = () => setShowModal(true);

  useEffect(() => {
    document.querySelectorAll(".query-button-panel").forEach((panel) => {
      const codeWrapper = panel.previousElementSibling;
      codeWrapper.classList.add("query-button-code");

      const querySnippet = codeWrapper.querySelector("code").textContent;
      const formatCode = getRequestAsCURL(querySnippet);

      panel.addEventListener("click", (e) => {
        const funcMap = {
          copy: handleCopy,
          console: handleOpenConsole,
          // setting wrapper
          setting: handleSetting,
          // setting icon
          "fa-cog": handleSetting,
        };

        const classList = e.target.classList;

        Object.keys(funcMap).forEach((key) => {
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
    const filterWrappers = document.querySelectorAll(".filter");
    const allFilters = [];
    let firstHash = "";
    filterWrappers.forEach((fw) => {
      const fs = fw.querySelectorAll("a");

      fs.forEach((f) => {
        if (!firstHash) {
          firstHash = f.hash;
        }
        allFilters.push(f);
      });
    });
    const allContents = document.querySelectorAll(`[class*="filter-"]`);

    if (!allContents.length) return;

    const clickEventHandler = (targetHash) => {
      const hash = targetHash;
      const currentFilters = allFilters.filter((f) => f.hash === hash);
      allFilters.forEach((f) => f.classList.toggle("active", false));
      currentFilters.forEach((cf) => cf.classList.toggle("active", true));
      allContents.forEach((c) => c.classList.toggle("active", false));
      const contents = document.querySelectorAll(
        `.filter-${hash.replace("#", "").replace(/%/g, "")}`
      );
      contents.forEach((c) => c.classList.toggle("active", true));
    };
    filterWrappers.forEach((w) => {
      w.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          clickEventHandler(e.target.hash);
        }
      });
    });

    if (window) {
      const windowHash = window.location.hash || firstHash;
      if (windowHash) {
        clickEventHandler(windowHash);
      }
      window.history.pushState(null, null, windowHash);

      window.addEventListener(
        "hashchange",
        () => {
          clickEventHandler(window.location.hash);
        },
        false
      );
    }
  }, []);
};

export const useMultipleCodeFilter = () => {
  const SEARCH = "search";
  useEffect(() => {
    const setSearch = (val) => window.localStorage.setItem(SEARCH, val);
    const getSearch = () => {
      return window.localStorage.getItem(SEARCH);
    };

    const filterWrappers = document.querySelectorAll(".multipleCode");

    const allFilters = [];
    let firstSearch = "";
    filterWrappers.forEach((fw) => {
      const fs = fw.querySelectorAll("a");

      fs.forEach((f) => {
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
      allContents.forEach((c) => c.classList.toggle("active", true));
      return;
    }
    // the language options of current code block
    // we must make sure options are same on single page
    const languageList = Array.prototype.map.call(
      filterWrappers[0].children,
      (item) => item.getAttribute("href")
    );
    const clickEventHandler = (targetSearch) => {
      const search = targetSearch;
      setSearch(search);
      const currentFilters = allFilters.filter((f) => f.search === search);
      allFilters.forEach((f) => f.classList.toggle("active", false));
      currentFilters.forEach((cf) => cf.classList.toggle("active", true));
      allContents.forEach((c) => c.classList.toggle("active", false));
      const contents = document.querySelectorAll(
        `.language-${search.replace("?", "").replace(/%/g, "")}`
      );

      contents.forEach((c) => c.classList.toggle("active", true));
    };

    filterWrappers.forEach((w) => {
      w.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.tagName === "A") {
          clickEventHandler(e.target.search);
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
export const useCodeCopy = (locale, cfgs) => {
  useEffect(() => {
    const elements = document.querySelectorAll("pre code");
    if (!!elements.length) {
      cfgs && hljs.configure(cfgs);
      elements.forEach((block) => {
        hljs.highlightElement(block);

        const html = block.innerHTML;
        const content = block.textContent;
        const code = <Code html={html} content={content} locale={locale} />;
        ReactDOM.render(code, block);
      });
    }

    return () => {
      if (!!elements.length) {
        elements.forEach((block) => {
          ReactDOM.unmountComponentAtNode(block);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
