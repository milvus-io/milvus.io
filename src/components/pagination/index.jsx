import React, { useState } from 'react';
import * as styles from './index.module.less';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const formateList = list => {
  const len = list.length;
  if (len <= 10) return list;
  let res = [...list.slice(0, 6), '...', list[len - 1]];
  console.log(res);
  return [...list.slice(0, 6), '...', list[len - 1]];
};

const Pageination = ({
  className,
  total = formateList(list),
  pageIndex,
  pageSize,
}) => {
  const [pageIdx, setPageIdx] = useState(1);

  const handleNavigate = way => {
    setPageIdx(v => (way === 'pre' ? v - 1 : v + 1));
  };

  const handleChoosePage = idx => {
    setPageIdx(idx);
  };

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
          handleNavigate('pre');
        }}
      >
        <i className="fas fa-chevron-left"></i>
      </span>

      <ul className={styles.pagesList}>
        {total.map(item => (
          <li
            className={`${styles.pagesItem} ${
              item === pageIdx ? styles.active : ''
            }`}
            onClick={() => handleChoosePage(item)}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>

      <span
        className={`${styles.iconWrapper} ${
          pageIdx === total.length ? styles.disabled : ''
        }`}
        onClick={() => {
          if (pageIdx === total.length) return;
          handleNavigate('next');
        }}
      >
        <i className="fas fa-chevron-right"></i>
      </span>
    </div>
  );
};
export default Pageination;
