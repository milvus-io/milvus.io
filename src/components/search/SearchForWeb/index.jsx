import React, { useState, useRef, useEffect } from 'react';
import {
  getAnchorElement,
  scrollToElement,
} from '../../../utils/docTemplate.util';
import LocalizeLink from '../../localizedLink/localizedLink';

import './index.scss';
const DOCS_JSON = require('../../../search.json');
let timer = null;
const SearchForWeb = props => {
  const { language, locale } = props;
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [showMatchData, setShowMatchData] = useState(true);
  const ref = useRef(null);
  const containerRef = useRef(null);

  const handleChange = e => {
    setQuery(ref.current.value);
    setLoading(true);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      let matchData = [];

      DOCS_JSON.forEach(v => {
        const { version, id, fileLang, path } = v;
        const targets = v.values.filter(text =>
          text.toLowerCase().includes(ref.current.value.toLowerCase())
        );

        const regx = new RegExp(ref.current.value, 'gi');
        const highlights = targets.length
          ? targets.map(v => v.replace(regx, search => `<em>${search}</em>`))
          : [];
        const results = targets.length
          ? targets.map((v, i) => ({
            title: v,
            highlight: highlights[i],
            id,
            lang: fileLang,
            version,
            path,
            isId: id === v,
          }))
          : [];
        matchData.push(...results);
      });

      matchData = matchData.filter(
        v => v && v.version !== 'master' && v.lang === locale
      );

      setMatchData(matchData);
      setLoading(false);
    }, 400);
  };
  const handleFocus = e => {
    setFocus(true);
    setShowMatchData(true);
  };
  const useClickOutside = (ref, handler, events) => {
    if (!events) events = [`mousedown`, `touchstart`];
    const detectClickOutside = event => {
      !ref.current.contains(event.target) && handler();
    };
    useEffect(() => {
      for (const event of events)
        document.addEventListener(event, detectClickOutside);
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
        for (const event of events)
          document.removeEventListener(event, detectClickOutside);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };
  useClickOutside(containerRef, () => setFocus(false));

  const onSearchItemClick = (isCurrentPage, title) => {
    window.localStorage.setItem('anchorTitle', title);
    setShowMatchData(false);

    // handle current page anchor direct
    if (isCurrentPage) {
      const anchorText = window.localStorage.getItem('anchorTitle');

      if (anchorText !== null) {
        for (let i = 2; i < 7; i++) {
          const element = getAnchorElement(`h${i}`, anchorText);

          if (element) {
            scrollToElement(element);
            window.localStorage.removeItem('anchorTitle');
            return;
          }
        }
      }
    }
  };

  return (
    <div className="search-wrapper-web" ref={containerRef}>
      <svg
        className="search-icon"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"
        ></path>
      </svg>
      <input
        placeholder={language.search}
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        ref={ref}
      ></input>
      {query.length && focus && showMatchData ? (
        <ul className="result-list">
          {matchData.length
            ? matchData.map((v, index) => {
              const { lang, version, title, isId, highlight, path } = v;
              /* eslint-disable-next-line */
              const normalVal = title.replace(/[\,\/]/g, '');
              const anchor = normalVal.split(' ').join('-');
              // window.localStorage.setItem('anchorTitle', title);

              // handle current page
              const pathname = window.location.pathname;
              const pathInfoList = pathname.split('/');
              const isCurrentPage =
                pathInfoList[pathInfoList.length - 1] === path;
              pathInfoList.splice(pathInfoList.length - 1, 1);
              // const targetLink = `${pathInfoList.join('/')}/${path}`;

              return (
                <li key={index}>
                  <i
                    tabIndex={0}
                    aria-label="match-data-item"
                    role='button'
                    onClick={() => onSearchItemClick(isCurrentPage, title)}
                    onKeyDown={() => onSearchItemClick(isCurrentPage, title)}
                  >
                    <LocalizeLink
                      locale={lang}
                      to={`/docs/${version}/${path}${isId ? '' : `?${anchor}`
                        }`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${highlight} ${version}`,
                        }}
                      ></span>
                    </LocalizeLink>
                  </i>
                  {/* <a
                      href={`${targetLink}${isId ? '' : `?${anchor}`}`}
                      target="_blank"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${highlight} ${version} ${
                            lang === 'cn' ? '中文' : 'en'
                          }`,
                        }}
                      ></span>
                    </a> */}
                </li>
              );
            })
            : loading
              ? language.loading
              : language.noresult}
        </ul>
      ) : null}
    </div>
  );
};

export default SearchForWeb;
