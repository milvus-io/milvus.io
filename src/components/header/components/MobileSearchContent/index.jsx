import React, { useState, useRef } from 'react';
import LocalizeLink from '../../../localizedLink/localizedLink';
import {
  getAnchorElement,
  scrollToElement,
} from '../../../../utils/docTemplate.util';
import * as styles from './index.module.less';

const DOCS_JSON = require('../../../../search.json');
let timer = null;

const MobileSearchContent = ({ language, locale, hideMobileMask }) => {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [showMatchData, setShowMatchData] = useState(true);
  const ref = useRef(null);

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
  const onSearchItemClick = (isCurrentPage, title) => {
    hideMobileMask();
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
    <div className={styles.mobileSearchContent}>
      <div className={styles.inputWrapper}>
        <input
          placeholder={language.search}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          ref={ref}
        />
      </div>
      <div className={styles.resultWrapper}>
        {query.length && focus && showMatchData ? (
          <ul className={styles.resultList}>
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
                        role="button"
                        onClick={() => onSearchItemClick(isCurrentPage, title)}
                        onKeyDown={() =>
                          onSearchItemClick(isCurrentPage, title)
                        }
                      >
                        <LocalizeLink
                          locale={lang}
                          to={`/docs/${version}/${path}${
                            isId ? '' : `?${anchor}`
                          }`}
                          className={styles.link}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: `${highlight} ${version}`,
                            }}
                          ></span>
                        </LocalizeLink>
                      </i>
                    </li>
                  );
                })
              : loading
              ? language.loading
              : language.noresult}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default MobileSearchContent;
