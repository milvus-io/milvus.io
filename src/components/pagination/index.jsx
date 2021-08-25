import React, { useEffect } from 'react';
import * as styles from './index.module.less';
import { globalHistory } from '@reach/router';

const formateList = (list, idx) => {
  const len = list.length;
  let res = [];
  if (len <= 7) return list;

  if (idx === 1 || idx === 2) {
    res = [].concat(list.slice(0, 3), '...', list[len - 1]);
  } else if (idx === 3) {
    res = [].concat(list.slice(0, 4), '...', list[len - 1]);
  } else if (idx > 3 && idx < len - 2) {
    let temp = list.slice(idx - 2, idx + 1);
    res = [].concat(1, '...', temp, '...', list[len - 1]);
  } else if (idx === len - 2) {
    res = [].concat(1, '...', list.slice(len - 4, len));
  } else {
    res = [].concat(1, '...', list.slice(len - 3, len));
  }
  return res;
};

const generateArray = (count, size) => {
  if (count === 0 || size === 0) return [];
  let n = 0;
  if (count % size == 0) {
    n = count / size;
  } else {
    n = count / size + 1;
  }

  return Array.from({ length: n }).map((_, k) => k + 1);
};

const Pagination = ({ className = '', total = 0, pageSize, setPageIndex }) => {
  const { search } = globalHistory.location;

  if (search === '' && typeof window !== 'undefined') {
    window.location.search = `?page=1`;
  }
  const pageIdx = search ? Number(search.replace(/\?page=/g, '')) : 1;
  const tempList = generateArray(total, pageSize);
  const navList = formateList(tempList, pageIdx);

  const handleChoosePage = idx => {
    if (typeof idx !== 'number') return;
    window.location.search = `?page=${idx}`;
  };

  useEffect(() => {
    setPageIndex(pageIdx);
  }, []);

  return (
    <div
      className={`${styles.pageinationWrapper} ${className ? className : ''}`}
    >
      <span
        className={`${styles.iconWrapper} ${
          pageIdx === 1 ? styles.disabled : ''
        }`}
        onClick={() => {
          if (pageIdx === 1) return;
          window.location.search = `?page=${pageIdx - 1}`;
        }}
      >
        <i className="fas fa-chevron-left"></i>
      </span>

      <ul className={styles.pagesList}>
        {navList.map((item, idx) => (
          <li
            className={`${
              typeof item !== 'number' ? styles.ellipsis : styles.pagesItem
            } ${item === pageIdx ? styles.active : ''} `}
            onClick={() => handleChoosePage(item)}
            key={item + idx}
          >
            {item}
          </li>
        ))}
      </ul>

      <span
        className={`${styles.iconWrapper} ${
          pageIdx === tempList.length ? styles.disabled : ''
        }`}
        onClick={() => {
          if (pageIdx === navList.length) return;
          window.location.search = `?page=${pageIdx + 1}`;
        }}
      >
        <i className="fas fa-chevron-right"></i>
      </span>
    </div>
  );
};
export default Pagination;
