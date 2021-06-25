import React from 'react';
import * as styles from './index.module.less';
const Input = props => {
  const { placeholder = '', setValue } = props;
  const handleChange = e => {
    setValue(e.currentTarget.value);
  };
  return (
    <input
      className={styles.myInput}
      placeholder={placeholder}
      onChange={handleChange}
    ></input>
  );
};

export default Input;
