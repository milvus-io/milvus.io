import React, { useState } from 'react';
import * as styles from './index.module.less';

const Pageination = ({ className, total, pageIndex, pageSize }) => {
  const [pageIdx, setPageIdx] = useState(1);

  const handleNavigate = way => {
    setPageIdx(v => (way === 'pre' ? v + 1 : v - 1));
  };

  const handleChoosePage = idx => {
    console.log(idx);
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
        <i class="fas fa-chevron-right"></i>
      </span>

      <ul className={styles.pagesList}>
        {total.map((_, idx) => (
          <li
            className={`${styles.pagesItem} ${
              idx === pageIdx ? styles.active : ''
            }`}
            onClick={() => handleChoosePage(idx)}
          >
            {idx + 1}
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
        <i class="fas fa-chevron-left"></i>
      </span>
    </div>
  );
};
export default Pageination;
