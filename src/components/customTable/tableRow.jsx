import React from 'react';
import * as styles from './index.module.less';

const TableRow = ({ data, propList, className }) => {
  return (
    <div className={`${styles.tableRow} ${className}`}>
      {propList.map(key => {
        return <p key={key}>{data[key]}</p>;
      })}
    </div>
  );
};

export default TableRow;
