import React, { useState, useRef } from 'react';
import * as styles from './index.module.less';

const TextFiled = ({
  className = '',
  isRequired = false,
  label,
  value,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  helpMsg,
  showError,
  errorMsg,
  type = 'text',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = e => {
    setIsFocused(true);
    onFocus(e);
    e.target.classList.add(styles.show);
  };
  return (
    // <div className={`${styles.textFiledWrapper} ${className}`}>

    //   <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''}`}>
    //     <div className={`${styles.labelWrapper} ${isFocused ? styles.scale : ''}`}>
    // <span>{label}</span>
    // {
    //   isRequired && (
    //     <span className={styles.icon}>*</span>
    //   )
    // }
    //     </div>

    //     <input
    // type={type}
    // className={`${styles.input} ${styles.focused}`}
    // value={value}
    // onChange={(e) => onChange(e)}
    // onFocus={handleFocus}
    // onBlur={e => onBlur(e)}
    //     />
    //   </div>
    // {
    //   ErrorMsg && <ErrorMsg />
    // }
    // </div>

    <div className={`${styles.textFiledWrapper} ${className}`}>
      <label htmlFor="">
        <p className={styles.labelWrapper}>
          <span>{label}</span>
          {isRequired && <span className={styles.icon}>*</span>}
        </p>

        <input
          type={type}
          className={styles.inputEle}
          value={value}
          onChange={e => onChange(e)}
          onFocus={handleFocus}
          onBlur={e => onBlur(e)}
          placeholder={helpMsg}
        />
      </label>
      {showError && <div className={styles.prompt}>{errorMsg}</div>}
    </div>
  );
};

export default TextFiled;
