import React from 'react';
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
  const handleFocus = e => {
    onFocus(e);
  };
  return (
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
