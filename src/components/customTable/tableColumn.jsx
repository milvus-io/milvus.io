import React from 'react';
import * as styles from './index.module.less';

const TableColumn = ({ prop, label, width, className = '' }) => {
  const calcWidth = width ? `${width}px` : 'auto';

  return (
    <p
      className={`${styles.tableHeadItem} ${className}`}
      style={{ width: calcWidth }}
      prop={prop}
    >
      {label}
    </p>
  );
};

export default TableColumn;
