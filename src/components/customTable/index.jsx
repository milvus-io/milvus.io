import React from 'react';
import TableRow from './tableRow';
import * as styles from './index.module.css';

const CustomTable = ({ className = '', data = [], children }) => {
  const propList = React.Children.toArray(children).map(child => child.props.prop);

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <div className={styles.tableHead}>{children}</div>

      <div>
        {data.map((item, idx) => {
          return <TableRow key={idx} data={item} propList={propList} />;
        })}
      </div>
    </div>
  );
};

export default CustomTable;
