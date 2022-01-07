import React, { useState } from 'react';
import * as styles from './index.module.less';
import { TextField } from '@mui/material';
import { submitInfoForm } from '../../http/submitEmail';

const InfoSubmitter = ({
  submitCb = () => { },
  source,
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
      submitCb(statusCode, unique_email_id, href);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.submitterContainer}>
      <p className={styles.alert}>
        Fill in your email address to receive a quick start guide for free!
      </p>

      <div>
        <TextField
          fullWidth
          variant="standard"
          label="EMAIL"
          value={value}
          onChange={handleChange}

        />
        <span className={styles.prompt}>
          *We will never share your email or spam you
        </span>
      </div>


      <div className={styles.btnWrapper}>
        <button
          className={styles.submitBtn}
          disabled={!regx.test(value)}
          onClick={handleSubmit}
        >Submit</button>
      </div>
    </div>
  );
};

export default InfoSubmitter;
