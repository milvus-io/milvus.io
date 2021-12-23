import React, { useState } from 'react';
import * as styles from './index.module.less';
import TextField from '../../textField';
import Button from '../../button';
import { submitInfoForm } from '../../../http/mailchimp';

const InfoSubmitter = ({
  locale,
  submitCb = () => {},
  source,
  hideModal = () => {},
  href = '',
}) => {
  const regx =
    /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/;
  const [value, setValue] = useState('');

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const { statusCode, unique_email_id } = await submitInfoForm({
        email: value,
        form: {
          SOURCE: source,
        },
      });
      hideModal();
      submitCb(statusCode, unique_email_id, href);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.submitterContainer}>
      <div className={styles.titleBar}>
        <h3 className={styles.title}>Before you go...</h3>
        <div
          className={styles.iconWrapper}
          role="button"
          onClick={hideModal}
          onKeyDown={hideModal}
          tabIndex="-1"
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <p className={styles.prompt}>
        Fill in your email address to receive a quick start guide for free!
      </p>

      <TextField
        label=""
        value={value}
        onChange={handleChange}
        helpMsg="EMAIL"
        showError={true}
        errorMsg="*We will never share your email or spam you"
      />

      <div className={styles.btnWrapper}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          locale={locale}
          children="Submit"
          className={styles.submitBtn}
          disabled={!regx.test(value)}
        />
      </div>
    </div>
  );
};

export default InfoSubmitter;
